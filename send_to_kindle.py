import os
import subprocess
from pathlib import Path
import logging
import sys
import argparse
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def _load_kindle_email() -> str | None:
    """Loads KINDLE_EMAIL from environment variables."""
    kindle_email = os.getenv('KINDLE_EMAIL')
    if not kindle_email:
        logger.error("KINDLE_EMAIL environment variable not set.")
        return None
    return kindle_email

def send_epub_to_kindle(epub_path: Path, kindle_email: str = None) -> bool:
    """
    Sends an EPUB file to a Kindle device using the mutt command-line tool.

    Args:
        epub_path: The path to the EPUB file to send.
        kindle_email: Optional. The recipient Kindle email address. If not provided,
                      it will be loaded from the KINDLE_EMAIL environment variable.

    Returns:
        True if the email was sent successfully, False otherwise.
    """
    if not epub_path.exists():
        logger.error(f"EPUB file not found: {epub_path}")
        return False

    if not kindle_email:
        kindle_email = _load_kindle_email()
        if not kindle_email:
            return False

    logger.info(f"Attempting to send '{epub_path.name}' to Kindle email: {kindle_email} using mutt.")

    # mutt command to send an email with an attachment
    # -s "Subject" : sets the subject of the email
    # -a <file>    : attaches the specified file
    # -- <recipient> : separates mutt options from the recipient address
    command = [
        "mutt",
        "-s", "NHK Easy Article", # Subject for Kindle to convert
        "-e", "set copy=no", # Prevent mutt from trying to save a copy in non-interactive mode
        "-a", str(epub_path),
        "--",
        kindle_email
    ]

    try:
        # Execute the mutt command
        result = subprocess.run(command, check=True, capture_output=True, text=True, stdin=subprocess.DEVNULL)
        logger.info(f"Successfully sent '{epub_path.name}' to Kindle.")
        logger.debug(f"Mutt stdout: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Mutt command failed with exit code {e.returncode} for '{epub_path.name}'.")
        logger.error(f"Mutt stdout: {e.stdout.strip()}")
        logger.error(f"Mutt stderr: {e.stderr.strip()}")
    except FileNotFoundError:
        logger.error("Mutt command not found. Please ensure mutt is installed and in your PATH.")
    except Exception as e:
        logger.error(f"An unexpected error occurred while sending email via mutt: {e}", exc_info=True)
    
    return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Send an EPUB file to a Kindle device via email using mutt."
    )
    parser.add_argument(
        "epub_file",
        type=Path,
        help="Path to the EPUB file to send."
    )
    parser.add_argument(
        "--kindle-email",
        type=str,
        help="Recipient Kindle email address. Overrides KINDLE_EMAIL environment variable."
    )
    args = parser.parse_args()

    kindle_email_to_use = args.kindle_email if args.kindle_email else os.getenv('KINDLE_EMAIL')

    if not kindle_email_to_use:
        logger.error("KINDLE_EMAIL is not set in environment or via --kindle-email argument. Cannot proceed.")
        sys.exit(1)

    if send_epub_to_kindle(args.epub_file, kindle_email=kindle_email_to_use):
        logger.info(f"Manual send of '{args.epub_file.name}' completed successfully.")
    else:
        logger.error(f"Manual send of '{args.epub_file.name}' failed.")
