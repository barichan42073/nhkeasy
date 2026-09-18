"""
This module provides functions for generating Anki packages
and interacting with AnkiConnect for importing notes.
"""

import hashlib
import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import requests
from requests.exceptions import RequestException

logger = logging.getLogger(__name__)

# Conditional import of genanki
try:
    import genanki
except ImportError:
    genanki = None
    logger.warning(
        "genanki module not found. Anki package generation functionality will be limited."
    )

from utils import sanitize_filename  # Import from shared utilities

# Constants for AnkiConnect
ANKICONNECT_URL_ENV = "ANKICONNECT_URL"
DEFAULT_ANKICONNECT_URL = "http://127.0.0.1:8765"


@dataclass
class AnkiPackageConfig:
    """Configuration for generating an Anki package."""

    output_dir: Path
    package_name: str = "NHK_Easy_Vocabulary"
    parent_deck: str = "NHKeasynews"
    max_notes: int | None = None
    model_id: int = 1607392319
    model_name: str = "Japanese Custom Template"  # Allow overriding the model name
    field_mappings: dict[str, str] | None = None
    template_prefix: str = "nhkeasy"  # New field to specify template files


def get_anki_model(
    model_id: int = 1607392319,
    model_name: str = "Japanese Custom Template",
    custom_fields: list[dict[str, str]] | None = None,
    template_prefix: str = "nhkeasy",  # Added template_prefix parameter
) -> "genanki.Model":
    """
    Defines the specific HTML/CSS structure for the Anki model by
    reading external template files, or uses custom fields if provided.
    The template_prefix determines which set of template files to use (e.g., 'nhkeasy' or 'imkanji').
    """
    templates_dir = Path(__file__).parent / "templates_anki"

    try:
        front_html = (templates_dir / f"{template_prefix}_front.html").read_text(
            encoding="utf-8"
        )
        back_html = (templates_dir / f"{template_prefix}_back.html").read_text(
            encoding="utf-8"
        )
        css_style = (templates_dir / f"{template_prefix}_style.css").read_text(
            encoding="utf-8"
        )
    except FileNotFoundError:
        logger.exception(
            "Template file not found for prefix '%s'. Falling back to basic templates.",
            template_prefix,
        )
        front_html, back_html, css_style = "{{Front}}", "{{FrontSide}}<hr>{{Back}}", ""

    # Default fields for NHK Easy
    default_fields = [
        {"name": "Front"},
        {"name": "Back"},
        {"name": "Meaning"},
        {"name": "Kanji"},
        {"name": "JLPT"},
        {"name": "ID"},
        {"name": "BushuMei"},
        {"name": "Chapter Number"},  # Added new field
    ]
    fields_to_use = custom_fields if custom_fields is not None else default_fields

    return genanki.Model(
        model_id=model_id,
        name=model_name,
        fields=fields_to_use,
        templates=[
            {
                "name": "Card 1",
                "qfmt": front_html,
                "afmt": back_html,
            },
        ],
        css=css_style,
    )


def build_generic_anki_package(
    notes: list["genanki.Note"], deck_name: str, output_path: Path
) -> Path | None:
    """
    A generic function that takes pre-built Anki notes and packages them into a .apkg file.
    """
    if genanki is None:
        logger.warning(
            "genanki module not available. Skipping Anki package generation."
        )
        return None

    if not notes:
        logger.info("No notes provided for Anki package generation.")
        return None

    # Generate a stable deck ID based on the full deck name
    deck_id = int(hashlib.sha1(deck_name.encode("utf-8")).hexdigest(), 16) % (10**10)
    deck = genanki.Deck(deck_id, deck_name)

    # Add all notes to the deck
    for note in notes:
        deck.add_note(note)

    # Write the package to disk
    try:
        genanki.Package(deck).write_to_file(str(output_path))
        logger.info(
            "Anki package '%s' created successfully at %s with %d notes.",
            deck_name,
            output_path.resolve(),
            len(notes),
        )
        return output_path
    except OSError:
        logger.exception(
            "Failed to write Anki package to '%s' due to an I/O error.",
            output_path,
        )
        return None
    except Exception:  # Catch any other unexpected genanki errors
        logger.exception(
            "An unexpected error occurred while writing Anki package to '%s'",
            output_path,
        )
        return None


