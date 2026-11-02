from anki_pipeline import select_daily_vocab, split_known_vocab


def _v(word, article="A"):
    return {"word": word, "article_title": article}


def test_select_daily_vocab_single_article_keeps_order_and_cap():
    pool = [_v(f"a{i}") for i in range(15)]

    result = select_daily_vocab(pool, max_words=12)

    assert [v["word"] for v in result] == [f"a{i}" for i in range(12)]


def test_select_daily_vocab_shares_slots_across_articles():
    pool = (
        [_v(f"a{i}", "A") for i in range(15)]
        + [_v(f"b{i}", "B") for i in range(15)]
        + [_v(f"c{i}", "C") for i in range(3)]
    )

    words = [v["word"] for v in select_daily_vocab(pool, max_words=12)]

    assert len(words) == 12
    assert {prefix: sum(w.startswith(prefix) for w in words) for prefix in "abc"} == {
        "a": 5,
        "b": 4,
        "c": 3,
    }
    assert words[:3] == ["a0", "b0", "c0"]


def test_select_daily_vocab_drops_duplicates_across_articles():
    pool = [_v("x", "A"), _v("y", "A"), _v("x", "B"), _v("z", "B")]

    words = [v["word"] for v in select_daily_vocab(pool, max_words=12)]

    assert sorted(words) == ["x", "y", "z"]
    assert words.count("x") == 1


def test_select_daily_vocab_handles_items_without_article_title():
    pool = [{"word": "x"}, {"word": "y"}]

    assert [v["word"] for v in select_daily_vocab(pool)] == ["x", "y"]


def test_split_known_vocab_splits_and_dedupes_in_order():
    pool = [_v("x", "A"), _v("k", "A"), _v("x", "B"), _v("k", "B"), _v("n", "B")]

    new, known = split_known_vocab(pool, {"k": {}})

    assert [v["word"] for v in new] == ["x", "n"]
    assert [v["word"] for v in known] == ["k"]
