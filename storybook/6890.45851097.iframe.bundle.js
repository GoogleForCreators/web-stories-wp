/*! For license information please see 6890.45851097.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[4509,6890],{"./node_modules/core-js/modules/es.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./node_modules/core-js/modules/es.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/esnext.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.iterator.find.js")},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.iterator.some.js")},"./node_modules/cssjanus/src/cssjanus.js":(module,exports)=>{var cssjanus;function Tokenizer(regex,token){var matches=[],index=0;function tokenizeCallback(match){return matches.push(match),token}function detokenizeCallback(){return matches[index++]}return{tokenize:function(str){return str.replace(regex,tokenizeCallback)},detokenize:function(str){return str.replace(new RegExp("("+token+")","g"),detokenizeCallback)}}}cssjanus=new function CSSJanus(){var escapePattern="(?:(?:(?:\\\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)|\\\\[^\\r\\n\\f0-9a-f])",nmcharPattern="(?:[_a-z0-9-]|[^\\u0020-\\u007e]|"+escapePattern+")",quantPattern="(?:[0-9]*\\.[0-9]+|[0-9]+)(?:\\s*(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)|"+("-?"+("(?:[_a-z]|[^\\u0020-\\u007e]|"+escapePattern+")")+nmcharPattern+"*")+")?",signedQuantPattern="((?:-?"+quantPattern+")|(?:inherit|auto))",colorPattern="(#?"+nmcharPattern+"+|(?:rgba?|hsla?)\\([ \\d.,%-]+\\))",urlCharsPattern="(?:[!#$%&*-~]|[^\\u0020-\\u007e]|"+escapePattern+")*?",lookAheadNotOpenBracePattern="(?!("+nmcharPattern+"|\\r?\\n|\\s|#|\\:|\\.|\\,|\\+|>|\\(|\\)|\\[|\\]|=|\\*=|~=|\\^=|'[^']*'])*?{)",lookAheadNotClosingParenPattern="(?!"+urlCharsPattern+"['\"]?\\s*\\))",lookAheadForClosingParenPattern="(?="+urlCharsPattern+"['\"]?\\s*\\))",suffixPattern="(\\s*(?:!important\\s*)?[;}])",temporaryTokenRegExp=new RegExp("`TMP`","g"),commentRegExp=new RegExp("\\/\\*[^*]*\\*+([^\\/*][^*]*\\*+)*\\/","gi"),noFlipSingleRegExp=new RegExp("(\\/\\*\\!?\\s*@noflip\\s*\\*\\/"+lookAheadNotOpenBracePattern+"[^;}]+;?)","gi"),noFlipClassRegExp=new RegExp("(\\/\\*\\!?\\s*@noflip\\s*\\*\\/[^\\}]*?})","gi"),directionLtrRegExp=new RegExp("(direction\\s*:\\s*)ltr","gi"),directionRtlRegExp=new RegExp("(direction\\s*:\\s*)rtl","gi"),leftRegExp=new RegExp("(^|[^a-zA-Z])(left)(?![a-zA-Z])"+lookAheadNotClosingParenPattern+lookAheadNotOpenBracePattern,"gi"),rightRegExp=new RegExp("(^|[^a-zA-Z])(right)(?![a-zA-Z])"+lookAheadNotClosingParenPattern+lookAheadNotOpenBracePattern,"gi"),leftInUrlRegExp=new RegExp("(^|[^a-zA-Z])(left)"+lookAheadForClosingParenPattern,"gi"),rightInUrlRegExp=new RegExp("(^|[^a-zA-Z])(right)"+lookAheadForClosingParenPattern,"gi"),ltrInUrlRegExp=new RegExp("(^|[^a-zA-Z])(ltr)"+lookAheadForClosingParenPattern,"gi"),rtlInUrlRegExp=new RegExp("(^|[^a-zA-Z])(rtl)"+lookAheadForClosingParenPattern,"gi"),cursorEastRegExp=new RegExp("(^|[^a-zA-Z])([ns]?)e-resize","gi"),cursorWestRegExp=new RegExp("(^|[^a-zA-Z])([ns]?)w-resize","gi"),fourNotationQuantRegExp=new RegExp("((?:margin|padding|border-width)\\s*:\\s*)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+"(\\s+)"+signedQuantPattern+suffixPattern,"gi"),fourNotationColorRegExp=new RegExp("((?:-color|border-style)\\s*:\\s*)"+colorPattern+"(\\s+)"+colorPattern+"(\\s+)"+colorPattern+"(\\s+)"+colorPattern+suffixPattern,"gi"),bgHorizontalPercentageRegExp=new RegExp("(background(?:-position)?\\s*:\\s*(?:[^:;}\\s]+\\s+)*?)("+quantPattern+")","gi"),bgHorizontalPercentageXRegExp=new RegExp("(background-position-x\\s*:\\s*)(-?(?:[0-9]*\\.[0-9]+|[0-9]+)%)","gi"),borderRadiusRegExp=new RegExp("(border-radius\\s*:\\s*)"+signedQuantPattern+"(?:(?:\\s+"+signedQuantPattern+")(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?)?(?:(?:(?:\\s*\\/\\s*)"+signedQuantPattern+")(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?(?:\\s+"+signedQuantPattern+")?)?"+suffixPattern,"gi"),boxShadowRegExp=new RegExp("(box-shadow\\s*:\\s*(?:inset\\s*)?)"+signedQuantPattern,"gi"),textShadow1RegExp=new RegExp("(text-shadow\\s*:\\s*)"+signedQuantPattern+"(\\s*)"+colorPattern,"gi"),textShadow2RegExp=new RegExp("(text-shadow\\s*:\\s*)"+colorPattern+"(\\s*)"+signedQuantPattern,"gi"),textShadow3RegExp=new RegExp("(text-shadow\\s*:\\s*)"+signedQuantPattern,"gi"),translateXRegExp=new RegExp("(transform\\s*:[^;}]*)(translateX\\s*\\(\\s*)"+signedQuantPattern+"(\\s*\\))","gi"),translateRegExp=new RegExp("(transform\\s*:[^;}]*)(translate\\s*\\(\\s*)"+signedQuantPattern+"((?:\\s*,\\s*"+signedQuantPattern+"){0,2}\\s*\\))","gi");function calculateNewBackgroundPosition(match,pre,value){var idx,len;return"%"===value.slice(-1)&&(-1!==(idx=value.indexOf("."))?(len=value.length-idx-2,value=(value=100-parseFloat(value)).toFixed(len)+"%"):value=100-parseFloat(value)+"%"),pre+value}function flipBorderRadiusValues(values){switch(values.length){case 4:values=[values[1],values[0],values[3],values[2]];break;case 3:values=[values[1],values[0],values[1],values[2]];break;case 2:values=[values[1],values[0]];break;case 1:values=[values[0]]}return values.join(" ")}function calculateNewBorderRadius(match,pre){var args=[].slice.call(arguments),firstGroup=args.slice(2,6).filter((function(val){return val})),secondGroup=args.slice(6,10).filter((function(val){return val})),post=args[10]||"";return pre+(secondGroup.length?flipBorderRadiusValues(firstGroup)+" / "+flipBorderRadiusValues(secondGroup):flipBorderRadiusValues(firstGroup))+post}function flipSign(value){return 0===parseFloat(value)?value:"-"===value[0]?value.slice(1):"-"+value}function calculateNewShadow(match,property,offset){return property+flipSign(offset)}function calculateNewTranslate(match,property,prefix,offset,suffix){return property+prefix+flipSign(offset)+suffix}function calculateNewFourTextShadow(match,property,color,space,offset){return property+color+space+flipSign(offset)}return{transform:function(css,options){var noFlipSingleTokenizer=new Tokenizer(noFlipSingleRegExp,"`NOFLIP_SINGLE`"),noFlipClassTokenizer=new Tokenizer(noFlipClassRegExp,"`NOFLIP_CLASS`"),commentTokenizer=new Tokenizer(commentRegExp,"`COMMENT`");return css=commentTokenizer.tokenize(noFlipClassTokenizer.tokenize(noFlipSingleTokenizer.tokenize(css.replace("`","%60")))),options.transformDirInUrl&&(css=css.replace(ltrInUrlRegExp,"$1`TMP`").replace(rtlInUrlRegExp,"$1ltr").replace(temporaryTokenRegExp,"rtl")),options.transformEdgeInUrl&&(css=css.replace(leftInUrlRegExp,"$1`TMP`").replace(rightInUrlRegExp,"$1left").replace(temporaryTokenRegExp,"right")),css=css.replace(directionLtrRegExp,"$1`TMP`").replace(directionRtlRegExp,"$1ltr").replace(temporaryTokenRegExp,"rtl").replace(leftRegExp,"$1`TMP`").replace(rightRegExp,"$1left").replace(temporaryTokenRegExp,"right").replace(cursorEastRegExp,"$1$2`TMP`").replace(cursorWestRegExp,"$1$2e-resize").replace(temporaryTokenRegExp,"w-resize").replace(borderRadiusRegExp,calculateNewBorderRadius).replace(boxShadowRegExp,calculateNewShadow).replace(textShadow1RegExp,calculateNewFourTextShadow).replace(textShadow2RegExp,calculateNewFourTextShadow).replace(textShadow3RegExp,calculateNewShadow).replace(translateXRegExp,calculateNewTranslate).replace(translateRegExp,calculateNewTranslate).replace(fourNotationQuantRegExp,"$1$2$3$8$5$6$7$4$9").replace(fourNotationColorRegExp,"$1$2$3$8$5$6$7$4$9").replace(bgHorizontalPercentageRegExp,calculateNewBackgroundPosition).replace(bgHorizontalPercentageXRegExp,calculateNewBackgroundPosition),css=noFlipSingleTokenizer.detokenize(noFlipClassTokenizer.detokenize(commentTokenizer.detokenize(css)))}}},module.exports?exports.transform=function(css,options,transformEdgeInUrl){var norm;return"object"==typeof options?norm=options:(norm={},"boolean"==typeof options&&(norm.transformDirInUrl=options),"boolean"==typeof transformEdgeInUrl&&(norm.transformEdgeInUrl=transformEdgeInUrl)),cssjanus.transform(css,norm)}:"undefined"!=typeof window&&(window.cssjanus=cssjanus)},"./node_modules/react-transition-group/esm/TransitionGroup.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>esm_TransitionGroup});var objectWithoutPropertiesLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),assertThisInitialized=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js"),inheritsLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js"),react=__webpack_require__("./node_modules/react/index.js"),TransitionGroupContext=__webpack_require__("./node_modules/react-transition-group/esm/TransitionGroupContext.js");function getChildMapping(children,mapFn){var result=Object.create(null);return children&&react.Children.map(children,(function(c){return c})).forEach((function(child){result[child.key]=function mapper(child){return mapFn&&(0,react.isValidElement)(child)?mapFn(child):child}(child)})),result}function getProp(child,prop,props){return null!=props[prop]?props[prop]:child.props[prop]}function getNextChildMapping(nextProps,prevChildMapping,onExited){var nextChildMapping=getChildMapping(nextProps.children),children=function mergeChildMappings(prev,next){function getValueForKey(key){return key in next?next[key]:prev[key]}prev=prev||{},next=next||{};var i,nextKeysPending=Object.create(null),pendingKeys=[];for(var prevKey in prev)prevKey in next?pendingKeys.length&&(nextKeysPending[prevKey]=pendingKeys,pendingKeys=[]):pendingKeys.push(prevKey);var childMapping={};for(var nextKey in next){if(nextKeysPending[nextKey])for(i=0;i<nextKeysPending[nextKey].length;i++){var pendingNextKey=nextKeysPending[nextKey][i];childMapping[nextKeysPending[nextKey][i]]=getValueForKey(pendingNextKey)}childMapping[nextKey]=getValueForKey(nextKey)}for(i=0;i<pendingKeys.length;i++)childMapping[pendingKeys[i]]=getValueForKey(pendingKeys[i]);return childMapping}(prevChildMapping,nextChildMapping);return Object.keys(children).forEach((function(key){var child=children[key];if((0,react.isValidElement)(child)){var hasPrev=key in prevChildMapping,hasNext=key in nextChildMapping,prevChild=prevChildMapping[key],isLeaving=(0,react.isValidElement)(prevChild)&&!prevChild.props.in;!hasNext||hasPrev&&!isLeaving?hasNext||!hasPrev||isLeaving?hasNext&&hasPrev&&(0,react.isValidElement)(prevChild)&&(children[key]=(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:prevChild.props.in,exit:getProp(child,"exit",nextProps),enter:getProp(child,"enter",nextProps)})):children[key]=(0,react.cloneElement)(child,{in:!1}):children[key]=(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:!0,exit:getProp(child,"exit",nextProps),enter:getProp(child,"enter",nextProps)})}})),children}var values=Object.values||function(obj){return Object.keys(obj).map((function(k){return obj[k]}))},TransitionGroup=function(_React$Component){function TransitionGroup(props,context){var _this,handleExited=(_this=_React$Component.call(this,props,context)||this).handleExited.bind((0,assertThisInitialized.A)(_this));return _this.state={contextValue:{isMounting:!0},handleExited,firstRender:!0},_this}(0,inheritsLoose.A)(TransitionGroup,_React$Component);var _proto=TransitionGroup.prototype;return _proto.componentDidMount=function componentDidMount(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},_proto.componentWillUnmount=function componentWillUnmount(){this.mounted=!1},TransitionGroup.getDerivedStateFromProps=function getDerivedStateFromProps(nextProps,_ref){var props,onExited,prevChildMapping=_ref.children,handleExited=_ref.handleExited;return{children:_ref.firstRender?(props=nextProps,onExited=handleExited,getChildMapping(props.children,(function(child){return(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:!0,appear:getProp(child,"appear",props),enter:getProp(child,"enter",props),exit:getProp(child,"exit",props)})}))):getNextChildMapping(nextProps,prevChildMapping,handleExited),firstRender:!1}},_proto.handleExited=function handleExited(child,node){var currentChildMapping=getChildMapping(this.props.children);child.key in currentChildMapping||(child.props.onExited&&child.props.onExited(node),this.mounted&&this.setState((function(state){var children=(0,esm_extends.A)({},state.children);return delete children[child.key],{children}})))},_proto.render=function render(){var _this$props=this.props,Component=_this$props.component,childFactory=_this$props.childFactory,props=(0,objectWithoutPropertiesLoose.A)(_this$props,["component","childFactory"]),contextValue=this.state.contextValue,children=values(this.state.children).map(childFactory);return delete props.appear,delete props.enter,delete props.exit,null===Component?react.createElement(TransitionGroupContext.A.Provider,{value:contextValue},children):react.createElement(TransitionGroupContext.A.Provider,{value:contextValue},react.createElement(Component,props,children))},TransitionGroup}(react.Component);TransitionGroup.propTypes={},TransitionGroup.defaultProps={component:"div",childFactory:function childFactory(child){return child}};const esm_TransitionGroup=TransitionGroup},"./node_modules/stylis-plugin-rtl/dist/stylis-rtl.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var _cssjanus2=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__("./node_modules/cssjanus/src/cssjanus.js"));var STYLIS_PROPERTY_CONTEXT=-1;function stylisRTLPlugin(context,content){if(context===STYLIS_PROPERTY_CONTEXT)return _cssjanus2.default.transform(content)}Object.defineProperty(stylisRTLPlugin,"name",{value:"stylisRTLPlugin"}),exports.Ay=stylisRTLPlugin},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);