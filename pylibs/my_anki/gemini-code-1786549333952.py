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