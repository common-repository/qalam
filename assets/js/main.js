const baseLink = 'https://api.qalam.ai/';
let originalText = null,
  qalamAgent = 'Wordpress',
  type = null,
  doneCallback = null,
  API_LINK = '',
  TOKEN = '',
  shadowRoot = null,
  qalamDisablePrompt = null,
  isTextArea = null,
  triggerFlag = !0,
  SCServiceActive = null,
  qalamExtension = null,
  qalamExtensionCont = null,
  qalamHighlightsCont = null,
  qalamMirror = null,
  qalamSuggestions = null,
  wrongSuggestionItem = null,
  element = null,
  withoutScrollDiff = 0,
  elementParent = null,
  typingStallCounter = 0,
  secondsCounter = null,
  resizeHoldCounter = null,
  currentTextSuggestions = [],
  ignoredSet = new Set(),
  removeSuggestionsTimeout = null,
  selectedText = '',
  isTashkeelActive = null,
  isTawtheeqActive = null,
  isWriterAllowedToAddToDic = !1,
  activeFrameId = null,
  offset_indices = null,
  editorId = '',
  PATH_MODE = 'PATH_MODE',
  QUERY_MODE = 'QUERY_MODE';
var cssId = 'myCss',
  INTERSECTION_THRESHOLD = 0.7,
  REMOVE_SUGGESTION_DELAY = 300,
  TYPING_STALL = 1,
  ANIMATION_DELAY = 1e3,
  STYLES_BLOCKING = new Set([
    'block',
    'flex',
    'flow-root',
    'grid',
    'list-item',
    'table',
    'table-caption',
    'table-cell',
    'table-footer-group',
    'table-header-group',
    'table-row',
    'table-row-group',
  ]),
  example =
    '\nقلم للأعمال\nمساعد الكتابة الذكي للغة العربية\nعن قلم:\nقال تعالى: نون والقلم وما يسطرون\nوقال تعالى: إن الله وملائكته يصلون على النبي يا أيها الذين آمنوا صلوا عليه وسلموا تسليما\nقلم واحدة من شركات مجموعة موضوع. كوم (المجموعة)، وهي الراءدة في تطبيقات الذكاء الاصطناعي باللغة العربية داخل المجموعة . وبعد نجاح إستخدام هذه التطبيقات داخلياً ولدى بعض عملاءنا المقربون ، قررنا مشاركة التجربة مع الشركات، و المؤسسات، والوزارات الأخرى محليا داخل الأردنوخارجها.\nيعمل على تطوير قلم نخبة من الأخصائيون والخبراء في اللغة العربيه وحوسبتها، وفي علم البيانات والذكاء الاصطناعي، اضافه إلى مهندسو البرمجيات والحاسوب. جميعهم يعملون معاً لصناعة منتج ذكي، يخدم الكتابة بلغة الصاد.\nلماذا قلم؟\nنعلم أن كتابة المحتوي، وتدقيقه، والمحافظة على أسلوب الكتابة والنسق المتبع في شركتكم مهمة ليست بالهلة، خاصة حين يكون بصيغ مختلفة، وفي حجماً كبير، مثل:\nالتقارير بشتى أنواعها\nالأبحاث والنشر\nالعروض الفنية و المالية\nالمراسلاة والخطابات\nالرسائل الإلكترونية\nوغيرها\nومن هنا جاءت المهمه التي اضطلع بها قلم للأعمال أن يكون عوناً لكم في التخفيف من عبئ تدقيق المحتوى بشتى أنواعه، ومساعدة الكتّاب/الموظفين حتى ينتجو محتوى سليماً من الأخطائ الإملائية واللغوية والقواعدية، وتحسين الصياغة في اللغة العربية، بالإضافة إلى مساعدتهم في اتباع النسق وأسلوب الكتابة الخاص بالشركة.',
  STYLES_HIDDEN = new Set(['none', 'table-column', 'table-column-group']),
  STYLES_WRAP = new Set(['pre', 'pre-wrap', 'pre-line']),
  BUTTON_NORMAL_COLOR = '#008677',
  BUTTON_ERROR_COLOR = '#EC2240',
  QALAM_TOOLBAR_STYLE = '',
  MIRROR_SHADOW_STYLE =
    '\nqalam-mirror {\n  border: 0px transparent;\n  text-shadow: none;\n  text-indent: 0px;\n  word-break: normal;\n  overflow-wrap: break-word;\n  word-spacing: 0px;\n  writing-mode: horizontal-tb;\n  white-space: pre-wrap;\n  vertical-align: baseline;\n  clear: both;\n  box-sizing: content-box;\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  background: transparent;\n  pointer-events: none;\n  overflow: hidden;\n  color: transparent;\n  z-index: 1;\n  visibility: hidden;\n}\nqalam-disable-prompt {\n  position: fixed;\n  padding: 24px 32px;\n  border-radius: 4px;\n  background-color: #fff;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);\n  pointer-events: all;\n  width: 228px;\n  height: fit-content;\n  font-family: Tajawal, sans-serif !important;\n  box-sizing: border-box;\n  z-index: 2147483647;\n}\nqalam-disable-prompt .prompt-title {\n  color: #000;\n  font-size: 18px;\n  letter-spacing: 0;\n  line-height: 36px;\n  text-align: right;\n  margin: 0 0 8px 0;\n  padding: 0;\n  display: inline-block;\n  font-family: Tajawal, sans-serif !important;\n  width: 100%;\n}\n.qalam-btn {\n  width: 100%;\n  height: 32px;\n  font-size: 14px;\n  font-weight: 600;\n  border-radius: 4px;\n  margin: 16px 0 0 0;\n  padding: 0;\n  outline: none;\n  border-style: solid;\n  cursor: pointer;\n  font-family: Tajawal, sans-serif !important;\n}\n.qalam-btn.secondary-btn {\n  border: 1px solid #008677;\n  color: #008677;\n  background-color: #fff;\n}\n.qalam-btn.primary-btn {\n  background-color: #008677;\n  color: #fff;\n  border-color: #008677;\n}\nqalam-suggestions {\n  width: 175px;\n  border-radius: 4px;\n  background-color: #ffffff;\n  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2);\n  position: fixed;\n  display: none;\n  cursor: pointer;\n  z-index: 2147483647;\n  pointer-events: all;\n}\nqalam-suggestions suggestions-cont > div:nth-of-type(1) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n}\nqalam-suggestions suggestions-cont suggestion-item {\n  padding: 16px;\n  background-color: #fff;\n  width: 100%;\n  height: 56px;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n}\nqalam-suggestions suggestions-cont suggestion-item suggestion-text {\n  color: #008677;\n  font-family: Tajawal, sans-serif !important;\n  font-size: 20px;\n  font-weight: 600;\n  text-align: right;\n  width: 100%;\n  height: fit-content;\n  margin: -2px 0 0 0;\n  padding: 0;\n  direction: rtl;\n  display: inline-block;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\nqalam-suggestions suggestions-cont suggestion-item:hover {\n  background-color: #008677;\n}\nqalam-suggestions suggestions-cont suggestion-item:hover suggestion-text {\n  color: #fff;\n}\nqalam-suggestions .ignore-cont{\n  position: relative;\n}\nqalam-suggestions .ignore-cont,qalam-suggestions .add-to-dic-cont, qalam-suggestions .wrong-suggestion-cont {\n  direction: rtl;\n  display: flex;\n  flex-direction: row;\n  justify-content: start;\n  padding: 12px;\n  background-color: #fff;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  align-items: center;\n  width: 100%;\n  height: 46px;\n  box-sizing: border-box;\n}\nqalam-suggestions .ignore-cont .ignore-icon, qalam-suggestions .add-to-dic-cont .add-to-dic-icon,  qalam-suggestions .wrong-suggestion-cont .wrong-suggestion-icon {\n  width: 15px;\n  height: 15px;\n  margin-left: 10px;\n}\nqalam-suggestions .ignore-cont .ignore-text, qalam-suggestions .add-to-dic-cont .add-to-dic-text,  qalam-suggestions .wrong-suggestion-cont .wrong-suggestion-text{\n  opacity: 0.55;\n  color: #000;\n  font-family: Tajawal, sans-serif !important;\n  font-size: 14px;\n  margin: -2px 0 0 0;\n  padding: 0;\n  display: inline-block;\n}\nqalam-suggestions .ignore-cont:hover,qalam-suggestions .add-to-dic-cont:hover, qalam-suggestions .wrong-suggestion-cont:hover {\n  background-color: #e7e7e7;\n}\nqalam-suggestions .ignore-cont:hover .ignore-text,qalam-suggestions .add-to-dic-cont:hover .add-to-dic-text,  qalam-suggestions .wrong-suggestion-cont:hover .wrong-suggestion-text{\n  opacity: 0.7;\n}\n\nqalam-suggestions .wrong-suggestion-more-icon {\n\tposition: absolute;\n\tright: 85%;\n\tpadding: 4px;\n\tborder-radius: 10px\n  }\n  qalam-suggestions .wrong-suggestion-more-icon:hover {\n\tbackground-color: #9F9898;\n  }\n  \n  qalam-suggestions .wrong-suggestion-cont{\n\tposition: absolute;\n\tright: 100%;\n\ttop: 0;\n\tbox-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2);\n\tborder-radius: 10px;\n  }\n.d-none{\n  display:none;\n}\nqalam-container{\n  display:block !important;\n}\n';
