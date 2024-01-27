"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[4888],{"./packages/animation/src/parts/effects/stories/flyIn.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_units__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/units/src/dimensions.ts"),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/animation/src/components/index.ts"),_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/animation/src/types/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/animation/src/storybookUtils/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Animations/Effects/Fly-In"},animations=[{id:"1",targets:["e1"],type:_types__WEBPACK_IMPORTED_MODULE_3__.ru.EffectFlyIn},{id:"2",targets:["e2"],type:_types__WEBPACK_IMPORTED_MODULE_3__.ru.EffectFlyIn,delay:500,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.sc.LeftToRight},{id:"3",targets:["e3"],type:_types__WEBPACK_IMPORTED_MODULE_3__.ru.EffectFlyIn,delay:1e3,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.sc.RightToLeft},{id:"4",targets:["e4"],type:_types__WEBPACK_IMPORTED_MODULE_3__.ru.EffectFlyIn,delay:1500,flyInDir:_types__WEBPACK_IMPORTED_MODULE_3__.sc.BottomToTop}],elements=[{id:"e1",color:"red",x:50,y:100,width:50,height:50},{id:"e2",color:"orange",x:50,y:175,width:50,height:50},{id:"e3",color:"blue",x:50,y:250,width:50,height:50},{id:"e4",color:"yellow",x:50,y:325,width:50,height:50}],defaultStyles={position:"relative",width:"50px",height:"50px"},_default={render:function Render(){const elementBoxes=elements.map((element=>({...element,...(0,_googleforcreators_units__WEBPACK_IMPORTED_MODULE_6__.iz)(element,100,100)})));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.CU,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("amp-story-page",{id:"page-0",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p",{style:{textAlign:"center",color:"#fff"},children:"Empty first page"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("amp-story-page",{id:"page-1",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p",{style:{textAlign:"center",color:"#fff"},children:"AMP Fly In"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("amp-story-grid-layer",{template:"vertical","aspect-ratio":_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.bC,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{"animate-in":"fly-in-top",style:{backgroundColor:"red",...defaultStyles}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{"animate-in":"fly-in-left","animate-in-delay":"0.5s",style:{backgroundColor:"orange",...defaultStyles}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{"animate-in":"fly-in-right","animate-in-delay":"1.0s",style:{backgroundColor:"blue",...defaultStyles}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{"animate-in":"fly-in-bottom","animate-in-delay":"1.5s",style:{backgroundColor:"yellow",...defaultStyles}})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("amp-story-page",{id:"page-2",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_components__WEBPACK_IMPORTED_MODULE_2__.AnimationProvider,{animations,elements,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components__WEBPACK_IMPORTED_MODULE_2__.AMPAnimations,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p",{style:{textAlign:"center",color:"#fff"},children:"Custom Fly In Effect"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("amp-story-grid-layer",{template:"vertical","aspect-ratio":_storybookUtils__WEBPACK_IMPORTED_MODULE_4__.bC,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"page-fullbleed-area",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"page-safe-area",children:elementBoxes.map((({id,color,x,y,width,height})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{style:{position:"absolute",top:`${y}%`,left:`${x}%`,width:`${width}%`,height:`${height}%`},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components__WEBPACK_IMPORTED_MODULE_2__.AMPWrapper,{target:id,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{style:{width:"100%",height:"100%",backgroundColor:color}})})},id)))})})})]})})]})}}},"./packages/animation/src/storybookUtils/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{CU:()=>AMPStoryWrapper,bC:()=>AMP_STORY_ASPECT_RATIO,JM:()=>PlayButton});__webpack_require__("./node_modules/react/index.js");var constants=__webpack_require__("./packages/units/src/constants.ts"),components=__webpack_require__("./packages/animation/src/components/index.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ampBoilerplate=function Boilerplate(){return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}"}}),(0,jsx_runtime.jsx)("noscript",{children:(0,jsx_runtime.jsx)("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}"}})})]})},AMP_STORY_ASPECT_RATIO=`${constants.JN}:${constants.r_}`;function AMPStoryWrapper({children}){return(0,jsx_runtime.jsxs)("div",{style:{width:"100%",height:"640px"},children:[(0,jsx_runtime.jsx)(ampBoilerplate,{}),(0,jsx_runtime.jsx)("amp-story",{standalone:!0,title:"My Story",publisher:"The AMP Team","publisher-logo-src":"https://example.com/logo/1x1.png","poster-portrait-src":"https://example.com/my-story/poster/3x4.jpg",children})]})}AMPStoryWrapper.displayName="AMPStoryWrapper";const PlayButton=()=>{const{actions:{WAAPIAnimationMethods}}=(0,components.useStoryAnimationContext)(),label_play="play",label_pause="pause",label_reset="reset";return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("button",{onClick:WAAPIAnimationMethods.play,children:label_play}),(0,jsx_runtime.jsx)("button",{onClick:WAAPIAnimationMethods.pause,children:label_pause}),(0,jsx_runtime.jsx)("button",{onClick:WAAPIAnimationMethods.reset,children:label_reset})]})}},"./node_modules/core-js/modules/esnext.iterator.every.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{every:function every(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return!iterate(record,(function(value,stop){if(!predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/animation/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);