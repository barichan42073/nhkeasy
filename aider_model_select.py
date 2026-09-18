#!/usr/bin/env python3
import os
import sys
import subprocess
from pathlib import Path

# Built-in defaults
BUILTIN_MODELS = {
    "gflash": "gemini-2.5-flash",
    "gpro": "gemini-2.5-pro",
    "dpro": "deepseek-reasoner",
    "dflash": "deepseek-chat",
}

def get_config_path():
    env_path = os.environ.get("AIDER_MODEL_SELECT_CONFIG")
    if env_path:
        return Path(env_path)
    return Path.home() / ".config" / "aider" / "model_select.conf"

def load_aliases():
    aliases = BUILTIN_MODELS.copy()
    config_file = get_config_path()
    
    if config_file.is_file():
        for line in config_file.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            # Support both space and '=' separators
            if "=" in line:
                parts = line.split("=", 1)
            else:
                parts = line.split(None, 1)
            
            if len(parts) == 2:
                aliases[parts[0].strip()] = parts[1].strip()
                
    return aliases

def main():
    aliases = load_aliases()
    args = sys.argv[1:]
    
    chosen_model = None
    passthrough_args = []
    
    # Simple argument parsing
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in ("-h", "--help"):
            print("Usage: aider-select [ALIAS or MODEL] [aider-options...]")
            print("\nAvailable Aliases:")
            for k, v in aliases.items():
                print(f"  {k:10} -> {v}")
            sys.exit(0)
        elif arg == "--model" and i + 1 < len(args):
            chosen_model = args[i + 1]
            i += 2
            continue
        elif not chosen_model and not arg.startswith("-"):
            chosen_model = arg
            i += 1
            continue
        else:
            passthrough_args = args[i:]
            break
        i += 1

    # Resolve alias or use direct model input
    if chosen_model:
        model = aliases.get(chosen_model, chosen_model)
    else:
        # Interactive selection if nothing provided
        items = list(aliases.items())
        print("Choose a model:")
        for idx, (alias, mod) in enumerate(items, 1):
            print(f" {idx:2d}) {alias:10} -> {mod}")
        
        try:
            sel = int(input(f"Enter number (1-{len(items)}): "))
            model = items[sel - 1][1]
        except (ValueError, IndexError):
            sys.exit("Error: Invalid selection.")

    # Build aider command
    cmd = ["aider", "--cache-keepalive-pings", "6", "--cache-prompts", "--no-stream", "--model", model]
    
    # Automatically force map-tokens to 0 for groq models
    if "groq" in model.lower():
        cmd.extend(["--map-tokens", "0"])
        
    cmd.extend(passthrough_args)
    
    print(f"Launching aider with model: {model}")
    os.execvp("aider", cmd)

if __name__ == "__main__":
    main()