const FLAT_RED = '#EC2240',
  FLAT_YELLOW = '#ffc940',
  FLAT_BLUE = '#1873D3',
  FLAT_GREEN = '#36CE8E',
  FLAT_BLUE_GREY = '#263238',
  FLAT_PURPLE = '#4a148c',
  FLAT_ORANGE = '#263238',
  FLAT_GREY = '#7393B3',
  TRANSPARENT_RED = 'rgba(255, 0, 0, 0.08)',
  TRANSPARENT_YELLOW = 'rgba(255, 201, 64, 0.27)',
  TRANSPARENT_BLUE = 'rgba(0, 255, 255, 0.08)',
  TRANSPARENT_GREEN = '#36ce8e14',
  TRANSPARENT_FLAT_BLUE_GREY = 'rgba(38, 50, 56, 0.08)',
  TRANSPARENT_FLAT_PURPLE = 'rgba(74, 20, 140, 0.08)',
  TRANSPARENT_FLAT_ORANGE = 'rgba(38, 50, 56, 0.08)',
  TRANSPARENT_GREY = '#b1b1b114',
  SC_LINE_COLOR = FLAT_RED,
  SC_LABEL_COLOR = TRANSPARENT_RED,
  OS_LINE_COLOR = '#7393B3',
  OS_LABEL_COLOR = '#b1b1b114',
  NUM_LINE_COLOR = '#ffc940',
  NUM_LABEL_COLOR = TRANSPARENT_YELLOW,
  GRAMMAR_LINE_COLOR = FLAT_BLUE,
  GRAMMAR_LABEL_COLOR = TRANSPARENT_BLUE,
  TF_LINE_COLOR = FLAT_GREEN,
  TF_LABEL_COLOR = TRANSPARENT_GREEN,
  PHRASING_LINE_COLOR = FLAT_YELLOW,
  PHRASING_LABEL_COLOR = TRANSPARENT_YELLOW,
  TERM_LINE_COLOR = FLAT_PURPLE,
  TERM_LABEL_COLOR = TRANSPARENT_FLAT_PURPLE,
  TAFQEET_LINE_COLOR = FLAT_ORANGE,
  TAFQEET_LABEL_COLOR = TRANSPARENT_FLAT_ORANGE,
  $ = jQuery.noConflict(),
  scr = document.createElement('script'),
  head = document.head || document.getElementsByTagName('head')[0];

function setParams(e, t, n, a) {
  (this.clientId = e),
    (this.documentId = t),
    (this.mode = n),
    (this.modeValue = a);
}
function activate(e, t) {
  (SCServiceActive = !0),
    (API_LINK = e),
    (TOKEN = t),
    getConfig(),
    getTermsConfig(),
    setSDKVersion(),
    setInterval(function () {
      setSDKVersion();
    }, 1 * 1000 * 60 * 60 * 24),
    init();
}
function setSDKVersion() {
  $.ajax({
    dataType: 'json',
    url: baseLink + 'sdk/version',
    method: 'PUT',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
      'sdk-version': '1.1.0-wp',
    },
    success: function () {},
    error: function () {},
  });
}
function checkFocusedElement() {
  if ((assignEditorIds(), SCServiceActive)) {
    let e = $(document.activeElement);
    e.hasClass('gramm_editor') && e.attr('data-gramm_editor', 'false'),
      e.hasClass('qalam_editor') && e.attr('data-qalam_editor', 'false'),
      (e.is('textarea') || 'true' == e.attr('contenteditable')) &&
        listenerTriggered(document.activeElement);
  }
  clearInterval(resizeHoldCounter), (resizeHoldCounter = null);
}
function init() {
  function e(e, t) {
    var n = 0;
    return function () {
      var a = this,
        o = arguments;
      clearTimeout(n),
        (n = setTimeout(function () {
          e.apply(a, o);
        }, t || 0));
    };
  }

  getCookie('qalam_user_id') || setCookie(),
    checkFocusedElement(),
    document.addEventListener('focus', checkFocusedElement, !0);
  let t = 0,
    n = 0,
    a = 0;
  var o = setInterval(function () {
    let l = document.querySelectorAll('iframe');
    if (0 != l.length) {
      for (var i = 0; i < l.length; ) {
        let s = l[i];
        if ((assignIframeEditorIds(s, i), s)) {
          let o =
            s.contentDocument && s.contentDocument.body
              ? s.contentDocument.body.parentElement.querySelector(
                  '[contenteditable]'
                ) || s.contentDocument.body.parentElement
              : null;
          if (o) {
            let l = s;
            s = s.contentDocument.querySelector('[contenteditable]');
            let i = o;
            $(i).on('click', function (e) {
              let t = tagIframe(l);
              activeFrameId !== t &&
                ((activeFrameId = t),
                setTimeout(function () {
                  listenerTriggered($(l)[0]);
                }, 10));
            }),
              $(i).on('mousemove', function (e) {
                if (isEventInsideElement(e, qalamSuggestions))
                  stopRemoveSuggestionsTimeout();
                else {
                  let t = $('qalam-label.active');
                  if (t.length) {
                    isInLabel = !1;
                    for (let n = 0; n < t.length; n++)
                      if (isEventInsideElement(e, t[n])) {
                        isInLabel = !0;
                        break;
                      }
                    isInLabel
                      ? stopRemoveSuggestionsTimeout()
                      : setRemoveSuggestionsTimeout();
                  }
                }
              }),
              $(i).unbind('keyup'),
              $(i).keyup(
                e(function (e) {
                  clearLabels(),
                    8 == e.keyCode
                      ? (clearTimeout(t),
                        SCServiceActive &&
                          (t = setTimeout(listenerTriggered($(l)[0]), 800)))
                      : (clearTimeout(n),
                        SCServiceActive &&
                          91 != e.keyCode &&
                          81 != e.keyCode &&
                          17 != e.keyCode &&
                          (n = setTimeout(listenerTriggered($(l)[0]), 600)));
                }, 1e3)
              ),
              i &&
                (i.onpaste = () => {
                  SCServiceActive &&
                    (clearTimeout(a),
                    (a = setTimeout(listenerTriggered($(l)[0]), 600)));
                  let e = 1;
                  e &&
                    setTimeout(() => {
                      spellCheckText(!0), (e = 0);
                    }, 1e3);
                });
          }
        }
        setTimeout(() => {
          clearInterval(o);
        }, 5e3),
          i++;
      }
      clearInterval(o);
    }
  }, 5e3);
  $(document).on('click', function (e) {
    $(e.target).closest('qalam-button-cont').length ||
      isEventInsideElement(e, qalamDisablePrompt) ||
      removeDisablePrompt(),
      isEventInsideElement(e, qalamSuggestions) || removeQalamSuggestions(),
      clearInterval(resizeHoldCounter),
      (resizeHoldCounter = null);
  }),
    mobileCheck &&
      document.addEventListener(
        'touchstart',
        function (e) {
          'QALAM-LABEL' == e.target.tagName &&
            (e.target.classList.add('active'), renderQalamSuggestions(e)),
            'QALAM-LABEL' != e.target.tagName &&
              'QALAM-SUGGESTIONS' != e.target.tagName &&
              'SUGGESTION-ITEM' != e.target.tagName &&
              'SUGGESTION-TEXT' != e.target.tagName &&
              'QALAM-MIRROR-SHADOW' != e.target.tagName &&
              ($(qalamSuggestions).remove(),
              $(
                'qalam-extension .qalam-highlights-cont qalam-label'
              ).removeClass('active'));
        },
        !1
      ),
    $(document).on('mousemove', function (e) {
      if (
        isEventInsideElement(e, qalamSuggestions) ||
        isEventInsideElement(e, wrongSuggestionItem)
      )
        stopRemoveSuggestionsTimeout();
      else {
        let t = $('qalam-label.active');
        if (t.length) {
          isInLabel = !1;
          for (let n = 0; n < t.length; n++)
            if (isEventInsideElement(e, t[n])) {
              isInLabel = !0;
              break;
            }
          isInLabel
            ? stopRemoveSuggestionsTimeout()
            : setRemoveSuggestionsTimeout();
        }
      }
    });
}

