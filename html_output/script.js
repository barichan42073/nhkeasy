let currentWord = null;
let vocabList = [];

function setMode(mode, btn) {
    document.getElementById('article-body').className = 'article-inner mode-' + mode;
    document.querySelectorAll('.controls button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function showSidebar(el) {
// highlight the active word
    document.querySelectorAll('.word-token').forEach(w => {
        w.classList.remove('word-active');
    });

    el.classList.add('word-active');

    const d = el.dataset;

    currentWord = {
        surface: d.surface || '',
        reading: d.reading || '',
        base: d.base || '',
        baseReading: d.basereading || '',
        level: d.level || '',
        translation: d.trans || ''
    };

    const level = currentWord.level ? currentWord.level.toUpperCase() : 'N/A';

    const html =
        '<div style="font-size: 0.8rem; font-weight: 800; color: #01579b; margin-bottom: 5px;">' + level + '</div>' +
        '<h2 style="font-size: 2rem; margin: 0; color: var(--nhk-blue); border-bottom: 2px solid var(--nhk-blue);">' + currentWord.surface + '</h2>' +
        '<p><strong>Reading:</strong> ' + currentWord.reading + '</p>' +
        '<p><strong>Base:</strong> ' + currentWord.base + ' (' + currentWord.baseReading + ')</p>' +
        '<div style="margin-top: 15px; color:#b91c1c; font-weight: 600;">' + currentWord.translation + '</div>';

    document.getElementById('side-content').innerHTML = html;

    const sentenceEl = el.closest('[data-sentence-id]');
    if (sentenceEl) {
        showSentenceTranslation(sentenceEl);
    }
}

function showSentenceTranslation(el) {

    // remove highlight from all sentences
    document.querySelectorAll('.article-title, .article-body-text').forEach(node => {
        node.classList.remove('sentence-active');
    });

    // highlight the clicked sentence
    el.classList.add('sentence-active');

    const jp = el.dataset.jp || '';
    const en = el.dataset.en || '';

    const html =
        '<div style="font-size: 0.8rem; font-weight: 800; color: #01579b; margin-bottom: 8px;">Sentence</div>' +
        '<div style="font-size: 0.95rem; color: #666; margin-bottom: 12px; line-height: 1.7;">' + jp + '</div>' +
        '<div style="font-size: 1.05rem; color: #222; font-weight: 600; line-height: 1.6;">' + en + '</div>';

    document.getElementById('sentence-content').innerHTML = html;
}

function addCurrentWordToVocab() {
    if (!currentWord) {
        return;
    }

    const exists = vocabList.some(word =>
        word.surface === currentWord.surface &&
        word.base === currentWord.base
    );

    if (!exists) {
        vocabList.push({ ...currentWord });
    }

    renderVocabList();
}

function renderVocabList() {
    const vocabListEl = document.getElementById('vocab-list');

    if (vocabList.length === 0) {
        vocabListEl.innerHTML = '<p style="color:#94a3b8; text-align:center;">No saved words yet.</p>';
        return;
    }

    const html = vocabList.map(word => {
        const level = word.level ? word.level.toUpperCase() : 'N/A';

        return (
            '<div style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">' +
                '<div style="font-size: 0.8rem; color: #01579b; font-weight: 700;">' + level + '</div>' +
                '<div style="font-size: 1.1rem; font-weight: 700; margin-top: 2px;">' + word.surface + '</div>' +
                '<div style="font-size: 0.95rem; color: #555;">' + word.reading + '</div>' +
                '<div style="font-size: 0.95rem; color: #b91c1c; margin-top: 4px;">' + word.translation + '</div>' +
            '</div>'
        );
    }).join('');

    vocabListEl.innerHTML = html;
}