def _create_anki_note_from_mapped_data(
    mapped_word_data: dict[str, str],
    model: "genanki.Model",
    tags: list[str] | None = None,
) -> Optional["genanki.Note"]:
    """
    Helper function to create a single Anki note from already mapped vocabulary data.
    The keys in mapped_word_data should directly correspond to the Anki model's field names.
    """
    field_values = []
    # Ensure fields are added in the order expected by the model
    for field in model.fields:
        field_name = field.name if hasattr(field, "name") else field["name"]
        field_values.append(mapped_word_data.get(field_name, ""))

    try:
        return genanki.Note(
            model=model,
            fields=field_values,
            tags=tags,
        )
    except (ValueError, TypeError):
        logger.exception(
            "Failed to create Anki note from mapped data %s due to invalid data.",
            mapped_word_data,
        )
        return None
    except Exception:
        logger.exception(
            "An unexpected error occurred while creating Anki note from mapped data %s",
            mapped_word_data,
        )
        return None


def generate_anki_package(
    vocabulary_list: list[dict[str, str]],
    config: AnkiPackageConfig,
    custom_anki_model_fields: list[dict[str, str]] | None = None,
    card_tags: list[str] | None = None,
) -> Path | None:
    """
    Generates Anki notes from a vocabulary list and packages them into an .apkg file.
    This function is flexible and can work with different input data structures
    via field_mappings.

    Args:
        vocabulary_list: A list of dictionaries, each representing a vocabulary item.
        config: An AnkiPackageConfig object containing generation parameters.
        custom_anki_model_fields: Optional list of dictionaries defining custom fields
                                  for the Anki model. If None, default fields are used.

    Returns:
        The path to the generated Anki package file, or None if genanki is not available
        or no notes were generated.
    """
    if genanki is None:
        logger.warning(
            "genanki module not available. Skipping Anki package generation."
        )
        return None

    if not vocabulary_list:
        logger.info("No vocabulary provided for Anki package generation.")
        return None

    my_model = get_anki_model(
        model_id=config.model_id,
        model_name=config.model_name,  # Pass the model_name from config
        custom_fields=custom_anki_model_fields,
        template_prefix=config.template_prefix,
    )
    notes = []

    # Default mappings for NHK Easy News structure
    # These map Anki Model Field Names (keys) to the vocabulary_list dictionary keys (values).
    nhk_easy_default_field_mappings = {
        "Front": "word",  # Maps to 'word' in the input vocabulary dictionary
        "Back": "reading",  # Maps to 'reading' in the input vocabulary dictionary
        "Meaning": "definition",  # Maps to 'definition' in the input vocabulary dictionary
        "Kanji": "word",  # Uses 'word' from input, assuming it contains kanji
        "JLPT": "jlpt_level",  # Maps to 'jlpt_level' in the input vocabulary dictionary
        "ID": "word",  # Uses 'word' as a source for ID hashing if no explicit ID
        "BushuMei": None,  # Not available in current input data
        "Chapter Number": None,  # Not available in current input data
    }

    # Use provided mappings or default to NHK Easy mappings
    field_mappings_to_use = (
        config.field_mappings
        if config.field_mappings is not None
        else nhk_easy_default_field_mappings
    )

    # Determine which input field to use for hashing the ID, if 'ID' is an Anki field
    # and not explicitly mapped in the input data.
    id_hash_source_field_name = None

    model_field_names = [f.name if hasattr(f, "name") else f["name"] for f in my_model.fields]
    if "ID" in model_field_names and (
        "ID" not in field_mappings_to_use or field_mappings_to_use["ID"] is None
    ):
        # Default to 'Front' as the hash source if 'ID' isn't explicitly mapped
        id_hash_source_field_name = field_mappings_to_use.get("Front")

    for num_notes_added, word_data in enumerate(vocabulary_list):
        if config.max_notes is not None and num_notes_added >= config.max_notes:
            logger.info("Reached max_notes limit (%d) for Anki deck.", config.max_notes)
            break

        mapped_word_data = {}
        for anki_field_name, input_key in field_mappings_to_use.items():
            if input_key:  # Ensure input_key is not None or empty
                mapped_word_data[anki_field_name] = word_data.get(input_key, "")
            else:
                mapped_word_data[anki_field_name] = (
                    ""  # Map to empty string if no input key
                )

        # Handle ID generation if needed
        if (
            id_hash_source_field_name
            and "ID" in mapped_word_data
            and not mapped_word_data["ID"]
        ):
            hash_source_value = mapped_word_data.get(id_hash_source_field_name, "")
            if hash_source_value:
                mapped_word_data["ID"] = hashlib.md5(
                    hash_source_value.encode("utf-8")
                ).hexdigest()[:8]

        logger.debug("Original word_data: %s", word_data)
        logger.debug("Mapped word_data for Anki note: %s", mapped_word_data)

        my_note = _create_anki_note_from_mapped_data(
            mapped_word_data, my_model, tags=card_tags
        )
        if my_note:
            notes.append(my_note)

    # Construct the nested deck name (e.g., "NHKeasynews::NHK_Easy_Vocabulary")
    full_deck_name = (
        f"{config.parent_deck}::{config.package_name}"
        if config.parent_deck
        else config.package_name
    )

    # Use package_name for the file so the OS doesn't throw an error on the "::" characters
    output_path = config.output_dir / f"{sanitize_filename(config.package_name)}.apkg"

    # Delegate to the generic builder
    return build_generic_anki_package(notes, full_deck_name, output_path)


