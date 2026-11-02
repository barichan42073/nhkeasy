import os
import smtplib
import mimetypes
from email.message import EmailMessage
from pathlib import Path
import logging
import sys
import argparse
from email.utils import make_msgid, formatdate

# No side effects at import: .env loading and logging setup happen in the
# entry point (pipeline.py, or the __main__ block below when run standalone).
logger = logging.getLogger(__name__)

# Explicit types for the files this project sends; mimetypes covers the rest.
_ATTACHMENT_TYPES = {
    ".epub": ("application", "epub+zip"),
    ".mp3": ("audio", "mpeg"),
}


def _attachment_type(file_path: Path) -> tuple[str, str]:
    """Returns (maintype, subtype) for the attachment, from its extension."""
    known = _ATTACHMENT_TYPES.get(file_path.suffix.lower())
    if known:
        return known
    guessed, _encoding = mimetypes.guess_type(file_path.name)
    if guessed and "/" in guessed:
        maintype, subtype = guessed.split("/", 1)
        return maintype, subtype
    return "application", "octet-stream"


def send_file_by_email(file_path: Path, recipient: str, subject: str) -> bool:
    """Emails one file as an attachment. Returns True on success."""
    if not isinstance(file_path, Path):
        file_path = Path(file_path)

    if not file_path.exists():
        logger.error(f"File not found: {file_path}")
        return False

    if not recipient:
        logger.error("No recipient address given.")
        return False

    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port_str = os.getenv('SMTP_PORT', '587')
    smtp_username = os.getenv('SMTP_USERNAME') or os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASSWORD')
    sender_email = os.getenv('SENDER_EMAIL') or smtp_username

    if not smtp_server or not smtp_username or not smtp_password:
        logger.error("SMTP configuration or credentials missing.")
        return False

    try:
        smtp_port = int(smtp_port_str)
    except ValueError:
        logger.error(f"Invalid SMTP_PORT: '{smtp_port_str}'")
        return False

    logger.info(f"Preparing to send '{file_path.name}' to {recipient}")

    # Create message with strict RFC headers required by strict gateways
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient
    msg['Date'] = formatdate(localtime=True)
    msg['Message-ID'] = make_msgid()
    msg['X-Mailer'] = 'Mutt/2.2.9'  # Mimic mutt's exact successful agent signature

    # Kindle personal documents do not need a body text message;
    # sending a clean attachment-only structure prevents parsing blocks.
    maintype, subtype = _attachment_type(file_path)
    try:
        with open(file_path, 'rb') as f:
            file_data = f.read()

        msg.add_attachment(
            file_data,
            maintype=maintype,
            subtype=subtype,
            filename=file_path.name
        )
    except Exception as e:
        logger.error(f"Failed to read file {file_path.name}: {e}")
        return False

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30) as server:
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=30) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)

        logger.info(f"Successfully delivered '{file_path.name}' payload to SMTP relay.")
        return True
    except Exception as e:
        logger.error(f"SMTP transmission failed: {e}", exc_info=True)
        return False


def send_epub_to_kindle(epub_path: Path, kindle_email: str = None) -> bool:
    """Emails an EPUB to the Kindle address (argument, else KINDLE_EMAIL)."""
    if not kindle_email:
        kindle_email = os.getenv('KINDLE_EMAIL')
        if not kindle_email:
            logger.error("KINDLE_EMAIL environment variable not set.")
            return False
    return send_file_by_email(epub_path, kindle_email, subject='NHK Easy Article')


if __name__ == "__main__":
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )

    parser = argparse.ArgumentParser(description="Send EPUB to Kindle via smtplib.")
    parser.add_argument("epub_file", type=Path)
    args = parser.parse_args()

    if send_epub_to_kindle(args.epub_file):
        sys.exit(0)
    else:
        sys.exit(1)
