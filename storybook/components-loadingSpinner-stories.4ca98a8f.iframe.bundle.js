"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[1595],{"./packages/design-system/src/components/loadingSpinner/loadingSpinner.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js"),__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js")),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/i18n/src/i18n.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const TAU=2*Math.PI,AriaOnlyAlert=styled_components__WEBPACK_IMPORTED_MODULE_5__.Ay.span.withConfig({displayName:"loadingSpinner__AriaOnlyAlert",componentId:"sc-10eor9p-0"})(["",""],_theme__WEBPACK_IMPORTED_MODULE_6__.Q),Container=styled_components__WEBPACK_IMPORTED_MODULE_5__.Ay.div.withConfig({displayName:"loadingSpinner__Container",componentId:"sc-10eor9p-1"})(["position:relative;height:","px;width:","px;color:",";"],(({animationSize})=>animationSize),(({animationSize})=>animationSize),(({theme})=>theme.colors.interactiveBg.brandNormal)),Circle=styled_components__WEBPACK_IMPORTED_MODULE_5__.Ay.div.withConfig({displayName:"loadingSpinner__Circle",componentId:"sc-10eor9p-2"})(["position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) ",";height:","px;width:","px;background-color:",";border-radius:",";animation-name:",";animation-fill-mode:both;animation-duration:","s;animation-iteration-count:infinite;animation-timing-function:",";"],(({$position:{x,y}})=>`translate(${x}px, ${y}px)`),(({circleSize})=>circleSize),(({circleSize})=>circleSize),(({theme})=>theme.colors.interactiveBg.brandNormal),(({theme})=>theme.borders.radius.round),(({circleIndex,numCircles})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_5__.i7)(["0%{opacity:1}","{opacity:1}","{opacity:0.3}","{opacity:1}"],100*circleIndex/numCircles+"%",100*(circleIndex+1)/numCircles+"%",100*(circleIndex+1)/numCircles+1+"%")),.85,_theme__WEBPACK_IMPORTED_MODULE_7__.U.inOutQuad);function _temp(){return(0,uuid__WEBPACK_IMPORTED_MODULE_9__.A)()}const __WEBPACK_DEFAULT_EXPORT__=function LoadingSpinner(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_3__.c)(27);let props,t1,t2,t3,t4;$[0]!==t0?(({animationSize:t1,circleSize:t2,loadingMessage:t3,numCircles:t4,...props}=t0),$[0]=t0,$[1]=props,$[2]=t1,$[3]=t2,$[4]=t3,$[5]=t4):(props=$[1],t1=$[2],t2=$[3],t3=$[4],t4=$[5]);const animationSize=void 0===t1?95:t1,circleSize=void 0===t2?12:t2;let t5;$[6]!==t3?(t5=void 0===t3?(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Loading","web-stories"):t3,$[6]=t3,$[7]=t5):t5=$[7];const loadingMessage=t5,numCircles=void 0===t4?11:t4;let t6,t7;$[8]!==numCircles?(t6=()=>Array.from({length:numCircles}).fill(1).map(_temp),t7=[numCircles],$[8]=numCircles,$[9]=t6,$[10]=t7):(t6=$[9],t7=$[10]);const ids=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__.Kr)(t6,t7);let t8,t9,t10;if($[11]!==loadingMessage?(t8=loadingMessage&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(AriaOnlyAlert,{role:"status"},loadingMessage),$[11]=loadingMessage,$[12]=t8):t8=$[12],$[13]!==animationSize||$[14]!==circleSize||$[15]!==ids||$[16]!==numCircles){let t10;$[18]!==animationSize||$[19]!==circleSize||$[20]!==numCircles?(t10=(id,index)=>{const angle=((index,numCircles)=>TAU*index/numCircles)(index,numCircles),position=((angle,animationSize)=>{const radius=animationSize/2,x=Math.sin(angle)*radius,y=-Math.cos(angle)*radius;return{x:x.toFixed(1),y:y.toFixed(1)}})(angle,animationSize);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Circle,{key:id,circleIndex:index,circleSize,numCircles,$position:position})},$[18]=animationSize,$[19]=circleSize,$[20]=numCircles,$[21]=t10):t10=$[21],t9=ids.map(t10),$[13]=animationSize,$[14]=circleSize,$[15]=ids,$[16]=numCircles,$[17]=t9}else t9=$[17];return $[22]!==animationSize||$[23]!==props||$[24]!==t8||$[25]!==t9?(t10=react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,_extends({animationSize},props),t8,t9),$[22]=animationSize,$[23]=props,$[24]=t8,$[25]=t9,$[26]=t10):t10=$[26],t10}},"./packages/design-system/src/components/loadingSpinner/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/loadingSpinner/loadingSpinner.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/LoadingSpinner",component:___WEBPACK_IMPORTED_MODULE_1__.A,args:{animationSize:95,circleSize:12,numCircles:11},parameters:{controls:{exclude:["loadingMessage"]}}},_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.A,args)}}},"./packages/design-system/src/theme/helpers/visuallyHidden.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>visuallyHidden});const visuallyHidden=(0,__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js").AH)(["position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;"])},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);