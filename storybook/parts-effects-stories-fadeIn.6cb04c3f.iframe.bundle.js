(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[8244],{"./packages/animation/src/parts/effects/stories/fadeIn.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/animation/src/components/index.ts"),_types__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/animation/src/types/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/animation/src/storybookUtils/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Animations/Effects/Fade-In"},animations=[{id:"1",targets:["e1"],type:_types__WEBPACK_IMPORTED_MODULE_2__.J6.EffectFade,duration:1e3},{id:"2",targets:["e2"],type:_types__WEBPACK_IMPORTED_MODULE_2__.J6.Fade,duration:2500}],elements=[{id:"e1",color:"red"},{id:"e2",color:"orange"}],defaultStyles={position:"relative",width:"50px",height:"50px"},_default={render:function Render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_3__.zB,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-0"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"Empty first page")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-1"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"AMP Fade In"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-grid-layer",{template:"horizontal"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fade-in","animate-in-duration":"1s",style:{backgroundColor:"red",...defaultStyles}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fade-in","animate-in-duration":"2.5s",style:{backgroundColor:"orange",...defaultStyles}}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-2"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AnimationProvider,{animations},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AMPAnimations,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"Custom Fade In Effect"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-grid-layer",{template:"horizontal"},elements.map((({id,color})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:id,style:defaultStyles},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AMPWrapper,{target:id},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{width:"100%",height:"100%",backgroundColor:color}})))))))))}}},"./packages/animation/src/storybookUtils/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{zB:()=>AMPStoryWrapper,yw:()=>AMP_STORY_ASPECT_RATIO,DM:()=>PlayButton});var react=__webpack_require__("./node_modules/react/index.js"),constants=__webpack_require__("./packages/units/src/constants.ts"),components=__webpack_require__("./packages/animation/src/components/index.ts");const ampBoilerplate=function Boilerplate(){return react.createElement(react.Fragment,null,react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}"}}),react.createElement("noscript",null,react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}"}})))},AMP_STORY_ASPECT_RATIO=`${constants.bj}:${constants.WY}`;function AMPStoryWrapper({children}){return react.createElement("div",{style:{width:"100%",height:"640px"}},react.createElement(ampBoilerplate,null),react.createElement("amp-story",{standalone:!0,title:"My Story",publisher:"The AMP Team","publisher-logo-src":"https://example.com/logo/1x1.png","poster-portrait-src":"https://example.com/my-story/poster/3x4.jpg"},children))}const PlayButton=()=>{const{actions:{WAAPIAnimationMethods}}=(0,components.useStoryAnimationContext)(),label_play="play",label_pause="pause",label_reset="reset";return react.createElement(react.Fragment,null,react.createElement("button",{onClick:WAAPIAnimationMethods.play},label_play),react.createElement("button",{onClick:WAAPIAnimationMethods.pause},label_pause),react.createElement("button",{onClick:WAAPIAnimationMethods.reset},label_reset))}},"./node_modules/core-js/internals/get-iterator-flattenable.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorMethod=__webpack_require__("./node_modules/core-js/internals/get-iterator-method.js");module.exports=function(obj,stringHandling){stringHandling&&"string"==typeof obj||anObject(obj);var method=getIteratorMethod(obj);return getIteratorDirect(anObject(void 0!==method?call(method,obj):obj))}},"./node_modules/core-js/modules/es.iterator.every.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{every:function every(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return!iterate(record,(function(value,stop){if(!predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/es.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorFlattenable=__webpack_require__("./node_modules/core-js/internals/get-iterator-flattenable.js"),createIteratorProxy=__webpack_require__("./node_modules/core-js/internals/iterator-create-proxy.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),IteratorProxy=createIteratorProxy((function(){for(var result,inner,iterator=this.iterator,mapper=this.mapper;;){if(inner=this.inner)try{if(!(result=anObject(call(inner.next,inner.iterator))).done)return result.value;this.inner=null}catch(error){iteratorClose(iterator,"throw",error)}if(result=anObject(call(this.next,iterator)),this.done=!!result.done)return;try{this.inner=getIteratorFlattenable(mapper(result.value,this.counter++),!1)}catch(error){iteratorClose(iterator,"throw",error)}}}));$({target:"Iterator",proto:!0,real:!0,forced:IS_PURE},{flatMap:function flatMap(mapper){return anObject(this),aCallable(mapper),new IteratorProxy(getIteratorDirect(this),{mapper,inner:null})}})},"./node_modules/core-js/modules/es.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/esnext.iterator.every.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.iterator.every.js")},"./node_modules/core-js/modules/esnext.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.iterator.flat-map.js")},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.iterator.some.js")},"./node_modules/prop-types/factoryWithThrowingShims.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var ReactPropTypesSecret=__webpack_require__("./node_modules/prop-types/lib/ReactPropTypesSecret.js");function emptyFunction(){}function emptyFunctionWithReset(){}emptyFunctionWithReset.resetWarningCache=emptyFunction,module.exports=function(){function shim(props,propName,componentName,location,propFullName,secret){if(secret!==ReactPropTypesSecret){var err=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw err.name="Invariant Violation",err}}function getShim(){return shim}shim.isRequired=shim;var ReactPropTypes={array:shim,bigint:shim,bool:shim,func:shim,number:shim,object:shim,string:shim,symbol:shim,any:shim,arrayOf:getShim,element:shim,elementType:shim,instanceOf:getShim,node:shim,objectOf:getShim,oneOf:getShim,oneOfType:getShim,shape:getShim,exact:getShim,checkPropTypes:emptyFunctionWithReset,resetWarningCache:emptyFunction};return ReactPropTypes.PropTypes=ReactPropTypes,ReactPropTypes}},"./node_modules/prop-types/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/prop-types/factoryWithThrowingShims.js")()},"./node_modules/prop-types/lib/ReactPropTypesSecret.js":module=>{"use strict";module.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},"./packages/animation/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);