function tagIframe(e) {
  if (e.getAttribute('data-qtag')) return e.getAttribute('data-qtag');
  const t = Math.random().toString(36).substring(5);
  return e.setAttribute('data-qtag', t), t;
}

function isEventInsideElement(e, t) {
  if (null == t) return !1;
  let n = t.getBoundingClientRect();
  return (
    e.clientX >= n.left &&
    e.clientX <= n.right &&
    e.clientY >= n.top &&
    e.clientY <= n.bottom
  );
}

function setRemoveSuggestionsTimeout() {
  null === removeSuggestionsTimeout &&
    (removeSuggestionsTimeout = setTimeout(function () {
      removeQalamSuggestions(), (removeSuggestionsTimeout = null);
    }, REMOVE_SUGGESTION_DELAY));
}
function stopRemoveSuggestionsTimeout() {
  null !== removeSuggestionsTimeout &&
    (clearTimeout(removeSuggestionsTimeout), (removeSuggestionsTimeout = null));
}

function getText() {
  offset_indices = new Set();
  if (!element) {
    return '';
  }
  //IFRAME
  if (element.tagName == 'IFRAME') {
    let body = element.contentDocument.querySelector('[contenteditable]');
    let text = '';
    let stack = [{ element: body, parent: null }];
    editorId = element.getAttribute('data-qid');
    while (stack.length) {
      let currentNode = stack.pop();
      let parentNode = currentNode.parent;
      currentNode = currentNode.element;
      if (!currentNode) {
        continue;
      }
      if (currentNode.tagName == 'BR') {
        // Add a dummy newline
        if (text.length > 0 && !offset_indices.has(text.length - 1)) {
          offset_indices.add(text.length);
          text += '\n';
        }
      } else if (currentNode.nodeType == 3) {
        // TEXT NODE, GET TEXT CONTENT

        let currentText = currentNode.textContent;
        // REPLACE NEWLINES WITH SPACES IF PARENT `WHITE-SPACE` STYLE DOESN'T RENDER NEWLINES
        if (
          !STYLES_WRAP.has(window.getComputedStyle(parentNode, null).whiteSpace)
        )
          currentText = currentText.replace(/\n/g, ' ');

        text += currentText;
      } else {
        let displayStyle =
          typeof currentNode == Element
            ? window.getComputedStyle(currentNode, null).display
            : '';

        // HIDDEN ELEMENT, SKIP
        if (STYLES_HIDDEN.has(displayStyle)) continue;

        // Block element, to add a dummy newline after all child nodes
        if (STYLES_BLOCKING.has(displayStyle))
          stack.push({
            element: document.createElement('br'),
            parent: currentNode,
          });

        // Push child nodes to stack
        let list = [];
        Array.from(currentNode.childNodes)
          .reverse()
          .forEach((childNode) => {
            list.push({ element: childNode, parent: currentNode });
          });
        stack.push(...list);

        // Block element, to add a dummy newline before all child nodes
        if (STYLES_BLOCKING.has(displayStyle))
          stack.push({
            element: document.createElement('br'),
            parent: currentNode,
          });
      }
    }
    return text;
  }

  //TEXTAREA
  if (isTextArea) {
    editorId = element.getAttribute('data-qid');
    return $(element).val() || $(element).text();
  }

  // TRAVERSE THROUGH TREE OF DIV (DFS)
  let text = '';
  let stack = [{ element: element, parent: null }];

  while (stack.length) {
    let currentNode = stack.pop();
    let parentNode = currentNode.parent;
    currentNode = currentNode.element;

    if (currentNode.tagName == 'BR') {
      // Add a dummy newline
      if (text.length > 0 && !offset_indices.has(text.length - 1)) {
        offset_indices.add(text.length);
        text += '\n';
      }
    } else if (currentNode.nodeType == 3) {
      // Text node, get text content

      let currentText = currentNode.textContent;
      // Replace newlines with spaces if parent `white-space` style doesn't render newlines
      let displayStyle =
        typeof currentNode == Element
          ? window.getComputedStyle(currentNode, null).whiteSpace
          : '';
      if (!STYLES_WRAP.has(displayStyle))
        currentText = currentText.replace(/\n/g, ' ');

      text += currentText;
    } else {
      let displayStyle =
        typeof currentNode == Element
          ? window.getComputedStyle(currentNode, null).display
          : '';
      // Hidden element, skip
      if (STYLES_HIDDEN.has(displayStyle)) continue;

      // Block element, to add a dummy newline after all child nodes
      if (STYLES_BLOCKING.has(displayStyle))
        stack.push({
          element: document.createElement('br'),
          parent: currentNode,
        });

      // Push child nodes to stack
      let list = [];
      Array.from(currentNode.childNodes)
        .reverse()
        .forEach((childNode) => {
          list.push({ element: childNode, parent: currentNode });
        });
      stack.push(...list);

      // Block element, to add a dummy newline before all child nodes
      if (STYLES_BLOCKING.has(displayStyle))
        stack.push({
          element: document.createElement('br'),
          parent: currentNode,
        });
    }
  }
  editorId = element.getAttribute('data-qid');
  return text;
}

function listenerTriggered(e) {
  if ((assignEditorIds(), element != e || 'IFRAME' == e.tagName)) {
    if (
      (unmountQalamComponent(),
      (isTextArea =
        'TEXTAREA' == (element = e).tagName || 'IFRAME' == element.tagName))
    ) {
      let e = getText();
      $(element).val('');
      let t = parseFloat($(element).css('border-left-width').replace('px', '')),
        n = parseFloat($(element).css('border-right-width').replace('px', ''));
      (withoutScrollDiff = element.offsetWidth - element.clientWidth - t - n),
        $(element).val(e);
    }
    if (
      ($(element).attr('spellcheck', !1),
      (elementParent = element.parentNode),
      '0px' == $(elementParent).css('width') &&
        '0px' == $(elementParent).css('height') &&
        $(elementParent).css('position', 'unset'),
      renderQalamMirror(),
      renderQalamComponent(),
      'IFRAME' != element.tagName)
    )
      $(element).on('scroll', function () {
        handleReposition(!1);
      }),
        $(window).on('scroll', function () {
          handleReposition(!1);
        }),
        $(window).on('resize', function () {
          handleReposition(!0);
        });
    else {
      let e,
        t = $(element).contents();
      $(t).on('scroll', function () {
        !(function () {
          let e = $('qalam-extension .qalam-highlights-cont qalam-label');
          for (let t = 0; t < e.length; t++) {
            const n = e[t];
            n.style.display = 'none';
          }
        })(),
          clearTimeout(e),
          (e = setTimeout(function () {
            handleReposition(!0);
          }, 200));
      });
    }
    new ResizeObserver(function () {
      handleReposition(!0);
    }).observe(element),
      '' != getText().trim() && (languageChecker(), spellCheckText());
  }
}

function handleReposition(e) {
  removeQalamSuggestions(),
    removeDisablePrompt(),
    repositionQalamButton(),
    $(qalamExtensionCont).scrollTop($(element).scrollTop()),
    $(qalamExtensionCont).scrollLeft($(element).scrollLeft()),
    e && SCServiceActive && drawLabels(!0);
}

function repositionQalamButton() {
  let e = $('qalam-button-cont');
  if (
    (e.css('position', 'absolute'),
    (qalamExtensionCont ? qalamExtensionCont.getBoundingClientRect() : '')
      .height > 30)
  ) {
    let t = 0;
    if ('rtl' == $(element).css('direction')) {
      let e = parseFloat($(element).css('border-left-width').replace('px', '')),
        n = parseFloat($(element).css('border-right-width').replace('px', ''));
      t = element.offsetWidth - element.clientWidth - e - n;
    }
    e.css('left', 6 + t), e.css('bottom', 6), e.css('padding', 4);
  } else e.css('left', 6), e.css('bottom', 6), e.css('padding', 0);
}

