"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[7370],{"./packages/animation/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/animation/src/parts/simple/stories/pulse.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_AMPStory:()=>_AMPStory,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/animation/src/components/index.ts"),_types__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/animation/src/types/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/animation/src/storybookUtils/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Animations/Parts/Pulse"},animations=[{id:"1",targets:["e1"],type:_types__WEBPACK_IMPORTED_MODULE_2__.J6.Pulse,iterations:2,delay:500},{id:"2",targets:["e2"],type:_types__WEBPACK_IMPORTED_MODULE_2__.J6.Pulse,iterations:4}],elements=[{id:"e1",color:"red",top:"40px",left:"150px"},{id:"e2",color:"green",top:"40px",left:"50px"}],defaultStyles={position:"absolute",width:"50px",height:"50px"},_default={render:function Render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AnimationProvider,{animations},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_3__.DM,null),elements.map((({id,color,...styles})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:id,style:{...defaultStyles,...styles}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.WAAPIWrapper,{target:id},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{width:"100%",height:"100%",backgroundColor:color}}))))))}},_AMPStory={render:function Render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_3__.zB,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{id:"page-0"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{textAlign:"center",color:"#fff"}},"Empty first page")),[1,2].map((pageId=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("amp-story-page",{key:pageId,id:`page-${pageId}`},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AnimationProvider,{animations},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AMPAnimations,null),elements.map((({id,color,...styles})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:id,style:{...defaultStyles,...styles}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.AMPWrapper,{target:id},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{width:"100%",height:"100%",backgroundColor:color}}))))))))))}}},"./packages/animation/src/storybookUtils/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{zB:()=>AMPStoryWrapper,yw:()=>AMP_STORY_ASPECT_RATIO,DM:()=>PlayButton});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),constants=__webpack_require__("./packages/units/src/constants.ts"),components=__webpack_require__("./packages/animation/src/components/index.ts");const ampBoilerplate=function Boilerplate(){const $=(0,dist.c)(2);let t0,t1;return $[0]===Symbol.for("react.memo_cache_sentinel")?(t0=react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}"}}),$[0]=t0):t0=$[0],$[1]===Symbol.for("react.memo_cache_sentinel")?(t1=react.createElement(react.Fragment,null,t0,react.createElement("noscript",null,react.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:"body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}"}}))),$[1]=t1):t1=$[1],t1},AMP_STORY_ASPECT_RATIO=`${constants.bj}:${constants.WY}`;function AMPStoryWrapper(t0){const $=(0,dist.c)(4),{children}=t0;let t1,t2,t3;return $[0]===Symbol.for("react.memo_cache_sentinel")?(t1={width:"100%",height:"640px"},t2=react.createElement(ampBoilerplate,null),$[0]=t1,$[1]=t2):(t1=$[0],t2=$[1]),$[2]!==children?(t3=react.createElement("div",{style:t1},t2,react.createElement("amp-story",{standalone:!0,title:"My Story",publisher:"The AMP Team","publisher-logo-src":"https://example.com/logo/1x1.png","poster-portrait-src":"https://example.com/my-story/poster/3x4.jpg"},children)),$[2]=children,$[3]=t3):t3=$[3],t3}AMPStoryWrapper.propTypes={children:prop_types_default().node};const PlayButton=()=>{const $=(0,dist.c)(11),{actions:t0}=(0,components.useStoryAnimationContext)(),{WAAPIAnimationMethods}=t0;let t1;$[0]===Symbol.for("react.memo_cache_sentinel")?(t1={play:"play",pause:"pause",reset:"reset"},$[0]=t1):t1=$[0];const label=t1;let t2,t3,t4,t5;return $[1]!==WAAPIAnimationMethods.play?(t2=react.createElement("button",{onClick:WAAPIAnimationMethods.play},label.play),$[1]=WAAPIAnimationMethods.play,$[2]=t2):t2=$[2],$[3]!==WAAPIAnimationMethods.pause?(t3=react.createElement("button",{onClick:WAAPIAnimationMethods.pause},label.pause),$[3]=WAAPIAnimationMethods.pause,$[4]=t3):t3=$[4],$[5]!==WAAPIAnimationMethods.reset?(t4=react.createElement("button",{onClick:WAAPIAnimationMethods.reset},label.reset),$[5]=WAAPIAnimationMethods.reset,$[6]=t4):t4=$[6],$[7]!==t2||$[8]!==t3||$[9]!==t4?(t5=react.createElement(react.Fragment,null,t2,t3,t4),$[7]=t2,$[8]=t3,$[9]=t4,$[10]=t5):t5=$[10],t5}}}]);