/* global Audio, Node, console, document, history, require, self, statusbar */

import Mask, { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskUnion, maskWithBit }
from './mask';
import
{
    _Array_isArray,
    _Array_prototype_every,
    _Array_prototype_forEach,
    _Array_prototype_push,
    _Error,
    _JSON_stringify,
    _Object_create,
    _Object_defineProperty,
    _Object_freeze,
    _Object_keys,
    assignNoEnum,
    createEmpty,
    esToString,
}
from './obj-utils';

declare global
{
    interface Array<T> { flat(): unknown; }

    const sidebar: unknown;
    const uneval: unknown;
}

interface Feature
{
    readonly attributes:        { [key: string]: unknown; };
    readonly mask:              Mask;
    readonly name?:             string;
    readonly canonicalNames:    string[];
}

type FeatureElement = Feature | string;

export function featuresToMask(featureObjs: readonly Feature[]): Mask
{
    let mask = maskNew();
    featureObjs.forEach
    (
        (featureObj: Feature): void =>
        {
            mask = maskUnion(mask, featureObj.mask);
        },
    );
    return mask;
}

export let Feature: { readonly prototype: Feature; new (): Feature; (): Feature; };

export let featureFromMask: (mask: Mask) => Feature;
export let isMaskCompatible: (mask: Mask) => boolean;
export let validMaskFromArrayOrStringOrFeature:
(arg: FeatureElement | readonly FeatureElement[]) => Mask;

