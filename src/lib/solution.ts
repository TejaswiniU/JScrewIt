import Level                                    from './level';
import { _Object_defineProperty, assignNoEnum } from './obj-utils';

export default class Solution
{
    public appendLength!:           number;
    public bridge?:                 string;
    public readonly charAt!:        (this: Solution, index: number) => string;
    public entryIndex?:             number | 'static';

    /**
     * Indicates whether this solution contains a plus sign out of brackets not preceded by an
     * exclamation mark or by another plus sign.
     */
    public readonly hasOuterPlus!:  boolean;
    public readonly length!:        number;
    public level?:                  Level;
    public readonly replacement:    string;

    public constructor(replacement: string, level?: Level, hasOuterPlus?: boolean)
    {
        this.replacement    = replacement;
        this.level          = level;
        if (hasOuterPlus !== undefined)
            setHasOuterPlus(this, hasOuterPlus);
    }
}

const protoSource =
{
    get appendLength(this: Solution): number
    {
        const extraLength = this.hasOuterPlus ? 3 : 1;
        const appendLength = this.length + extraLength;
        return appendLength;
    },
    set appendLength(this: Solution, appendLength: number)
    {
        _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
    },
    get hasOuterPlus(this: Solution): boolean
    {
        let str = this.replacement;
        for (;;)
        {
            const newStr = str.replace(/\([^()]*\)|\[[^[\]]*]/g, '.');
            if (newStr.length === str.length)
                break;
            str = newStr;
        }
        const hasOuterPlus = /(^|[^!+])\+/.test(str);
        setHasOuterPlus(this, hasOuterPlus);
        return hasOuterPlus;
    },
    get length(this: Solution): number
    {
        return this.replacement.length;
    },
    charAt(this: Solution, index: number): string
    {
        return this.replacement[index];
    },
    toString(this: Solution): string
    {
        return this.replacement;
    },
};

assignNoEnum(Solution.prototype, protoSource);

function setHasOuterPlus(solution: Solution, hasOuterPlus: boolean): void
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}
