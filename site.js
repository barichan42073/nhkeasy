/* Easy NHK News — shared page behaviour: site menu and furigana mode.
 *
 * Furigana mode is stored per device in localStorage under 'nhkeasy-furigana'
 * and applied as a class on <html>: furi-all, furi-tap or furi-off.
 * Article pages set the class from an inline <head> script before first paint,
 * so this file only has to keep it in sync and wire up the controls.
 */
(function () {
    var KEY = 'nhkeasy-furigana';
    var MODES = ['all', 'tap', 'off'];
    var DEFAULT_MODE = 'tap';
    var root = document.documentElement;

    function readMode() {
        try {
            var m = localStorage.getItem(KEY);
            if (MODES.indexOf(m) !== -1) return m;
        } catch (e) {}
        return DEFAULT_MODE;
    }

    function currentMode() {
        for (var i = 0; i < MODES.length; i++) {
            if (root.classList.contains('furi-' + MODES[i])) return MODES[i];
        }
        return readMode();
    }

    function clearRevealed() {
        var shown = document.querySelectorAll('ruby.furi-shown');
        for (var i = 0; i < shown.length; i++) shown[i].classList.remove('furi-shown');
    }

    function applyMode(mode, save) {
        MODES.forEach(function (m) { root.classList.remove('furi-' + m); });
        root.classList.add('furi-' + mode);
        var buttons = document.querySelectorAll('.furi-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', buttons[i].dataset.furi === mode ? 'true' : 'false');
        }
        clearRevealed();
        if (save) {
            try { localStorage.setItem(KEY, mode); } catch (e) {}
        }
    }

    function isTyping(el) {
        if (!el) return false;
        var tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    }

    function init() {
        var hasFurigana = !!document.querySelector('.furi-control');

        if (hasFurigana) {
            applyMode(currentMode(), false);

            var buttons = document.querySelectorAll('.furi-btn');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function () {
                    applyMode(this.dataset.furi, true);
                });
            }

            // "On tap" mode: tapping or clicking a word toggles its reading.
            document.addEventListener('click', function (e) {
                if (!root.classList.contains('furi-tap')) return;
                var ruby = e.target.closest && e.target.closest('ruby');
                if (!ruby || ruby.closest('.site-header')) return;
                var sel = window.getSelection && window.getSelection();
                if (sel && sel.toString()) return; // the reader is selecting text
                ruby.classList.toggle('furi-shown');
            });

            // F cycles Always -> On tap -> Off.
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'f' && e.key !== 'F') return;
                if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
                var next = MODES[(MODES.indexOf(currentMode()) + 1) % MODES.length];
                applyMode(next, true);
            });
        }

        // Site menu.
        var menuButton = document.querySelector('.menu-button');
        var menu = document.getElementById('site-menu');
        if (menuButton && menu) {
            function setMenu(open) {
                menu.hidden = !open;
                menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
                menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
                menuButton.classList.toggle('is-open', open);
            }
            menuButton.addEventListener('click', function () { setMenu(menu.hidden); });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && !menu.hidden) {
                    setMenu(false);
                    menuButton.focus();
                }
            });
            document.addEventListener('click', function (e) {
                if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
