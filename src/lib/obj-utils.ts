export var _Array                           = Array;
export var _Array_isArray                   = _Array.isArray;
export var _Array_prototype                 = _Array.prototype;
export var _Array_prototype_every           = _Array_prototype.every;
export var _Array_prototype_forEach         = _Array_prototype.forEach;
export var _Array_prototype_map             = _Array_prototype.map;
export var _Array_prototype_push            = _Array_prototype.push;

export var _Date                            = Date;

export var _Error                           = Error;

export var _Function                        = Function;

export var _JSON_parse                      = JSON.parse;
export var _JSON_stringify                  = JSON.stringify;

export var _Math_abs                        = Math.abs;
export var _Math_max                        = Math.max;
export var _Math_pow                        = Math.pow;

export var _Object                          = Object;
export var _Object_create                   = _Object.create;
export var _Object_defineProperties         = _Object.defineProperties;
export var _Object_defineProperty           = _Object.defineProperty;
export var _Object_freeze                   = _Object.freeze;

export var _Object_getOwnPropertyDescriptor =
_Object.getOwnPropertyDescriptor as <T extends { }>(o: T, p: keyof T) => PropertyDescriptor;

export var _Object_keys:
<T extends { }>(obj: T) => (keyof T)[] =
_Object.keys;

export var _RegExp                          = RegExp;

export var _String                          = String;

export var _SyntaxError                     = SyntaxError;

export var _TypeError                       = TypeError;

export var _parseInt                        = parseInt;

export function assignNoEnum<T extends { }, U extends { }>(target: T, source: U): T
{
    var descriptors: { [K in keyof U]?: PropertyDescriptor } = { };
    var names = _Object_keys(source);
    names.forEach
    (
        function (name): void
        {
            var descriptor = _Object_getOwnPropertyDescriptor(source, name);
            descriptor.enumerable = false;
            descriptors[name] = descriptor;
        }
    );
    _Object_defineProperties(target, descriptors as PropertyDescriptorMap);
    return target;
}

export var createEmpty = _Object_create.bind(null, null, undefined as unknown as { });

export function esToString(arg: unknown): string
{
    if (typeof arg === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    var str = _String(arg);
    return str;
}

export function noProto<T extends { }>(obj: T): { __proto__: null; }
{
    var result = createEmpty();
    _Object_keys(obj).forEach
    (
        (name: keyof T): void =>
        {
            result[name] = obj[name];
        }
    );
    return result;
}

export var noop = _Function();