function renderQalamComponent() {
  if ((drawLabels(!0), !$(elementParent).find('qalam-container').length)) {
    let e = document.createElement('qalam-container');
    $(elementParent).append(e);
    let t = document.createElement('qalam-wrapper');
    (qalamExtension = document.createElement('qalam-extension')),
      (qalamExtensionCont = document.createElement('qalam-extension-cont')),
      ((qalamHighlightsCont = document.createElement('div')).className =
        'qalam-highlights-cont');
    let n = document.createElement('qalam-button-cont'),
      a = document.createElement('div');
    a.className = 'qalam-button';
    let o = document.createElement('p');
    (o.className = 'errors'),
      $(a).css('backgroundImage', `url(${settings.assetsPath}/images/128.png)`),
      isUrlDisabled()
        ? $(a).css('background-image', 'url(../images/disabled.png)')
        : $(a).css(
            'backgroundImage',
            `url(${settings.assetsPath}/images/128.png)`
          );
    let l = document.createElement('div');
    l.className = 'separator';
    let i = document.createElement('img');
    (i.className = 'disable-icon'),
      (i.src = `${settings.assetsPath}/images/disable.svg`),
      (i.title = 'تعطيل عمل قلم'),
      $(i).on('click', function (e) {
        showDisablePrompt();
      }),
      resizeQalamExtension();
    let s = document.createElement('qalam-tashkeel-blk');
    (s.className = 'qalam-tashkeel'), (s.style.display = 'none');
    let r = document.createElement('qalam-quraan-blk');
    (r.className = 'qalam-quraan'), (r.style.display = 'none');
    let c = document.createElement('img');
    (c.className = 'qalam-quraan-icon'),
      (c.src = `${settings.assetsPath}/images/quran_3.svg`);
    let m = document.createElement('img');
    if (
      ((m.className = 'qalam-tashkeel-icon'),
      (m.src = `${settings.assetsPath}/images/tashkeel.svg`),
      (qalamExtensionCont.style.width = '100%'),
      (qalamExtensionCont.style.height = '100%'),
      a.appendChild(o),
      n.appendChild(a),
      n.appendChild(l),
      n.appendChild(i),
      qalamExtensionCont.appendChild(qalamHighlightsCont),
      qalamExtension.appendChild(qalamExtensionCont),
      isTashkeelActive &&
        (s.appendChild(m),
        s.appendChild(document.createElement('div')),
        qalamExtension.appendChild(s)),
      isTawtheeqActive &&
        (r.appendChild(c),
        r.appendChild(document.createElement('div')),
        qalamExtension.appendChild(r)),
      'IFRAME' == element.tagName)
    ) {
      let e =
          element.contentDocument && element.contentDocument.body
            ? element.contentDocument.body.parentElement.querySelector(
                '[contenteditable]'
              ) || element.contentDocument.body.parentElement
            : null,
        t = element.contentWindow || element.contentDocument;
      $(e).mouseup(function () {
        (selectedText = getSelectedText(t)),
          showTashkeelAndTawtheeq(selectedText, s, r);
      });
    } else
      $(element).mouseup(function () {
        (selectedText = getSelectedText(window)),
          showTashkeelAndTawtheeq(selectedText, s, r);
      });
    $(s).on('mousedown', function (e) {
      $(this).prop('disabled') || controlSelection(e);
    }),
      $(r).on('mousedown', function (e) {
        $(this).prop('disabled') || controlSelection(e);
      });
    if (element) {
      setupEventHandlers(element, resetQalam);
    } else {
      console.log('Element not found');
    }
    t.append(qalamExtension), qalamExtension.appendChild(n), e.append(t);
  }
}

function resetQalam(event) {
  if (!triggerFlag) return;
  // typing trigger & refelct to mirror
  clearButton();
  clearLabels();
  resizeQalamExtension();
  handleReposition();
  typedIn();
}

function addEventListeners(element, callback) {
  // Input and textarea elements
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.addEventListener('input', () => callback());
  }
  // Contenteditable elements
  else if (element.isContentEditable) {
    element.addEventListener('input', () => callback());
  }
}

function setupEventHandlers(element, callback) {
  addEventListeners(element, callback);
  if (element.isContentEditable) {
    initMutationObserver(element, callback);
  }
}

function initMutationObserver(element, callback) {
  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  };

  // Callback function to execute when mutations are observed
  var observer = new MutationObserver(function (mutationsList) {
    mutationsList.forEach(function (mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        callback();
      } else if (mutation.type === 'attributes') {
        callback();
      }
    });
  });

  // Start observing the target node for configured mutations
  observer.observe(element, config);

  // Return observer so it can be disconnected later if needed
  return observer;
}

function getConfig() {
  $.ajax({
    url: baseLink + 'test/config',
    method: 'GET',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    success: function (e) {
      let t = e.categories.filter((e) => 'tashkeel' == e.id),
        n = e.categories.filter((e) => 'tawtheeq' == e.id);
      'true' == t[0].value || $('.qalam-tashkeel').remove(),
        (isTashkeelActive = 'true' == t[0].value),
        (isTawtheeqActive = 'true' == n[0].value);
    },
    error: function () {},
  });
}

function getTermsConfig() {
  $.ajax({
    dataType: 'json',
    url: baseLink + 'dictionaries/words?fields=config',
    type: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    success: function (e) {
      isWriterAllowedToAddToDic =
        'true' == e.dictionaryConfig.writerAllowedToAddDictionary;
    },
    error: function () {},
  });
}

function controlSelection(e) {
  e.preventDefault(), e.stopPropagation();
  let t = e.currentTarget,
    n = '';
  if (
    ((n =
      'qalam-tashkeel' == e.currentTarget.classList.value
        ? 'SC_service_tashkeel'
        : 'SC_service_tawtheeq'),
    'IFRAME' == element.tagName)
  ) {
    let e = element.contentWindow || element.contentDocument;
    selectedText = getSelectedText(e);
  } else selectedText = getSelectedText(window);
  if (!selectedText || isEmpty(selectedText))
    return void hideTashkeelAndTawtheeq();
  $('qalam-tashkeel-blk').prop('disabled', !0),
    $('qalam-quraan-blk').prop('disabled', !0),
    $(t).find('div').addClass('qalam-icons-loader');
  let a = getUuid(),
    o = { text: selectedText, docId: a };
  'SC_service_tashkeel' == n &&
    $.ajax({
      dataType: 'json',
      url: baseLink + 'qalam/tashkeel',
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${clientId}`,
        'Qalam-Agent': qalamAgent,
      },
      data: JSON.stringify(o),
      success: function (e) {
        var n = e && e.text ? e.text : '';
        'IFRAME' == element.tagName
          ? (element.contentDocument.execCommand('insertText', !1, n),
            spellCheckText(!0))
          : isTextArea
          ? document.execCommand('insertText', !1, n)
          : document.execCommand('insertHTML', !1, n),
          $('qalam-tashkeel-blk,qalam-quraan-blk').removeClass('disabled'),
          $('qalam-tashkeel-blk').prop('disabled', !1),
          $('qalam-quraan-blk').prop('disabled', !1),
          $(t).find('div').removeClass('qalam-icons-loader'),
          (selectedText = null);
      },
      error: function () {},
    }),
    'SC_service_tawtheeq' == n &&
      $.ajax({
        dataType: 'json',
        url: baseLink + 'quran/tawtheeq',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${clientId}`,
          'Qalam-Agent': qalamAgent,
        },
        data: JSON.stringify(o),
        success: function (e) {
          isEmpty(e) || (enter = '\n');
          var n =
            e && e.suggestions
              ? e.suggestions[0].matchedTextAyaModern + enter
              : '';
          n &&
            '\n' != n &&
            ('IFRAME' == element.tagName
              ? (element.contentDocument.execCommand('insertText', !1, n),
                spellCheckText(!0))
              : isTextArea
              ? document.execCommand('insertText', !1, n)
              : document.execCommand('insertHTML', !1, n)),
            $('qalam-tashkeel-blk,qalam-quraan-blk').removeClass('disabled'),
            $('qalam-tashkeel-blk').prop('disabled', !1),
            $('qalam-quraan-blk').prop('disabled', !1),
            $(t).find('div').removeClass('qalam-icons-loader'),
            (selectedText = null);
        },
        error: function () {},
      });
}
function getSelectedText(e) {
  if (e.getSelection && e.getSelection().toString())
    return e.getSelection().toString();
  if (document.selection) return document.selection.createRange().text;
  {
    let e = $(element).get(0);
    return e && e.value && e.selectionStart
      ? e.value.substring(e.selectionStart, e.selectionEnd)
      : '';
  }
}
function showTashkeelAndTawtheeq(e, t, n) {
  e
    ? ((t.style.display = 'flex'), (n.style.display = 'flex'))
    : ((t.style.display = 'none'), (n.style.display = 'none'));
}

