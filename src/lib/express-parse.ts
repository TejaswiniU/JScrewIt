import { _Array_isArray, _Function, _JSON_parse, _RegExp, _String, createEmpty } from './obj-utils';

// Recognized syntax elements include:
//
// * The boolean literals "true" and "false"
// * The pseudoconstant literals "undefined", "NaN" and "Infinity"
// * ES5 strict mode numeric literals
// * ES5 strict mode string literals with the line continuation extension
// * Empty and singleton array literals
// * ASCII identifiers
// * ASCII property getters in dot notation
// * Property getters in bracket notation
// * Function calls without parameters and with one parameter
// * The unary operators "!", "+", and to a limited extent "-" and "++" (prefix and postfix
//   increment)
// * The binary operators "+" and to a limited extent "-"
// * Grouping parentheses
// * White spaces and line terminators
// * Semicolons
// * Comments

interface ExpressUnit
{
    arithmetic?: boolean;
    readonly identifier?: string;
    mod?: string;
    ops?: ExpressUnit[];
    pmod?: string;
    str?: string;
    terms?: ExpressUnit[];
    type?: 'call' | 'get' | 'param-call';
    value?: readonly ExpressUnit[] | boolean | number | string | undefined;
}

type Finalizer = (unit: ExpressUnit, parseInfo: ParseInfo) => FinalizerResult;
type FinalizerResult = ExpressUnit | Parser;

interface IdentifierData
{
    readonly escaped:       boolean;
    readonly identifier:    string;
}

interface ParseInfo
{
    data: string;
    readonly finalizerStack: Finalizer[];
    readonly modStack: string[];
    readonly opsStack: ExpressUnit[][];
    separator?: string;
    readonly unitStack: (ExpressUnit | undefined)[];
}

type Parser = ((parseInfo: ParseInfo) => FinalizerResult) | undefined;

function appendGetOp(parseInfo: ParseInfo, op: ExpressUnit): void
{
    const str = stringifyUnit(op);
    if (str != null)
        op.str = str;
    op.type = 'get';
    appendOp(parseInfo, op);
}

function appendOp(parseInfo: ParseInfo, op: ExpressUnit): void
{
    const { opsStack } = parseInfo;
    const ops = opsStack[opsStack.length - 1];
    ops.push(op);
}

function appendTerm(parseInfo: ParseInfo, term: ExpressUnit): FinalizerResult
{
    let unit = popUnit(parseInfo);
    let mod = popMod(parseInfo);
    applyMod(term, mod);
    if (unit)
    {
        if (!finalizeUnit(term))
            return;
        const { terms } = unit;
        if (terms && isUndecoratedUnit(unit))
        {
            terms.push(term);
            if (!term.arithmetic)
                unit.arithmetic = false;
        }
        else
        {
            if (!finalizeUnit(unit))
                return;
            const arithmetic = unit.arithmetic && term.arithmetic;
            unit = { arithmetic, ops: [], terms: [unit, term] };
        }
    }
    else
        unit = term;
    const binSign = read(parseInfo, /^(?:\+(?!\+)|-(?!-))/);
    if (!binSign)
    {
        const finalizer = popFinalizer(parseInfo);
        return finalizer(unit, parseInfo);
    }
    if (binSign === '-' && !unit.arithmetic)
        applyMod(unit, '+');
    mod = readMod(parseInfo, binSign === '+' ? '' : binSign);
    pushMod(parseInfo, mod);
    pushUnit(parseInfo, unit);
    return parsePrimaryExpr;
}

function applyMod(unit: ExpressUnit, mod: string): void
{
    if (!unit.mod && 'value' in unit && unit.arithmetic && !unit.pmod)
    {
        let value = unit.value as boolean | number | undefined;
        let index = mod.length;
        loop:
        while (index--)
        {
            const thisMod = mod[index];
            switch (thisMod)
            {
            case '!':
                value = !value;
                break;
            case '+':
                value = +(value as any);
                break;
            case '-':
                value = -(value as any);
                break;
            case '#':
                break loop;
            }
        }
        unit.value = value;
        mod = mod.slice(0, index + 1);
    }
    if (mod)
    {
        mod = joinMods(mod, unit.mod || '', unit.pmod);
        unit.mod = mod;
        unit.arithmetic = true;
    }
}

