import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
import logging
import sys
import argparse
import uuid
from email.utils import make_msgid, formatdate

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
logger = logging.getLogger(__name__)

def send_epub_to_kindle(epub_path: Path, kindle_email: str = None) -> bool:
    if not isinstance(epub_path, Path):
        epub_path = Path(epub_path)

    if not epub_path.exists():
        logger.error(f"EPUB file not found: {epub_path}")
        return False

    if not kindle_email:
        kindle_email = os.getenv('KINDLE_EMAIL')
        if not kindle_email:
            logger.error("KINDLE_EMAIL environment variable not set.")
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

    logger.info(f"Preparing to send '{epub_path.name}' to Kindle: {kindle_email}")

    # Create message with strict RFC headers required by strict gateways
    msg = EmailMessage()
    msg['Subject'] = 'NHK Easy Article'
    msg['From'] = sender_email
    msg['To'] = kindle_email
    msg['Date'] = formatdate(localtime=True)
    msg['Message-ID'] = make_msgid()
    msg['X-Mailer'] = 'Mutt/2.2.9'  # Mimic mutt's exact successful agent signature

    # Kindle personal documents do not need a body text message; 
    # sending a clean attachment-only structure prevents parsing blocks.
    try:
        with open(epub_path, 'rb') as f:
            file_data = f.read()
        
        msg.add_attachment(
            file_data,
            maintype='application',
            subtype='epub+zip',
            filename=epub_path.name
        )
    except Exception as e:
        logger.error(f"Failed to read EPUB file: {e}")
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

        logger.info(f"Successfully delivered '{epub_path.name}' payload to SMTP relay.")
        return True
    except Exception as e:
        logger.error(f"SMTP transmission failed: {e}", exc_info=True)
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Send EPUB to Kindle via smtplib.")
    parser.add_argument("epub_file", type=Path)
    args = parser.parse_args()
    
    if send_epub_to_kindle(args.epub_file):
        sys.exit(0)
    else:
        sys.exit(1)