function hideTashkeelAndTawtheeq() {
  $('qalam-quraan-blk').css('display', 'none'),
    $('qalam-tashkeel-blk').css('display', 'none');
}

function renderQalamMirror() {
  if (!$('html').find('qalam-mirror-shadow').length) {
    let e = document.createElement('qalam-mirror-shadow');
    $('html').append(e), (shadowRoot = e.attachShadow({ mode: 'open' }));
    let t = document.createElement('style');
    (t.textContent = MIRROR_SHADOW_STYLE),
      shadowRoot.appendChild(t),
      isTextArea &&
        ((qalamMirror = document.createElement('qalam-mirror')),
        $(qalamMirror).css('padding', $(element).css('padding')),
        languageChecker(),
        setFontSpecsForQalamMirror(),
        resetQalamMirror(),
        shadowRoot.append(qalamMirror));
  }
}

function setFontSpecsForQalamMirror() {
  let e =
    $(element).css('font-weight') +
    ' ' +
    $(element).css('font-size') +
    ' / ' +
    $(element).css('line-height') +
    ' ' +
    $(element).css('font-family');
  $(qalamMirror).css('font', e),
    $(qalamMirror).css('letter-spacing', $(element).css('letter-spacing'));
}

function reflectToQalamMirror() {
  isTextArea && element && (resetQalamMirror(), $(qalamMirror).html(getText()));
}

function resetQalamMirror() {
  setFontSpecsForQalamMirror();
  let e = parseFloat($(element).css('padding-left').replace('px', '')),
    t = parseFloat($(element).css('padding-right').replace('px', '')),
    n = parseFloat($(element).css('border-left-width').replace('px', '')),
    a = parseFloat($(element).css('border-right-width').replace('px', '')),
    o = element.offsetWidth - element.clientWidth - n - a;
  (o -= withoutScrollDiff), $(qalamMirror).css('left', o);
  let l = e + t + o + n + a;
  $(qalamMirror).css('width', element.getBoundingClientRect().width - l),
    $(qalamMirror).css('height', 'auto');
}

function resizeQalamExtension() {
  let e = parseFloat($(element).css('border-top-width').replace('px', '')),
    t = parseFloat($(element).css('border-bottom-width').replace('px', '')),
    n = parseFloat($(element).css('border-left-width').replace('px', '')),
    a = parseFloat($(element).css('border-right-width').replace('px', '')),
    o = element.getBoundingClientRect();
  $(qalamExtension).css('height', o.height - e - t),
    $(qalamExtension).css('top', $(element).position().top + e),
    $(qalamExtension).css('margin', $(element).css('margin')),
    $(qalamExtension).css('width', o.width - n - a),
    $(qalamExtension).css('left', $(element).position().left + n),
    $(qalamExtension).css('position', 'absolute'),
    $('.qalam-highlights-cont').css('height', element.scrollHeight);
}

function getUrlWithoutParams() {
  return [location.protocol, '//', location.host, location.pathname].join('');
}

function disableUrl() {
  if (isUrlDisabled()) return;
  let e = JSON.parse(localStorage.getItem('urlsDisabled')) || [];
  e.push(getUrlWithoutParams()),
    localStorage.setItem('urlsDisabled', JSON.stringify(e));
}

function enableUrl() {
  let e = JSON.parse(localStorage.getItem('urlsDisabled')) || [];
  (urlDisabledIndex = e.findIndex((e) => e === getUrlWithoutParams())),
    urlDisabledIndex > -1 &&
      (e.splice(urlDisabledIndex, 1),
      localStorage.setItem('urlsDisabled', JSON.stringify(e)));
}

function isUrlDisabled() {
  let e = JSON.parse(localStorage.getItem('urlsDisabled')) || [];
  return (
    (urlsDisabledIndex = e.find((e) => e === getUrlWithoutParams())),
    !!urlsDisabledIndex
  );
}

function showDisablePrompt() {
  if (!$(shadowRoot).find('qalam-disable-prompt').length) {
    qalamDisablePrompt = document.createElement('qalam-disable-prompt');
    let e = document.createElement('p');
    (e.innerHTML = 'تعطيل عمل “قلم”؟'), (e.className = 'prompt-title');
    let t = document.createElement('button');
    (t.innerHTML = 'تعطيل عمل قلم'),
      (t.className = 'qalam-btn secondary-btn'),
      $(t).attr('type', 'button'),
      $(t).on('click', function (e) {
        disableUrl(),
          drawLabels(!1),
          $('.qalam-highlights-cont qalam-label').remove(),
          $(element).next().addClass('d-none'),
          $('qalam-button-cont .qalam-button .errors').css('display', 'none'),
          $('qalam-button-cont .qalam-button').css(
            'background-image',
            `url(${settings.assetsPath}/images/disabled.png)`
          );
      });
    let n = document.createElement('button');
    (n.innerHTML = 'إبقاء قلم فعّالاً'),
      (n.className = 'qalam-btn primary-btn'),
      $(n).attr('type', 'button'),
      $(n).on('click', function () {
        enableUrl(),
          removeDisablePrompt(),
          spellCheckText(!0),
          $(element).next().removeClass('d-none'),
          $('qalam-button-cont .qalam-button').css('background-image', 'none');
      }),
      qalamDisablePrompt.appendChild(e),
      qalamDisablePrompt.appendChild(t),
      qalamDisablePrompt.appendChild(n),
      $(shadowRoot).append(qalamDisablePrompt);
    let a = $('qalam-button-cont')[0].getBoundingClientRect(),
      o = qalamDisablePrompt.getBoundingClientRect(),
      l = [
        { top: a.top + a.height - o.height, left: a.left + a.width },
        {
          top: a.top,
          left: a.left + a.width,
        },
        { top: a.top + a.height - o.height, left: a.left - o.width },
        { top: a.top, left: a.left - o.width },
      ];
    for (
      let e = 0;
      e < l.length &&
      ($(qalamDisablePrompt).css('top', l[e].top),
      $(qalamDisablePrompt).css('left', l[e].left),
      !isElementInViewport(qalamDisablePrompt));
      e++
    );
    $('qalam-button-cont').addClass('active');
  }
}

function removeDisablePrompt() {
  $('qalam-button-cont').removeClass('active'), $(qalamDisablePrompt).remove();
}

function mobileCheck() {
  let e = !1;
  var t;
  return (
    (t = navigator.userAgent || navigator.vendor || window.opera),
    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      t
    ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        t.substr(0, 4)
      )) &&
      (e = !0),
    e
  );
}

function removeQalamSuggestions() {
  mobileCheck() ||
    ($(qalamSuggestions).remove(),
    $('qalam-extension .qalam-highlights-cont qalam-label').removeClass(
      'active'
    ));
}

function removeNotification() {
  $('qalam-notification').css('right', '-450px'),
    setTimeout(function () {
      $('qalam-notification').remove();
    }, 750);
}

function typedIn() {
  (typingStallCounter = 0),
    languageChecker(),
    secondsCounter ||
      (secondsCounter = setInterval(function () {
        typingStallCounter >= TYPING_STALL &&
          ('' != getText().trim()
            ? spellCheckText()
            : (clearButton(), clearLabels()),
          clearInterval(secondsCounter),
          (typingStallCounter = 0),
          (secondsCounter = null)),
          typingStallCounter++;
      }, 500));
}

function clearButton() {
  $('qalam-button-cont .qalam-button .errors').css('display', 'none'),
    isUrlDisabled()
      ? $('qalam-button-cont .qalam-button').css(
          'background-image',
          `url(${settings.assetsPath}/images/disabled.png)`
        )
      : $('qalam-button-cont .qalam-button').css(
          'background-image',
          `url(${settings.assetsPath}/images/128.png)`
        ),
    $('qalam-button-cont .qalam-button').css(
      'background-color',
      BUTTON_NORMAL_COLOR
    ),
    clearLabels();
}

function languageChecker() {
  isTextArea &&
    (/[\u0600-\u06FF]/.test(getText())
      ? $(element).css('direction', 'rtl')
      : $(element).css('direction', 'ltr'));
  let e = $(element).css('direction'),
    t = 'rtl' == e ? 'right' : 'left';
  $(qalamMirror).css('direction', e),
    $(qalamMirror).css('text-align', t),
    $(element).css('text-align', t);
}

