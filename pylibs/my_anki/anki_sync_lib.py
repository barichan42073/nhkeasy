import os
from typing import Optional
from anki.collection import Collection, ImportAnkiPackageOptions, ImportAnkiPackageRequest
from pathlib import Path

class AnkiWebManager:

    def __init__(
        self,
        username: str,
        password: str,
        # Default to the absolute path where your real collection lives
        db_path: str = "/home/nev/pyprojects/data/local_anki_data/collection.anki2",
    ):
        self.username = username
        self.password = password
        # Ensure we always deal with an absolute, fully expanded path
        self.db_path = str(Path(db_path).expanduser().resolve())

        # Ensure working directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)


    def import_and_sync(self, apkg_path: str, with_scheduling: bool = False) -> None:
        """Imports an .apkg file into the local collection and syncs changes to AnkiWeb.

        Args:
            apkg_path: Path to the .apkg file to import.
            with_scheduling: Whether to preserve original scheduling info if present.
        """
        if not os.path.exists(apkg_path):
            raise FileNotFoundError(f"Package file not found: {apkg_path}")

        col = Collection(self.db_path)
        try:
            print("Logging into AnkiWeb...")
            auth = col.sync_login(self.username, self.password, endpoint=None)

            print("Checking sync status with AnkiWeb...")
            sync_result = col.sync_collection(auth, sync_media=True)

            # Update endpoint if assigned to a specific cluster
            if sync_result.new_endpoint:
                auth.endpoint = sync_result.new_endpoint

            # If local DB is new/empty, download from AnkiWeb
            if sync_result.required == sync_result.FULL_SYNC:
                print("Downloading remote profile from AnkiWeb...")
                col.full_upload_or_download(auth=auth, server_usn=0, upload=False)
                print("Download complete.")

            # Import the .apkg package
            print(f"Importing package '{apkg_path}'...")
            col.import_anki_package(
                ImportAnkiPackageRequest(
                    package_path=apkg_path,
                    options=ImportAnkiPackageOptions(
                        with_scheduling=with_scheduling, 
                        with_deck_configs=False
                    ),
                )
            )

            # Push imported changes back up to AnkiWeb
            print("Pushing new cards to AnkiWeb...")
            sync_result = col.sync_collection(auth, sync_media=True)

            if sync_result.required == sync_result.FULL_SYNC:
                print("Uploading local state to AnkiWeb...")
                col.full_upload_or_download(auth=auth, server_usn=0, upload=True)

            print("Successfully imported and synced to AnkiWeb!")

        finally:
            col.close()
