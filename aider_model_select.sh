#!/usr/bin/env bash
set -euo pipefail

# Default config file path (override with AIDER_MODEL_SELECT_CONFIG)
CONFIG_FILE="${AIDER_MODEL_SELECT_CONFIG:-$HOME/.config/aider/model_select.conf}"

die() {
    echo "Error: $*" >&2
    exit 1
}

trim() {
    local s="$1"
    s="${s#"${s%%[![:space:]]*}"}"
    s="${s%"${s##*[![:space:]]}"}"
    printf '%s' "$s"
}

builtin_model() {
    case "$1" in
        gflash) echo "gemini-2.5-flash" ;;
        gpro)   echo "gemini-2.5-pro" ;;
        dpro)   echo "deepseek-reasoner" ;;
        dflash) echo "deepseek-chat" ;;
        *)      return 1 ;;
    esac
}

config_lookup() {
    local alias="$1" line key val
    [[ -f "$CONFIG_FILE" ]] || return 1
    while IFS= read -r line || [[ -n "$line" ]]; do
        line="$(trim "$line")"
        [[ -z "$line" || "$line" == \#* ]] && continue
        if [[ "$line" =~ ^[[:space:]]*([^[:space:]=]+)[[:space:]=]+(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            val="$(trim "${BASH_REMATCH[2]}")"
            if [[ "$key" == "$alias" ]]; then
                echo "$val"
                return 0
            fi
        fi
    done < "$CONFIG_FILE"
    return 1
}

resolve_alias() {
    local alias="$1" model
    model="$(config_lookup "$alias")" && { echo "$model"; return 0; }
    model="$(builtin_model "$alias")" && { echo "$model"; return 0; }
    return 1
}

looks_like_model() {
    [[ "$1" == */* || "$1" == *.* ]]
}

print_aliases() {
    echo "Built-in aliases:"
    printf "  %-10s -> %s\n" "gflash" "gemini-2.5-flash"
    printf "  %-10s -> %s\n" "gpro"   "gemini-2.5-pro"
    printf "  %-10s -> %s\n" "dpro"   "deepseek-reasoner"
    printf "  %-10s -> %s\n" "dflash" "deepseek-chat"

    if [[ -f "$CONFIG_FILE" ]]; then
        echo ""
        echo "User-defined aliases from $CONFIG_FILE:"
        local line
        while IFS= read -r line || [[ -n "$line" ]]; do
            line="$(trim "$line")"
            [[ -z "$line" || "$line" == \#* ]] && continue
            printf "  %s\n" "$line"
        done < "$CONFIG_FILE"
    fi
}

show_usage() {
    cat <<EOF
Usage: $(basename "$0") [ALIAS] [aider-options...]
       $(basename "$0") --model MODEL [aider-options...]
       $(basename "$0") --default NAME [aider-options...]

Select a model to use with aider.

Options:
  -h, --help        Show this help.
  --model MODEL     Use MODEL directly without alias resolution.
  --default NAME    Use NAME (alias or direct model) non-interactively.
  --verify          Check with 'aider --models' that the model exists.

Environment:
  AIDER_MODEL_SELECT          Default alias/model when no CLI selection is made.
  AIDER_MODEL_SELECT_CONFIG   Path to a config file.
                              (default: ~/.config/aider/model_select.conf)

Config file format: "alias model" or "alias=model", one per line.

Aliases:
EOF
    print_aliases
    exit 0
}

interactive_select() {
    local -a aliases=() models=()
    add_alias() {
        aliases+=("$1")
        models+=("$2")
    }

    add_alias gflash "gemini-2.5-flash"
    add_alias gpro   "gemini-2.5-pro"
    add_alias dpro   "deepseek-reasoner"
    add_alias dflash "deepseek-chat"

    if [[ -f "$CONFIG_FILE" ]]; then
        local line
        while IFS= read -r line || [[ -n "$line" ]]; do
            line="$(trim "$line")"
            [[ -z "$line" || "$line" == \#* ]] && continue
            if [[ "$line" =~ ^[[:space:]]*([^[:space:]=]+)[[:space:]=]+(.*)$ ]]; then
                add_alias "${BASH_REMATCH[1]}" "$(trim "${BASH_REMATCH[2]}")"
            fi
        done < "$CONFIG_FILE"
    fi

    echo "Choose a model:"
    local i
    for i in "${!aliases[@]}"; do
        printf " %2d) %-10s -> %s\n" "$((i+1))" "${aliases[$i]}" "${models[$i]}"
    done

    local sel
    read -r -p "Enter number (1-${#aliases[@]}): " sel || exit 1
    if ! [[ "$sel" =~ ^[0-9]+$ ]] || (( sel < 1 || sel > ${#aliases[@]} )); then
        die "Invalid selection."
    fi
    echo "${models[$((sel-1))]}"
}

verify_model() {
    local model="$1"
    if ! command -v aider >/dev/null 2>&1; then
        echo "Warning: 'aider' not found; skipping verification." >&2
        return 0
    fi
    if aider --models 2>/dev/null | grep -Fq "$model"; then
        return 0
    else
        echo "Warning: '$model' not found in 'aider --models' output." >&2
        return 1
    fi
}

main() {
    local alias_arg="" chosen_model=""
    local verify=false
    local -a passthrough=()
    local args=("$@")
    local i=0

    while [[ $i -lt ${#args[@]} ]]; do
        local arg="${args[$i]}"
        case "$arg" in
            -h|--help)
                show_usage
                ;;
            --default)
                i=$((i+1))
                [[ $i -lt ${#args[@]} ]] || die "--default requires an argument"
                alias_arg="${args[$i]}"
                i=$((i+1))
                ;;
            --model)
                i=$((i+1))
                [[ $i -lt ${#args[@]} ]] || die "--model requires an argument"
                chosen_model="${args[$i]}"
                i=$((i+1))
                ;;
            --model=*)
                chosen_model="${arg#--model=}"
                i=$((i+1))
                ;;
            --verify)
                verify=true
                i=$((i+1))
                ;;
            --)
                i=$((i+1))
                break
                ;;
            -*)
                break
                ;;
            *)
                if [[ -z "$chosen_model" && -z "$alias_arg" ]]; then
                    alias_arg="$arg"
                    i=$((i+1))
                fi
                break
                ;;
        esac
    done
    passthrough=("${args[@]:i}")

    local model=""
    if [[ -n "$chosen_model" ]]; then
        model="$chosen_model"
    else
        if [[ -z "$alias_arg" && -n "${AIDER_MODEL_SELECT:-}" ]]; then
            alias_arg="$AIDER_MODEL_SELECT"
        fi

        if [[ -n "$alias_arg" ]]; then
            if model="$(resolve_alias "$alias_arg")"; then
                :
            elif looks_like_model "$alias_arg"; then
                model="$alias_arg"
            else
                die "Unknown alias: $alias_arg (use --help to see aliases)"
            fi
        else
            model="$(interactive_select)"
        fi
    fi

    if [[ "$verify" == true ]]; then
        verify_model "$model" || die "Model verification failed for '$model'"
    fi

    # Automatically set map-tokens to 0 if using a Groq model
    local -a map_arg=()
    if [[ "$model" == *groq* ]]; then
        map_arg=("--map-tokens" "0")
    fi

    echo "Launching aider with model: $model"
    exec aider --cache-keepalive-pings 6 --cache-prompts --no-stream --model "$model" "${map_arg[@]}" "${passthrough[@]}"
}

main "$@"
