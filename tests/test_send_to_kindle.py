import os
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock
import smtplib
import tempfile

import send_to_kindle


class TestSendToKindle(unittest.TestCase):
    def setUp(self):
        self.env_patcher = patch.dict(os.environ, {
            "SMTP_SERVER": "smtp.example.com",
            "SMTP_PORT": "587",
            "SMTP_USERNAME": "user@example.com",
            "SMTP_PASSWORD": "secret",
            "SENDER_EMAIL": "sender@example.com",
            "KINDLE_EMAIL": "kindle@example.com"
        })
        self.env_patcher.start()

    def tearDown(self):
        self.env_patcher.stop()

    def test_send_epub_to_kindle_file_not_found(self):
        non_existent = Path("/path/to/non_existent.epub")
        self.assertFalse(send_to_kindle.send_epub_to_kindle(non_existent))

    def test_send_epub_to_kindle_missing_kindle_email(self):
        with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
            with patch.dict(os.environ, {}, clear=True):
                self.assertFalse(send_to_kindle.send_epub_to_kindle(Path(tmp.name)))

    def test_send_epub_to_kindle_missing_smtp_server(self):
        with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
            with patch.dict(os.environ, {"KINDLE_EMAIL": "kindle@example.com"}, clear=True):
                self.assertFalse(send_to_kindle.send_epub_to_kindle(Path(tmp.name)))

    def test_send_epub_to_kindle_success_tls(self):
        with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
            tmp_path = Path(tmp.name)
            tmp_path.write_bytes(b"dummy epub data")

            with patch("smtplib.SMTP") as mock_smtp_cls:
                mock_smtp = MagicMock()
                mock_smtp_cls.return_value.__enter__.return_value = mock_smtp

                result = send_to_kindle.send_epub_to_kindle(tmp_path)

                self.assertTrue(result)
                mock_smtp_cls.assert_called_once_with("smtp.example.com", 587, timeout=30)
                mock_smtp.starttls.assert_called_once()
                mock_smtp.login.assert_called_once_with("user@example.com", "secret")
                mock_smtp.send_message.assert_called_once()

                sent_msg = mock_smtp.send_message.call_args[0][0]
                self.assertEqual(sent_msg["Subject"], "NHK Easy Article")
                self.assertEqual(sent_msg["From"], "sender@example.com")
                self.assertEqual(sent_msg["To"], "kindle@example.com")

    def test_send_epub_to_kindle_success_ssl(self):
        with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
            tmp_path = Path(tmp.name)
            tmp_path.write_bytes(b"dummy epub data")

            with patch.dict(os.environ, {"SMTP_PORT": "465"}):
                with patch("smtplib.SMTP_SSL") as mock_smtp_ssl_cls:
                    mock_smtp_ssl = MagicMock()
                    mock_smtp_ssl_cls.return_value.__enter__.return_value = mock_smtp_ssl

                    result = send_to_kindle.send_epub_to_kindle(tmp_path)

                    self.assertTrue(result)
                    mock_smtp_ssl_cls.assert_called_once_with("smtp.example.com", 465, timeout=30)
                    mock_smtp_ssl.login.assert_called_once_with("user@example.com", "secret")
                    mock_smtp_ssl.send_message.assert_called_once()

    def test_send_epub_to_kindle_auth_error(self):
        with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
            tmp_path = Path(tmp.name)
            tmp_path.write_bytes(b"dummy epub data")

            with patch("smtplib.SMTP") as mock_smtp_cls:
                mock_smtp = MagicMock()
                mock_smtp.login.side_effect = smtplib.SMTPAuthenticationError(535, b"Authentication failed")
                mock_smtp_cls.return_value.__enter__.return_value = mock_smtp

                result = send_to_kindle.send_epub_to_kindle(tmp_path)
                self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()