((): void =>
{
    interface PredefinedFeature extends Feature { name: string; }

    type FeatureInfo =
    ({ readonly description: string; } | { readonly engine: string; })
    &
    {
        readonly check?:        () => unknown;
        readonly includes?:     string[];
        readonly excludes?:     string[];
        readonly attributes?:   { [key: string]: unknown; };
    };

    function areCompatible(): boolean
    {
        let arg0;
        const features =
        arguments.length === 1 && _Array_isArray(arg0 = (arguments as any)['0']) ? arg0 : arguments;
        let compatible;
        if (features.length > 1)
        {
            const mask = featureArrayLikeToMask(features);
            compatible = isMaskCompatible(mask);
        }
        else
            compatible = true;
        return compatible;
    }

    function areEqual(): boolean
    {
        let mask: Mask;
        const equal =
        _Array_prototype_every.call
        (
            arguments,
            (arg: FeatureElement | readonly FeatureElement[], index): boolean =>
            {
                let returnValue;
                const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                if (index)
                    returnValue = maskAreEqual(otherMask, mask);
                else
                {
                    mask = otherMask;
                    returnValue = true;
                }
                return returnValue;
            },
        );
        return equal;
    }

    function checkSelfFeature(this: (str: string) => unknown): unknown
    {
        // ('' + self) throws an error inside a web worker in Safari 8 and 9.
        let str;
        try
        {
            str = `${self}`;
        }
        catch
        {
            return false;
        }
        const available = this(str);
        return available;
    }

    function commonOf(): Feature | null
    {
        let returnValue: Feature | null;
        if (arguments.length)
        {
            let mask: undefined | Mask;
            _Array_prototype_forEach.call
            (
                arguments,
                (arg: FeatureElement | readonly FeatureElement[]): void =>
                {
                    const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    if (mask != null)
                        mask = maskIntersection(mask, otherMask);
                    else
                        mask = otherMask;
                },
            );
            returnValue = featureFromMask(mask as Mask);
        }
        else
            returnValue = null;
        return returnValue;
    }

    function completeExclusions(name: string): void
    {
        const info: any = FEATURE_INFOS[name];
        const { excludes } = info;
        if (excludes)
        {
            const featureObj = ALL[name];
            const { mask } = featureObj;
            excludes.forEach
            (
                (exclude: string): void =>
                {
                    const excludeMask = completeFeature(exclude);
                    const incompatibleMask = maskUnion(mask, excludeMask);
                    incompatibleMaskMap[incompatibleMask as any] = incompatibleMask;
                },
            );
        }
    }

    function completeFeature(name: string): Mask
    {
        let mask: Mask;
        let featureObj = ALL[name];
        if (featureObj)
            ({ mask } = featureObj);
        else
        {
            const info: any = FEATURE_INFOS[name];
            if (typeof info === 'string')
            {
                mask = completeFeature(info);
                featureObj = ALL[info];
            }
            else
            {
                let { check } = info;
                if (check)
                {
                    mask = maskWithBit(bitIndex++);
                    if (check())
                        autoMask = maskUnion(autoMask, mask);
                    check = wrapCheck(check);
                }
                else
                    mask = maskNew();
                const includes: string[] = includesMap[name] = info.includes || [];
                includes.forEach
                (
                    (include: string): void =>
                    {
                        const includeMask = completeFeature(include);
                        mask = maskUnion(mask, includeMask);
                    },
                );
                let description;
                const { engine } = info;
                if (engine == null)
                    ({ description } = info);
                else
                    description = createEngineFeatureDescription(engine);
                const elementary = check || info.excludes;
                featureObj =
                createFeature(name, description, mask, check, engine, info.attributes, elementary);
                if (elementary)
                    ELEMENTARY.push(featureObj);
            }
            registerFeature(name, featureObj);
        }
        return mask;
    }

    function createEngineFeatureDescription(engine: string): string
    {
        const description = `Features available in ${engine}.`;
        return description;
    }

    function createFeature
    (
        name:           string,
        description:    string,
        mask:           Mask,
        check?:         () => boolean,
        engine?:        string,
        attributes?:    object,
        elementary?:    boolean,
    ):
    Feature
    {
        attributes = _Object_freeze(attributes || { });
        const descriptors: PropertyDescriptorMap =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            description:    { value: description },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        const featureObj = _Object_create(featurePrototype, descriptors);
        initMask(featureObj, mask);
        return featureObj;
    }

    function featureArrayLikeToMask(arrayLike: ArrayLike<FeatureElement>): Mask
    {
        let mask = maskNew();
        _Array_prototype_forEach.call
        (
            arrayLike,
            (feature: FeatureElement): void =>
            {
                const otherMask = maskFromStringOrFeature(feature);
                mask = maskUnion(mask, otherMask);
            },
        );
        return mask;
    }

    function initMask(featureObj: Feature, mask: Mask): void
    {
        _Object_defineProperty(featureObj, 'mask', { value: _Object_freeze(mask) });
    }

    /**
     * Node.js custom inspection function.
     * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
     * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
     *
     * @function inspect
     *
     * @see
     * {@link https://tiny.cc/j4wz9y|Custom inspection functions on Objects} for further
     * information.
     */
    function inspect(this: Feature, depth: never, opts: any): unknown
    {
        let returnValue;
        const str = this.toString();
        if (opts !== undefined) // opts can be undefined in Node.js 0.10.0.
            returnValue = opts.stylize(str, 'jscrewit-feature');
        else
            returnValue = str;
        return returnValue;
    }

    function isExcludingAttribute
    (attributeCache: { [key: string]: boolean; }, attributeName: string, featureObjs: Feature[]):
    boolean
    {
        let returnValue = attributeCache[attributeName];
        if (returnValue === undefined)
        {
            attributeCache[attributeName] =
            returnValue =
            featureObjs.some
            ((featureObj: Feature): boolean => attributeName in featureObj.attributes);
        }
        return returnValue;
    }

    function maskFromStringOrFeature(arg: FeatureElement): Mask
    {
        let mask;
        if (arg instanceof Feature)
            ({ mask } = arg);
        else
        {
            const name = esToString(arg);
            const featureObj = ALL[name];
            if (!featureObj)
                throw new _Error(`Unknown feature ${_JSON_stringify(name)}`);
            ({ mask } = featureObj);
        }
        return mask;
    }

    function registerFeature(name: string, featureObj: Feature): void
    {
        const descriptor = { enumerable: true, value: featureObj };
        _Object_defineProperty(Feature, name, descriptor);
        ALL[name] = featureObj;
    }

    function validateMask(mask: Mask): void
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    function validMaskFromArguments
    (args: ArrayLike<FeatureElement | readonly FeatureElement[]>): Mask
    {
        let mask = maskNew();
        let validationNeeded = 0;
        _Array_prototype_forEach.call
        (
            args,
            (arg: FeatureElement | readonly FeatureElement[]): void =>
            {
                let otherMask;
                if (_Array_isArray(arg))
                {
                    otherMask = featureArrayLikeToMask(arg);
                    validationNeeded |= arg.length > 1 as any;
                }
                else
                    otherMask = maskFromStringOrFeature(arg as FeatureElement);
                mask = maskUnion(mask, otherMask);
            },
        );
        validationNeeded |= args.length > 1 as any;
        if (validationNeeded)
            validateMask(mask);
        return mask;
    }

    function wrapCheck(check: () => unknown): () => boolean
    {
        const returnValue = (): boolean => !!check();
        return returnValue;
    }

    const ALL = createEmpty();
    const ELEMENTARY: PredefinedFeature[] = [];

    const FEATURE_INFOS: { [key: string]: FeatureInfo | string; } =
    {
        ANY_DOCUMENT:
        {
            description:
            'Existence of the global object document whose string representation starts with ' +
            '"[object " and ends with "Document]".',
            check:
            (): unknown =>
            typeof document === 'object' && /^\[object .*Document]$/.test(`${document}`),
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ANY_WINDOW:
        {
            description:
            'Existence of the global object self whose string representation starts with ' +
            '"[object " and ends with "Window]".',
            check:
            checkSelfFeature.bind((str: string): unknown => /^\[object .*Window]$/.test(str)),
            includes: ['SELF_OBJ'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ARRAY_ITERATOR:
        {
            description:
            'The property that the string representation of Array.prototype.entries() starts ' +
            'with "[object Array" and ends with "]" at index 21 or 22.',
            check:
            (): unknown =>
            Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries() as any),
        },
        ARROW:
        {
            description: 'Support for arrow functions.',
            check:
            (): unknown =>
            {
                try
                {
                    Function('()=>{}')();
                    return true;
                }
                catch
                { }
            },
        },
        ATOB:
        {
            description: 'Existence of the global functions atob and btoa.',
            check: (): unknown => typeof atob === 'function' && typeof btoa === 'function',
            attributes: { 'web-worker': 'no-atob-in-web-worker' },
        },
        BARPROP:
        {
            description:
            'Existence of the global object statusbar having the string representation "[object ' +
            'BarProp]".',
            check: (): unknown =>
            typeof statusbar === 'object' && `${statusbar}` === '[object BarProp]',
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        CAPITAL_HTML:
        {
            description:
            'The property that the various string methods returning HTML code such as ' +
            'String.prototype.big or String.prototype.link have both the tag name and attributes ' +
            'written in capital letters.',
            check:
            (): unknown =>
            ''.big()            === '<BIG></BIG>'               &&
            ''.fontcolor('')    === '<FONT COLOR=""></FONT>'    &&
            ''.fontsize('')     === '<FONT SIZE=""></FONT>'     &&
            ''.link('')         === '<A HREF=""></A>'           &&
            ''.small()          === '<SMALL></SMALL>'           &&
            ''.strike()         === '<STRIKE></STRIKE>'         &&
            ''.sub()            === '<SUB></SUB>'               &&
            ''.sup()            === '<SUP></SUP>',
        },
        CONSOLE:
        {
            description:
            'Existence of the global object console having the string representation "[object ' +
            'Console]".\n' +
            'This feature may become unavailable when certain browser extensions are active.',
            check: (): unknown =>
            typeof console === 'object' && `${console}` === '[object Console]',
            attributes: { 'web-worker': 'no-console-in-web-worker' },
        },
        DOCUMENT:
        {
            description:
            'Existence of the global object document having the string representation "[object ' +
            'Document]".',
            check: (): unknown =>
            typeof document === 'object' && `${document}` === '[object Document]',
            includes: ['ANY_DOCUMENT'],
            excludes: ['HTMLDOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        DOMWINDOW:
        {
            description:
            'Existence of the global object self having the string representation "[object ' +
            'DOMWindow]".',
            check: checkSelfFeature.bind((str: string): unknown => str === '[object DOMWindow]'),
            includes: ['ANY_WINDOW'],
            excludes: ['WINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ESC_HTML_ALL:
        {
            description:
            'The property that double quotation mark, less than and greater than characters in ' +
            'the argument of String.prototype.fontcolor are escaped into their respective HTML ' +
            'entities.',
            check: (): unknown => ~''.fontcolor('"<>').indexOf('&quot;&lt;&gt;'),
            includes: ['ESC_HTML_QUOT'],
            excludes: ['ESC_HTML_QUOT_ONLY'],
        },
        ESC_HTML_QUOT:
        {
            description:
            'The property that double quotation marks in the argument of ' +
            'String.prototype.fontcolor are escaped as "&quot;".',
            check: (): unknown => ~''.fontcolor('"').indexOf('&quot;'),
        },
        ESC_HTML_QUOT_ONLY:
        {
            description:
            'The property that only double quotation marks and no other characters in the ' +
            'argument of String.prototype.fontcolor are escaped into HTML entities.',
            check: (): unknown => ~''.fontcolor('"<>').indexOf('&quot;<>'),
            includes: ['ESC_HTML_QUOT'],
            excludes: ['ESC_HTML_ALL'],
        },
        ESC_REGEXP_LF:
        {
            description:
            'Having regular expressions created with the RegExp constructor use escape sequences ' +
            'starting with a backslash to format line feed characters ("\\n") in their string ' +
            'representation.',
            check: (): unknown => `${RegExp('\n')}`[1] === '\\',
        },
        ESC_REGEXP_SLASH:
        {
            description:
            'Having regular expressions created with the RegExp constructor use escape sequences ' +
            'starting with a backslash to format slashes ("/") in their string representation.',
            check: (): unknown => `${RegExp('/')}`[1] === '\\',
        },
        EXTERNAL:
        {
            description:
            'Existence of the global object sidebar having the string representation "[object ' +
            'External]".',
            check:
            (): unknown => typeof sidebar === 'object' && `${sidebar}` === '[object External]',
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        FF_SRC:
        {
            description:
            'A string representation of native functions typical for Firefox and Safari.\n' +
            'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
            'end of the string and the presence of a line feed followed by four whitespaces ' +
            '("\\n    ") before the "[native code]" sequence.',
            includes: ['NO_IE_SRC', 'NO_V8_SRC'],
            excludes: ['NO_FF_SRC'],
        },
        FILL:
        {
            description: 'Existence of the native function Array.prototype.fill.',
            check: (): unknown => Array.prototype.fill,
        },
        FLAT:
        {
            description: 'Existence of the native function Array.prototype.flat.',
            check: (): unknown => Array.prototype.flat,
        },
        FROM_CODE_POINT:
        {
            description: 'Existence of the function String.fromCodePoint.',
            check: (): unknown => String.fromCodePoint,
        },
        FUNCTION_19_LF:
        {
            description:
            'A string representation of dynamically generated functions where the character at ' +
            'index 19 is a line feed ("\\n").',
            check: (): unknown => `${Function()}`[19] === '\n',
        },
        FUNCTION_22_LF:
        {
            description:
            'A string representation of dynamically generated functions where the character at ' +
            'index 22 is a line feed ("\\n").',
            check: (): unknown => `${Function()}`[22] === '\n',
        },
        GMT:
        {
            description:
            'Presence of the text "GMT" after the first 25 characters in the string returned by ' +
            'Date().\n' +
            'The string representation of dates is implementation dependent, but most engines ' +
            'use a similar format, making this feature available in all supported engines except ' +
            'Internet Explorer 9 and 10.',
            check: (): unknown => /^.{25}GMT/.test(Date()),
        },
        HISTORY:
        {
            description:
            'Existence of the global object history having the string representation "[object ' +
            'History]".',
            check:
            (): unknown => typeof history === 'object' && `${history}` === '[object History]',
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        HTMLAUDIOELEMENT:
        {
            description:
            'Existence of the global object Audio whose string representation starts with ' +
            '"function HTMLAudioElement".',
            check:
            (): unknown =>
            typeof Audio !== 'undefined' && /^function HTMLAudioElement/.test(Audio as any),
            includes: ['NO_IE_SRC'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        HTMLDOCUMENT:
        {
            description:
            'Existence of the global object document having the string representation "[object ' +
            'HTMLDocument]".',
            check:
            (): unknown =>
            typeof document === 'object' && `${document}` === '[object HTMLDocument]',
            includes: ['ANY_DOCUMENT'],
            excludes: ['DOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        IE_SRC:
        {
            description:
            'A string representation of native functions typical for Internet Explorer.\n' +
            'Remarkable traits are the presence of a line feed character ("\\n") at the ' +
            'beginning and at the end of the string and a line feed followed by four whitespaces ' +
            '("\\n    ") before the "[native code]" sequence.',
            includes: ['NO_FF_SRC', 'NO_V8_SRC'],
            excludes: ['NO_IE_SRC'],
        },
        INCR_CHAR:
        {
            description:
            'The ability to use unary increment operators with string characters, like in ( ' +
            '++"some string"[0] ): this will result in a TypeError in strict mode in ECMAScript ' +
            'compliant engines.',
            check: (): unknown => true,
            attributes: { 'forced-strict-mode': 'char-increment-restriction' },
        },
        INTL:
        {
            description: 'Existence of the global object Intl.',
            check: (): unknown => typeof Intl === 'object',
        },
        LOCALE_INFINITY:
        {
            description: 'Language sensitive string representation of Infinity as "∞".',
            check: (): unknown => Infinity.toLocaleString() === '∞',
        },
        NAME:
        {
            description: 'Existence of the name property for functions.',
            check: (): unknown => 'name' in Function(),
        },
        NODECONSTRUCTOR:
        {
            description:
            'Existence of the global object Node having the string representation "[object ' +
            'NodeConstructor]".',
            check:
            (): unknown => typeof Node !== 'undefined' && `${Node}` === '[object NodeConstructor]',
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        NO_FF_SRC:
        {
            description:
            'A string representation of native functions typical for V8 and Edge or for Internet ' +
            'Explorer but not for Firefox and Safari.',
            check:
            (): unknown => /^(\n?)function Object\(\) \{\1 +\[native code]\s\}/.test(Object as any),
            excludes: ['FF_SRC'],
        },
        NO_IE_SRC:
        {
            description:
            'A string representation of native functions typical for most engines with the ' +
            'notable exception of Internet Explorer.\n' +
            'A remarkable trait of this feature is the lack of line feed characters at the ' +
            'beginning and at the end of the string.',
            check:
            (): unknown => /^function Object\(\) \{(\n   )? \[native code]\s\}/.test(Object as any),
            excludes: ['IE_SRC'],
        },
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        {
            description:
            'The property that the string representation of Array.prototype.entries() evaluates ' +
            'to "[object Array Iterator]".',
            check:
            (): unknown =>
            Array.prototype.entries && `${[].entries()}` === '[object Array Iterator]',
            includes: ['ARRAY_ITERATOR'],
        },
        NO_V8_SRC:
        {
            description:
            'A string representation of native functions typical for Firefox, Internet Explorer ' +
            'and Safari.\n' +
            'A most remarkable trait of this feature is the presence of a line feed followed by ' +
            'four whitespaces ("\\n    ") before the "[native code]" sequence.',
            check:
            (): unknown => /^\n?function Object\(\) \{\n    \[native code]\s\}/.test(Object as any),
            excludes: ['V8_SRC'],
        },
        SELF: 'ANY_WINDOW',
        SELF_OBJ:
        {
            description:
            'Existence of the global object self whose string representation starts with ' +
            '"[object ".',
            check: checkSelfFeature.bind((str: string): unknown => /^\[object /.test(str)),
            attributes: { 'web-worker': 'safari-bug-21820506' },
        },
        STATUS:
        {
            description: 'Existence of the global string status.',
            check: (): unknown => typeof status === 'string',
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        UNDEFINED:
        {
            description:
            'The property that Object.prototype.toString.call() evaluates to "[object ' +
            'Undefined]".\n' +
            'This behavior is specified by ECMAScript, and is enforced by all engines except ' +
            'Android Browser versions prior to 4.1.2, where this feature is not available.',
            check:
            (): unknown =>
            {
                const toString = Object.prototype.toString as { } as { call(): unknown; };
                const available = toString.call() === '[object Undefined]';
                return available;
            },
        },
        UNEVAL:
        {
            description: 'Existence of the global function uneval.',
            check: (): unknown => typeof uneval !== 'undefined',
        },
        V8_SRC:
        {
            description:
            'A string representation of native functions typical for the V8 engine, but also ' +
            'found in Edge.\n' +
            'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
            'end of the string and the presence of a single whitespace before the "[native ' +
            'code]" sequence.',
            includes: ['NO_FF_SRC', 'NO_IE_SRC'],
            excludes: ['NO_V8_SRC'],
        },
        WINDOW:
        {
            description:
            'Existence of the global object self having the string representation "[object ' +
            'Window]".',
            check: checkSelfFeature.bind((str: string): unknown => str === '[object Window]'),
            includes: ['ANY_WINDOW'],
            excludes: ['DOMWINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },

        DEFAULT:
        {
            description:
            'Minimum feature level, compatible with all supported engines in all environments.',
        },
        BROWSER:
        {
            description:
            'Features available in all browsers.\n' +
            'No support for Node.js.',
            includes: ['ANY_DOCUMENT', 'ANY_WINDOW', 'HISTORY', 'INCR_CHAR', 'STATUS'],
            attributes:
            {
                'char-increment-restriction': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
        },
        COMPACT:
        {
            description:
            'All new browsers\' features.\n' +
            'No support for Node.js and older browsers like Internet Explorer, Safari 9 or ' +
            'Android Browser.',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        ANDRO_4_0:
        {
            engine: 'Android Browser 4.0',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'STATUS',
                'V8_SRC',
            ],
        },
        ANDRO_4_1:
        {
            engine: 'Android Browser 4.1 to 4.3',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        ANDRO_4_4:
        {
            engine: 'Android Browser 4.4',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null },
        },
        CHROME_PREV: 'CHROME_73',
        CHROME: 'CHROME_73',
        CHROME_73:
        {
            engine: 'Chrome 73 and Opera 60 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        EDGE: 'EDGE_40',
        EDGE_PREV: 'EDGE_40',
        EDGE_40:
        {
            engine: 'Edge 40 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        FF_ESR: 'FF_54',
        FF_54:
        {
            engine: 'Firefox 54 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'EXTERNAL',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'UNEVAL',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        FF: 'FF_62',
        FF_62:
        {
            engine: 'Firefox 62 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'EXTERNAL',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'UNEVAL',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_9:
        {
            engine: 'Internet Explorer 9',
            includes:
            [
                'CAPITAL_HTML',
                'DOCUMENT',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
        },
        IE_10:
        {
            engine: 'Internet Explorer 10',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'DOCUMENT',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_11:
        {
            engine: 'Internet Explorer 11',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_11_WIN_10:
        {
            engine: 'Internet Explorer 11 on Windows 10',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        NODE_0_10:
        {
            engine: 'Node.js 0.10',
            includes:
            [
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'NAME',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_0_12:
        {
            engine: 'Node.js 0.12',
            includes:
            [
                'ESC_HTML_QUOT_ONLY',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_4:
        {
            engine: 'Node.js 4',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_5:
        {
            engine: 'Node.js 5 to 9',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_10:
        {
            engine: 'Node.js 10',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_11:
        {
            engine: 'Node.js 11',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_12:
        {
            engine: 'Node.js 12 or later',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        SAFARI_7_0:
        {
            engine: 'Safari 7.0',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'no-console-in-web-worker': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_7_1:
        {
            engine: 'Safari 7.1 and Safari 8',
            includes:
            [
                'ARRAY_ITERATOR',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_8: 'SAFARI_7_1',
        SAFARI_9:
        {
            engine: 'Safari 9',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_10:
        {
            engine: 'Safari 10 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI: 'SAFARI_12',
        SAFARI_12:
        {
            engine: 'Safari 12 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
    };

    Feature =
    function (this: unknown): Feature
    {
        const mask = validMaskFromArguments(arguments);
        const featureObj = this instanceof Feature ? this : _Object_create(featurePrototype);
        initMask(featureObj, mask);
        return featureObj;
    } as typeof Feature;

    const constructorSource = { ALL, ELEMENTARY, areCompatible, areEqual, commonOf };

    assignNoEnum(Feature, constructorSource);

    const featurePrototype = Feature.prototype;

    const protoSource =
    {
        get canonicalNames(this: Feature): string[]
        {
            const { mask } = this;
            const featureNameSet: { [key: string]: null; } = createEmpty();
            const allIncludes: string[] = [];
            ELEMENTARY.forEach
            (
                (featureObj: PredefinedFeature): void =>
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                    {
                        const { name } = featureObj;
                        featureNameSet[name] = null;
                        const includes = includesMap[name];
                        _Array_prototype_push.apply(allIncludes, includes);
                    }
                },
            );
            allIncludes.forEach
            (
                (name: string): void =>
                {
                    delete featureNameSet[name];
                },
            );
            const names = _Object_keys(featureNameSet).sort();
            return names;
        },

        description: undefined,

        elementary: false,

        get elementaryNames(this: Feature): string[]
        {
            const names: string[] = [];
            const { mask } = this;
            ELEMENTARY.forEach
            (
                (featureObj: PredefinedFeature): void =>
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                        names.push(featureObj.name);
                },
            );
            return names;
        },

        includes(this: Feature): boolean
        {
            const { mask } = this;
            const included =
            _Array_prototype_every.call
            (
                arguments,
                (arg: FeatureElement | readonly FeatureElement[]): boolean =>
                {
                    const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    const returnValue = maskIncludes(mask, otherMask);
                    return returnValue;
                },
            );
            return included;
        },

        inspect,

        name: undefined,

        restrict
        (
            this: Feature,
            environment: 'forced-strict-mode' | 'web-worker',
            engineFeatureObjs: Feature[],
        ):
        Feature
        {
            let resultMask = maskNew();
            const thisMask = this.mask;
            const attributeCache = createEmpty();
            ELEMENTARY.forEach
            (
                (featureObj: PredefinedFeature): void =>
                {
                    const otherMask = featureObj.mask;
                    const included = maskIncludes(thisMask, otherMask);
                    if (included)
                    {
                        const attributeValue =
                        featureObj.attributes[environment] as string | undefined;
                        if
                        (
                            attributeValue === undefined ||
                            engineFeatureObjs !== undefined &&
                            !isExcludingAttribute(attributeCache, attributeValue, engineFeatureObjs)
                        )
                            resultMask = maskUnion(resultMask, otherMask);
                    }
                },
            );
            const returnValue = featureFromMask(resultMask);
            return returnValue;
        },

        toString(this: Feature): string
        {
            let { name } = this;
            if (name === undefined)
                name = `{${this.canonicalNames.join(', ')}}`;
            const str = `[Feature ${name}]`;
            return str;
        },
    };

    assignNoEnum(featurePrototype, protoSource);
    {
        let inspectKey: undefined | symbol;
        try
        {
            inspectKey = require('util').inspect.custom;
        }
        catch
        { }
        if (inspectKey)
        {
            _Object_defineProperty
            (featurePrototype, inspectKey, { configurable: true, value: inspect, writable: true });
        }
    }

    featureFromMask =
    (mask: Mask): Feature =>
    {
        const featureObj = _Object_create(featurePrototype);
        initMask(featureObj, mask);
        return featureObj;
    };

    isMaskCompatible =
    (mask: Mask): boolean =>
    incompatibleMaskList.every
    ((incompatibleMask: Mask): boolean => !maskIncludes(mask, incompatibleMask));

    validMaskFromArrayOrStringOrFeature =
    (arg: FeatureElement | readonly FeatureElement[]): Mask =>
    {
        let mask;
        if (_Array_isArray(arg))
        {
            mask = featureArrayLikeToMask(arg);
            if (arg.length > 1)
                validateMask(mask);
        }
        else
            mask = maskFromStringOrFeature(arg as FeatureElement);
        return mask;
    };

    let autoMask = maskNew();
    let bitIndex = 0;
    const includesMap: { [key: string]: string[]; } = createEmpty();
    const incompatibleMaskMap: { [key: string]: Mask; } = createEmpty();

    const featureNames = _Object_keys(FEATURE_INFOS);
    featureNames.forEach(completeFeature);
    featureNames.forEach(completeExclusions);
    const incompatibleMaskList =
    _Object_keys(incompatibleMaskMap).map((key: string): Mask => incompatibleMaskMap[key]);
    ELEMENTARY.sort
    (
        (feature1: PredefinedFeature, feature2: PredefinedFeature): -1 | 1 =>
        feature1.name < feature2.name ? -1 : 1,
    );
    _Object_freeze(ELEMENTARY);
    const autoFeatureObj =
    createFeature('AUTO', 'All features available in the current engine.', autoMask);
    registerFeature('AUTO', autoFeatureObj);
    _Object_freeze(ALL);
}
)();