function defaultReadIdentifierData(parseInfo: ParseInfo): IdentifierData | undefined
{
    const rawIdentifier = read(parseInfo, rawIdentifierRegExp);
    if (rawIdentifier)
    {
        const identifier = _JSON_parse(`"${rawIdentifier}"`);
        if (/^[$A-Z_a-z][$\w]*$/.test(identifier))
        {
            const escaped = identifier.length < rawIdentifier.length;
            return { escaped, identifier };
        }
    }
}

function escapeMod(mod: string): string
{
    const escapedMod = mod.replace(/\+\+/g, '#');
    return escapedMod;
}

function evalExpr(expr: string): boolean | number | string | undefined
{
    const value = _Function(`return ${expr}`)() as boolean | number | string | undefined;
    return value;
}

function finalizeArrayElement(unit: ExpressUnit, parseInfo: ParseInfo): Parser
{
    if (finalizeUnit(unit) && readSquareBracketRight(parseInfo))
    {
        newOps(parseInfo, { value: [unit] });
        return parseNextOp;
    }
}

function finalizeGroup(unit: ExpressUnit, parseInfo: ParseInfo): Parser
{
    if (readParenthesisRight(parseInfo))
    {
        newOps(parseInfo, unit);
        return parseNextOp;
    }
}

function finalizeIndexer(op: ExpressUnit, parseInfo: ParseInfo): Parser
{
    if (finalizeUnit(op) && readSquareBracketRight(parseInfo))
    {
        appendGetOp(parseInfo, op);
        return parseNextOp;
    }
}

function finalizeParamCall(op: ExpressUnit, parseInfo: ParseInfo): Parser
{
    if (finalizeUnit(op) && readParenthesisRight(parseInfo))
    {
        op.type = 'param-call';
        appendOp(parseInfo, op);
        return parseNextOp;
    }
}

