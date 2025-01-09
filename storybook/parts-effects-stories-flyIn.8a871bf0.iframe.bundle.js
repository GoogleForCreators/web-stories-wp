"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6699],{"./packages/animation/src/parts/effects/stories/flyIn.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_units__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/units/src/dimensions.ts")),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/animation/src/components/index.ts"),_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/animation/src/types/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/animation/src/storybookUtils/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Animations/Effects/Fly-In"},animations=[{id:"1",targets:["e1"],type:_types__WEBPACK_IMPORTED_MODULE_3__.J6.EffectFlyIn},{id:"2",targets:["e2"],type:_types__WEBPACK_IMPORTED_MODULE_3__.J6.EffectFlyIn,delay:500,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.m3.LeftToRight},{id:"3",targets:["e3"],type:_types__WEBPACK_IMPORTED_MODULE_3__.J6.EffectFlyIn,delay:1e3,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.m3.RightToLeft},{id:"4",targets:["e4"],type:_types__WEBPACK_IMPORTED_MODULE_3__.J6.EffectFlyIn,delay:1500,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.m3.BottomToTop}],elements=[{id:"e1",color:"red",x:50,y:100,width:50,height:50},{id:"e2",color:"orange",x:50,y:175,width:50,height:50},{id:"e3",color:"blue",x:50,y:250,width:50,height:50},{id:"e4",color:"yellow",x:50,y:325,width:50,height:50}],defaultStyles={position:"relative",width:"50px",height:"50px"},_default={render:function Render(){const elementBoxes=elements.map((element=>({...element,...(0,_googleforcreators_units__WEBPACK_IMPORTED_MODULE_5__.YH)(element,100,100)})));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.zB,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-0"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"Empty first page")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-1"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"AMP Fly In"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-grid-layer",{template:"vertical","aspect-ratio":_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.yw},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fly-in-top",style:{backgroundColor:"red",...defaultStyles}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fly-in-left","animate-in-delay":"0.5s",style:{backgroundColor:"orange",...defaultStyles}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fly-in-right","animate-in-delay":"1.0s",style:{backgroundColor:"blue",...defaultStyles}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"animate-in":"fly-in-bottom","animate-in-delay":"1.5s",style:{backgroundColor:"yellow",...defaultStyles}}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-2"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.AnimationProvider,{animations,elements},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.AMPAnimations,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"Custom Fly In Effect"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-grid-layer",{template:"vertical","aspect-ratio":_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.yw},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"page-fullbleed-area"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"page-safe-area"},elementBoxes.map((({id,color,x,y,width,height})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:id,style:{position:"absolute",top:`${y}%`,left:`${x}%`,width:`${width}%`,height:`${height}%`}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.AMPWrapper,{target:id},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{width:"100%",height:"100%",backgroundColor:color}})))))))))))}}},"./packages/animation/src/storybookUtils/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{zB:()=>AMPStoryWrapper,yw:()=>AMP_STORY_ASPECT_RATIO,DM:()=>PlayButton});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),constants=__webpack_require__("./packages/units/src/constants.ts"),components=__webpack_require__("./packages/animation/src/components/index.ts");const ampBoilerplate=function Boilerplate(){const $=(0,dist.c)(2);let t0,t1;return $[0]===Symbol.for("react.memo_cache_sentinel")?(t0=react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}"}}),$[0]=t0):t0=$[0],$[1]===Symbol.for("react.memo_cache_sentinel")?(t1=react.createElement(react.Fragment,null,t0,react.createElement("noscript",null,react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}"}}))),$[1]=t1):t1=$[1],t1},AMP_STORY_ASPECT_RATIO=`${constants.bj}:${constants.WY}`;function AMPStoryWrapper(t0){const $=(0,dist.c)(4),{children}=t0;let t1,t2,t3;return $[0]===Symbol.for("react.memo_cache_sentinel")?(t1={width:"100%",height:"640px"},t2=react.createElement(ampBoilerplate,null),$[0]=t1,$[1]=t2):(t1=$[0],t2=$[1]),$[2]!==children?(t3=react.createElement("div",{style:t1},t2,react.createElement("amp-story",{standalone:!0,title:"My Story",publisher:"The AMP Team","publisher-logo-src":"https://example.com/logo/1x1.png","poster-portrait-src":"https://example.com/my-story/poster/3x4.jpg"},children)),$[2]=children,$[3]=t3):t3=$[3],t3}AMPStoryWrapper.propTypes={children:prop_types_default().node};const PlayButton=()=>{const $=(0,dist.c)(11),{actions:t0}=(0,components.useStoryAnimationContext)(),{WAAPIAnimationMethods}=t0;let t1;$[0]===Symbol.for("react.memo_cache_sentinel")?(t1={play:"play",pause:"pause",reset:"reset"},$[0]=t1):t1=$[0];const label=t1;let t2,t3,t4,t5;return $[1]!==WAAPIAnimationMethods.play?(t2=react.createElement("button",{onClick:WAAPIAnimationMethods.play},label.play),$[1]=WAAPIAnimationMethods.play,$[2]=t2):t2=$[2],$[3]!==WAAPIAnimationMethods.pause?(t3=react.createElement("button",{onClick:WAAPIAnimationMethods.pause},label.pause),$[3]=WAAPIAnimationMethods.pause,$[4]=t3):t3=$[4],$[5]!==WAAPIAnimationMethods.reset?(t4=react.createElement("button",{onClick:WAAPIAnimationMethods.reset},label.reset),$[5]=WAAPIAnimationMethods.reset,$[6]=t4):t4=$[6],$[7]!==t2||$[8]!==t3||$[9]!==t4?(t5=react.createElement(react.Fragment,null,t2,t3,t4),$[7]=t2,$[8]=t3,$[9]=t4,$[10]=t5):t5=$[10],t5}},"./node_modules/core-js/internals/get-iterator-flattenable.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorMethod=__webpack_require__("./node_modules/core-js/internals/get-iterator-method.js");module.exports=function(obj,stringHandling){stringHandling&&"string"==typeof obj||anObject(obj);var method=getIteratorMethod(obj);return getIteratorDirect(anObject(void 0!==method?call(method,obj):obj))}},"./node_modules/core-js/modules/es.iterator.every.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{every:function every(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return!iterate(record,(function(value,stop){if(!predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/es.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorFlattenable=__webpack_require__("./node_modules/core-js/internals/get-iterator-flattenable.js"),createIteratorProxy=__webpack_require__("./node_modules/core-js/internals/iterator-create-proxy.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),IteratorProxy=createIteratorProxy((function(){for(var result,inner,iterator=this.iterator,mapper=this.mapper;;){if(inner=this.inner)try{if(!(result=anObject(call(inner.next,inner.iterator))).done)return result.value;this.inner=null}catch(error){iteratorClose(iterator,"throw",error)}if(result=anObject(call(this.next,iterator)),this.done=!!result.done)return;try{this.inner=getIteratorFlattenable(mapper(result.value,this.counter++),!1)}catch(error){iteratorClose(iterator,"throw",error)}}}));$({target:"Iterator",proto:!0,real:!0,forced:IS_PURE},{flatMap:function flatMap(mapper){return anObject(this),aCallable(mapper),new IteratorProxy(getIteratorDirect(this),{mapper,inner:null})}})},"./node_modules/core-js/modules/es.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/esnext.iterator.every.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.iterator.every.js")},"./node_modules/core-js/modules/esnext.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.iterator.flat-map.js")},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.iterator.some.js")},"./packages/animation/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);