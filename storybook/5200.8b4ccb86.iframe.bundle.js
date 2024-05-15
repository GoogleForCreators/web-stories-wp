/*! For license information please see 5200.8b4ccb86.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5200,2262,9980,8964],{"./node_modules/@ap.cx/hues/dist/hues.umd.js":function(__unused_webpack_module,exports){!function(exports){"use strict";function str2rgba(str){var color,colorStr=str.toLowerCase();if("rgb"===colorStr.substring(0,3)){var matches=/^rgba?\s*\((\d+),\s*(\d+),\s*(\d+)([^)]*)\)$/.exec(colorStr);color={r:matches[1]/255,g:matches[2]/255,b:matches[3]/255,a:1},matches[4]&&(color.a=parseFloat(/^,\s*(.*)$/.exec(matches[4])[1]))}else"#"===colorStr.charAt(0)&&(colorStr=colorStr.substr(1)),3===colorStr.length&&(colorStr=colorStr.replace(/^(.)(.)(.)$/,"$1$1$2$2$3$3")),4===colorStr.length&&(colorStr=colorStr.replace(/^(.)(.)(.)(.)$/,"$1$1$2$2$3$3$4$4")),color={r:parseInt(colorStr.substr(0,2),16)/255,g:parseInt(colorStr.substr(2,2),16)/255,b:parseInt(colorStr.substr(4,2),16)/255,a:1},8===colorStr.length&&(color.a=parseInt(colorStr.substr(6,2),16)/255);return color}function rgba2hsla(_ref){var h,s,l,r=_ref.r,g=_ref.g,b=_ref.b,a=_ref.a,min=Math.min(r,g,b),max=Math.max(r,g,b),delta=max-min;return max===min?h=0:r===max?h=(g-b)/delta:g===max?h=2+(b-r)/delta:b===max&&(h=4+(r-g)/delta),(h=Math.min(60*h,360))<0&&(h+=360),l=(min+max)/2,s=max===min?0:l<=.5?delta/(max+min):delta/(2-max-min),{h,s:s*=100,l:l*=100,a}}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread2(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest()}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}function _iterableToArrayLimit(arr,i){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(arr)){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function rgb2hsl(rgb){var _rgba2hsla=rgba2hsla(_objectSpread2(_objectSpread2({},rgb),{},{a:1}));return{h:_rgba2hsla.h,s:_rgba2hsla.s,l:_rgba2hsla.l}}function hsla2rgba(_ref){var r,g,b,m,c,x,h=_ref.h,s=_ref.s,l=_ref.l,a=_ref.a;return isFinite(h)||(h=0),isFinite(s)||(s=0),isFinite(l)||(l=0),(h/=60)<0&&(h=6- -h%6),h%=6,s=Math.max(0,Math.min(1,s/100)),l=Math.max(0,Math.min(1,l/100)),x=(c=(1-Math.abs(2*l-1))*s)*(1-Math.abs(h%2-1)),h<1?(r=c,g=x,b=0):h<2?(r=x,g=c,b=0):h<3?(r=0,g=c,b=x):h<4?(r=0,g=x,b=c):h<5?(r=x,g=0,b=c):(r=c,g=0,b=x),{r:r+=m=l-c/2,g:g+=m,b:b+=m,a}}function hsl2rgb(hsl){var _hsla2rgba=hsla2rgba(_objectSpread2(_objectSpread2({},hsl),{},{a:1}));return{r:_hsla2rgba.r,g:_hsla2rgba.g,b:_hsla2rgba.b}}function rgba2hex(_ref){var r=_ref.r,g=_ref.g,b=_ref.b,a=_ref.a;return"#"+(255*r|256).toString(16).slice(1)+(255*g|256).toString(16).slice(1)+(255*b|256).toString(16).slice(1)+(255*a|256).toString(16).slice(1)}function rgb2hex(rgb){return rgba2hex(_objectSpread2(_objectSpread2({},rgb),{},{a:1})).slice(0,7)}function contrast(l1,l2){return(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}function relativeLuminance(_ref){var r=_ref.r,g=_ref.g,b=_ref.b,a=_ref.a,_map2=_slicedToArray([r,g,b].map((function(c){return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)})),3);return(.2126*_map2[0]+.7152*_map2[1]+.0722*_map2[2])*a}var ratios={"min-ratio-3":{description:"(WCAG AA, large text)",minRatio:3},"min-ratio-4.5":{description:"(WCAG AA, normal text / WCAG AAA, large text)",minRatio:4.5},"min-ratio-7":{description:"(WCAG AAA, normal text)",minRatio:7},"AA-large":{description:"(WCAG AA, large text)",minRatio:3},AA:{description:"(WCAG AA, normal text)",minRatio:4.5},AAA:{description:"(WCAG AAA, normal text)",minRatio:7}};function aa(ratio){var verbose=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return ratio>=3&&(arguments.length>1&&void 0!==arguments[1]?arguments[1]:16)>=18?(verbose&&console.log(ratios["min-ratio-3"]),!0):ratio>=4.5&&(verbose&&console.log(ratios["min-ratio-4.5"]),!0)}function aaa(ratio){var verbose=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return ratio>=4.5&&(arguments.length>1&&void 0!==arguments[1]?arguments[1]:16)>=18?(verbose&&console.log(ratios["min-ratio-4.5"]),!0):ratio>=7&&(verbose&&console.log(ratios["min-ratio-7"]),!0)}function hslaVector3(_ref,v3){var h=_ref.h,s=_ref.s,l=_ref.l,a=_ref.a,hv=v3[0],sv=v3[1],lv=v3[2],h1=(h+hv)%360;return h1<0&&(h1+=360),{h:h1,s:Math.min(Math.max(s+sv,0),100),l:Math.min(Math.max(l+lv,0),100),a}}var THRESHOLD=.1;function getAccesibleHexColor(rgba,background,ratio){var r,result=rgba;do{r=contrast(relativeLuminance(str2rgba(rgba2hex(result=hsla2rgba(hslaVector3(rgba2hsla(result),[0,0,THRESHOLD]))))),relativeLuminance(background))}while(Math.round(100*r)/100<=ratio);return result}exports.aa=aa,exports.aaa=aaa,exports.contrast=contrast,exports.getAccesibleHexColor=getAccesibleHexColor,exports.hsl2rgb=hsl2rgb,exports.hsla2rgba=hsla2rgba,exports.hslaVector3=hslaVector3,exports.ratios=ratios,exports.relativeLuminance=relativeLuminance,exports.rgb2hex=rgb2hex,exports.rgb2hsl=rgb2hsl,exports.rgba2hex=rgba2hex,exports.rgba2hsla=rgba2hsla,exports.str2rgba=str2rgba,Object.defineProperty(exports,"__esModule",{value:!0})}(exports)},"./node_modules/core-js/internals/add-to-unscopables.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,UNSCOPABLES=wellKnownSymbol("unscopables"),ArrayPrototype=Array.prototype;void 0===ArrayPrototype[UNSCOPABLES]&&defineProperty(ArrayPrototype,UNSCOPABLES,{configurable:!0,value:create(null)}),module.exports=function(key){ArrayPrototype[UNSCOPABLES][key]=!0}},"./node_modules/core-js/internals/array-from-constructor-and-list.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js");module.exports=function(Constructor,list,$length){for(var index=0,length=arguments.length>2?$length:lengthOfArrayLike(list),result=new Constructor(length);length>index;)result[index]=list[index++];return result}},"./node_modules/core-js/internals/array-group.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var bind=__webpack_require__("./node_modules/core-js/internals/function-bind-context.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),toPropertyKey=__webpack_require__("./node_modules/core-js/internals/to-property-key.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),objectCreate=__webpack_require__("./node_modules/core-js/internals/object-create.js"),arrayFromConstructorAndList=__webpack_require__("./node_modules/core-js/internals/array-from-constructor-and-list.js"),$Array=Array,push=uncurryThis([].push);module.exports=function($this,callbackfn,that,specificConstructor){for(var Constructor,key,value,O=toObject($this),self=IndexedObject(O),boundFunction=bind(callbackfn,that),target=objectCreate(null),length=lengthOfArrayLike(self),index=0;length>index;index++)value=self[index],(key=toPropertyKey(boundFunction(value,index,O)))in target?push(target[key],value):target[key]=[value];if(specificConstructor&&(Constructor=specificConstructor(O))!==$Array)for(key in target)target[key]=arrayFromConstructorAndList(Constructor,target[key]);return target}},"./node_modules/core-js/modules/esnext.array.group.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$group=__webpack_require__("./node_modules/core-js/internals/array-group.js"),addToUnscopables=__webpack_require__("./node_modules/core-js/internals/add-to-unscopables.js");$({target:"Array",proto:!0},{group:function group(callbackfn){return $group(this,callbackfn,arguments.length>1?arguments[1]:void 0)}}),addToUnscopables("group")},"./node_modules/core-js/modules/esnext.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/cssjanus/src/cssjanus.js":(module,exports)=>{var cssjanus;function Tokenizer(regex,token){var matches=[],index=0;function tokenizeCallback(match){return matches.push(match),token}function detokenizeCallback(){return matches[index++]}return{tokenize:function(str){return str.replace(regex,tokenizeCallback)},detokenize:function(str){return str.replace(new RegExp("("+token+")","g"),detokenizeCallback)}}}cssjanus=new function CSSJanus(){var escapePattern="(?:(?:(?:\\\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)|\\\\[^\\r\\n\\f0-9a-f])",nmcharPattern="(?:[_a-z0-9-]|[^\\u0020-\\u007e]|"+escapePattern+")",quantPattern="(?:[0-9]*\\.[0-9]+|[0-9]+)(?:\\s*(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)|"+("-?"+("(?:[_a-z]|[^\\u0020-\\u007e]|"+escapePattern+")")+nmcharPattern+"*")+")?",signedQuantPattern="((?:-?"+quantPattern+")|(?:inherit|auto))",colorPattern="(#?"+nmcharPattern+"+|(?:rgba?|hsla?)\\([ \\d.,%-]+\\))",urlCharsPattern="(?:[!#$%&*-~]|[^\\u0020-\\u007e]|"+escapePattern+")*?",lookAheadNotOpenBracePattern="(?!("+nmcharPattern+"|\\r?\\n|\\s|#|\\:|\\.|\\,|\\+|>|\\(|\\)|\\[|\\]|=|\\*=|~=|\\^=|'[^']*'])*?{)",lookAheadNotClosingParenPattern="(?!"+urlCharsPattern+"['\"]?\\s*\\))",lookAheadForClosingParenPattern="(?="+urlCharsPattern+"['\"]?\\s*\\))",suffixPattern="(\\s*(?:!important\\s*)?[;}])",temporaryTokenRegExp=new RegExp("`TMP`","g"),commentRegExp=new RegExp("\\/\\*[^*]*\\*+([^\\/*][^*]*\\*+)*\\/","gi"),noFlipSingleRegExp=new RegExp("(\\/\\*\\!?\\s*@noflip\\s*\\*\\/"+lookAheadNotOpenBracePattern+"[^;}]+;?)","gi"),noFlipClassRegExp=new RegExp("(\\/\\*\\!?\\s*@noflip\\s*\\*\\/[^\\}]*?})","gi"),directionLtrRegExp=new RegExp("(direction\\s*:\\s*)ltr","gi"),directionRtlRegExp=new RegExp("(direction\\s*:\\s*)rtl","gi"),leftRegExp=new RegExp("(^|[^a-zA-Z])(left)(?![a-zA-Z])"+lookAheadNotClosingParenPattern+lookAheadNotOpenBracePattern,"gi"),rightRegExp=new RegExp("(^|[^a-zA-Z])(right)(?![a-zA-Z])"+lookAheadNotClosingParenPattern+lookAheadNotOpenBracePattern,"gi"),leftInUrlRegExp=new RegExp("(^|[^a-zA-Z])(left)"+lookAheadForClosingParenPattern,"gi"),rightInUrlRegExp=new RegExp("(^|[^a-zA-Z])(right)"+lookAheadForClosingParenPattern,"gi"),ltrInUrlRegExp=new RegExp("(^|[^a-zA-Z])(ltr)"+lookAheadForClosingParenPattern,"gi"),rtlInUrlRegExp=new RegExp("(^|[^a-zA-Z])(rtl)"+lookAheadForClosingParenPattern,"gi"),cursorEastRegExp=new RegExp("(^|[^a-zA-Z])([ns]?)e-resize","gi"),cursorWestRegExp=new RegExp("(^|[^a-zA-Z])([ns]?)w-resize","gi"),fourNotationQuantRegExp=new RegExp("((?:margin|padding|border-width)\\s*:\\s*)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+suffixPattern,"gi"),fourNotationColorRegExp=new RegExp("((?:-color|border-style)\\s*:\\s*)"+colorPattern+"(\\s+)"+colorPattern+"(\\s+)"+colorPattern+"(\\s+)"+colorPattern+suffixPattern,"gi"),bgHorizontalPercentageRegExp=new RegExp("(background(?:-position)?\\s*:\\s*(?:[^:;}\\s]+\\s+)*?)("+quantPattern+")","gi"),bgHorizontalPercentageXRegExp=new RegExp("(background-position-x\\s*:\\s*)(-?(?:[0-9]*\\.[0-9]+|[0-9]+)%)","gi"),borderRadiusRegExp=new RegExp("(border-radius\\s*:\\s*)"+signedQuantPattern+"(?:(?:\\s+"+signedQuantPattern+")(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?)?(?:(?:(?:\\s*\\/\\s*)"+signedQuantPattern+")(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?)?"+suffixPattern,"gi"),boxShadowRegExp=new RegExp("(box-shadow\\s*:\\s*(?:inset\\s*)?)"+signedQuantPattern,"gi"),textShadow1RegExp=new RegExp("(text-shadow\\s*:\\s*)"+signedQuantPattern+"(\\s*)"+colorPattern,"gi"),textShadow2RegExp=new RegExp("(text-shadow\\s*:\\s*)"+colorPattern+"(\\s*)"+signedQuantPattern,"gi"),textShadow3RegExp=new RegExp("(text-shadow\\s*:\\s*)"+signedQuantPattern,"gi"),translateXRegExp=new RegExp("(transform\\s*:[^;}]*)(translateX\\s*\\(\\s*)"+signedQuantPattern+"(\\s*\\))","gi"),translateRegExp=new RegExp("(transform\\s*:[^;}]*)(translate\\s*\\(\\s*)"+signedQuantPattern+"((?:\\s*,\\s*"+signedQuantPattern+"){0,2}\\s*\\))","gi");function calculateNewBackgroundPosition(match,pre,value){var idx,len;return"%"===value.slice(-1)&&(-1!==(idx=value.indexOf("."))?(len=value.length-idx-2,value=(value=100-parseFloat(value)).toFixed(len)+"%"):value=100-parseFloat(value)+"%"),pre+value}function flipBorderRadiusValues(values){switch(values.length){case 4:values=[values[1],values[0],values[3],values[2]];break;case 3:values=[values[1],values[0],values[1],values[2]];break;case 2:values=[values[1],values[0]];break;case 1:values=[values[0]]}return values.join(" ")}function calculateNewBorderRadius(match,pre){var args=[].slice.call(arguments),firstGroup=args.slice(2,6).filter((function(val){return val})),secondGroup=args.slice(6,10).filter((function(val){return val})),post=args[10]||"";return pre+(secondGroup.length?flipBorderRadiusValues(firstGroup)+" / "+flipBorderRadiusValues(secondGroup):flipBorderRadiusValues(firstGroup))+post}function flipSign(value){return 0===parseFloat(value)?value:"-"===value[0]?value.slice(1):"-"+value}function calculateNewShadow(match,property,offset){return property+flipSign(offset)}function calculateNewTranslate(match,property,prefix,offset,suffix){return property+prefix+flipSign(offset)+suffix}function calculateNewFourTextShadow(match,property,color,space,offset){return property+color+space+flipSign(offset)}return{transform:function(css,options){var noFlipSingleTokenizer=new Tokenizer(noFlipSingleRegExp,"`NOFLIP_SINGLE`"),noFlipClassTokenizer=new Tokenizer(noFlipClassRegExp,"`NOFLIP_CLASS`"),commentTokenizer=new Tokenizer(commentRegExp,"`COMMENT`");return css=commentTokenizer.tokenize(noFlipClassTokenizer.tokenize(noFlipSingleTokenizer.tokenize(css.replace("`","%60")))),options.transformDirInUrl&&(css=css.replace(ltrInUrlRegExp,"$1`TMP`").replace(rtlInUrlRegExp,"$1ltr").replace(temporaryTokenRegExp,"rtl")),options.transformEdgeInUrl&&(css=css.replace(leftInUrlRegExp,"$1`TMP`").replace(rightInUrlRegExp,"$1left").replace(temporaryTokenRegExp,"right")),css=css.replace(directionLtrRegExp,"$1`TMP`").replace(directionRtlRegExp,"$1ltr").replace(temporaryTokenRegExp,"rtl").replace(leftRegExp,"$1`TMP`").replace(rightRegExp,"$1left").replace(temporaryTokenRegExp,"right").replace(cursorEastRegExp,"$1$2`TMP`").replace(cursorWestRegExp,"$1$2e-resize").replace(temporaryTokenRegExp,"w-resize").replace(borderRadiusRegExp,calculateNewBorderRadius).replace(boxShadowRegExp,calculateNewShadow).replace(textShadow1RegExp,calculateNewFourTextShadow).replace(textShadow2RegExp,calculateNewFourTextShadow).replace(textShadow3RegExp,calculateNewShadow).replace(translateXRegExp,calculateNewTranslate).replace(translateRegExp,calculateNewTranslate).replace(fourNotationQuantRegExp,"$1$2$3$8$5$6$7$4$9").replace(fourNotationColorRegExp,"$1$2$3$8$5$6$7$4$9").replace(bgHorizontalPercentageRegExp,calculateNewBackgroundPosition).replace(bgHorizontalPercentageXRegExp,calculateNewBackgroundPosition),css=noFlipSingleTokenizer.detokenize(noFlipClassTokenizer.detokenize(commentTokenizer.detokenize(css)))}}},module.exports?exports.transform=function(css,options,transformEdgeInUrl){var norm;return"object"==typeof options?norm=options:(norm={},"boolean"==typeof options&&(norm.transformDirInUrl=options),"boolean"==typeof transformEdgeInUrl&&(norm.transformEdgeInUrl=transformEdgeInUrl)),cssjanus.transform(css,norm)}:"undefined"!=typeof window&&(window.cssjanus=cssjanus)},"./node_modules/stylis-plugin-rtl/dist/stylis-rtl.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var _cssjanus2=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__("./node_modules/cssjanus/src/cssjanus.js"));var STYLIS_PROPERTY_CONTEXT=-1;function stylisRTLPlugin(context,content){if(context===STYLIS_PROPERTY_CONTEXT)return _cssjanus2.default.transform(content)}Object.defineProperty(stylisRTLPlugin,"name",{value:"stylisRTLPlugin"}),exports.ZP=stylisRTLPlugin},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/story-editor/node_modules/react-blurhash/dist/esm/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{E:()=>u});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),blurhash__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/blurhash/dist/esm/index.js"),P=Object.defineProperty,R=Object.defineProperties,C=Object.getOwnPropertyDescriptors,m=Object.getOwnPropertySymbols,v=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable,b=(e,s,t)=>s in e?P(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t,h=(e,s)=>{for(var t in s||(s={}))v.call(s,t)&&b(e,t,s[t]);if(m)for(var t of m(s))x.call(s,t)&&b(e,t,s[t]);return e},p=(e,s)=>R(e,C(s)),g=(e,s)=>{var t={};for(var r in e)v.call(e,r)&&s.indexOf(r)<0&&(t[r]=e[r]);if(null!=e&&m)for(var r of m(e))s.indexOf(r)<0&&x.call(e,r)&&(t[r]=e[r]);return t},o=class extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{constructor(){super(...arguments),this.canvas=null,this.handleRef=t=>{this.canvas=t,this.draw()},this.draw=()=>{let{hash:t,height:r,punch:n,width:a}=this.props;if(this.canvas){let i=(0,blurhash__WEBPACK_IMPORTED_MODULE_1__.Jx)(t,a,r,n),c=this.canvas.getContext("2d"),d=c.createImageData(a,r);d.data.set(i),c.putImageData(d,0,0)}}}componentDidUpdate(){this.draw()}render(){let i=this.props,{hash:t,height:r,width:n}=i,a=g(i,["hash","height","width"]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("canvas",p(h({},a),{height:r,width:n,ref:this.handleRef}))}};o.defaultProps={height:128,width:128};var D={position:"absolute",top:0,bottom:0,left:0,right:0,width:"100%",height:"100%"},u=class extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{componentDidUpdate(){if(this.props.resolutionX<=0)throw new Error("resolutionX must be larger than zero");if(this.props.resolutionY<=0)throw new Error("resolutionY must be larger than zero")}render(){let w=this.props,{hash:s,height:t,width:r,punch:n,resolutionX:a,resolutionY:i,style:c}=w,d=g(w,["hash","height","width","punch","resolutionX","resolutionY","style"]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",p(h({},d),{style:p(h({display:"inline-block",height:t,width:r},c),{position:"relative"})}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(o,{hash:s,height:i,width:a,punch:n,style:D}))}};u.defaultProps={height:128,width:128,resolutionX:32,resolutionY:32}}}]);