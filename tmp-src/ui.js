(function () {
    'use strict';

    (function ()
    {

        var _Object = Object;

        var art =
        window.art =
        function (target)
        {
            var node;
            if (target instanceof Node)
                node = target;
            else if (typeof target === 'function')
                node = target.call(art);
            else
                node = document.createElement(target);
            var argCount = arguments.length;
            for (var index = 0; ++index < argCount;)
            {
                var arg = arguments[index];
                if (arg instanceof Node)
                    node.appendChild(arg);
                else if (arg != null)
                {
                    var type = typeof arg;
                    if (type === 'object')
                        deepAssign(node, arg);
                    else if (type === 'function')
                        arg.call(art, node);
                    else
                        node.appendChild(document.createTextNode(arg));
                }
            }
            return node;
        };

        function deepAssign(target, source)
        {
            _Object.keys(source).forEach
            (
                function (name)
                {
                    var descriptor = _Object.getOwnPropertyDescriptor(source, name);
                    if ('value' in descriptor)
                    {
                        var value = descriptor.value;
                        if (name in target && typeof value === 'object')
                            deepAssign(target[name], value);
                        else
                            target[name] = value;
                    }
                    else
                        _Object.defineProperty(target, name, descriptor);
                }
            );
        }

        art.off =
        function (type, listener, useCapture)
        {
            var processEventListener =
            createProcessEventListener(type, listener, useCapture, 'removeEventListener');
            return processEventListener;
        };

        art.on =
        function (type, listener, useCapture)
        {
            var processEventListener =
            createProcessEventListener(type, listener, useCapture, 'addEventListener');
            return processEventListener;
        };

        function createProcessEventListener(type, listener, useCapture, methodName)
        {
            function processEventListener(target)
            {
                function callback(thisType)
                {
                    target[methodName](thisType, listener, useCapture);
                }

                if (Array.isArray(type))
                    type.forEach(callback);
                else
                    callback(type);
            }

            return processEventListener;
        }

        art.css =
        function (selectors, ruleObj)
        {
            var ruleStr = formatRule(selectors, ruleObj);
            addRule(ruleStr);
        };

        function addRule(ruleStr)
        {
            if (!styleSheet)
            {
                var style = art('STYLE');
                art(document.head, style);
                styleSheet = style.sheet;
            }
            styleSheet.insertRule(ruleStr, styleSheet.cssRules.length);
        }

        function createRuleDefs(ruleObj, callback)
        {
            var ruleDefs =
            _Object.keys(ruleObj).map
            (
                function (ruleName)
                {
                    var ruleValue = ruleObj[ruleName];
                    var ruleDef = callback(ruleName, ruleValue);
                    return ruleDef;
                }
            );
            return ruleDefs;
        }

        function formatRule(selectors, ruleObj)
        {
            var ruleDefs =
            createRuleDefs
            (
                ruleObj,
                function (ruleName, ruleValue)
                {
                    var ruleDef = ruleName + ':' + ruleValue;
                    return ruleDef;
                }
            );
            var ruleStr = selectors + '{' + ruleDefs.join(';') + '}';
            return ruleStr;
        }

        var styleSheet;
    }
    )();

    /* eslint-env browser */

    (function ()
    {

        function formatItem(value)
        {
            var text;
            var type = typeof value;
            try
            {
                if (type === 'string')
                    text = '"' + value + '"';
                else if (value === 0 && 1 / value < 0)
                    text = '-0';
                else if (Array.isArray(value))
                    text = value.length ? '[…]' : '[]';
                else if (type === 'bigint')
                    text = value + 'n';
                // In Node.js 0.12, calling String with a symbol argument throws a TypeError.
                // Since this script is only used in browsers this is not a true problem, but still.
                else if (type !== 'symbol')
                    text = String(value);
                else
                    text = value.toString();
            }
            catch (error)
            { }
            return text;
        }

        self.formatValue =
        function (value)
        {
            var text;
            if (Array.isArray(value))
            {
                try
                {
                    text = '[' + value.map(formatItem).join(', ') + ']';
                }
                catch (error)
                { }
            }
            else
                text = formatItem(value);
            return text;
        };

        self.formatValueType =
        function (value)
        {
            var valueType;
            if (value !== null)
            {
                var type = typeof value;
                // document.all has type "undefined".
                if  (type === 'function' || type === 'object' || type === 'undefined')
                {
                    var prototype = Object.getPrototypeOf(value);
                    if (prototype === Array.prototype)
                    {
                        switch (value.length)
                        {
                        case 0:
                            valueType = 'an empty array';
                            break;
                        case 1:
                            valueType = 'a one element array';
                            break;
                        default:
                            valueType = 'an array';
                            break;
                        }
                    }
                    else if (prototype === Date.prototype)
                        valueType = 'a date';
                    else if (prototype === RegExp.prototype)
                        valueType = 'a regular expression';
                    else if (type === 'function')
                        valueType = 'a function';
                    else
                        valueType = 'an object';
                }
            }
            return valueType;
        };
    }
    )();

    var WORKER_SRC = "\"use strict\";self.onmessage=function(t){var r=t.data,e=r.url;null!=e&&importScripts(e);var s=r.input;if(null!=s){var n;try{n={output:JScrewIt.encode(s,r.options)}}catch(t){n={error:String(t)}}postMessage(n)}};";

    /* eslint-env browser */

    function hasTabindex(element)
    {
        var result = element.hasAttribute('tabindex');
        return result;
    }

    function removeTabindex(element)
    {
        element.removeAttribute('tabindex');
    }

    function setTabindex(element)
    {
        element.setAttribute('tabindex', 0);
    }

    /* eslint-env browser */

    function createButton(text)
    {
        function deactivate()
        {
            button.className = 'button focusable';
            setCaptureListeners('off');
        }

        function handleClick(evt)
        {
            if (isDisabled())
                evt.stopImmediatePropagation();
            evt.preventDefault();
        }

        function handleDocumentMousemove(evt)
        {
            if (evt.target !== button && isActive()) // capture lost
                deactivate();
        }

        function handleDocumentMouseout(evt)
        {
            if (!evt.relatedTarget && isActive()) // capture lost
                deactivate();
        }

        function handleKeydown(evt)
        {
            if (evt.keyCode === 13) // Enter
            {
                button.click();
                evt.preventDefault();
            }
        }

        function handleKeyup(evt)
        {
            if (evt.keyCode === 32) // Space
            {
                button.click();
                evt.preventDefault();
            }
        }

        function handleMousedown(evt)
        {
            if (evt.button === 0 && !isDisabled() && !isActive())
            {
                button.setCapture();
                button.className = 'active button focusable';
                setCaptureListeners('on');
            }
        }

        function handleMouseup(evt)
        {
            if (evt.button === 0 && isActive())
            {
                document.releaseCapture();
                deactivate();
            }
        }

        function isActive()
        {
            var active = /\bactive\b/.test(button.className);
            return active;
        }

        function isDisabled()
        {
            var disabled = !hasTabindex(button);
            return disabled;
        }

        function setCaptureListeners(methodName)
        {
            var method = art[methodName];
            art
            (
                document,
                method('mousemove', handleDocumentMousemove),
                method('mouseout', handleDocumentMouseout)
            );
        }

        var button =
        art
        (
            'SPAN',
            {
                className: 'button focusable',
                get disabled()
                {
                    var value = isDisabled();
                    return value;
                },
                set disabled(value)
                {
                    value = !!value;
                    if (value !== isDisabled())
                    {
                        if (value)
                        {
                            art(button, removeTabindex);
                            if (isActive())
                            {
                                document.releaseCapture();
                                setCaptureListeners('off');
                            }
                            button.blur();
                        }
                        else
                            art(button, setTabindex);
                        // Make sure the class does change so a refresh is triggered in Internet
                        // Explorer and Edge.
                        button.className = '';
                        button.className = 'button focusable';
                    }
                },
            },
            setTabindex,
            art.on('click', handleClick),
            art.on('keydown', handleKeydown),
            art.on('keyup', handleKeyup),
            art.on('mouseup', handleMouseup),
            art('SPAN', text),
            art('SPAN')
        );
        if (button.setCapture) // setCapture is only defined in Internet Explorer.
        {
            button.firstChild.setAttribute('unselectable', 'on');
            art(button, art.on('mousedown', handleMousedown));
        }
        return button;
    }

    art.css
    (
        '.button',
        {
            background: '#e0e0e0',
            color:      '#212121',
            cursor:     'default',
            display:    'inline-block',
            position:   'relative',
        }
    );
    art.css('.button, .button>:last-child', { 'border-radius': '.1em' });
    art.css('.button.active, .button[tabindex]:active', { background: '#29b3e5' });
    art.css
    (
        '.button.active>:first-child, .button[tabindex]:active>:first-child',
        { left: '.1em', top: '.1em' }
    );
    art.css
    ('.button.active>:last-child, .button[tabindex]:active>:last-child', { 'border-color': '#0088b6' });
    art.css('.button:not([tabindex])', { background: '#e9e9e9', color: '#707070' });
    art.css('.button:not([tabindex])>:last-child', { 'border-color': '#bababa' });
    art.css
    (
        '.button>:first-child',
        {
            display:                'inline-block',
            margin:                 '.15em .5em',
            position:               'relative',
            'user-select':          'none',
            '-moz-user-select':     'none',
            '-ms-user-select':      'none',
            '-webkit-user-select':  'none',
        }
    );
    art.css
    (
        '.button>:last-child',
        {
            'border-color': '#707070',
            'border-style': 'solid',
            'border-width': '1px',
            display:        'inline-block',
            position:       'absolute',
            left:           '0',
            right:          '0',
            top:            '0',
            bottom:         '0',
        }
    );
    art.css('.button[tabindex]:hover:not(.active):not(:active)', { background: '#a3f4ff' });
    art.css
    ('.button[tabindex]:hover:not(.active):not(:active)>:last-child', { 'border-color': '#189fdd' });

    /* eslint-env browser */

    function showModalBox(content, callback)
    {
        function close()
        {
            var body = document.body;
            body.removeChild(overlay);
            art(body, art.off('keydown', handleKeydown), art.off('focus', handleFocus, true));
            if (callback !== undefined)
                callback();
        }

        function grabFocus()
        {
            focusableContainer.focus();
        }

        function handleFocus(evt)
        {
            if (!focusableContainer.contains(evt.target))
                grabFocus();
        }

        function handleKeydown(evt)
        {
            var keyCode = evt.keyCode;
            if (keyCode === 13 || keyCode === 27) // Enter, Esc
            {
                var activeElement = document.activeElement;
                if (activeElement.contains(focusableContainer) || !activeElement.contains(evt.target))
                {
                    close();
                    evt.preventDefault();
                }
            }
        }

        var BOX_BORDER_RADIUS   = 23;
        var BOX_MARGIN          = 2;

        var focusableContainer =
        art
        (
            'DIV',
            {
                style:
                {
                    borderRadius:   BOX_BORDER_RADIUS + BOX_MARGIN + 'px',
                    display:        'inline-block',
                    maxWidth:       '500px',
                    width:          '100%',
                },
            },
            setTabindex,
            art
            (
                'DIV',
                {
                    className: 'focusable',
                    id: 'modalBox',
                    style:
                    {
                        background:     'whitesmoke',
                        border:         '10px solid blue',
                        borderRadius:   BOX_BORDER_RADIUS + 'px',
                        margin:         BOX_MARGIN + 'px',
                    },
                },
                art
                (
                    'DIV',
                    { style: { margin: '1.5em 1.5em .25em', overflow: 'hidden' } },
                    content,
                    art
                    (
                        'DIV',
                        { style: { margin: '1.25em 0' } },
                        art
                        (
                            createButton('OK'),
                            { style: { maxWidth: '5em', width: '100%' } },
                            art.on('click', close)
                        )
                    )
                )
            )
        );
        var overlay =
        art
        (
            'DIV',
            {
                style:
                {
                    background: 'rgba(0, 0, 0, .25)',
                    overflow:   'auto',
                    position:   'fixed',
                    textAlign:  'center',
                    left:       '0',
                    top:        '0',
                    bottom:     '0',
                    width:      '100%',
                },
            },
            art
            (
                'DIV',
                { style: { display: 'table', tableLayout: 'fixed', width: '100%', height: '100%' } },
                art
                (
                    'DIV',
                    { style: { display: 'table-cell', verticalAlign: 'middle' } },
                    focusableContainer
                )
            )
        );
        art
        (document.body, overlay, art.on('focus', handleFocus, true), art.on('keydown', handleKeydown));
        setTimeout(grabFocus);
    }

    art.css('#modalBox p:first-child', { 'margin-top': '0' });
    art.css('#modalBox p:last-child', { 'margin-bottom': '0' });

    /* eslint-env browser */

    function createEngineSelectionBox()
    {
        var ENGINE_INFO_LIST =
        [
            {
                name: 'Chrome',
                versions:
                [
                    { featureName: 'CHROME_73', number: '73+' },
                ],
            },
            {
                name: 'Edge',
                versions:
                [
                    { featureName: 'EDGE_40', number: '40+' },
                ],
            },
            {
                name: 'Firefox',
                versions:
                [
                    { featureName: 'FF_54', number: '54–61' },
                    { featureName: 'FF_62', number: '62+' },
                ],
            },
            {
                name: 'Internet Explorer',
                versions:
                [
                    { featureName: 'IE_9', number: '9' },
                    { featureName: 'IE_10', number: '10' },
                    { featureName: 'IE_11', number: '11' },
                    { featureName: 'IE_11_WIN_10', number: '11 (W10)' },
                ],
            },
            {
                name: 'Safari',
                versions:
                [
                    { featureName: 'SAFARI_7_0', number: '7.0' },
                    { featureName: 'SAFARI_7_1', number: '7.1–8' },
                    { featureName: 'SAFARI_9', number: '9' },
                    { featureName: 'SAFARI_10', number: '10–11' },
                    { featureName: 'SAFARI_12', number: '12+' },
                ],
            },
            {
                name: 'Opera',
                versions:
                [
                    { featureName: 'CHROME_73', number: '60+' },
                ],
            },
            {
                name: 'Android Browser',
                versions:
                [
                    { featureName: 'ANDRO_4_0', number: '4.0' },
                    { featureName: 'ANDRO_4_1', number: '4.1–4.3' },
                    { featureName: 'ANDRO_4_4', number: '4.4' },
                ],
            },
            {
                name: 'Node.js',
                versions:
                [
                    { featureName: 'NODE_0_10', number: '0.10' },
                    { featureName: 'NODE_0_12', number: '0.12' },
                    { featureName: 'NODE_4', number: '4' },
                    { featureName: 'NODE_5', number: '5' },
                    { featureName: 'NODE_10', number: '10' },
                    { featureName: 'NODE_11', number: '11' },
                    { featureName: 'NODE_12', number: '12+' },
                ],
            },
        ];

        var FORCED_STRICT_MODE_CAPTION = 'Generate strict mode code';

        var FORCED_STRICT_MODE_HELP =
        '<p>The option <dfn>' + FORCED_STRICT_MODE_CAPTION + '</dfn> instructs JScrewIt to avoid ' +
        'optimizations that don\'t work in strict mode JavaScript code. Check this option only if ' +
        'your environment disallows non-strict code. You may want to do this for example in one of ' +
        'the following circumstances.' +
        '<ul>' +
        '<li>To encode a string or a number and embed it in a JavaScript file in a place where ' +
        'strict mode code is expected, like in a scope containing a use strict directive or in a ' +
        'class body.' +
        '<li>To encode a script and run it in Node.js with the option <code>--use_strict</code>.' +
        '<li>To encode an ECMAScript module. Note that module support in JSFuck is <em>very</em> ' +
        'limited, as <code>import</code> and <code>export</code> statements don\'t work at all. ' +
        'If your module doesn\'t contain these statements, you can encode it using this option.' +
        '</ul>' +
        '<p>In most other cases, this option is not required, even if your script contains a top ' +
        'level <code>"use strict"</code> statement.';

        var WEB_WORKER_CAPTION = 'Support web workers';

        var WEB_WORKER_HELP =
        '<p>Web workers are part of a standard HTML technology used to perform background tasks in ' +
        'JavaScript.' +
        '<p>Check the option <dfn>' + WEB_WORKER_CAPTION + '</dfn> only if your code needs to run ' +
        'inside a web worker. To create or use a web worker in your code, this option is not required.';

        var QUESTION_MARK_SIZE = '10.5pt';

        function createCheckBox(text, inputProps)
        {
            var checkBox =
            art
            (
                'LABEL',
                { style: { display: 'inline-table' } },
                art
                (
                    'SPAN',
                    { style: { display: 'table-cell', verticalAlign: 'middle' } },
                    art('INPUT', { style: { margin: '0 .25em 0 0' }, type: 'checkbox' }, inputProps)
                ),
                art('SPAN', { style: { display: 'table-cell' } }, text)
            );
            return checkBox;
        }

        function createQuestionMark(innerHTML)
        {
            function showHelp()
            {
                showModalBox(contentBlock);
            }

            // Older Android Browser versions have problems in mixing elements with display style
            // 'inline-block' and 'inline-table' in the same line, so we'll stick to 'inline-table'
            // here.
            var DISPLAY_STYLE = 'inline-table';

            var contentBlock = art('DIV', { className: 'help-text' });
            contentBlock.innerHTML = innerHTML;
            var questionMark =
            art
            (
                'SPAN',
                {
                    className: 'focusable',
                    style:
                    {
                        background:     'black',
                        borderRadius:   '1em',
                        color:          'white',
                        cursor:         'pointer',
                        display:        DISPLAY_STYLE,
                        fontSize:       '8pt',
                        fontWeight:     'bold',
                        lineHeight:     QUESTION_MARK_SIZE,
                        position:       'relative',
                        textAlign:      'center',
                        top:            '-1.5pt',
                        width:          QUESTION_MARK_SIZE,
                    },
                    title: 'Learn more…',
                },
                '?',
                setTabindex,
                art.on('click', showHelp)
            );
            return questionMark;
        }

        function dispatchInputEvent()
        {
            var evt = document.createEvent('Event');
            evt.initEvent('input', true, false);
            comp.dispatchEvent(evt);
        }

        function handleAllEngineChange()
        {
            var checked = allEngineInput.checked;
            Array.prototype.forEach.call
            (
                engineVersionInputs,
                function (input)
                {
                    input.checked = checked;
                }
            );
        }

        function handleAllEngineChangeAsync()
        {
            setTimeout
            (
                function ()
                {
                    if (!allEngineInput.indeterminate)
                        handleAllEngineChange();
                }
            );
        }

        function init()
        {
            var allEngineField =
            art
            (
                createCheckBox('Select/deselect all'),
                { style: { margin: '0 0 .5em' } },
                art.on('change', handleAllEngineChange),
                art.on(['keyup', 'mouseup'], handleAllEngineChangeAsync)
            );
            var engineFieldBox = art('TABLE', { style: { borderSpacing: '0', width: '100%' } });
            var forcedStrictModeField = createCheckBox(FORCED_STRICT_MODE_CAPTION);
            var webWorkerField = createCheckBox(WEB_WORKER_CAPTION);
            comp =
            art
            (
                'FIELDSET',
                {
                    className: 'engine-selection-box',
                    get feature()
                    {
                        return currentFeature;
                    },
                },
                art
                (
                    'DIV',
                    art
                    (
                        'P',
                        { style: { margin: '.25em 0 .75em' } },
                        'Select the engines you want your code to support.'
                    ),
                    allEngineField,
                    engineFieldBox,
                    art('HR'),
                    art('DIV', webWorkerField, ' ', createQuestionMark(WEB_WORKER_HELP)),
                    art('DIV', forcedStrictModeField, ' ', createQuestionMark(FORCED_STRICT_MODE_HELP)),
                    art.on('change', updateStatus)
                )
            );
            ENGINE_INFO_LIST.forEach
            (
                function (engineInfo, engineIndex)
                {
                    var versions = engineInfo.versions;
                    var engineField;
                    var engineFieldProps = engineIndex & 1 ? { className: 'even-field' } : null;
                    var rowSpan = (versions.length + 2) / 3 ^ 0;
                    var cellCount = rowSpan * 3;
                    for (var versionIndex = 0; versionIndex < cellCount; ++versionIndex)
                    {
                        var version = versions[versionIndex];
                        if (!(versionIndex % 3))
                        {
                            engineField = art('TR', engineFieldProps);
                            if (!versionIndex)
                            {
                                art
                                (
                                    engineField,
                                    art
                                    (
                                        'TD',
                                        { rowSpan: rowSpan, style: { padding: '0 .5em 0 0' } },
                                        engineInfo.name
                                    )
                                );
                            }
                            art(engineFieldBox, engineField);
                        }
                        var versionCheckBox =
                        version ?
                        createCheckBox
                        (version.number, { checked: true, featureName: version.featureName }) :
                        null;
                        art
                        (
                            engineField,
                            art
                            ('TD', { style: { padding: '0 0 0 .5em', width: '6em' } }, versionCheckBox)
                        );
                    }
                }
            );
            allEngineInput = allEngineField.querySelector('INPUT');
            engineVersionInputs = engineFieldBox.querySelectorAll('INPUT');
            forcedStrictModeInput = forcedStrictModeField.querySelector('INPUT');
            webWorkerInput = webWorkerField.querySelector('INPUT');
            updateCurrentFeature();
        }

        function updateCurrentFeature()
        {
            var Feature = JScrewIt.Feature;
            var features =
            Array.prototype.filter.call
            (
                engineVersionInputs,
                function (input)
                {
                    return input.checked;
                }
            )
            .map
            (
                function (input)
                {
                    ++checkedCount;
                    return Feature[input.featureName];
                }
            );
            var checkedCount = features.length;
            allEngineInput.checked = checkedCount;
            allEngineInput.indeterminate = checkedCount && checkedCount < engineVersionInputs.length;
            currentFeature = Feature.commonOf.apply(null, features) || Feature.DEFAULT;
            if (webWorkerInput.checked)
                currentFeature = currentFeature.restrict('web-worker', features);
            if (forcedStrictModeInput.checked)
                currentFeature = currentFeature.restrict('forced-strict-mode', features);
        }

        function updateStatus()
        {
            updateCurrentFeature();
            dispatchInputEvent();
        }

        var allEngineInput;
        var comp;
        var currentFeature;
        var engineVersionInputs;
        var forcedStrictModeInput;
        var webWorkerInput;

        init();
        return comp;
    }

    art.css('.engine-selection-box', { background: '#f0f0f0' });
    art.css('.engine-selection-box .even-field', { background: '#fff' });
    art.css('.help-text', { 'font-size': '11pt', 'text-align': 'justify' });
    art.css('.help-text code', { 'white-space': 'pre' });
    art.css('.help-text dfn', { 'font-style': 'normal', 'font-weight': 'bold' });
    art.css('.help-text li', { 'margin': '.5em 0' });

    /* eslint-env browser */
    /* global art */

    function createRoll()
    {
        function init()
        {
            var container = art('DIV');
            containerStyle = container.style;
            containerStyle.display = 'none';
            comp = art('DIV', container, { container: container, rollTo: rollTo });
            compStyle = comp.style;
            compStyle.height = '0';
            compStyle.overflowY = 'hidden';
        }

        function progress()
        {
            var now = +new Date();
            var elapsed = now - startTime;
            opening = startOpening + elapsed * openSign / 250;
            if ((opening - endOpening) * openSign >= 0)
            {
                opening = endOpening;
                stop();
            }
            compStyle.height = opening === 1 ? '' : comp.scrollHeight * opening + 'px';
            containerStyle.display = opening === 0 ? 'none' : '';
        }

        function rollTo(newEndOpening)
        {
            if (newEndOpening === opening)
                stop();
            else
            {
                var newOpenSign = newEndOpening > opening ? 1 : -1;
                if (newOpenSign !== openSign)
                {
                    startOpening = opening;
                    startTime = +new Date();
                    openSign = newOpenSign;
                }
                endOpening = newEndOpening;
                if (!interval)
                    interval = setInterval(progress, 0);
            }
        }

        function stop()
        {
            clearInterval(interval);
            interval = null;
            openSign = 0;
        }

        var comp;
        var compStyle;
        var containerStyle;
        var endOpening;
        var interval;
        var openSign = 0;
        var opening = 0;
        var startOpening;
        var startTime;

        init();
        return comp;
    }

    /* eslint-env browser */

    var JS_MIME_TYPE = 'application/javascript';

    function createWorker()
    {
        worker = new Worker(workerURL);
        worker.onmessage = handleWorkerMessage;
    }

    function destroyWorkerURL()
    {
        URL.revokeObjectURL(workerURL);
        workerURL = undefined;
    }

    function encode()
    {
        var output;
        var options = getOptions();
        try
        {
            output = JScrewIt.encode(inputArea.value, options);
        }
        catch (error)
        {
            resetOutput();
            updateError(String(error));
            return;
        }
        updateOutput(output);
    }

    function encodeAsync()
    {
        var options = getOptions();
        var data = { input: inputArea.value, options: options };
        if (waitingForWorker)
        {
            worker.terminate();
            createWorker();
            data.url = jscrewitURL;
        }
        worker.postMessage(data);
        resetOutput();
        setWaitingForWorker(true);
        inputArea.onkeyup = null;
    }

    function getOptions()
    {
        var options = { features: currentFeature.canonicalNames };
        return options;
    }

    function handleCompInput()
    {
        var selectedIndex = compMenu.selectedIndex;
        var compatibility = compMenu.options[selectedIndex].value;
        // If the option "Custom…" is not selected, the feature object can be determined directly from
        // the selected option; otherwise, it must be retrieved from the engineSelectionBox.
        var feature = compatibility ? Feature[compatibility] : engineSelectionBox.feature;
        if (outOfSync || !Feature.areEqual(feature, currentFeature))
        {
            currentFeature = feature;
            this();
        }
        if (selectedIndex !== compMenu.previousIndex)
        {
            compMenu.previousIndex = selectedIndex;
            roll.rollTo(+!compatibility);
        }
    }

    function handleInputAreaKeyUp(evt)
    {
        if (evt.keyCode !== 9) // Tab
            encodeAsync();
    }

    function handleOutputAreaMouseDown(evt)
    {
        if (ignoreRepeatedMainMouseButtonEvent(evt))
        {
            var outputLength = outputArea.value.length;
            if (outputArea.selectionStart !== 0 || outputArea.selectionEnd !== outputLength)
            {
                outputArea.selectionStart = 0;
                outputArea.selectionEnd = outputLength;
                if ('scrollTopMax' in outputArea) // Hack for Firefox
                {
                    var scrollTop = outputArea.scrollTop;
                    art
                    (
                        outputArea,
                        art.on
                        (
                            'scroll',
                            function ()
                            {
                                outputArea.scrollTop = scrollTop;
                            },
                            { once: true }
                        )
                    );
                }
            }
        }
    }

    function handleReaderLoadEnd()
    {
        loadFileButton.disabled = false;
        var result = this.result;
        if (result != null)
            inputArea.value = result;
        inputArea.oninput();
        inputArea.disabled = false;
    }

    function handleRun()
    {
        var content;
        var value;
        try
        {
            value = (0, eval)(outputArea.value);
        }
        catch (error)
        {
            content = art('P', String(error));
        }
        if (value !== undefined)
        {
            var text = formatValue(value);
            var valueType = formatValueType(value);
            if (text)
            {
                var intro =
                valueType ? 'Evaluation result is ' + valueType + ':' : 'Evaluation result is';
                content =
                art
                (
                    'DIV',
                    art('P', intro),
                    art
                    (
                        'P',
                        { style: { overflowX: 'auto' } },
                        art
                        (
                            'DIV',
                            {
                                style:
                                { display: 'inline-block', textAlign: 'left', whiteSpace: 'pre' },
                            },
                            text
                        )
                    )
                );
            }
            else
                content = art('DIV', art('P', 'Evaluation result is ' + valueType + '.'));
        }
        if (content != null)
        {
            var runThisButton = this;
            showModalBox
            (
                content,
                function ()
                {
                    runThisButton.focus();
                }
            );
        }
    }

    function handleWorkerMessage(evt)
    {
        var data = evt.data;
        var error = data.error;
        if (error)
            updateError(error);
        else
            updateOutput(data.output);
        setWaitingForWorker(false);
    }

    function ignoreRepeatedMainMouseButtonEvent(evt)
    {
        var repeated;
        var target = evt.target;
        if ('runtimeStyle' in target) // Hack for Internet Explorer
        {
            var lastMainMouseButtonEventTimeStamp = target.lastMainMouseButtonEventTimeStamp;
            var currentTimeStamp = evt.button === 0 ? evt.timeStamp : undefined;
            target.lastMainMouseButtonEventTimeStamp = currentTimeStamp;
            repeated = currentTimeStamp - lastMainMouseButtonEventTimeStamp <= 500;
        }
        else
            repeated = evt.detail >= 2 && evt.button === 0;
        if (repeated)
            evt.preventDefault();
        return repeated;
    }

    function init()
    {
        document.querySelector('main>div').style.display = 'block';
        inputArea.value = inputArea.defaultValue;
        var outputAreaProps = isBlink() ? { rows: 1, style: { overflowX: 'scroll' } } : { rows: 10 };
        art
        (
            outputArea,
            outputAreaProps,
            art.on('mousedown', handleOutputAreaMouseDown),
            art.on('mouseup', ignoreRepeatedMainMouseButtonEvent),
            art.on('input', updateStats)
        );
        art
        (
            stats.parentNode,
            art
            (
                createButton('Run this'),
                { style: { bottom: '0', fontSize: '10pt', position: 'absolute', right: '0' } },
                art.on('click', handleRun)
            )
        );
        (function ()
        {
            var COMPACT = Feature.COMPACT;
            if (Feature.AUTO.includes(COMPACT))
                currentFeature = COMPACT;
            else
                currentFeature = Feature.BROWSER;
            compMenu.value = currentFeature.name;
            compMenu.previousIndex = compMenu.selectedIndex;
        }
        )();
        var changeHandler;
        if (worker)
        {
            changeHandler = encodeAsync;
            encodeAsync();
        }
        else
        {
            var encodeButton = art(createButton('Encode'), art.on('click', encode));
            art(controls, encodeButton);
            changeHandler = noEncode;
            outputArea.value = '';
        }
        if (typeof File !== 'undefined')
        {
            var loadFileInput =
            art
            (
                'INPUT',
                { accept: '.js', style: { display: 'none' }, type: 'file' },
                art.on('change', loadFile)
            );
            // In older Android Browser versions, HTMLElement objects don't have a "click" property;
            // HTMLInputElement objects do.
            var openLoadFileDialog = HTMLInputElement.prototype.click.bind(loadFileInput);
            loadFileButton =
            art(createButton('Load file…'), art.on('click', openLoadFileDialog));
            art(controls, loadFileButton, loadFileInput);
        }
        inputArea.oninput = changeHandler;
        var compHandler = handleCompInput.bind(changeHandler);
        art(compMenu, art.on('change', compHandler));
        engineSelectionBox = art(createEngineSelectionBox(), art.on('input', compHandler));
        roll = createRoll();
        art
        (
            roll.container,
            art
            (
                'DIV',
                { className: 'frame' },
                art('SPAN', 'Custom Compatibility Selection'),
                engineSelectionBox
            )
        );
        art(controls.parentNode, roll);
        inputArea.selectionStart = 0x7fffffff;
        inputArea.focus();
    }

    function initLater()
    {
        document.addEventListener('DOMContentLoaded', init);
    }

    function isBlink()
    {
        var chrome = self.chrome;
        var blink = chrome && chrome.csi;
        return blink;
    }

    function loadFile()
    {
        var file = this.files[0];
        if (file)
        {
            inputArea.disabled = true;
            inputArea.value = '';
            loadFileButton.disabled = true;
            var reader = new FileReader();
            reader.addEventListener('loadend', handleReaderLoadEnd);
            reader.readAsText(file);
        }
    }

    function noEncode()
    {
        if (outputSet)
            updateStats(true);
    }

    function resetOutput()
    {
        outputSet = false;
        outputArea.value = '';
        stats.textContent = '…';
    }

    function setWaitingForWorker(value)
    {
        waitingForWorker = value;
        outputArea.disabled = value;
    }

    function updateError(error)
    {
        showModalBox(art('P', error));
    }

    function updateOutput(output)
    {
        outputArea.value = output;
        updateStats();
    }

    function updateStats(newOutOfSync)
    {
        var length = outputArea.value.length;
        var html = length === 1 ? '1 char' : length + ' chars';
        outOfSync = !!newOutOfSync;
        if (newOutOfSync)
        {
            if (worker)
                inputArea.onkeyup = handleInputAreaKeyUp;
            html += ' – <i>out of sync</i>';
        }
        outputSet = true;
        stats.innerHTML = html;
    }

    var Feature = JScrewIt.Feature;

    var currentFeature;
    var engineSelectionBox;
    var jscrewitURL;
    var loadFileButton;
    var outOfSync;
    var outputSet;
    var roll;
    var waitingForWorker;
    var worker;
    var workerURL;

    if (typeof Worker !== 'undefined') // In older versions of Safari, typeof Worker is "object".
    {
        workerURL = URL.createObjectURL(new Blob([WORKER_SRC], { type: JS_MIME_TYPE }));
        try
        {
            createWorker();
        }
        catch (error)
        {
            destroyWorkerURL();
        }
    }
    if (worker)
    {
        (function ()
        {
            var request = new XMLHttpRequest();
            request.onerror =
            function ()
            {
                worker.terminate();
                worker = undefined;
                destroyWorkerURL();
            };
            request.onload =
            function ()
            {
                jscrewitURL = URL.createObjectURL(request.response);
                worker.postMessage({ url: jscrewitURL });
            };
            request.onloadend =
            function ()
            {
                if (document.readyState === 'loading')
                    initLater();
                else
                    init();
            };
            request.open('GET', 'lib/jscrewit.min.js', true);
            request.overrideMimeType(JS_MIME_TYPE);
            request.responseType = 'blob';
            request.send();
        }
        )();
    }
    else
        initLater();

}());
