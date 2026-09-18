import csv
import logging
from pathlib import Path

import anki_generator
from anki_generator import AnkiPackageConfig

logger = logging.getLogger(__name__)

# Use a distinct model_id for imkanji data to prevent clashes with other note types
IMKANJI_MODEL_ID = 2023082301


def create_imkanji_anki_package(
    csv_file_path: Path = Path("imkanji_small.csv"),
    output_package_name: str = "imkanji_small_anki.apkg",
    output_dir: Path = Path("./"),
    parent_deck_name: str = "Imkanji",
    template_prefix: str = "imkanji",  # New parameter for template prefix
) -> Path | None:
    """
    Generates an Anki package from the imkanji_small.csv file.

    Args:
        csv_file_path: The path to the input CSV file (default: imkanji_small.csv).
        output_package_name: The name of the output Anki package file
                             (default: imkanji_small_anki.apkg).
        output_dir: The directory where the Anki package will be saved (default: current dir).
        parent_deck_name: The name of the parent Anki deck (default: Imkanji).

    Returns:
        The path to the generated Anki package file, or None if generation failed.
    """
    if not csv_file_path.exists():
        logger.error("CSV file not found at %s", csv_file_path)
        return None

    vocabulary_list = []
    try:
        with open(csv_file_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Clean up any potential BOM character in the first header if present
                if "\ufeff" in row:
                    row[row.get("\ufeffKanji Word/Compound", "Unknown Header")] = (
                        row.pop("\ufeffKanji Word/Compound")
                    )
                vocabulary_list.append(row)
        logger.info(
            "Successfully loaded %d entries from %s",
            len(vocabulary_list),
            csv_file_path,
        )
    except Exception:
        logger.exception("Failed to read or parse CSV file: %s", csv_file_path)
        return None

    # Define the field mappings from CSV column headers to Anki model fields
    imkanji_field_mappings = {
        "Front": "Kanji Word/Compound",
        "Back": "Hiragana Reading",
        # "Meaning": "English Translation",
        # "Kanji": "Target Kanji",
        # "JLPT": "JLPT Level",
        # "BushuMei": "Bushimei",
        # "Chapter Number": "Chapter Number",
        # ID will be automatically generated from "Front" if not explicitly mapped
    }

    # Configure the Anki package generation
    anki_config = AnkiPackageConfig(
        output_dir=output_dir,
        package_name=output_package_name.replace(
            ".apkg", ""
        ),  # remove extension for package_name
        parent_deck=parent_deck_name,
        field_mappings=imkanji_field_mappings,
        max_notes=None,  # No limit for this use case
        model_id=IMKANJI_MODEL_ID,
        model_name="IM Kanji Custom Template",  # Explicitly set a unique note type name
        template_prefix=template_prefix,
    )

    # Generate the Anki package
    logger.info(
        "Generating Anki package '%s' from %s...",
        output_package_name,
        csv_file_path.name,
    )
    generated_package_path = anki_generator.generate_anki_package(
        vocabulary_list=vocabulary_list,
        config=anki_config,
    )

    if generated_package_path:
        logger.info(
            "Anki package created successfully: %s", generated_package_path.name
        )
        # Import the generated package into Anki via AnkiConnect
        if anki_generator.import_package_to_anki(generated_package_path):
            logger.info("Successfully imported package into Anki.")
        else:
            logger.warning(
                "Failed to import package into Anki. Ensure Anki desktop is running "
                "and AnkiConnect is installed and enabled."
            )
    else:
        logger.error("Failed to create Anki package.")

    return generated_package_path


def create_minimal_test_package(
    csv_file_path: Path = Path("test_data.csv"),
    output_package_name: str = "test_minimal.apkg",
    output_dir: Path = Path("./"),
    parent_deck_name: str = "Test",
    template_prefix: str = "test",
) -> Path | None:
    """
    Generates a minimal Anki package for testing purposes.
    """
    # Ensure the output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    if not csv_file_path.exists():
        logger.error("CSV file not found at %s", csv_file_path)
        return None

    vocabulary_list = []
    try:
        with open(csv_file_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                vocabulary_list.append(row.copy())  # PERF402: Create a copy of the row
        logger.info(
            "Successfully loaded %d entries from %s",
            len(vocabulary_list),
            csv_file_path,
        )
    except Exception:
        logger.exception("Failed to read or parse CSV file: %s", csv_file_path)
        return None

    # Define the field mappings from CSV column headers to Anki model fields
    minimal_field_mappings = {
        "Front": "Front",  # Map CSV's FrontField to Anki's 'Front'
        "Back": "Back",  # Map CSV's BackField to Anki's 'Back'
    }

    # Explicitly define the fields for the Anki model to match template expectations
    minimal_anki_model_fields = [
        {"name": "Front"},
        {"name": "Back"},
    ]

    # Configure the Anki package generation
    anki_config = AnkiPackageConfig(
        output_dir=output_dir,
        package_name=output_package_name.replace(".apkg", ""),
        parent_deck=parent_deck_name,
        field_mappings=minimal_field_mappings,
        max_notes=None,
        model_name="Minimal Test Model",  # Unique name for test note type
        template_prefix=template_prefix,
    )

    # Generate the Anki package
    logger.info(
        "Generating Anki package '%s' from %s...",
        output_package_name,
        csv_file_path.name,
    )
    generated_package_path = anki_generator.generate_anki_package(
        vocabulary_list=vocabulary_list,
        config=anki_config,
        custom_anki_model_fields=minimal_anki_model_fields,
    )

    if generated_package_path:
        logger.info(
            "Anki package created successfully: %s", generated_package_path.name
        )
        # Import the generated package into Anki via AnkiConnect
        if anki_generator.import_package_to_anki(generated_package_path):
            logger.info("Successfully imported package into Anki.")
        else:
            logger.warning(
                "Failed to import package into Anki. Ensure Anki desktop is running "
                "and AnkiConnect is installed and enabled."
            )
    else:
        logger.error("Failed to create Anki package.")

    return generated_package_path


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
    )
    package_path = create_imkanji_anki_package(template_prefix="imkanji")
    if package_path:
        print(f"Anki package generated at: {package_path.resolve()}")
    else:
        print("Anki package generation failed.")