def import_package_to_anki(apkg_path: Path) -> bool:
    """
    Sends a request to AnkiConnect to import the generated .apkg file directly.
    Anki must be running with the AnkiConnect add-on installed.
    """
    absolute_path = str(apkg_path.resolve())

    anki_connect_url = os.getenv(ANKICONNECT_URL_ENV, DEFAULT_ANKICONNECT_URL)
    logger.info(
        "Attempting to import Anki package via AnkiConnect at %s", anki_connect_url
    )

    payload = {
        "action": "importPackage",
        "version": 6,
        "params": {"path": absolute_path},
    }

    try:
        response = requests.post(anki_connect_url, json=payload, timeout=10)
        response.raise_for_status()
        result = response.json()

        if result.get("error"):
            logger.error("AnkiConnect failed to import: %s", result["error"])
            return False

        logger.info("Successfully imported %s directly into Anki!", apkg_path.name)
        return True

    except RequestException as error:
        if isinstance(error, requests.exceptions.ConnectionError):
            logger.warning(
                "Connection refused. Is Anki open and is AnkiConnect installed/enabled?",
                exc_info=True,
            )
        elif isinstance(error, requests.exceptions.Timeout):
            logger.warning(
                "AnkiConnect connection timed out at %s.",
                anki_connect_url,
                exc_info=True,
            )
        elif isinstance(error, requests.exceptions.HTTPError):
            logger.warning(
                "AnkiConnect returned an HTTP error: %s - %s.",
                error.response.status_code,
                error.response.reason,
                exc_info=True,
            )
        else:
            logger.warning(
                "Could not connect to AnkiConnect. Is Anki open and is AnkiConnect "
                "installed?",
                exc_info=True,
            )
        return False
    except json.JSONDecodeError:
        logger.exception("Failed to decode JSON response from AnkiConnect.")
        return False
    except Exception:
        logger.exception("An unexpected error occurred during Anki package import.")
        return False
