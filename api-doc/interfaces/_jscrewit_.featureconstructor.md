
# Interface: FeatureConstructor

## Hierarchy

* [FeatureAll](_jscrewit_.featureall.md)

  ↳ **FeatureConstructor**

## Callable

▸ (...`features`: [Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](_jscrewit_.customfeature.md)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](_jscrewit_.featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)</code>.

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`** 

An error is thrown if any of the specified features are not mutually compatible.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](_jscrewit_.customfeature.md)*

## Index

### Constructors

* [constructor](_jscrewit_.featureconstructor.md#constructor)

### Properties

* [ALL](_jscrewit_.featureconstructor.md#readonly-all)
* [ANDRO_4_0](_jscrewit_.featureconstructor.md#andro_4_0)
* [ANDRO_4_1](_jscrewit_.featureconstructor.md#andro_4_1)
* [ANDRO_4_4](_jscrewit_.featureconstructor.md#andro_4_4)
* [ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)
* [ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)
* [ARRAY_ITERATOR](_jscrewit_.featureconstructor.md#array_iterator)
* [ARROW](_jscrewit_.featureconstructor.md#arrow)
* [ATOB](_jscrewit_.featureconstructor.md#atob)
* [AUTO](_jscrewit_.featureconstructor.md#auto)
* [BARPROP](_jscrewit_.featureconstructor.md#barprop)
* [BROWSER](_jscrewit_.featureconstructor.md#browser)
* [CAPITAL_HTML](_jscrewit_.featureconstructor.md#capital_html)
* [CHROME](_jscrewit_.featureconstructor.md#chrome)
* [CHROME_73](_jscrewit_.featureconstructor.md#chrome_73)
* [CHROME_PREV](_jscrewit_.featureconstructor.md#chrome_prev)
* [COMPACT](_jscrewit_.featureconstructor.md#compact)
* [CONSOLE](_jscrewit_.featureconstructor.md#console)
* [DEFAULT](_jscrewit_.featureconstructor.md#default)
* [DOCUMENT](_jscrewit_.featureconstructor.md#document)
* [DOMWINDOW](_jscrewit_.featureconstructor.md#domwindow)
* [ELEMENTARY](_jscrewit_.featureconstructor.md#readonly-elementary)
* [ESC_HTML_ALL](_jscrewit_.featureconstructor.md#esc_html_all)
* [ESC_HTML_QUOT](_jscrewit_.featureconstructor.md#esc_html_quot)
* [ESC_HTML_QUOT_ONLY](_jscrewit_.featureconstructor.md#esc_html_quot_only)
* [ESC_REGEXP_LF](_jscrewit_.featureconstructor.md#esc_regexp_lf)
* [ESC_REGEXP_SLASH](_jscrewit_.featureconstructor.md#esc_regexp_slash)
* [EXTERNAL](_jscrewit_.featureconstructor.md#external)
* [FF](_jscrewit_.featureconstructor.md#ff)
* [FF_62](_jscrewit_.featureconstructor.md#ff_62)
* [FF_74](_jscrewit_.featureconstructor.md#ff_74)
* [FF_78](_jscrewit_.featureconstructor.md#ff_78)
* [FF_ESR](_jscrewit_.featureconstructor.md#ff_esr)
* [FF_PREV](_jscrewit_.featureconstructor.md#ff_prev)
* [FF_SRC](_jscrewit_.featureconstructor.md#ff_src)
* [FILL](_jscrewit_.featureconstructor.md#fill)
* [FLAT](_jscrewit_.featureconstructor.md#flat)
* [FROM_CODE_POINT](_jscrewit_.featureconstructor.md#from_code_point)
* [FUNCTION_19_LF](_jscrewit_.featureconstructor.md#function_19_lf)
* [FUNCTION_22_LF](_jscrewit_.featureconstructor.md#function_22_lf)
* [GMT](_jscrewit_.featureconstructor.md#gmt)
* [HISTORY](_jscrewit_.featureconstructor.md#history)
* [HTMLAUDIOELEMENT](_jscrewit_.featureconstructor.md#htmlaudioelement)
* [HTMLDOCUMENT](_jscrewit_.featureconstructor.md#htmldocument)
* [IE_10](_jscrewit_.featureconstructor.md#ie_10)
* [IE_11](_jscrewit_.featureconstructor.md#ie_11)
* [IE_11_WIN_10](_jscrewit_.featureconstructor.md#ie_11_win_10)
* [IE_9](_jscrewit_.featureconstructor.md#ie_9)
* [IE_SRC](_jscrewit_.featureconstructor.md#ie_src)
* [INCR_CHAR](_jscrewit_.featureconstructor.md#incr_char)
* [INTL](_jscrewit_.featureconstructor.md#intl)
* [LOCALE_INFINITY](_jscrewit_.featureconstructor.md#locale_infinity)
* [NAME](_jscrewit_.featureconstructor.md#name)
* [NODECONSTRUCTOR](_jscrewit_.featureconstructor.md#nodeconstructor)
* [NODE_0_10](_jscrewit_.featureconstructor.md#node_0_10)
* [NODE_0_12](_jscrewit_.featureconstructor.md#node_0_12)
* [NODE_10](_jscrewit_.featureconstructor.md#node_10)
* [NODE_11](_jscrewit_.featureconstructor.md#node_11)
* [NODE_12](_jscrewit_.featureconstructor.md#node_12)
* [NODE_4](_jscrewit_.featureconstructor.md#node_4)
* [NODE_5](_jscrewit_.featureconstructor.md#node_5)
* [NO_FF_SRC](_jscrewit_.featureconstructor.md#no_ff_src)
* [NO_IE_SRC](_jscrewit_.featureconstructor.md#no_ie_src)
* [NO_OLD_SAFARI_ARRAY_ITERATOR](_jscrewit_.featureconstructor.md#no_old_safari_array_iterator)
* [NO_V8_SRC](_jscrewit_.featureconstructor.md#no_v8_src)
* [SAFARI](_jscrewit_.featureconstructor.md#safari)
* [SAFARI_10](_jscrewit_.featureconstructor.md#safari_10)
* [SAFARI_12](_jscrewit_.featureconstructor.md#safari_12)
* [SAFARI_7_0](_jscrewit_.featureconstructor.md#safari_7_0)
* [SAFARI_7_1](_jscrewit_.featureconstructor.md#safari_7_1)
* [SAFARI_8](_jscrewit_.featureconstructor.md#safari_8)
* [SAFARI_9](_jscrewit_.featureconstructor.md#safari_9)
* [SELF](_jscrewit_.featureconstructor.md#self)
* [SELF_OBJ](_jscrewit_.featureconstructor.md#self_obj)
* [STATUS](_jscrewit_.featureconstructor.md#status)
* [UNDEFINED](_jscrewit_.featureconstructor.md#undefined)
* [UNEVAL](_jscrewit_.featureconstructor.md#uneval)
* [V8_SRC](_jscrewit_.featureconstructor.md#v8_src)
* [WINDOW](_jscrewit_.featureconstructor.md#window)

### Methods

* [areCompatible](_jscrewit_.featureconstructor.md#arecompatible)
* [areEqual](_jscrewit_.featureconstructor.md#areequal)
* [commonOf](_jscrewit_.featureconstructor.md#commonof)

## Constructors

###  constructor

\+ **new FeatureConstructor**(...`features`: [Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](_jscrewit_.customfeature.md)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](_jscrewit_.featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)</code>.

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`** 

