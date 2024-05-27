"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[1595],{"./packages/design-system/src/components/loadingSpinner/loadingSpinner.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts")),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/i18n/src/i18n.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const TAU=2*Math.PI,AriaOnlyAlert=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.span.withConfig({displayName:"loadingSpinner__AriaOnlyAlert",componentId:"sc-10eor9p-0"})(["",""],_theme__WEBPACK_IMPORTED_MODULE_4__.Q),Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"loadingSpinner__Container",componentId:"sc-10eor9p-1"})(["position:relative;height:","px;width:","px;color:",";"],(({animationSize})=>animationSize),(({animationSize})=>animationSize),(({theme})=>theme.colors.interactiveBg.brandNormal)),Circle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"loadingSpinner__Circle",componentId:"sc-10eor9p-2"})(["position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) ",";height:","px;width:","px;background-color:",";border-radius:",";animation-name:",";animation-fill-mode:both;animation-duration:","s;animation-iteration-count:infinite;animation-timing-function:",";"],(({$position:{x,y}})=>`translate(${x}px, ${y}px)`),(({circleSize})=>circleSize),(({circleSize})=>circleSize),(({theme})=>theme.colors.interactiveBg.brandNormal),(({theme})=>theme.borders.radius.round),(({circleIndex,numCircles})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.i7)(["0%{opacity:1}","{opacity:1}","{opacity:0.3}","{opacity:1}"],100*circleIndex/numCircles+"%",100*(circleIndex+1)/numCircles+"%",100*(circleIndex+1)/numCircles+1+"%")),.85,_theme__WEBPACK_IMPORTED_MODULE_5__.U.inOutQuad);const __WEBPACK_DEFAULT_EXPORT__=function LoadingSpinner({animationSize=95,circleSize=12,loadingMessage=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Loading","web-stories"),numCircles=11,...props}){const ids=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Kr)((()=>Array.from({length:numCircles}).fill(1).map((()=>(0,uuid__WEBPACK_IMPORTED_MODULE_7__.A)()))),[numCircles]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,_extends({animationSize},props),loadingMessage&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(AriaOnlyAlert,{role:"status"},loadingMessage),ids.map(((id,index)=>{const angle=((index,numCircles)=>TAU*index/numCircles)(index,numCircles),position=((angle,animationSize)=>{const radius=animationSize/2,x=Math.sin(angle)*radius,y=-Math.cos(angle)*radius;return{x:x.toFixed(1),y:y.toFixed(1)}})(angle,animationSize);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Circle,{key:id,circleIndex:index,circleSize,numCircles,$position:position})})))}},"./packages/design-system/src/components/loadingSpinner/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/loadingSpinner/loadingSpinner.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/LoadingSpinner",component:___WEBPACK_IMPORTED_MODULE_1__.A,args:{animationSize:95,circleSize:12,numCircles:11},parameters:{controls:{exclude:["loadingMessage"]}}},_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.A,args)}}},"./packages/design-system/src/theme/helpers/visuallyHidden.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>visuallyHidden});const visuallyHidden=(0,__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js").AH)(["position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;"])},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);