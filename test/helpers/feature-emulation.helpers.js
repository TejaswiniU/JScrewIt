/* global document, global, self */

'use strict';

(function (global)
{
    function createBackupMap()
    {
        var backupMap = Object.create(null);
        return backupMap;
    }

    function emuDo(emuFeatures, callback)
    {
        var context = Object.create(null);
        try
        {
            emuFeatures.forEach
            (
                function (featureName)
                {
                    EMU_FEATURE_INFOS[featureName].call(context);
                }
            );
            var result = callback();
            return result;
        }
        finally
        {
            var backupMap = context.BACKUP;
            if (backupMap)
                restoreAll(backupMap, global);
        }
    }

    function emuEval(emuFeatures, jsFuck)
    {
        var result =
        emuDo
        (
            emuFeatures,
            function ()
            {
                return evalJSFuck(jsFuck);
            }
        );
        return result;
    }

    function evalJSFuck(jsFuck)
    {
        var body = 'return ' + String(jsFuck);
        var result = Function(body)();
        return result;
    }

    function fromCodePoint()
    {
        var codeUnits = [];
        Array.prototype.forEach.call
        (
            arguments,
            function (arg)
            {
                var codePoint = +arg;
                if ((codePoint & 0x1fffff) !== codePoint || codePoint > 0x10ffff)
                    throw new RangeError(codePoint + ' is not a valid code point');
                if (codePoint <= 0xffff)
                    codeUnits.push(codePoint);
                else
                {
                    var highSurrogate = (codePoint - 0x10000 >> 10) + 0xd800;
                    var lowSurrogate = (codePoint & 0x3ff) + 0xdc00;
                    codeUnits.push(highSurrogate, lowSurrogate);
                }
            }
        );
        var result = String.fromCharCode.apply(null, codeUnits);
        return result;
    }

    function makeEmuFeatureArrayPrototypeFunction(name, fn)
    {
        var setUp =
        function ()
        {
            fn.toString =
            function ()
            {
                var str = String(Array.prototype.join).replace(/\bjoin\b/, name);
                return str;
            };
            override(this, 'Array.prototype.' + name, { value: fn });
        };
        return setUp;
    }

    function makeEmuFeatureDocument(str, regExp)
    {
        var setUp =
        function ()
        {
            if (global.document)
            {
                if (regExp.test(document + ''))
                    return;
            }
            else
            {
                var createElement =
                function (tagName)
                {
                    var elementStr =
                    String(tagName).toLowerCase() === 'video' ?
                    '[object HTMLVideoElement]' : '[object HTMLUnknownElement]';
                    return elementStr;
                };
                override(this, 'document', { value: { createElement: createElement } });
            }
            var valueOf =
            function ()
            {
                return str;
            };
            override(this, 'document.valueOf', { value: valueOf });
        };
        return setUp;
    }

    function makeEmuFeatureEntries(str, regExp)
    {
        var setUp =
        function ()
        {
            if (Array.prototype.entries && regExp.test([].entries()))
                return;
            var arrayIteratorProto = this.arrayIteratorProto = { };
            var arrayIterator = Object.create(arrayIteratorProto);
            var entries =
            function ()
            {
                return arrayIterator;
            };
            override(this, 'Array.prototype.entries', { value: entries });
            var context = this;
            registerToStringAdapter
            (
                this,
                'Object',
                function ()
                {
                    if
                    (
                        this instanceof Object &&
                        Object.getPrototypeOf(this) === context.arrayIteratorProto
                    )
                        return str;
                }
            );
        };
        return setUp;
    }

    function makeEmuFeatureEscHtml(replacer, regExp)
    {
        var setUp =
        makeEmuFeatureHtml
        (
            ['anchor', 'fontcolor', 'fontsize', 'link'],
            function (method)
            {
                function adaptedMethod(value)
                {
                    var str = method.call(this, '');
                    value = replacer(String(value));
                    var index = str.lastIndexOf('"');
                    str = str.slice(0, index) + value + str.slice(index);
                    return str;
                }

                return adaptedMethod;
            },
            regExp
        );
        return setUp;
    }

    function makeEmuFeatureEscRegExp(char, escSeq)
    {
        var setUp =
        function ()
        {
            if ((RegExp(char) + '')[1] !== '\\')
            {
                var newRegExp =
                (function (oldRegExp)
                {
                    function RegExp(pattern, flags)
                    {
                        if (pattern !== undefined)
                            pattern = String(pattern).replace(charRegExp, escSeq);
                        var obj = oldRegExp(pattern, flags);
                        return obj;
                    }

                    var charRegExp = oldRegExp(char, 'g');
                    RegExp.prototype = oldRegExp.prototype;
                    return RegExp;
                }
                )(RegExp);
                override(this, 'RegExp.prototype.constructor', { value: newRegExp });
                override(this, 'RegExp', { value: newRegExp });
            }
        };
        return setUp;
    }

    function makeEmuFeatureFunctionLF(replacement)
    {
        var setUp =
        function ()
        {
            var context = this;
            registerToStringAdapter
            (
                this,
                'Function',
                function ()
                {
                    var str = context.Function.toString.call(this);
                    if (/function anonymous\(\n?\) {\s+}/.test(str))
                        return replacement;
                }
            );
        };
        return setUp;
    }

    function makeEmuFeatureHtml(methodNames, adapter, regExp)
    {
        var setUp =
        function ()
        {
            var prototype = String.prototype;
            methodNames.forEach
            (
                function (methodName)
                {
                    var method = prototype[methodName];
                    if (regExp && regExp.test(''[methodName]('"<>')))
                        return;
                    var adaptedMethod = adapter(method);
                    override(this, 'String.prototype.' + methodName, { value: adaptedMethod });
                },
                this
            );
        };
        return setUp;
    }

    function makeEmuFeatureNativeFunctionSource()
    {
        var args = Array.prototype.slice.call(arguments);
        var setUp =
        function ()
        {
            var nativeFunctionSourceInfos = this.nativeFunctionSourceInfos;
            if (nativeFunctionSourceInfos)
            {
                this.nativeFunctionSourceInfos =
                nativeFunctionSourceInfos.filter
                (
                    function (nativeFunctionSourceInfo)
                    {
                        var keep = args.indexOf(nativeFunctionSourceInfo) >= 0;
                        return keep;
                    }
                );
            }
            else
            {
                this.nativeFunctionSourceInfos = args;
                var context = this;
                var adapter =
                function ()
                {
                    var str = context.Function.toString.call(this);
                    var match = /^\n?(function \w+\(\) \{)\s+\[native code]\s+}\n?$/.exec(str);
                    if (match)
                    {
                        var nativeFunctionSourceInfo = context.nativeFunctionSourceInfos[0];
                        var body = nativeFunctionSourceInfo.body;
                        var delimiter = nativeFunctionSourceInfo.delimiter;
                        str = delimiter + match[1] + body + '}' + delimiter;
                        return str;
                    }
                };
                registerToStringAdapter(this, 'Function', adapter);
            }
        };
        return setUp;
    }

    function makeEmuFeatureSelf(str, regExp)
    {
        var setUp =
        function ()
        {
            if (global.self)
            {
                if (regExp.test(self + ''))
                    return;
            }
            else
                override(this, 'self', { value: { } });
            var valueOf =
            function ()
            {
                return str;
            };
            override(this, 'self.valueOf', { value: valueOf });
        };
        return setUp;
    }

    function override(context, path, descriptor)
    {
        var properties = context.BACKUP || (context.BACKUP = createBackupMap());
        var components = path.split('.');
        var name = components.pop();
        var obj =
        components.reduce
        (
            function (parent, childName)
            {
                var backupData = properties[childName] || (properties[childName] = { });
                properties =
                backupData.properties || (backupData.properties = createBackupMap());
                return parent[childName];
            },
            global
        );
        var backupData = properties[name] || (properties[name] = { });
        if (!('descriptor' in backupData))
        {
            var oldDescriptor = Object.getOwnPropertyDescriptor(obj, name);
            backupData.descriptor = oldDescriptor;
        }
        descriptor.configurable = true;
        Object.defineProperty(obj, name, descriptor);
    }

    function overrideToString(context, typeName)
    {
        var toString = global[typeName].prototype.toString;
        var adapters = [];
        context[typeName] = { adapters: adapters, toString: toString };
        var callToString =
        function (target)
        {
            var str;
            for (var index = adapters.length; index-- > 0;)
            {
                var adapter = adapters[index];
                str = adapter.call(target);
                if (str !== undefined)
                    return str;
            }
            str = toString.call(target);
            return str;
        };
        var value =
        function ()
        {
            var str = callToString(this);
            return str;
        };
        // The Internet Explorer 9 implementation of the call method sets the global object as this
        // when no arguments are specified.
        value.call = callToString;
        override(context, typeName + '.prototype.toString', { value: value });
    }

    function registerToStringAdapter(context, typeName, adapter)
    {
        if (!context[typeName])
            overrideToString(context, typeName);
        context[typeName].adapters.push(adapter);
    }

    function replaceArrowFunctions(expr)
    {
        expr =
        expr.replace
        (
            ARROW_REGEXP,
            function (match, capture1, capture2)
            {
                var replacement1 = /^\(.*\)$/.test(capture1) ? capture1 : '(' + capture1 + ')';
                var innerExpr = replaceArrowFunctions(capture2);
                var replacement2 =
                /^\{[\s\S]*\}$/.test(capture2) ? innerExpr : '{return(' + innerExpr + ')}';
                var replacement = '(function' + replacement1 + replacement2 + ')';
                return replacement;
            }
        );
        return expr;
    }

    function restoreAll(properties, obj)
    {
        for (var name in properties)
        {
            var backupData = properties[name];
            var subProperties = backupData.properties;
            if (subProperties)
                restoreAll(subProperties, obj[name]);
            if ('descriptor' in backupData)
            {
                var descriptor = backupData.descriptor;
                if (descriptor)
                    Object.defineProperty(obj, name, descriptor);
                else
                    delete obj[name];
            }
        }
    }

    var ARROW_REGEXP =
    /(\([^(]*\)|[\w$]+)=>(\{.*?\}|(?:\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)|[^,()])*)/g;

    var NATIVE_FUNCTION_SOURCE_INFO_FF = { body: '\n    [native code]\n',    delimiter: ''   };
    var NATIVE_FUNCTION_SOURCE_INFO_IE = { body: '\n    [native code]\n',    delimiter: '\n' };
    var NATIVE_FUNCTION_SOURCE_INFO_V8 = { body: ' [native code] ',          delimiter: ''   };

    var EMU_FEATURE_INFOS =
    {
        ANY_DOCUMENT: makeEmuFeatureDocument('[object Document]', /^\[object .*Document]$/),
        ANY_WINDOW: makeEmuFeatureSelf('[object Window]', /^\[object .*Window]$/),
        ARRAY_ITERATOR: makeEmuFeatureEntries('[object Array Iterator]', /^\[object Array.{8,9}]$/),
        ARROW:
        function ()
        {
            var newFunction =
            (function (oldFunction)
            {
                function Function()
                {
                    var lastArgIndex = arguments.length - 1;
                    if (lastArgIndex >= 0)
                        arguments[lastArgIndex] = fixBody(arguments[lastArgIndex]);
                    var fnObj = oldFunction.apply(null, arguments);
                    return fnObj;
                }

                function fixBody(body)
                {
                    if (typeof body === 'string')
                        body = replaceArrowFunctions(body);
                    return body;
                }

                Function.prototype = oldFunction.prototype;
                return Function;
            }
            )(Function);
            override(this, 'Function.prototype.constructor', { value: newFunction });
            override(this, 'Function', { value: newFunction });
        },
        ATOB:
        function ()
        {
            var BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            function btoa(input)
            {
                var output = '';
                input = String(input);
                for (var index = 0; index < input.length;)
                {
                    var chr1 = input.charCodeAt(index++);
                    var enc1 = chr1 >> 2;
                    var chr2 = input.charCodeAt(index++);
                    var enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                    var enc3;
                    var enc4;
                    if (isNaN(chr2))
                        enc3 = enc4 = 64;
                    else
                    {
                        var chr3 = input.charCodeAt(index++);
                        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                        if (isNaN(chr3))
                            enc4 = 64;
                        else
                            enc4 = chr3 & 63;
                    }
                    output +=
                    BASE64_CHARS.charAt(enc1) + BASE64_CHARS.charAt(enc2) +
                    BASE64_CHARS.charAt(enc3) + BASE64_CHARS.charAt(enc4);
                }
                return output;
            }

            function atob(input)
            {
                var output = '';
                input = String(input);
                for (var index = 0; index < input.length;)
                {
                    var enc1 = BASE64_CHARS.indexOf(input.charAt(index++));
                    var enc2 = BASE64_CHARS.indexOf(input.charAt(index++));
                    var chr1 = enc1 << 2 | enc2 >> 4;
                    output += String.fromCharCode(chr1);
                    var pos3 = input.charAt(index++);
                    var enc3 = BASE64_CHARS.indexOf(pos3);
                    if (!pos3 || enc3 === 64)
                        break;
                    var chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                    output += String.fromCharCode(chr2);
                    var pos4 = input.charAt(index++);
                    var enc4 = BASE64_CHARS.indexOf(pos4);
                    if (!pos4 || enc4 === 64)
                        break;
                    var chr3 = (enc3 & 3) << 6 | enc4;
                    output += String.fromCharCode(chr3);
                }
                return output;
            }

            override(this, 'atob', { value: atob });
            override(this, 'btoa', { value: btoa });
        },
        BARPROP:
        function ()
        {
            var toString =
            function ()
            {
                return '[object BarProp]';
            };
            // In Android Browser versions prior to 4.4, Object.defineProperty doesn't replace
            // the statusbar correctly despite the configurable attribute set.
            // As a workaround, we'll simply set a custom toString function.
            if (global.statusbar)
                override(this, 'statusbar.toString', { value: toString });
            else
                override(this, 'statusbar', { value: { toString: toString } });
        },
        CAPITAL_HTML: makeEmuFeatureHtml
        (
            [
                'anchor',
                'big',
                'blink',
                'bold',
                'fixed',
                'fontcolor',
                'fontsize',
                'italics',
                'link',
                'small',
                'strike',
                'sub',
                'sup',
            ],
            function (method)
            {
                function adaptedMethod()
                {
                    var str =
                    method.apply(this, arguments).replace
                    (
                        /^<[\w ]+|[\w ]+>$/g,
                        function (match)
                        {
                            return match.toUpperCase();
                        }
                    );
                    return str;
                }

                return adaptedMethod;
            }
        ),
        CONSOLE:
        function ()
        {
            // Workaround for Internet Explorer 9...
            var console = global.console;
            if (!console || !Object.getPrototypeOf(console))
                override(this, 'console', { value: Object.create(console || null) });
            // ...end of the workaround.
            var toString =
            function ()
            {
                return '[object Console]';
            };
            override(this, 'console.toString', { value: toString });
        },
        DOCUMENT: makeEmuFeatureDocument('[object Document]', /^\[object Document]$/),
        DOMWINDOW: makeEmuFeatureSelf('[object DOMWindow]', /^\[object DOMWindow]$/),
        ESC_HTML_ALL:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return str;
            },
            /&quot;&lt;&gt;/
        ),
        ESC_HTML_QUOT:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;');
                return str;
            },
            /&quot;/
        ),
        ESC_HTML_QUOT_ONLY:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;');
                return str;
            },
            /&quot;<>/
        ),
        ESC_REGEXP_LF: makeEmuFeatureEscRegExp('\n', '\\n'),
        ESC_REGEXP_SLASH: makeEmuFeatureEscRegExp('/', '\\/'),
        EXTERNAL:
        function ()
        {
            var toString =
            function ()
            {
                return '[object External]';
            };
            override(this, 'sidebar', { value: { toString: toString } });
        },
        FF_SRC: makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_FF),
        FILL: makeEmuFeatureArrayPrototypeFunction('fill', Function()),
        FLAT:
        makeEmuFeatureArrayPrototypeFunction
        (
            'flat',
            function ()
            {
                var array = [];
                Array.prototype.forEach.call
                (
                    this,
                    function (element)
                    {
                        array = array.concat(element);
                    }
                );
                return array;
            }
        ),
        FROM_CODE_POINT:
        function ()
        {
            override(this, 'String.fromCodePoint', { value: fromCodePoint });
        },
        FUNCTION_19_LF: makeEmuFeatureFunctionLF('function anonymous(\n) {\n\n}'),
        FUNCTION_22_LF: makeEmuFeatureFunctionLF('function anonymous() {\n\n}'),
        GMT:
        function ()
        {
            var Date =
            function ()
            {
                return 'Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)';
            };
            override(this, 'Date', { value: Date });
        },
        HISTORY:
        function ()
        {
            var toString =
            function ()
            {
                return '[object History]';
            };
            override(this, 'history', { value: { toString: toString } });
        },
        HTMLAUDIOELEMENT:
        function ()
        {
            if (!global.Audio)
                override(this, 'Audio', { value: { } });
            var toString =
            function ()
            {
                return 'function HTMLAudioElement';
            };
            override(this, 'Audio.toString', { value: toString });
        },
        HTMLDOCUMENT: makeEmuFeatureDocument('[object HTMLDocument]', /^\[object HTMLDocument]$/),
        IE_SRC: makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_IE),
        INTL:
        function ()
        {
            override(this, 'Intl', { value: { } });
        },
        LOCALE_INFINITY:
        function ()
        {
            var toLocaleString = Number.prototype.toLocaleString;
            var value =
            function ()
            {
                var result;
                switch (+this) // In Internet Explorer 9, +this is different from this.
                {
                case Infinity:
                    result = '∞';
                    break;
                case -Infinity:
                    result = '-∞';
                    break;
                default:
                    result = toLocaleString.apply(this, arguments);
                    break;
                }
                return result;
            };
            override(this, 'Number.prototype.toLocaleString', { value: value });
        },
        NAME:
        function ()
        {
            var get =
            function ()
            {
                var result = /^\s*function ([\w$]+)/.exec(this)[1];
                return result;
            };
            override(this, 'Function.prototype.name', { get: get });
        },
        NODECONSTRUCTOR:
        function ()
        {
            if (!global.Node)
                override(this, 'Node', { value: { } });
            var toString =
            function ()
            {
                return '[object NodeConstructor]';
            };
            override(this, 'Node.toString', { value: toString });
        },
        NO_FF_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_IE, NATIVE_FUNCTION_SOURCE_INFO_V8),
        NO_IE_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_FF, NATIVE_FUNCTION_SOURCE_INFO_V8),
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        makeEmuFeatureEntries('[object Array Iterator]', /^\[object Array Iterator]$/),
        NO_V8_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_FF, NATIVE_FUNCTION_SOURCE_INFO_IE),
        SELF_OBJ: makeEmuFeatureSelf('[object Object]', /^\[object /),
        STATUS:
        function ()
        {
            override(this, 'status', { value: '' });
        },
        UNDEFINED:
        function ()
        {
            registerToStringAdapter
            (
                this,
                'Object',
                function ()
                {
                    if (this === undefined)
                        return '[object Undefined]';
                }
            );
        },
        V8_SRC: makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_V8),
        WINDOW: makeEmuFeatureSelf('[object Window]', /^\[object Window]$/),
    };

    var EMU_FEATURES =
    Object.keys(EMU_FEATURE_INFOS).filter
    (
        function (featureName)
        {
            var condition = EMU_FEATURE_INFOS[featureName].condition;
            var result = !condition || condition();
            return result;
        }
    );

    var exports =
    {
        EMU_FEATURES:   EMU_FEATURES,
        emuDo:          emuDo,
        emuEval:        emuEval,
        evalJSFuck:     evalJSFuck,
    };

    Object.keys(exports).forEach
    (
        function (name)
        {
            global[name] = exports[name];
        }
    );
}
)(typeof self === 'undefined' ? global : self);
