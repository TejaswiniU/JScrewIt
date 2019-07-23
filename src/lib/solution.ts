import Level                        from './level';
import { _Object_defineProperty }   from './obj-utils';

function setHasOuterPlus(solution: Solution, hasOuterPlus: boolean): void
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}

export default class Solution
{
    public readonly replacement:    string;
    public level?:                  Level;

    public constructor(replacement: string, level?: Level, hasOuterPlus?: boolean)
    {
        this.replacement    = replacement;
        this.level          = level;
        if (hasOuterPlus !== undefined)
            setHasOuterPlus(this, hasOuterPlus);
    }

    public get appendLength(): number
    {
        const extraLength = this.hasOuterPlus ? 3 : 1;
        const appendLength = this.length + extraLength;
        return appendLength;
    }

    public set appendLength(appendLength: number)
    {
        _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
    }

    /**
     * Determines whether this solution contains a plus sign out of brackets not preceded by an
     * exclamation mark or by another plus sign.
     */
    public get hasOuterPlus(): boolean
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
    }

    public get length(): number
    {
        return this.replacement.length;
    }

    public charAt(index: number): string
    {
        return this.replacement[index];
    }

    public toString(): string
    {
        return this.replacement;
    }
}
