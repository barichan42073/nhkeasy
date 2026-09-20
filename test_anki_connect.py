import json
import os
import sys
import logging
import requests # Import the requests library
from requests.exceptions import RequestException # For specific error handling

# Set up basic logging for the test script
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants for AnkiConnect (mirroring anki_generator.py)
ANKICONNECT_URL_ENV = "ANKICONNECT_URL"
DEFAULT_ANKICONNECT_URL = "http://127.0.0.1:8765"

def test_connection():
    anki_connect_url = os.getenv(ANKICONNECT_URL_ENV, DEFAULT_ANKICONNECT_URL)
    logger.info(f"Attempting to connect to AnkiConnect at: {anki_connect_url}")

    payload = {
        "action": "deckNames",
        "version": 6
    }

    try:
        response = requests.post(anki_connect_url, json=payload, timeout=10) # Added a timeout
        response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
        result = response.json()

        assert not result.get('error'), f"AnkiConnect returned an error: {result['error']}"
        
        deck_names = result.get('result')
        logger.info(f"Successfully connected to AnkiConnect!")
        if deck_names:
            logger.info(f"Found decks: {', '.join(deck_names)}")
        else:
            logger.info("No decks found in Anki.")

    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection refused. Is Anki running and AnkiConnect installed/enabled? (Error: {e})")
        assert False, f"Connection refused: {e}"
    except requests.exceptions.Timeout as e:
        logger.error(f"AnkiConnect connection timed out at {anki_connect_url}. (Error: {e})")
        assert False, f"Connection timed out: {e}"
    except requests.exceptions.HTTPError as e:
        logger.error(f"AnkiConnect returned an HTTP error: {e.response.status_code} - {e.response.reason}. (Error: {e})")
        assert False, f"HTTP error: {e}"
    except RequestException as e:
        logger.error(f"Could not connect to AnkiConnect. Is Anki running and AnkiConnect installed? (Error: {e})")
        assert False, f"Request exception: {e}"
    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode JSON response from AnkiConnect. Is AnkiConnect returning valid JSON? (Error: {e})")
        assert False, f"JSON decode error: {e}"
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        assert False, f"Unexpected error: {e}"

if __name__ == "__main__":
    try:
        test_connection()
        logger.info("AnkiConnect connection test successful!")
        sys.exit(0)
    except AssertionError as e:
        logger.error(f"AnkiConnect connection test failed: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"An unexpected error occurred during test execution: {e}", exc_info=True)
        sys.exit(1)
