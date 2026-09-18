//
// 共通JS (jQuery非依存版)
//
(function () {
  //
  // Global variable
  //
  var rootPath = '/news/easy/';
  window.easyGV = {
    path: rootPath,
    jsonPath: rootPath,
    listPath: rootPath,
    rankJsonPath: rootPath,
    iframePath: rootPath,
    jsonURL: {
      toplist: 'top-list.json',
      newslist: 'news-list.json',
      disasterlist: 'disaster-list.json',
      voicereplace: 'player/voice_replace/voice_replace.json',
      rankinglist: 'ranking-list.json',
    },
    getJson: function (url, resolve) {
      // jQueryのajaxをfetchに置き換え
      fetch(url, {
        cache: 'no-store', // キャッシュを無効化
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    getDoubleDigitsNum: function (num) {
      num += '';
      if (num.length === 1) {
        num = '0' + num;
      }
      return num;
    },
    getFormatDate: function (date, format) {
      if (!format) format = 'MM月DD日';
      var thisHour = easyGV.getDoubleDigitsNum(date.getHours());
      var thisMinute = easyGV.getDoubleDigitsNum(date.getMinutes());
      format = format.replace(/MM/g, date.getMonth() + 1);
      format = format.replace(/DD/g, date.getDate());
      format = format.replace(/hh/g, thisHour);
      format = format.replace(/mm/g, thisMinute);
      return format;
    },
    getBrowser: function () {
      var ua = navigator.userAgent;
      var o = {
        Android: ua.search(/(Android )(\d+\.\d+)/) > -1,
        androidVer: parseFloat(RegExp.$2),
        Kindle: ua.search(/Silk/) > -1,
        iPhone: ua.search(/iPhone/) > -1,
        iPod: ua.search(/iPod/) > -1,
        iPad: ua.search(/iPad/) > -1,
        iOS: false,
        Touch: false,
        IE: ua.search(/MSIE/) > -1,
      };
      if (o.androidVer < 2.1) {
        o.Android = false;
      }
      if (o.iPhone || o.iPod || o.iPad) o.iOS = true;
      if (o.iOS || o.Android) o.Touch = true;
      return o;
    },
    getNewsLink: function (newsID) {
      return easyGV.path + newsID + '/' + newsID + '.html';
    },
    getNewsItemHtml: function (data, itemClassName = 'list__item') {
      if (!data) {
        return '';
      }
      var html = '';
      var prearrangedTime = new Date(data.news_prearranged_time.replace(/-/g, '/'));
      var postTime = easyGV.getFormatDate(prearrangedTime, 'MM月DD日 hh時mm分');
      var datetime = data.news_prearranged_time;
      html += '<article class="' + itemClassName + '">';
      html += '<a href="' + easyGV.getNewsLink(data.news_id) + '">';
      var imgSrc = easyGV.path + 'images/noimg_default_easy_s.jpg"';
      if (data.has_news_easy_image) {
        imgSrc = data.news_easy_image_uri;
      } else if (data.has_news_web_image) {
        imgSrc = data.news_web_image_uri;
      }
      html +=
        '<img src="' +
        imgSrc +
        '" alt="" onerror="this.src=\'' +
        easyGV.path +
        'images/noimg_default_easy_s.jpg\';">';
      html += '<div class="item__info">';
      html += '<h2>' + data.title_with_ruby + '</h2>';
      html += '<time datetime="' + datetime + '">' + postTime + '</time>';
      html += '</div></a></article>';

      return html;
    },
    // Input: newslist(JSON object), keyword(Strings, not ListObject)
    searchNewsList: function (data, keywords) {
      // 1単語目の検索
      function firstSearch(dataList, keyword) {
        let tmp = [];
        for (let i = 0; i < dataList.length; i++) {
          for (let j = 0, day = dataList[i]; j < day.length; j++) {
            const article = day[j];
            title = article.title;
            if (title.includes(keyword)) {
              tmp.push(article);
            }
          }
        }
        return tmp;
      }

      // 2単語目以降の検索
      function searchBlock(dataList, keyword) {
        let tmp = [];
        for (let i = 0; i < dataList.length; i++) {
          const article = dataList[i];
          title = article.title;
          if (title.includes(keyword)) {
            tmp.push(article);
          }
        }
        return tmp;
      }

      let allNewslist = Object.values(data[0]);
      let wordList = keywords.split(' ');
      let newslist = firstSearch(allNewslist, wordList[0]);
      if (wordList.length > 1) {
        for (i = 1; i < wordList.length; i++) {
          newslist = searchBlock(newslist, wordList[i]);
        }
      }
      return newslist;
    },
    // 災害ページ内の検索(OR検索になっている・"雷"のときに"地雷"の記事を除外する)
    orSearchNewsList: function (data, keywords) {
      function orSearch(dataList, wordList) {
        let tmp = [];
        for (let i = 0; i < dataList.length; i++) {
          for (let j = 0, day = dataList[i]; j < day.length; j++) {
            const article = day[j];
            title = article.title;
            for (let k = 0; k < wordList.length; k++) {
              if (title.includes(wordList[k])) {
                if (wordList[k] == '雷' && title.includes('地雷')) {
                  break;
                }
                tmp.push(article);
                break;
              }
            }
          }
        }
        return tmp;
      }
      let allNewslist = Object.values(data[0]);
      let wordList = keywords.split(' ');
      return orSearch(allNewslist, wordList);
    },
    // 不要な記号やスペースを含む文字列を半角スペース区切りの単語列に分割
    parseKeyword: function (str) {
      try {
        tmp = str.replace(/　/g, ' ');
        tmp = tmp.replace(/・/g, ' ');
        while (tmp.includes('  ')) {
          tmp = tmp.replace(/  /g, ' ');
        }
        tmp = tmp.replace(/[\\/&?<>=;'|]/g, '');
        if (tmp.endsWith(' ')) {
          tmp = tmp.slice(0, -1);
        }
        return tmp;
      } catch (e) {
        console.log(e);
        return '';
      }
    },
    showContents: function () {
      var loadingElement = document.getElementById('loading');
      var contentElement = document.querySelector('.l-main');
      if (loadingElement) loadingElement.style.display = 'none';
      if (contentElement) contentElement.style.display = 'block';
    },
  };

  //
  // DOM操作のヘルパー関数
  //
  const domHelper = {
    // 要素を選択する (jQueryの$()の代わり)
    select: function (selector, parent = document) {
      return parent.querySelector(selector);
    },

    // 複数の要素を選択する (jQueryの$()の代わり)
    selectAll: function (selector, parent = document) {
      return parent.querySelectorAll(selector);
    },

    // クラスの追加 (jQueryのaddClass()の代わり)
    addClass: function (element, className) {
      if (element) element.classList.add(className);
    },

    // クラスの削除 (jQueryのremoveClass()の代わり)
    removeClass: function (element, className) {
      if (element) element.classList.remove(className);
    },

    // クラスの切り替え (jQueryのtoggleClass()の代わり)
    toggleClass: function (element, className) {
      if (element) element.classList.toggle(className);
    },

    // クラスの存在確認 (jQueryのhasClass()の代わり)
    hasClass: function (element, className) {
      return element ? element.classList.contains(className) : false;
    },

    // HTML内容の設定 (jQueryのhtml()の代わり)
    setHtml: function (element, html) {
      if (element) element.innerHTML = html;
    },

    // HTML内容の追加 (jQueryのappend()の代わり)
    appendHtml: function (element, html) {
      if (element) element.insertAdjacentHTML('beforeend', html);
    },

    // イベントリスナーの追加 (jQueryのon()の代わり)
    addEvent: function (element, eventType, handler) {
      if (element) element.addEventListener(eventType, handler);
    },

    // 複数要素へのイベントリスナー追加
    addEventToAll: function (elements, eventType, handler) {
      if (elements) {
        elements.forEach((element) => {
          element.addEventListener(eventType, handler);
        });
      }
    },

    // スムーススクロール (jQueryのanimate()の代わり)
    smoothScroll: function (targetElement, duration = 700) {
      if (!targetElement) return;

      const headerElement = document.getElementById('nhk-one-header');
      const headerBottomPosition = headerElement ? headerElement.getBoundingClientRect().bottom : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerBottomPosition;

      window.scrollTo({
        top: targetPosition < 0 ? 0 : targetPosition,
        behavior: 'smooth',
      });
    },
  };

  //
  // Common
  //
  function Common() {
    // スムーススクロール
    const smoothScrollLinks = domHelper.selectAll('.js-smooth-scroll');
    domHelper.addEventToAll(smoothScrollLinks, 'click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#' || href === '') {
        domHelper.smoothScroll(document.documentElement);
      } else {
        const target = document.querySelector(href);
        if (target) domHelper.smoothScroll(target);
      }
    });

    // ことばの色
    const toggleColorBtn = document.getElementById('js-toggle-color');
    if (toggleColorBtn) {
      domHelper.addEvent(toggleColorBtn, 'click', function (e) {
        e.preventDefault();
        const articleBody = document.getElementById('js-article-body');

        if (domHelper.hasClass(this, 'is-active')) {
          domHelper.removeClass(this, 'is-active');
          this.innerHTML = 'ことばの<ruby>色<rt>いろ</rt></ruby>を<ruby>消<rt>け</rt></ruby>す';
          domHelper.removeClass(articleBody, 'is-no-color');
        } else {
          domHelper.addClass(this, 'is-active');
          this.innerHTML = 'ことばの<ruby>色<rt>いろ</rt></ruby>をつける';
          domHelper.addClass(articleBody, 'is-no-color');
        }
      });
    }

    // 漢字の読み方
    const toggleRubyBtns = domHelper.selectAll('.js-toggle-ruby');
    domHelper.addEventToAll(toggleRubyBtns, 'click', function (e) {
      e.preventDefault();
      const wrapper = document.getElementById('easy-wrapper');

      if (domHelper.hasClass(this, 'is-active')) {
        domHelper.removeClass(this, 'is-active');
        this.innerHTML =
          '<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>を<ruby>消<rt>け</rt></ruby>す';
        domHelper.removeClass(wrapper, 'is-no-ruby');
      } else {
        domHelper.addClass(this, 'is-active');
        this.innerHTML =
          '<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>をつける';
        domHelper.addClass(wrapper, 'is-no-ruby');
      }
    });

    // アコーディオン
    const toggleAccordionBtns = domHelper.selectAll('.js-toggle-accordion');
    domHelper.addEventToAll(toggleAccordionBtns, 'click', function (e) {
      e.preventDefault();
      const accordionWrapper = this.closest('.js-accordion-wrapper');
      const accordionBody = accordionWrapper.querySelector('.js-accordion-body');

      if (domHelper.hasClass(this, 'is-open')) {
        domHelper.removeClass(this, 'is-open');
        domHelper.removeClass(accordionWrapper, 'is-open');
        domHelper.removeClass(accordionBody, 'is-open');
      } else {
        domHelper.addClass(this, 'is-open');
        domHelper.addClass(accordionWrapper, 'is-open');
        domHelper.addClass(accordionBody, 'is-open');
      }
    });

    // 検索ボックス
    const formEls = document.querySelectorAll('.js-search-box-form');
    function setFormEvent(formEl) {
      formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        var inputEl = formEl.querySelector('input');
        var keyword = easyGV.parseKeyword(inputEl.value);
        inputEl.value = keyword;
        if (keyword !== '') {
          event.target.submit();
        }
      });
    }
    for (var i = 0; i < formEls.length; i++) {
      setFormEvent(formEls[i]);
    }
  }

  //
  // Header
  //
  function Header() {
    var mediaQuery = window.matchMedia('(min-width: 961px)');
    const toggleMenuBtn = document.getElementById('js-toggle-menu');

    function changeMenuSize() {
      if (toggleMenuBtn) {
        if (mediaQuery.matches) {
          toggleMenuBtn.innerHTML = 'このサイトについて <div></div>';
        } else {
          toggleMenuBtn.innerHTML = 'メニュー <div></div>';
        }
      }
    }

    // 読み込まれたときに動作
    window.addEventListener('load', function () {
      changeMenuSize();
    });

    // MediaQueryが変更した時に動作
    mediaQuery.addEventListener('change', function () {
      changeMenuSize();
    });

    // リサイズ時にmenu部分の高さを調整
    let lastInnerWidth = window.innerWidth;
    let timer = 0;
    window.addEventListener('resize', function () {
      // リサイズしているときは、タイマーをリセットする
      clearTimeout(timer);
      //リサイズから100msたってから実行（100msの間にresizeが実行されなければ）
      timer = setTimeout(function () {
        if (lastInnerWidth != window.innerWidth) {
          // 横幅を記録しておく
          lastInnerWidth = window.innerWidth;

          if (toggleMenuBtn && domHelper.hasClass(toggleMenuBtn, 'is-open')) {
            let accordionWrapper = toggleMenuBtn.closest('.js-accordion-wrapper');
            let accordionBody = accordionWrapper.querySelector('.js-accordion-body');
            const accordionHeightBefore = accordionBody.offsetHeight;
            accordionBody.style.height = 'auto';
            const accordionHeight = accordionBody.offsetHeight;
            accordionBody.style.height = `${accordionHeightBefore}px`;
            setTimeout(() => {
              accordionBody.style.height = `${accordionHeight}px`;
            }, 30);
          }
        }
      }, 100);
    });

    // ヘッダーのアコーディオン
    if (toggleMenuBtn) {
      toggleMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var accordionWrapper = this.closest('.js-accordion-wrapper');
        var accordionBody = accordionWrapper.querySelector('.js-accordion-body');

        if (domHelper.hasClass(this, 'is-open')) {
          domHelper.removeClass(this, 'is-open');
          domHelper.removeClass(accordionWrapper, 'is-open');
          domHelper.removeClass(accordionBody, 'is-open');
          accordionBody.style.height = '0';
        } else {
          accordionBody.style.height = 'auto';
          const accordionHeight = accordionBody.offsetHeight;
          accordionBody.style.height = '';

          setTimeout(() => {
            accordionBody.style.height = `${accordionHeight}px`;
          }, 30);
          domHelper.addClass(this, 'is-open');
          domHelper.addClass(accordionWrapper, 'is-open');
          domHelper.addClass(accordionBody, 'is-open');
        }
      });
    }
  }

  //
  // Sidebar
  //
  function Sidebar() {
    function changeLanguage() {
      const changeLanguageButtons = document.querySelectorAll('.aboutSite-button');
      const changeLanguageContents = document.querySelectorAll('.aboutSite-content');
      changeLanguageButtons.forEach((button) => {
        button.addEventListener('click', () => {
          changeLanguageContents.forEach((text) => text.classList.toggle('hidden'));
        });
      });
    }

    changeLanguage();
    new Calendar();
  }

  //
  // Calendar
  //
  function Calendar() {
    let today = new Date();
    const Base = new Date();
    const limit = new Date(Base);
    limit.setMonth(limit.getMonth() - 12); // 遡れる期間(template = 1年間)
    const calendar_month = document.getElementById('calendar-month');
    const calendar_days = document.getElementById('calendar-days');
    const next = () => {
      clickMonth(1);
    };
    const back = () => {
      clickMonth(-1);
    };
    // 矢印クリック(戻る・進む)
    function setArrow() {
      const next_arrow = document.getElementById('next_arrow');
      const back_arrow = document.getElementById('back_arrow');
      // 一旦付いてるものを消す
      if (next_arrow) {
        next_arrow.removeEventListener('click', next);
        if (today < Base) {
          next_arrow.addEventListener('click', next);
          next_arrow.classList.remove('limited');
        } else {
          next_arrow.classList.add('limited');
        }
      }

      if (back_arrow) {
        back_arrow.removeEventListener('click', back);
        if (today > limit) {
          back_arrow.addEventListener('click', back);
          back_arrow.classList.remove('limited');
        } else {
          back_arrow.classList.add('limited');
        }
      }
    }

    // DOMを作る
    function makeCalendar(date = today) {
      if (!calendar_month || !calendar_days) return;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startDay = new Date(year, month - 1, 1).getDay(); // 今月1日の曜日
      let startDate = new Date(year, month - 1, 1);
      startDate.setDate(startDate.getDate() - startDay); // 第1週の日曜日
      let endDate = new Date(year, month, 0);
      calendar_month.innerText = `${year}年 ${month}月`;

      let fragment = document.createDocumentFragment();

      for (let w = 0, targetday = startDate; w < 6; w++) {
        const row = document.createElement('tr');
        for (let d = 0; d < 7; d++) {
          const cell = document.createElement('td');
          cell.innerText = targetday.getDate();
          const tmp = new Date(targetday);
          tmp.setDate(targetday.getDate() - d);
          const start = `${tmp.getFullYear()}-${('0' + (tmp.getMonth() + 1)).slice(
            -2,
          )}-${('0' + tmp.getDate()).slice(-2)}`;

          if (Base < targetday || limit > targetday) {
            cell.className = 'out_of_range';
          } else {
            // マウスホバーの動作設定
            cell.addEventListener('mouseover', (e) => {
              const brother = Array.from(e.target.parentNode.children);
              brother.forEach((bro) => {
                bro.classList.add('hovered');
              });
            });
            cell.addEventListener('mouseout', (e) => {
              const brother = Array.from(e.target.parentNode.children);
              brother.forEach((bro) => {
                bro.classList.remove('hovered');
              });
            });
            // クリック動作の設定
            cell.addEventListener('click', () => {
              clickDate(start);
            });
          }

          if (w === 0 && d < startDay) {
            // 前の月
            cell.classList.add('other_month');
          } else if (targetday.getMonth() !== date.getMonth()) {
            // 次の月
            cell.classList.add('other_month');
          }
          row.appendChild(cell);

          if (targetday >= endDate) {
            w = 6;
          }

          targetday.setDate(targetday.getDate() + 1);
        }
        fragment.appendChild(row);
      }

      // 元のを消して、新しいのを追加する
      while (calendar_days.firstChild) {
        calendar_days.removeChild(calendar_days.firstChild);
      }
      calendar_days.appendChild(fragment);
    }

    // その週日曜日から土曜日を検索条件のクエリに指定した過去記事ページのリンク先に飛ぶ
    function clickDate(start) {
      // input:String(Date 0埋め)
      let url = easyGV.listPath + 'list/index.html';
      let param = new URLSearchParams(url.search);
      param.set('date', start);
      window.location.href = url + `?${param.toString()}`;
    }

    // 矢印を押したときにカレンダーを書き換える
    function clickMonth(diff) {
      today.setMonth(today.getMonth() + diff);
      makeCalendar(today);
      setArrow();
    }

    setArrow();
    makeCalendar(today);
  }

  // DOMContentLoadedイベントで初期化
  document.addEventListener('DOMContentLoaded', function () {
    new Common();
    new Header();
    new Sidebar();
  });
})();