function finalizeUnit(unit: ExpressUnit): ExpressUnit | undefined
{
    const mod = unit.mod || '';
    if (!/-/.test(mod) && (!/#$/.test(mod) || unit.ops!.length))
    {
        unit.mod = unescapeMod(mod);
        return unit;
    }
}

function isReturnableIdentifier(identifier: string, escaped: boolean): boolean
{
    const returnable =
    UNRETURNABLE_WORDS.indexOf(identifier) < 0 &&
    (!escaped || INESCAPABLE_WORDS.indexOf(identifier) < 0);
    return returnable;
}

function isUndecoratedUnit(unit: ExpressUnit): boolean
{
    const undecorated = !(unit.mod || unit.ops!.length);
    return undecorated;
}

function joinMods(mod1: string, mod2: string, trimTrailingPlus?: unknown): string
{
    let mod =
    (mod1 + mod2)
    .replace(/\+\+|--/, '+')
    .replace(/\+-|-\+/, '-')
    .replace(/!-/, '!+')
    .replace(/\+#/, '#')
    .replace(/!\+!/, '!!')
    .replace('!!!', '!');
    if (trimTrailingPlus)
        mod = mod.replace(/\+$/, '');
    return mod;
}

function makeRegExp(richPattern: string): RegExp
{
    const pattern = `^(?:${replacePattern(richPattern)})`;
    const regExp = _RegExp(pattern);
    return regExp;
}

function newOps(parseInfo: ParseInfo, unit: ExpressUnit): void
{
    pushNewOps(parseInfo);
    pushUnit(parseInfo, unit);
}

function parse(parseInfo: ParseInfo): ExpressUnit | undefined
{
    let next: FinalizerResult;
    for (next = parseUnit; typeof next === 'function'; next = next(parseInfo));
    return next;
}

function parseNextOp(parseInfo: ParseInfo): FinalizerResult
{
    if (readParenthesisLeft(parseInfo))
    {
        if (readParenthesisRight(parseInfo))
        {
            appendOp(parseInfo, { type: 'call' });
            return parseNextOp;
        }
        pushFinalizer(parseInfo, finalizeParamCall);
        return parseUnit;
    }
    if (readSquareBracketLeft(parseInfo))
    {
        pushFinalizer(parseInfo, finalizeIndexer);
        return parseUnit;
    }
    if (read(parseInfo, /^\./))
    {
        const identifierData = defaultReadIdentifierData(parseInfo);
        if (!identifierData)
            return;
        appendGetOp(parseInfo, { ops: [], value: identifierData.identifier });
        return parseNextOp;
    }
    let unit = popUnit(parseInfo);
    let ops = popOps(parseInfo);
    if (ops.length)
    {
        unit.arithmetic = false;
        if (unit.mod || unit.pmod)
        {
            if (!finalizeUnit(unit))
                return;
            unit = { terms: [unit] };
        }
    }
    unit.ops = ops = (unit.ops || []).concat(ops);
    if (ops.length && !unit.mod && !unit.pmod)
    {
        if (/^.*$/.test(parseInfo.separator!))
        {
            const pmod = read(parseInfo, /^\+\+/);
            if (pmod)
            {
                unit.pmod = pmod;
                unit.arithmetic = true;
            }
        }
    }
    const next = appendTerm(parseInfo, unit);
    return next;
}

function parsePrimaryExpr(parseInfo: ParseInfo): FinalizerResult
{
    const strExpr = read(parseInfo, strRegExp);
    if (strExpr)
    {
        const str = evalExpr(strExpr);
        newOps(parseInfo, { value: str });
        return parseNextOp;
    }
    const constValueExpr = read(parseInfo, constValueRegExp);
    if (constValueExpr)
    {
        const constValue = evalExpr(constValueExpr);
        newOps(parseInfo, { arithmetic: true, value: constValue });
        return parseNextOp;
    }
    if (readSquareBracketLeft(parseInfo))
    {
        if (readSquareBracketRight(parseInfo))
        {
            newOps(parseInfo, { value: [] });
            return parseNextOp;
        }
        pushFinalizer(parseInfo, finalizeArrayElement);
        return parseUnit;
    }
    if (readParenthesisLeft(parseInfo))
    {
        pushFinalizer(parseInfo, finalizeGroup);
        return parseUnit;
    }
    const identifierData = defaultReadIdentifierData(parseInfo);
    if (identifierData)
    {
        const { identifier } = identifierData;
        if (isReturnableIdentifier(identifier, identifierData.escaped))
        {
            newOps(parseInfo, { identifier });
            return parseNextOp;
        }
    }
}

function parseUnit(parseInfo: ParseInfo): Parser
{
    const MAX_PARSABLE_NESTINGS = 1000;

    if (parseInfo.finalizerStack.length <= MAX_PARSABLE_NESTINGS)
    {
        const mod = readMod(parseInfo, '');
        pushMod(parseInfo, mod);
        pushUnit(parseInfo);
        return parsePrimaryExpr;
    }
}

function popFinalizer(parseInfo: ParseInfo): Finalizer
{
    const ret = parseInfo.finalizerStack.pop()!;
    return ret;
}

function popMod(parseInfo: ParseInfo): string
{
    const mod = parseInfo.modStack.pop()!;
    return mod;
}

function popOps(parseInfo: ParseInfo): ExpressUnit[]
{
    const ops = parseInfo.opsStack.pop()!;
    return ops;
}

function popUnit(parseInfo: ParseInfo): ExpressUnit
{
    const unit = parseInfo.unitStack.pop()!;
    return unit;
}

function pushFinalizer(parseInfo: ParseInfo, finalizer: Finalizer): void
{
    parseInfo.finalizerStack.push(finalizer);
}

function pushMod(parseInfo: ParseInfo, mod: string): void
{
    parseInfo.modStack.push(mod);
}

function pushNewOps(parseInfo: ParseInfo): void
{
    parseInfo.opsStack.push([]);
}

function pushUnit(parseInfo: ParseInfo, unit?: ExpressUnit): void
{
    parseInfo.unitStack.push(unit);
}

function read(parseInfo: ParseInfo, regExp: RegExp): string | undefined
{
    let { data } = parseInfo;
    const matches = regExp.exec(data);
    if (matches)
    {
        const [match] = matches;
        data = data.slice(match.length);
        const [separator] = separatorRegExp.exec(data)!;
        if (separator)
            data = data.slice(separator.length);
        parseInfo.data = data;
        parseInfo.separator = separator;
        return match;
    }
}

function readMod(parseInfo: ParseInfo, mod: string): string
{
    let newMod;
    while (newMod = read(parseInfo, /^(?:!|\+\+?|-(?!-))/))
        mod = joinMods(mod, escapeMod(newMod));
    return mod;
}

function readParenthesisLeft(parseInfo: ParseInfo): string | undefined
{
    const match = read(parseInfo, /^\(/);
    return match;
}

function readParenthesisRight(parseInfo: ParseInfo): string | undefined
{
    const match = read(parseInfo, /^\)/);
    return match;
}

function readSeparatorOrColon(parseInfo: ParseInfo): void
{
    parseInfo.data = parseInfo.data.replace(separatorOrColonRegExp, '');
}

function readSquareBracketLeft(parseInfo: ParseInfo): string | undefined
{
    const match = read(parseInfo, /^\[/);
    return match;
}

function readSquareBracketRight(parseInfo: ParseInfo): string | undefined
{
    const match = read(parseInfo, /^]/);
    return match;
}

function replaceAndGroupToken(unused: string, tokenName: keyof typeof tokens): string
{
    const replacement = `(?:${replaceToken(tokenName)})`;
    return replacement;
}

function replacePattern(richPattern: string): string
{
    const pattern = richPattern.replace(/#(\w+)/g, replaceAndGroupToken);
    return pattern;
}

function replaceToken(tokenName: keyof typeof tokens): string
{
    let replacement = tokenCache[tokenName];
    if (replacement == null)
    {
        const richPattern = tokens[tokenName];
        tokenCache[tokenName] = replacement = replacePattern(richPattern);
    }
    return replacement;
}

function stringifyUnit(unit: ExpressUnit): string | undefined
{
    let inArray = false;
    while ('value' in unit && isUndecoratedUnit(unit))
    {
        const { value } = unit;
        if (!_Array_isArray(value))
            return value == null && inArray ? '' : _String(value);
        [unit] = value;
        if (!unit)
            return '';
        inArray = true;
    }
}

function unescapeMod(mod: string): string
{
    const unescapedMod = mod.replace(/#/g, '++');
    return unescapedMod;
}

const tokens =
{
    ConstIdentifier:        'Infinity|NaN|false|true|undefined',
    DecimalLiteral:         '(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:[Ee][+-]?\\d+)?',
    DoubleQuotedString:     '"(?:#EscapeSequence|(?!["\\\\]).)*"',
    EscapeSequence:         '\\\\(?:u#HexDigit{4}|x#HexDigit{2}|0(?![0-7])|\r\n|[^0-7ux])',
    HexDigit:               '[0-9A-Fa-f]',
    HexIntegerLiteral:      '0[Xx]#HexDigit+',
    NumericLiteral:         '#HexIntegerLiteral|#DecimalLiteral',
    Separator:              '#SeparatorChar|//.*(?!.)|/\\*[\\s\\S]*?\\*/',
    // U+180E is recognized as a separator in older browsers.
    // U+FEFF is missed by /\s/ in Android Browser < 4.1.x.
    SeparatorChar:          '(?!\u180E)[\\s\uFEFF]',
    SingleQuotedString:     '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
    UnicodeEscapeSequence:  '\\\\u#HexDigit{4}',
};

const tokenCache: { [key: string]: string; } = createEmpty();

// Reserved words and that cannot be written with escape sequences.
const INESCAPABLE_WORDS = ['false', 'null', 'true'];

// This list includes reserved words and identifiers that would cause a change in a script's
// behavior when placed after a return statement inside a Function invocation.
// Unwanted changes include producing a syntax error where none is expected or a difference in
// evaluation.
const UNRETURNABLE_WORDS =
[
    'arguments',    // shadowed in function body
    'debugger',     // : debugger;
    'delete',       // : delete(x);
    'if',           // : if(x);
    'import',       // : import(x);
    'let',          // may be an identifier in non-strict mode
    'new',          // : new(x);
    'return',       // : return;
    'this',         // shadowed in function body
    'throw',        // : throw(x);
    'typeof',       // : typeof(x);
    'void',         // : void(x);
    'while',        // : while(x);
    'with',         // : with(x);
    'yield',        // may be an identifier in non-strict mode
];

const constValueRegExp          = makeRegExp('(?:#NumericLiteral|#ConstIdentifier)');
const rawIdentifierRegExp       = makeRegExp('(?:[$\\w]|#UnicodeEscapeSequence)+');
const separatorOrColonRegExp    = makeRegExp('(?:#Separator|;)*');
const separatorRegExp           = makeRegExp('#Separator*');
const strRegExp                 = makeRegExp('#SingleQuotedString|#DoubleQuotedString');

export default function expressParse(input: string): ExpressUnit | true | undefined
{
    const parseInfo: ParseInfo =
    { data: input, modStack: [], opsStack: [], finalizerStack: [finalizeUnit], unitStack: [] };
    readSeparatorOrColon(parseInfo);
    if (!parseInfo.data)
        return true;
    const unit = parse(parseInfo);
    if (unit)
    {
        readSeparatorOrColon(parseInfo);
        if (!parseInfo.data)
            return unit;
    }
}