function spellCheckText(e) {
  let t = ANIMATION_DELAY;
  e
    ? (t = 0)
    : (isUrlDisabled()
        ? $('.qalam-button').css(
            'background-image',
            `url(${settings.assetsPath}/images/disabled.png)`
          )
        : $('qalam-button-cont .qalam-button').css(
            'background-image',
            `url(${settings.assetsPath}/images/logo.gif)`
          ),
      $('qalam-button-cont .qalam-button').css(
        'background-image',
        `url(${settings.assetsPath}/images/logo.gif)`
      ),
      $('qalam-button-cont .qalam-button .errors').css('display', 'none'));
  let n = getText();
  isUrlDisabled() || callService(n, t, e);
}

function fetchErrors(e, t) {
  (currentTextSuggestions = e), drawLabels(t);
}

function drawLabels(e) {
  reflectToQalamMirror(),
    resizeQalamExtension(),
    $('.qalam-highlights-cont qalam-label').remove();
  let t = currentTextSuggestions.length;
  t > 0
    ? ($.each(currentTextSuggestions, function () {
        let t = this.original;
        type = this.type;
        let n = this.from,
          a = this.to,
          o = this.lang,
          l = this.replacement,
          i = this.lineColor,
          r = this.labelColor,
          s = getRangeSpecs(n, a);
        s &&
          ($.each(s, function () {
            labelCreator(o, t, type, n, a, l, i, r, this, e);
          }),
          handleReposition());
      }),
      setErrorsTotal(t))
    : clearButton();
}

