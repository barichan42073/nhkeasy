//
// 詳細ページJS (jQuery非依存版)
//
var dictImagePath = dictImagePath ?? '';

document.addEventListener('DOMContentLoaded', function () {
  var newsId = null;
  var bodyId = document.body.getAttribute('id');
  if (bodyId) {
    var matchBodyId = bodyId.match(/((?:k|t|j|em|ne)\d{13,14})/);
    if (matchBodyId) {
      newsId = matchBodyId[0];
    }
  }

  var newsData = null;
  var resNewsWebState = '';

  var isNewsPage = true;
  var pageType = document.body.getAttribute('data-page');
  if (pageType !== 'news') {
    isNewsPage = false;
  }

  var articleFigureEl = document.getElementById('js-article-figure');
  var regularNewsLnkEl = document.getElementById('js-regular-news');

  function setMoviePlayer() {
    var mId =
      !newsData.has_news_web_image && !newsData.has_news_easy_image
        ? null
        : newsData.news_web_movie_uri;

    var moviePlayerUrl = '/n-data/conf/player/index.html';
    var newsWebMovieUrl = newsData.news_web_movie_uri;
    var movieIframeUrl = newsWebMovieUrl;

    // EASY用movie
    if (newsData.has_news_easy_movie) {
      // movieIframeUrlの例 ne2024103016575_98aCM3gsDdj5Vr6fxKoQGI2NHN65xenFSKEY7Nbs.mp4
      // https://media.vd.st.nhk/news/k10014871861_202507231027_202507231033/index.m3u8の形式にする
      // movieIframeUrl = newsData.news_easy_movie_uri.slice(0, -4) + '/index.m3u8&';
      // movieImageUrlの例 duJb5Kfrz0GezV74AIomTr1hoFr9MFMUCCLCyZkM.jpg
      // https:// で始まる形式にする

      // mrurlはフルパス
      var mrurl = newsData.news_easy_movie_uri;
      // mrposterはドメインが不要で除去
      var mrposter = new URL(newsData.news_easy_image_uri).pathname;
      movieIframeUrl = moviePlayerUrl + '?mrurl=' + mrurl + '&mrposter=' + mrposter;
    }

    // 元記事が読み込めるかチェック
    if (newsData.news_web_url !== null) {
      checkNewsWeb();
    }

    if (mId == null) {
      if (regularNewsLnkEl !== null) {
        regularNewsLnkEl.style.display = 'none';
      }
    } else {
      if (newsData.has_news_web_movie || newsData.has_news_easy_movie) {
        articleFigureEl.innerHTML =
          '<iframe src="' + movieIframeUrl + '" allowfullscreen movie=false></iframe>';

        // jQueryのajaxをfetchに置き換え
        fetch(movieIframeUrl, {
          cache: 'no-store', // キャッシュを無効化
        })
          .then((response) => {
            if (response.status === 200 || response.status === 304) {
              articleFigureEl.classList.add('is-video');
              articleFigureEl.classList.add('is-show');
            } else {
              setMainImage();
            }
            return response;
          })
          .catch((error) => {
            console.error('Error fetching movie:', error);
            setMainImage();
          });
      } else {
        setMainImage();
      }
    }
  }

  function removeRegularArticleLink() {
    if (regularNewsLnkEl !== null) {
      regularNewsLnkEl.setAttribute('href', newsData.news_web_url);
      regularNewsLnkEl.style.display = 'none';
    }
  }

  function getNewArticles(currentNewsId) {
    var newsLength = 5;
    var newsDataList = [];
    function makeTopNews(json) {
      var newsListHtml = '';
      newsDataList = json;
      function makeTopNewsList(start, end) {
        let skipOffset = 0;
        for (var i = start; i < end; i++) {
          if (currentNewsId !== null && newsDataList[i].news_id === currentNewsId) {
            skipOffset = 1;
          }
          newsListHtml += easyGV.getNewsItemHtml(
            newsDataList[i + skipOffset],
            'new-articles__item',
          );
        }
      }
      makeTopNewsList(0, newsLength);
      var newsList = document.querySelector('.new-articles__list');
      if (newsList) {
        newsList.insertAdjacentHTML('beforeend', newsListHtml);
      }
    }
    easyGV.getJson(easyGV.jsonPath + easyGV.jsonURL.toplist, makeTopNews);
    easyGV.showContents();
  }

  function setMainImage() {
    var src = '';
    var basePath = easyGV.path;
    if (newsData.has_news_easy_image) {
      src = newsData.news_easy_image_uri;
    } else if (newsData.has_news_web_image) {
      src = newsData.news_web_image_uri;
    }
    if (newsData.has_news_web_image && resNewsWebState !== 'success') {
      articleFigureEl.innerHTML =
        '<img src="' +
        src +
        '" alt="" onerror="this.src=\'' +
        basePath +
        'images/noimg_default_easy_m.jpg\';">';
      articleFigureEl.classList.add('is-show');
    }
    if (src != '') {
      articleFigureEl.innerHTML =
        '<img src="' +
        src +
        '" alt="" onerror="this.src=\'' +
        basePath +
        'images/noimg_default_easy_m.jpg\';">';
      articleFigureEl.classList.add('is-show');
    }
  }

  function checkNewsWeb() {
    // jQueryのajaxをfetchに置き換え
    fetch(newsData.news_web_url, {
      cache: 'no-store', // キャッシュを無効化
    })
      .then((response) => {
        if (response.status === 200 || response.status === 304) {
          return response.text();
        } else {
          resNewsWebState = 'errorStatus';
          removeRegularArticleLink();
        }
      })
      // .then((data) => {
      //   var news_web_image_url = newsData.news_web_image_uri.split('/');
      //   if (data.match(news_web_image_url[news_web_image_url.length - 1])) {
      //     resNewsWebState = 'success';
      //   } else {
      //     resNewsWebState = 'errorImage';
      //   }
      // })
      .catch((error) => {
        resNewsWebState = 'error';
        removeRegularArticleLink();
      });
  }

  function setAudioPlayer(voiceId) {
    var iframeHtml = '';
    var title = encodeURIComponent(document.title);

    if (isNewsPage) {
      iframeHtml =
        '<div class="frame-wrap"><iframe src="' +
        easyGV.iframePath +
        'player/audio-v6.html?voiceId=' +
        voiceId +
        '&title=' +
        title +
        '"></iframe></div>';
    } else {
      iframeHtml =
        '<div class="frame-wrap"><iframe src="' +
        easyGV.iframePath +
        'player/audio-v6.html?voiceId=' +
        voiceId +
        '&title=' +
        title +
        '&isDisaster=true' +
        '"></iframe></div>';
    }
    var audioWrapperEl = document.getElementById('js-audio-wrapper');
    var audioInnerEl = document.getElementById('js-audio-inner');
    var audioListenButton = document.querySelector('.js-open-audio');
    var isShow = false;

    if (audioListenButton) {
      audioListenButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (!isShow) {
          audioListenButton.classList.add('is-active');
          if (audioWrapperEl) audioWrapperEl.classList.add('is-active');
          if (audioInnerEl) audioInnerEl.innerHTML = iframeHtml;
          isShow = true;
        } else {
          audioListenButton.classList.remove('is-active');
          if (audioWrapperEl) audioWrapperEl.classList.remove('is-active');
          if (audioInnerEl) audioInnerEl.innerHTML = '';
          isShow = false;
        }
      });
    }

    const closeAudioButton = document.querySelector('.js-close-audio');
    if (closeAudioButton) {
      closeAudioButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (audioListenButton) audioListenButton.classList.remove('is-active');
        if (audioWrapperEl) audioWrapperEl.classList.remove('is-active');
        if (audioInnerEl) audioInnerEl.innerHTML = '';
        isShow = false;
      });
    }
  }

  function getCurrentNewsData(json) {
    if (!(json && json[0])) {
      return null;
    }
    var data = null;
    for (var i in json[0]) {
      var list = json[0][i];
      for (var k in list) {
        if (list[k].news_id == newsId) {
          data = list[k];
          break;
        }
      }
    }
    return data;
  }

  function getVoiceId(json) {
    if (!json) {
      return newsId;
    }
    var id = '';
    for (var i in json) {
      if (json[i].news_id == newsId) {
        id = json[i].voice_id;
        break;
      }
    }
    if (id == '') {
      id = newsId;
    }
    return id;
  }

  function formatArticleDate() {
    var dateEl = document.getElementById('js-article-date');
    if (dateEl) {
      var articleDateText = dateEl.textContent;
      dateEl.textContent = articleDateText.replace('[0', '[').replace('月0', '月');
    }
  }

  if (isNewsPage) {
    easyGV.getJson(easyGV.path + easyGV.jsonURL.newslist, function (json) {
      newsData = getCurrentNewsData(json); // 当該記事のJSONデータを取得
      getNewArticles(newsId); // 関連記事を取得
      if (newsData !== null) {
        setMoviePlayer();
      } else if (newsData == null) {
        if (regularNewsLnkEl !== null) {
          regularNewsLnkEl.style.display = 'none';
        }
      }
      if (newsData !== null) {
        setAudioPlayer(encodeURIComponent(newsData.news_easy_voice_uri));
      }
    });
    easyGV.showContents();
    formatArticleDate();
  } else {
    easyGV.getJson(easyGV.path + easyGV.jsonURL.voicereplace, function (json) {
      setAudioPlayer(getVoiceId(json));
    });
    easyGV.showContents();
  }
});
