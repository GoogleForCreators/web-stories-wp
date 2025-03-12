"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9039],{"./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/i18n/src/sprintf.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/icons/cross_large.svg"),_propTypes__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/propTypes.js");const Nav=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.nav.withConfig({displayName:"header__Nav",componentId:"sc-1wko3r4-0"})(["justify-content:space-between;align-items:center;display:flex;margin:48px auto;width:calc(76% + 121px);"]),CTAButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$).attrs({type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary,size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.Mp.Small}).withConfig({displayName:"header__CTAButton",componentId:"sc-1wko3r4-1"})(["padding:10px 16px;"]);function Header(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(14),{templateTitle,templateId,templateActions,canCreateStory}=t0;let t1;$[0]!==templateActions?(t1=templateActions||{},$[0]=templateActions,$[1]=t1):t1=$[1];const{createStoryFromTemplate,handleDetailsToggle}=t1;let t2,t3,t4,t5,t6;return $[2]===Symbol.for("react.memo_cache_sentinel")?(t2=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Close","web-stories"),$[2]=t2):t2=$[2],$[3]===Symbol.for("react.memo_cache_sentinel")?(t3=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.A,null),$[3]=t3):t3=$[3],$[4]!==handleDetailsToggle?(t4=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$,{type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.VQ.Tertiary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.Ak.Square,size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.Mp.Small,"aria-label":t2,onClick:handleDetailsToggle},t3),$[4]=handleDetailsToggle,$[5]=t4):t4=$[5],$[6]!==canCreateStory||$[7]!==createStoryFromTemplate||$[8]!==templateId||$[9]!==templateTitle?(t5=canCreateStory&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(CTAButton,{onClick:()=>createStoryFromTemplate(templateId),"aria-label":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__.A)((0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Use %s template to create new story","web-stories"),templateTitle)},(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Use template","web-stories")),$[6]=canCreateStory,$[7]=createStoryFromTemplate,$[8]=templateId,$[9]=templateTitle,$[10]=t5):t5=$[10],$[11]!==t4||$[12]!==t5?(t6=react__WEBPACK_IMPORTED_MODULE_0__.createElement(Nav,null,t4,t5),$[11]=t4,$[12]=t5,$[13]=t6):t6=$[13],t6}Header.propTypes={canCreateStory:prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool,templateActions:_propTypes__WEBPACK_IMPORTED_MODULE_2__.zk,templateId:prop_types__WEBPACK_IMPORTED_MODULE_9___default().number,templateTitle:prop_types__WEBPACK_IMPORTED_MODULE_9___default().string};const __WEBPACK_DEFAULT_EXPORT__=Header},"./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/index.js"),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/TemplateDetails/Header",component:___WEBPACK_IMPORTED_MODULE_1__.A,argTypes:{createStoryFromTemplate:{action:"create story from template clicked"},handleDetailsToggle:{action:"modal was toggled"}}},StorybookLayoutContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__StorybookLayoutContainer",componentId:"sc-w09fet-0"})(["margin-top:40px;height:100vh;"]),_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.PE.Provider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StorybookLayoutContainer,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.A,{templateActions:{...args},canCreateStory:!0})))}}},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/design-system/src/icons/cross_large.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCrossLarge=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.146 25.854a.5.5 0 0 0 .708-.708L16.707 16l9.147-9.146a.5.5 0 0 0-.708-.708L16 15.293 6.854 6.146a.5.5 0 1 0-.708.708L15.293 16l-9.147 9.146a.5.5 0 0 0 .708.708L16 16.707z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCrossLarge)}}]);