function detectBrowser() {
  return -1 !=
    (navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR'))
    ? 'Opera'
    : -1 != navigator.userAgent.indexOf('Chrome')
    ? 'Chrome'
    : -1 != navigator.userAgent.indexOf('Safari')
    ? 'Safari'
    : -1 != navigator.userAgent.indexOf('Firefox')
    ? 'Firefox'
    : -1 != navigator.userAgent.indexOf('MSIE') || 1 == !!document.documentMode
    ? 'IE'
    : 'Unknown';
}

function detectBrowser() {
  return -1 !=
    (navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR'))
    ? 'Opera'
    : -1 != navigator.userAgent.indexOf('Chrome')
    ? 'Chrome'
    : -1 != navigator.userAgent.indexOf('Safari')
    ? 'Safari'
    : -1 != navigator.userAgent.indexOf('Firefox')
    ? 'Firefox'
    : -1 != navigator.userAgent.indexOf('MSIE') || 1 == !!document.documentMode
    ? 'IE'
    : 'Unknown';
}
function labelCreator(e, t, n, a, o, l, i, r, s, u) {
  let c = document.createElement('qalam-label');
  (s.width = s.right - s.left),
    (s.height = s.bottom - s.top),
    $(c).css('width', s.width),
    $(c).css('height', 1.05 * s.height),
    'Firefox' == detectBrowser()
      ? ($(c).css('top', s.top + 6 - 0.025 * s.height),
        $(c).css('left', s.left + 12))
      : ($(c).css('top', s.top - 0.025 * s.height), $(c).css('left', s.left)),
    $(c).css('background-color', r),
    $(c).on('mouseenter', function (e) {
      renderQalamSuggestions(e, t, n), $(c).addClass('active');
    });
  let m = JSON.stringify(l);
  $(c).attr('data-suggestions', m),
    $(c).attr('data-start-index', a),
    $(c).attr('data-end-index', o),
    $(c).attr('data-lang', e);
  let d = document.createElement('label-border');
  $(d).css('left', s.left),
    $(d).css('width', s.width),
    $(d).css('background-color', i),
    c.appendChild(d),
    qalamHighlightsCont.appendChild(c),
    u
      ? $(d).css('left', '0')
      : setTimeout(function () {
          $(d).css('left', '0');
        }, 10);
}
function getRangeInfo(e, t) {
  let n = {};
  if ('IFRAME' == element.tagName) {
    let a = [element.contentDocument.activeElement],
      o = 0;
    for (; a.length; ) {
      let l = a.pop();
      if (3 == l.nodeType) {
        for (let a = 0; a < l.textContent.length; a++)
          e <= o + a &&
            o + a <= t &&
            (n[o + a] = {
              node: l,
              index: a,
            });
        if ((o += l.textContent.length) > t) break;
      } else {
        let displayStyle =
          typeof currentNode == Element
            ? window.getComputedStyle(l, null).display
            : '';
        if (STYLES_HIDDEN.has(displayStyle)) continue;
        a.push(...Array.from(l.childNodes).reverse());
      }
    }
    return n;
  }
  if (isTextArea) {
    let a = qalamMirror.childNodes[0];
    for (let o = e; o <= t; o++) n[o] = { node: a, index: o };
    return n;
  }
  let a = [element],
    o = 0;
  for (; a.length; ) {
    let l = a.pop();
    if (3 == l.nodeType) {
      for (let a = 0; a < l.textContent.length; a++)
        e <= o + a && o + a <= t && (n[o + a] = { node: l, index: a });
      if ((o += l.textContent.length) > t) break;
    } else {
      let displayStyle =
        typeof l == Element ? window.getComputedStyle(l, null).display : '';
      if (STYLES_HIDDEN.has(displayStyle)) continue;
      a.push(...Array.from(l.childNodes).reverse());
    }
  }
  return n;
}

function getRangeSpecs(e, t) {
  let n = getRangeInfo(e, t),
    a = document.createRange(),
    o = [],
    l = 0,
    i = 0,
    s = element.getBoundingClientRect();
  for (let r = e; r <= t; r++) {
    try {
      a.setStart(n[r].node, n[r].index), a.setEnd(n[r].node, n[r].index + 1);
    } catch (e) {}
    let e = a.getBoundingClientRect();
    if (0 == e.width || 0 == e.height) continue;
    let t = e.top - !isTextArea * (s.top - $(element).scrollTop()),
      c = e.bottom - !isTextArea * (s.top - $(element).scrollTop()),
      m = e.left - !isTextArea * s.left,
      d = e.right - !isTextArea * s.left,
      u = Math.min(c - t, i - l),
      g = Math.min(i, c) - Math.max(l, t);
    0 == o.length || g / u < INTERSECTION_THRESHOLD
      ? o.push({
          right: d,
          left: m,
          bottom: c,
          top: t,
        })
      : ((o[o.length - 1].left = Math.min(o[o.length - 1].left, m)),
        (o[o.length - 1].right = Math.max(o[o.length - 1].right, d)),
        (o[o.length - 1].top = Math.min(o[o.length - 1].top, t)),
        (o[o.length - 1].bottom = Math.max(o[o.length - 1].bottom, c))),
      (l = t),
      (i = c);
  }
  return o;
}

function clearLabels() {
  (currentTextSuggestions = []),
    $('.qalam-highlights-cont qalam-label').remove();
}

function setErrorsTotal(e) {
  $('qalam-button-cont .qalam-button').css(
    'background-color',
    BUTTON_ERROR_COLOR
  ),
    $('qalam-button-cont .qalam-button').css('background-image', 'unset'),
    $('qalam-button-cont .qalam-button .errors').css('display', 'block'),
    $('qalam-button-cont .qalam-button .errors').text(e),
    e > 99
      ? $('qalam-button-cont .qalam-button .errors').css('font-size', '12px')
      : $('qalam-button-cont .qalam-button .errors').css('font-size', '15px');
}

function decreaseTotalErrorsCount() {
  let e = parseInt($('qalam-button-cont .qalam-button .errors').text());
  e > 1
    ? $('qalam-button-cont .qalam-button .errors').text(e - 1)
    : clearButton();
}

function renderQalamSuggestions(e, t, n) {
  removeQalamSuggestions();
  let a = $(e.target).closest('qalam-label'),
    o = JSON.parse($(a).attr('data-suggestions')),
    l = $(a).attr('data-start-index'),
    i = $(a).attr('data-end-index'),
    r = $(a).attr('data-lang');
  if (!$(shadowRoot).find('qalam-suggestions').length) {
    qalamSuggestions = document.createElement('qalam-suggestions');
    let e = document.createElement('suggestions-cont');
    $.each(o, function () {
      let t = this,
        n = document.createElement('suggestion-item');
      $(n).on('click', function () {
        let e = $(element).scrollTop(),
          n = $(window).scrollTop();
        $(`qalam-label[data-start-index="${l}"]`).remove(),
          removeQalamSuggestions(),
          decreaseTotalErrorsCount(),
          replaceOriginalText(t, l, i),
          spellCheckText(!0),
          $(element).scrollTop(e),
          $(window).scrollTop(n),
          mobileCheck() &&
            ($(qalamSuggestions).remove(),
            $('qalam-extension .qalam-highlights-cont qalam-label').removeClass(
              'active'
            ));
      });
      let a = document.createElement('suggestion-text');
      'en' === r && ((a.style.direction = 'ltr'), (a.style.textAlign = 'left')),
        '' === t.trim()
          ? (a.innerHTML = '<i style="font-size:12px;"><مسافة زائدة><i>')
          : (a.innerHTML = t),
        n.appendChild(a),
        e.appendChild(n);
    });
    let s = document.createElement('div');
    (s.className = 'ignore-cont'),
      $(s).on('click', function () {
        wordGetter(l, i);
        onDismissCallback([t], getContext(t, l, i)),
          $(`qalam-label[data-start-index='${l}']`).remove(),
          removeQalamSuggestions(),
          spellCheckText(!0);
      });
    let u = document.createElement('img');
    (u.className = 'ignore-icon'),
      (u.src = `${settings.assetsPath}/images/ignore.svg`);
    let c,
      m = document.createElement('p');
    if (
      ((m.className = 'ignore-text'),
      (m.innerHTML = 'تجاهل هذا التصحيح'),
      s.appendChild(u),
      s.appendChild(m),
      isWriterAllowedToAddToDic && 'terms' != n)
    ) {
      (c = document.createElement('div')),
        (c.className = 'add-to-dic-cont'),
        $(c).on('click', function () {
          onAddToDictionaryCallback([t], getContext(t, l, i)),
            $(`qalam-label[data-start-index="${l}"]`).remove(),
            removeQalamSuggestions(),
            spellCheckText(!0);
        });
      let e = document.createElement('img');
      (e.className = 'add-to-dic-icon'),
        (e.src = `${settings.assetsPath}/images/add.svg`);
      let n = document.createElement('p');
      (n.className = 'add-to-dic-text'),
        (n.innerHTML = 'إضافة إلى القاموس'),
        c.appendChild(e),
        c.appendChild(n);
    }
    let d = document.createElement('img');
    if (
      ((d.className = 'wrong-suggestion-more-icon'),
      (d.src = `${settings.assetsPath}/images/more.png`),
      (d.width = '15'),
      (d.height = '15'),
      $(d).on('click', function (e) {
        e.preventDefault(),
          e.stopPropagation(),
          (wrongSuggestionItem = document.createElement('div')),
          (wrongSuggestionItem.className = 'wrong-suggestion-cont');
        let n = document.createElement('img');
        (n.className = 'wrong-suggestion-icon'),
          (n.src = `${settings.assetsPath}/images/wrong-suggestion.svg`);
        let a = document.createElement('p');
        (a.className = 'wrong-suggestion-text'),
          (a.innerHTML = 'هذا اقتراح خاطئ'),
          wrongSuggestionItem.appendChild(n),
          wrongSuggestionItem.appendChild(a),
          $(wrongSuggestionItem).on('click', function () {
            onWrongSuggestionCallback(t, getContext(t, l, i)),
              $(`qalam-label[data-start-index="${l}"]`).remove(),
              removeQalamSuggestions();
          }),
          s.appendChild(wrongSuggestionItem);
      }),
      qalamSuggestions.appendChild(e),
      qalamSuggestions.appendChild(s),
      'terms' != n && s.appendChild(d),
      isWriterAllowedToAddToDic &&
        'terms' != n &&
        qalamSuggestions.appendChild(c),
      $(shadowRoot).append(qalamSuggestions),
      o.length > 0)
    ) {
      (labelBoundingBox = a[0].getBoundingClientRect()),
        $(qalamSuggestions).css('display', 'block'),
        (suggestionBoundingBox = qalamSuggestions.getBoundingClientRect());
      let e = [
        {
          top: labelBoundingBox.top + labelBoundingBox.height,
          left:
            labelBoundingBox.left +
            labelBoundingBox.width -
            suggestionBoundingBox.width,
        },
        {
          top: labelBoundingBox.top + labelBoundingBox.height,
          left: labelBoundingBox.left,
        },
        {
          top: labelBoundingBox.top - suggestionBoundingBox.height,
          left:
            labelBoundingBox.left +
            labelBoundingBox.width -
            suggestionBoundingBox.width,
        },
        {
          top: labelBoundingBox.top - suggestionBoundingBox.height,
          left: labelBoundingBox.left,
        },
      ];
      for (
        let t = 0;
        t < e.length &&
        ($(qalamSuggestions).css('top', e[t].top),
        $(qalamSuggestions).css('left', e[t].left),
        !isElementInViewport(qalamSuggestions));
        t++
      );
    }
  }
  resizeQalamExtension();
}
function onAddToDictionaryCallback(e, t) {
  $.ajax({
    dataType: 'json',
    url: baseLink + 'dictionaries/words',
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    data: JSON.stringify({ words: e, context: t }),
    success: function (e) {},
    error: function () {},
  });
}
function onWrongSuggestionCallback(e, t) {
  $.ajax({
    dataType: 'json',
    url: `${baseLink}documents/${uuidV3Hash}/wrong/suggestions`,
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    data: JSON.stringify({ words: e, context: t }),
    success: function (e) {},
    error: function () {},
  });
}
function onDismissCallback(e, t) {
  $.ajax({
    dataType: 'json',
    url: baseLink + 'documents/' + uuidV3Hash + '/dismissals',
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    data: JSON.stringify({ words: e, context: t }),
    success: function (e) {},
    error: function () {},
  });
}

function isElementInViewport(e) {
  let t = e.getBoundingClientRect();
  return (
    t.top >= 0 &&
    t.left >= 0 &&
    t.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    t.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function wordGetter(e, t) {
  return $(element)
    .val()
    .substr(e, parseInt(t) - e + 1);
}

function replaceOriginalText(e, t, n) {
  let a = getText().length;
  if (isTextArea)
    if ('IFRAME' == element.tagName) {
      element.contentWindow.focus();
      let e = getRangeInfo(t, n);
      (range = element.contentDocument.createRange()),
        range.setStart(e[t].node, e[t].index),
        range.setEnd(e[n].node, e[n].index + 1),
        (sel = element.contentDocument.getSelection()),
        sel.removeAllRanges(),
        sel.addRange(range);
    } else
      $(element).trigger('focus'),
        ($(element)[0].selectionStart = t),
        ($(element)[0].selectionEnd = parseInt(n) + 1);
  else {
    $(element).trigger('focus');
    let e = getRangeInfo(t, n);
    (range = document.createRange()),
      range.setStart(e[t].node, e[t].index),
      range.setEnd(e[n].node, e[n].index + 1),
      (sel = window.getSelection()),
      sel.removeAllRanges(),
      sel.addRange(range);
  }
  (triggerFlag = !1),
    'IFRAME' == element.tagName
      ? element.contentDocument.execCommand('insertText', !1, e)
      : document.execCommand('insertText', !1, e),
    setTimeout(function () {
      triggerFlag = !0;
    }, 5);
  let o = a - getText().length,
    l = -1;
  $.each(currentTextSuggestions, function (e, n) {
    n.from == t
      ? (l = e)
      : n.from > t &&
        ((currentTextSuggestions[e].from -= o),
        (currentTextSuggestions[e].to -= o));
  }),
    -1 != l && currentTextSuggestions.splice(l, 1),
    drawLabels(!0);
}

function unmountQalamComponent() {
  $('qalam-container').remove(),
    $('qalam-mirror-shadow').remove(),
    null != qalamMirror && $(qalamMirror).remove(),
    removeQalamSuggestions(),
    (ignoredSet = new Set()),
    (currentTextSuggestions = []);
}

function resetGlobalVariables() {
  (shadowRoot = null),
    (qalamDisablePrompt = null),
    (isTextArea = null),
    (triggerFlag = !0),
    (SCServiceActive = null),
    (qalamExtension = null),
    (qalamExtensionCont = null),
    (qalamHighlightsCont = null),
    (qalamMirror = null),
    removeDisablePrompt(),
    removeQalamSuggestions(),
    (qalamSuggestions = null),
    $(element).off(),
    (element = null),
    (withoutScrollDiff = 0),
    (elementParent = null),
    (typingStallCounter = 0),
    (secondsCounter = null),
    (resizeHoldCounter = null),
    (currentTextSuggestions = []),
    clearInterval(secondsCounter),
    clearInterval(resizeHoldCounter);
}

function turnOnSC() {
  (SCServiceActive = !0), init();
}

function turnOffSC() {
  (SCServiceActive = !1), unmountQalamComponent(), resetGlobalVariables();
}

function setCookie() {
  let e = generateId(8);
  document.cookie = 'qalam_user_id=' + e + '; path=/';
}

function getCookie(e) {
  for (
    var t = e + '=', n = document.cookie.split(';'), a = 0;
    a < n.length;
    a++
  ) {
    for (var o = n[a]; ' ' == o.charAt(0); ) o = o.substring(1, o.length);
    if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
  }
  return null;
}

function generateId(e) {
  for (
    var t = '',
      n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      a = n.length,
      o = 0;
    o < e;
    o++
  )
    t += n.charAt(Math.floor(Math.random() * a));
  return t;
}

function getUuid() {
  let elementQalamId = $(element).attr('qalam-id');
  if (elementQalamId) {
    uuidV3Hash = uuidv5(elementQalamId, clientId);
  } else if (documentId)
    uuidV3Hash = uuid.v5(documentId + ':' + editorId, clientId);
  else if (mode == PATH_MODE) {
    var a = extractPathParamAt(modeValue);
    a || (documentId = a = uuid.v4()),
      (uuidV3Hash = uuid.v5(a + ':' + editorId, clientId));
  } else if (mode == QUERY_MODE) {
    var o = extractQueryParam(modeValue);
    o || (documentId = o = uuid.v4()),
      (uuidV3Hash = uuid.v5(o + ':' + editorId, clientId));
  } else
    (documentId = uuid.v4()),
      (uuidV3Hash = uuid.v5(documentId + ':' + editorId, clientId));

  return uuidV3Hash;
}

function callService(e, t, n) {
  uuidV3Hash = getUuid();
  var l = {
    url: API_LINK,
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${clientId}`,
      'Qalam-Agent': qalamAgent,
    },
    success: function () {},
    error: function (e, t, n) {
      e.status;
    },
    data: JSON.stringify({ text: e, docId: uuidV3Hash }),
  };
  setTimeout(function () {
    $.ajax(l).done(function (t) {
      let a = [];
      extend(
        a,
        extractRest(
          t.termSuggestions,
          TERM_LINE_COLOR,
          TERM_LABEL_COLOR,
          'terms'
        )
      ),
        extend(
          a,
          extractResponse(
            t.spellCheckResponse,
            SC_LINE_COLOR,
            SC_LABEL_COLOR,
            'spellChecker'
          )
        );
      extend(
        a,
        extractResponse(
          t.grammarResponse,
          GRAMMAR_LINE_COLOR,
          GRAMMAR_LABEL_COLOR,
          'grammar'
        )
      ),
        extend(
          a,
          extractResponse(
            t.phrasingResponse,
            PHRASING_LINE_COLOR,
            PHRASING_LABEL_COLOR,
            'phrasing'
          )
        ),
        extend(
          a,
          extractResponse(
            t.tafqitResponse,
            TF_LINE_COLOR,
            TF_LABEL_COLOR,
            'tafqitResponse'
          )
        ),
        extend(
          a,
          extractResponse(
            t.otherSuggestions,
            OS_LINE_COLOR,
            OS_LABEL_COLOR,
            'otherSuggestions'
          )
        );
      let o = [],
        l = 0;
      for (let t = 0; t < e.length; ++t)
        offset_indices.has(t) && (l += 1), o.push(l);
      for (let e = 0; e < a.length; ++e)
        (a[e].from -= o[a[e].from]), (a[e].to -= o[a[e].to]);
      e == getText() &&
        ((flagged_tokens = []),
        $.each(a, function () {
          let e = JSON.stringify({
            word: wordGetter(this.from, this.to),
            suggestions: this.replacement,
          });
          ignoredSet.has(e) || flagged_tokens.push(this);
        }),
        0 == flagged_tokens.length
          ? clearButton()
          : fetchErrors(flagged_tokens, n));
    });
  }, t);
}

function extractResponse(e, t, n, x) {
  if (null == e || jQuery.isEmptyObject(e)) return [];
  if (((SCSuggestions = e.results.flagged_tokens), null == SCSuggestions))
    return [];
  let a = [];
  for (let e = 0; e < SCSuggestions.length; e++)
    (token = SCSuggestions[e]),
      a.push({
        type: x,
        lineColor: t,
        labelColor: n,
        from: token.start_index,
        to: token.end_index,
        lang: token.lang ? token.lang : 'ar',
        original: token.original_word,
        replacement: (function (e) {
          let t = [];
          for (let n = 0; n < e.length; n++) t.push(e[n].text);
          return t;
        })(token.suggestions),
      });
  return a;
}

function extractRest(e, t, n, x) {
  if (null == e) return [];
  for (let a = 0; a < e.length; a++)
    (e[a].type = x),
      (e[a].replacement = [e[a].replacement]),
      (e[a].to -= 1),
      (e[a].lineColor = t),
      (e[a].labelColor = n);
  return e;
}

function isOverlapping(e, t, n, a) {
  return n <= t && a >= e;
}

function extend(e, t) {
  for (let n = 0; n < t.length; n++) {
    let a = !0;
    for (let o = 0; o < e.length; o++)
      if (isOverlapping(t[n].from, t[n].to, e[o].from, e[o].to)) {
        a = !1;
        break;
      }
    a && e.push(t[n]);
  }
}

async function shakel() {
  selectedText = window.getSelection().toString();
}

function unshakel(e) {
  return e && (selectedText = e.replace(/([\u064b-\u0653\u0670])/g, '')), e;
}

function isEmpty(e) {
  return 0 === Object.keys(e).length;
}

function extractQueryParam(e) {
  return new URLSearchParams(window.location.search).get(e);
}

function extractPathParamAt(e) {
  if (0 != e) return window.location.pathname.split('/')[e];
  console.error('Index should start from 1');
}

function assignEditorIds() {
  document.querySelectorAll('[contenteditable]').forEach((e, t) => {
    e.setAttribute('data-qid', 'ce:' + t);
  }),
    document.querySelectorAll('textarea').forEach((e, t) => {
      e.setAttribute('data-qid', 'te:' + t);
    });
}

function assignIframeEditorIds(e, t) {
  e.contentDocument.querySelectorAll('[contenteditable]').forEach((e, n) => {
    e.setAttribute('data-qid', `fce:${t}:${n}`);
  }),
    e.contentDocument.querySelectorAll('textarea').forEach((e, n) => {
      e.setAttribute('data-qid', `fte:${t}:${n}`);
    });
}

function getContext(e, t, n) {
  let a = getText(),
    o = a
      .replace(/\n/g, '')
      .substring(0, t)
      .split(' ')
      .filter((e) => '' != e && ' ' != e),
    l = a
      .replace(/\n/g, '')
      .substring(parseInt(n) + 1)
      .split(' ')
      .filter((e) => '' != e && ' ' != e);
  return `\n\t\t\t${o.slice(o.length - 6).join(' ')} ${e} ${l
    .slice(0, 5)
    .join(' ')}`;
}
window.x || (x = {}),
  (x.Selector = {}),
  (x.Selector.getSelected = function () {
    var e = '';
    return (
      window.getSelection
        ? (e = window.getSelection())
        : document.getSelection
        ? (e = document.getSelection())
        : document.selection && (e = document.selection.createRange().text),
      e
    );
  }),
  $(document).ready(function () {
    (scr.src = `${settings.assetsPath}/js/uuid.js`),
      (scr.async = !1),
      head.insertBefore(scr, head.firstChild);
    let e = document.querySelectorAll('textarea');
    for (let a = 0; a < e.length; a++) {
      const o = e[a];
      var t = o.parentNode,
        n = document.createElement('div');
      n.classList.add('textarea-blk'), t.replaceChild(n, o), n.appendChild(o);
    }
    if (
      (activate(baseLink + 'test/go', clientId),
      !document.getElementById(cssId))
    ) {
      var a = document.getElementsByTagName('head')[0],
        o = document.createElement('link');
      (o.id = cssId),
        (o.rel = 'stylesheet'),
        (o.type = 'text/css'),
        (o.href = `${settings.assetsPath}/css/qalamExtension.css`),
        (o.media = 'all'),
        a.appendChild(o);
    }
  });
