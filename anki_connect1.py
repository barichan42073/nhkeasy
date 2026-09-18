import json
import sys
import os
import urllib.request
import urllib.error

class AnkiConnectManager:
    """Manager for AnkiConnect API interactions"""
    
    def __init__(self, host='127.0.0.1', port=8765):
        self.url = f'http://{host}:{port}'
    
    def post(self, action, **params):
        """Send a request to AnkiConnect"""
        payload = json.dumps({
            "action": action,
            "version": 6,
            "params": params
        }).encode('utf-8')
        
        request = urllib.request.Request(self.url, data=payload)
        request.add_header('Content-Type', 'application/json')
        
        try:
            response = urllib.request.urlopen(request)
            result = json.loads(response.read().decode('utf-8'))
            
            # Check for AnkiConnect errors
            if len(result) != 2:
                raise AnkiConnectError(result.get('error', 'Unknown error'))
            elif result['error'] is not None:
                raise AnkiConnectError(result['error'])
            
            return result['result']
        except urllib.error.URLError as e:
            raise AnkiConnectError(f"Failed to connect to Anki (make sure Anki is running): {e}")
    
    def check_version(self):
        """Check AnkiConnect version compatibility"""
        try:
            version = self.post('version')
            if version < 6:
                raise AnkiConnectError("AnkiConnect version 6 or higher is required")
            print(f"AnkiConnect version: {version}")
        except AnkiConnectError as e:
            raise

class AnkiConnectError(Exception):
    """Custom exception for AnkiConnect errors"""
    pass

def upload_anki_package(apkg_path, host='127.0.0.1', port=8765):
    """
    Upload an Anki package (.apkg) file to Anki using AnkiConnect
    
    Args:
        apkg_path (str): Path to the .apkg file
        host (str): AnkiConnect host address
        port (int): AnkiConnect port number
    
    Returns:
        bool: True if upload successful, False otherwise
    """
    
    # Validate file exists
    if not os.path.exists(apkg_path):
        print(f"Error: File not found: {apkg_path}")
        return False
    
    # Check file extension
    if not apkg_path.lower().endswith('.apkg'):
        print(f"Warning: File doesn't have .apkg extension: {apkg_path}")
    
    try:
        # Initialize AnkiConnect connection
        anki = AnkiConnectManager(host, port)
        
        # Check AnkiConnect is running and compatible
        print("Checking AnkiConnect connection...")
        anki.check_version()
        
        # Get the absolute path to pass to AnkiConnect
        absolute_path = os.path.abspath(apkg_path)
        
        print(f"Uploading {absolute_path} to Anki...")
        
        # Upload the package to Anki using the file path
        result = anki.post(
            'importPackage',
            path=absolute_path
        )
        
        # AnkiConnect returns True on successful import, or None if it silently succeeded in older versions
        # Usually checking if an exception wasn't thrown is sufficient for importPackage.
        print(f"Successfully uploaded {apkg_path} to Anki")
        return True
            
    except AnkiConnectError as e:
        print(f"AnkiConnect error: {e}")
        print("\nMake sure:")
        print("1. Anki is running")
        print("2. AnkiConnect add-on is installed (code: 2055492159)")
        print("3. AnkiConnect is enabled (Tools > Add-ons > AnkiConnect)")
        return False
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def main():
    """Main entry point for the script"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Upload an Anki package (.apkg) file to Anki using AnkiConnect'
    )
    parser.add_argument(
        'apkg_path',
        help='Path to the .apkg file to upload'
    )
    parser.add_argument(
        '--host',
        default='127.0.0.1',
        help='AnkiConnect host (default: 127.0.0.1)'
    )
    parser.add_argument(
        '--port',
        type=int,
        default=8765,
        help='AnkiConnect port (default: 8765)'
    )
    
    args = parser.parse_args()
    
    # Upload the package
    success = upload_anki_package(
        args.apkg_path,
        host=args.host,
        port=args.port
    )
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()