declare global
{
    interface Array<T> { push(...items: readonly T[]): number; }
    interface ArrayConstructor { isArray(arg: any): arg is any[] | readonly any[]; }
    interface CallableFunction extends Function
    {
        apply
        <T, A extends readonly any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
        call<T, R>(this: (this: T) => R): R;
    }
    interface String { charCodeAt(): number; }
}

export const _Array                         = Array;
export const _Array_isArray                 = _Array.isArray;
export const _Array_prototype               = _Array.prototype;
export const _Array_prototype_every         = _Array_prototype.every;
export const _Array_prototype_forEach       = _Array_prototype.forEach;
export const _Array_prototype_map           = _Array_prototype.map;
export const _Array_prototype_push          = _Array_prototype.push;

export const _Date                          = Date;

export const _Error                         = Error;

export const _Function                      = Function;

export const _JSON_parse                    = JSON.parse;
export const _JSON_stringify                = JSON.stringify;

export const _Math_abs                      = Math.abs;
export const _Math_max                      = Math.max;
export const _Math_pow                      = Math.pow;

export const _Object                        = Object;
export const _Object_create                 = _Object.create;
export const _Object_defineProperties       = _Object.defineProperties;
export const _Object_defineProperty         = _Object.defineProperty;
export const _Object_freeze                 = _Object.freeze;

export const _Object_getOwnPropertyDescriptor =
_Object.getOwnPropertyDescriptor as <T extends { }>(o: T, p: keyof T) => PropertyDescriptor;

export const _Object_keys =
_Object.keys as <T extends { }>(obj: T) => (string & keyof T)[];

export const _RegExp                        = RegExp;

export const _String                        = String;

export const _SyntaxError                   = SyntaxError;

export const _TypeError                     = TypeError;

export const _parseInt                      = parseInt;

export function assignNoEnum<T extends { }, U extends { }>(target: T, source: U): T
{
    const descriptors: { [K in keyof U]?: PropertyDescriptor } = { };
    const names = _Object_keys(source);
    names.forEach
    (
        (name: keyof U): void =>
        {
            const descriptor = _Object_getOwnPropertyDescriptor(source, name);
            descriptor.enumerable = false;
            descriptors[name] = descriptor;
        },
    );
    _Object_defineProperties(target, descriptors as PropertyDescriptorMap);
    return target;
}

export const createEmpty: () => { [K in number | string | symbol]: any } =
_Object_create.bind(null, null, undefined as any);

export function esToString(arg: unknown): string
{
    if (typeof arg === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    const str = _String(arg);
    return str;
}

export function noProto<T extends { }>(obj: T): { [K in keyof T]: T[K] }
{
    const result = createEmpty() as { [K in keyof T]: T[K] };
    _Object_keys(obj).forEach
    (
        (name: keyof T): void =>
        {
            result[name] = obj[name];
        },
    );
    return result;
}

export const noop = _Function();