An error is thrown if any of the specified features are not mutually compatible.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](_jscrewit_.customfeature.md)*

## Properties

### `Readonly` ALL

• **ALL**: *[FeatureAll](_jscrewit_.featureall.md)*

An immutable mapping of all predefined feature objects accessed by name or alias.

**`example`** 

This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

___

###  ANDRO_4_0

• **ANDRO_4_0**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_0](_jscrewit_.featureall.md#andro_4_0)*

Features available in Android Browser 4.0.

___

###  ANDRO_4_1

• **ANDRO_4_1**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_1](_jscrewit_.featureall.md#andro_4_1)*

Features available in Android Browser 4.1 to 4.3.

___

###  ANDRO_4_4

• **ANDRO_4_4**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_4](_jscrewit_.featureall.md#andro_4_4)*

Features available in Android Browser 4.4.

___

###  ANY_DOCUMENT

• **ANY_DOCUMENT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_DOCUMENT](_jscrewit_.featureall.md#any_document)*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___

###  ANY_WINDOW

• **ANY_WINDOW**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_WINDOW](_jscrewit_.featureall.md#any_window)*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___

###  ARRAY_ITERATOR

• **ARRAY_ITERATOR**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARRAY_ITERATOR](_jscrewit_.featureall.md#array_iterator)*

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.

___

###  ARROW

• **ARROW**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARROW](_jscrewit_.featureall.md#arrow)*

Support for arrow functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.

___

###  ATOB

• **ATOB**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ATOB](_jscrewit_.featureall.md#atob)*

Existence of the global functions atob and btoa.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.

___

###  AUTO

• **AUTO**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[AUTO](_jscrewit_.featureall.md#auto)*

All features available in the current engine.

___

###  BARPROP

• **BARPROP**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BARPROP](_jscrewit_.featureall.md#barprop)*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

___

###  BROWSER

• **BROWSER**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BROWSER](_jscrewit_.featureall.md#browser)*

Features available in all browsers.

No support for Node.js.

___

###  CAPITAL_HTML

• **CAPITAL_HTML**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CAPITAL_HTML](_jscrewit_.featureall.md#capital_html)*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`reamarks`** 

Available in Internet Explorer.

___

###  CHROME

• **CHROME**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME](_jscrewit_.featureall.md#chrome)*

An alias for `CHROME_73`.

___

###  CHROME_73

• **CHROME_73**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_73](_jscrewit_.featureall.md#chrome_73)*

Features available in Chrome 73, Edge 79 and Opera 60 or later.

___

###  CHROME_PREV

• **CHROME_PREV**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_PREV](_jscrewit_.featureall.md#chrome_prev)*

An alias for `CHROME_73`.

___

###  COMPACT

• **COMPACT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[COMPACT](_jscrewit_.featureall.md#compact)*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

___

###  CONSOLE

• **CONSOLE**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CONSOLE](_jscrewit_.featureall.md#console)*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`reamarks`** 

Available in Firefox before 78, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

___

###  DEFAULT

• **DEFAULT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DEFAULT](_jscrewit_.featureall.md#default)*

Minimum feature level, compatible with all supported engines in all environments.

___

###  DOCUMENT

• **DOCUMENT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOCUMENT](_jscrewit_.featureall.md#document)*

Existence of the global object document having the string representation "\[object Document\]".

**`reamarks`** 

Available in Internet Explorer before 11. This feature is not available inside web workers.

___

###  DOMWINDOW

• **DOMWINDOW**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOMWINDOW](_jscrewit_.featureall.md#domwindow)*

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`reamarks`** 

Available in Android Browser before 4.4. This feature is not available inside web workers.

___

### `Readonly` ELEMENTARY

• **ELEMENTARY**: *keyof ElementaryFeature[]*

An immutable array of all elementary feature objects ordered by name.

___

###  ESC_HTML_ALL

• **ESC_HTML_ALL**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_ALL](_jscrewit_.featureall.md#esc_html_all)*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`reamarks`** 

Available in Android Browser and Node.js before 0.12.

___

###  ESC_HTML_QUOT

• **ESC_HTML_QUOT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT](_jscrewit_.featureall.md#esc_html_quot)*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___

###  ESC_HTML_QUOT_ONLY

• **ESC_HTML_QUOT_ONLY**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT_ONLY](_jscrewit_.featureall.md#esc_html_quot_only)*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.

___

###  ESC_REGEXP_LF

• **ESC_REGEXP_LF**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_LF](_jscrewit_.featureall.md#esc_regexp_lf)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.

___

###  ESC_REGEXP_SLASH

• **ESC_REGEXP_SLASH**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_SLASH](_jscrewit_.featureall.md#esc_regexp_slash)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.

___

###  EXTERNAL

• **EXTERNAL**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EXTERNAL](_jscrewit_.featureall.md#external)*

Existence of the global object sidebar having the string representation "\[object External\]".

**`reamarks`** 

Available in Firefox. This feature is not available inside web workers.

___

###  FF

• **FF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF](_jscrewit_.featureall.md#ff)*

An alias for `FF_78`.

___

###  FF_62

• **FF_62**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_62](_jscrewit_.featureall.md#ff_62)*

Features available in Firefox 62 to 73.

___

###  FF_74

• **FF_74**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_74](_jscrewit_.featureall.md#ff_74)*

Features available in Firefox 62 to 77.

___

###  FF_78

• **FF_78**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_78](_jscrewit_.featureall.md#ff_78)*

Features available in Firefox 62 or later.

___

###  FF_ESR

• **FF_ESR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_ESR](_jscrewit_.featureall.md#ff_esr)*

An alias for `FF_62`.

___

###  FF_PREV

• **FF_PREV**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_PREV](_jscrewit_.featureall.md#ff_prev)*

An alias for `FF_74`.

___

###  FF_SRC

• **FF_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_SRC](_jscrewit_.featureall.md#ff_src)*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox and Safari.

___

###  FILL

• **FILL**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FILL](_jscrewit_.featureall.md#fill)*

Existence of the native function Array.prototype.fill.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.

___

###  FLAT

• **FLAT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FLAT](_jscrewit_.featureall.md#flat)*

Existence of the native function Array.prototype.flat.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 12+, Opera and Node.js 11+.

___

###  FROM_CODE_POINT

• **FROM_CODE_POINT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FROM_CODE_POINT](_jscrewit_.featureall.md#from_code_point)*

Existence of the function String.fromCodePoint.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.

___

###  FUNCTION_19_LF

• **FUNCTION_19_LF**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_19_LF](_jscrewit_.featureall.md#function_19_lf)*

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`reamarks`** 

Available in Chrome, Edge, Firefox, Opera and Node.js 10+.

___

###  FUNCTION_22_LF

• **FUNCTION_22_LF**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_22_LF](_jscrewit_.featureall.md#function_22_lf)*

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`reamarks`** 

Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.

___

###  GMT

• **GMT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[GMT](_jscrewit_.featureall.md#gmt)*

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.

___

###  HISTORY

• **HISTORY**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HISTORY](_jscrewit_.featureall.md#history)*

Existence of the global object history having the string representation "\[object History\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___

###  HTMLAUDIOELEMENT

• **HTMLAUDIOELEMENT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLAUDIOELEMENT](_jscrewit_.featureall.md#htmlaudioelement)*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`reamarks`** 

Available in Android Browser 4.4. This feature is not available inside web workers.

___

###  HTMLDOCUMENT

• **HTMLDOCUMENT**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLDOCUMENT](_jscrewit_.featureall.md#htmldocument)*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.

___

###  IE_10

• **IE_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_10](_jscrewit_.featureall.md#ie_10)*

Features available in Internet Explorer 10.

___

###  IE_11

• **IE_11**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11](_jscrewit_.featureall.md#ie_11)*

Features available in Internet Explorer 11.

___

###  IE_11_WIN_10

• **IE_11_WIN_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11_WIN_10](_jscrewit_.featureall.md#ie_11_win_10)*

Features available in Internet Explorer 11 on Windows 10.

___

###  IE_9

• **IE_9**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_9](_jscrewit_.featureall.md#ie_9)*

Features available in Internet Explorer 9.

___

###  IE_SRC

• **IE_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_SRC](_jscrewit_.featureall.md#ie_src)*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Internet Explorer.

___

###  INCR_CHAR

• **INCR_CHAR**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INCR_CHAR](_jscrewit_.featureall.md#incr_char)*

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.

___

###  INTL

• **INTL**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INTL](_jscrewit_.featureall.md#intl)*

Existence of the global object Intl.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___

###  LOCALE_INFINITY

• **LOCALE_INFINITY**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[LOCALE_INFINITY](_jscrewit_.featureall.md#locale_infinity)*

Language sensitive string representation of Infinity as "∞".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___

###  NAME

• **NAME**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NAME](_jscrewit_.featureall.md#name)*

Existence of the name property for functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___

###  NODECONSTRUCTOR

• **NODECONSTRUCTOR**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODECONSTRUCTOR](_jscrewit_.featureall.md#nodeconstructor)*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`reamarks`** 

Available in Safari before 10. This feature is not available inside web workers.

___

###  NODE_0_10

• **NODE_0_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_10](_jscrewit_.featureall.md#node_0_10)*

Features available in Node.js 0.10.

___

###  NODE_0_12

• **NODE_0_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_12](_jscrewit_.featureall.md#node_0_12)*

Features available in Node.js 0.12.

___

###  NODE_10

• **NODE_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_10](_jscrewit_.featureall.md#node_10)*

Features available in Node.js 10.

___

###  NODE_11

• **NODE_11**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_11](_jscrewit_.featureall.md#node_11)*

Features available in Node.js 11.

___

###  NODE_12

• **NODE_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_12](_jscrewit_.featureall.md#node_12)*

Features available in Node.js 12 or later.

___

###  NODE_4

• **NODE_4**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_4](_jscrewit_.featureall.md#node_4)*

Features available in Node.js 4.

___

###  NODE_5

• **NODE_5**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_5](_jscrewit_.featureall.md#node_5)*

Features available in Node.js 5 to 9.

___

###  NO_FF_SRC

• **NO_FF_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_FF_SRC](_jscrewit_.featureall.md#no_ff_src)*

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`reamarks`** 

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.

___

###  NO_IE_SRC

• **NO_IE_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_IE_SRC](_jscrewit_.featureall.md#no_ie_src)*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___

###  NO_OLD_SAFARI_ARRAY_ITERATOR

• **NO_OLD_SAFARI_ARRAY_ITERATOR**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](_jscrewit_.featureall.md#no_old_safari_array_iterator)*

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.

___

###  NO_V8_SRC

• **NO_V8_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_V8_SRC](_jscrewit_.featureall.md#no_v8_src)*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox, Internet Explorer and Safari.

___

###  SAFARI

• **SAFARI**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI](_jscrewit_.featureall.md#safari)*

An alias for `SAFARI_12`.

___

###  SAFARI_10

• **SAFARI_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_10](_jscrewit_.featureall.md#safari_10)*

Features available in Safari 10 or later.

___

###  SAFARI_12

• **SAFARI_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_12](_jscrewit_.featureall.md#safari_12)*

Features available in Safari 12 or later.

___

###  SAFARI_7_0

• **SAFARI_7_0**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_0](_jscrewit_.featureall.md#safari_7_0)*

Features available in Safari 7.0.

___

###  SAFARI_7_1

• **SAFARI_7_1**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_1](_jscrewit_.featureall.md#safari_7_1)*

Features available in Safari 7.1 and Safari 8.

___

###  SAFARI_8

• **SAFARI_8**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_8](_jscrewit_.featureall.md#safari_8)*

An alias for `SAFARI_7_1`.

___

###  SAFARI_9

• **SAFARI_9**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_9](_jscrewit_.featureall.md#safari_9)*

Features available in Safari 9.

___

###  SELF

• **SELF**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF](_jscrewit_.featureall.md#self)*

An alias for `ANY_WINDOW`.

___

###  SELF_OBJ

• **SELF_OBJ**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF_OBJ](_jscrewit_.featureall.md#self_obj)*

Existence of the global object self whose string representation starts with "\[object ".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

___

###  STATUS

• **STATUS**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[STATUS](_jscrewit_.featureall.md#status)*

Existence of the global string status.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___

###  UNDEFINED

• **UNDEFINED**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[UNDEFINED](_jscrewit_.featureall.md#undefined)*

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.

___

###  UNEVAL

• **UNEVAL**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[UNEVAL](_jscrewit_.featureall.md#uneval)*

Existence of the global function uneval.

**`reamarks`** 

Available in Firefox before 74.

___

###  V8_SRC

• **V8_SRC**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[V8_SRC](_jscrewit_.featureall.md#v8_src)*

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`reamarks`** 

Available in Chrome, Edge, Opera, Android Browser and Node.js.

___

###  WINDOW

• **WINDOW**: *[ElementaryFeature](_jscrewit_.elementaryfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[WINDOW](_jscrewit_.featureall.md#window)*

Existence of the global object self having the string representation "\[object Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

## Methods

###  areCompatible

▸ **areCompatible**(...`features`: [FeatureElement](../modules/_jscrewit_.md#featureelement)[]): *boolean*

Determines whether the specified features are mutually compatible.

**`example`** 

```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
```

```js
// true
JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
```

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [FeatureElement](../modules/_jscrewit_.md#featureelement)[] |

**Returns:** *boolean*

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

___

###  areEqual

▸ **areEqual**(...`features`: [Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary
features, regardless of any other difference.

**`example`** 

```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

___

###  commonOf

▸ **commonOf**(...`features`: [Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](_jscrewit_.customfeature.md) | null*

Creates a new feature object equivalent to the intersection of the specified features.

**`example`** 

This will create a new feature object equivalent to <code>[NAME](_jscrewit_.featureconstructor.md#name)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code>.
This is because both <code>[HTMLDOCUMENT](_jscrewit_.featureconstructor.md#htmldocument)</code> and <code>[DOCUMENT](_jscrewit_.featureconstructor.md#document)</code> imply
<code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](_jscrewit_.customfeature.md) | null*

A feature object, or `null` if no arguments are specified.
