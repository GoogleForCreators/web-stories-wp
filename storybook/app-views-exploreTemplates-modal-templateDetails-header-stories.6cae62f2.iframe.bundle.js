"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9039],{"./packages/design-system/src/icons/cross_large.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgCrossLarge=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.146 25.854a.5.5 0 0 0 .708-.708L16.707 16l9.147-9.146a.5.5 0 0 0-.708-.708L16 15.293 6.854 6.146a.5.5 0 1 0-.708.708L15.293 16l-9.147 9.146a.5.5 0 0 0 .708.708L16 16.707z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCrossLarge)},"./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/i18n/src/sprintf.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/icons/cross_large.svg");__webpack_require__("./packages/dashboard/src/propTypes.js");const Nav=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.nav.withConfig({displayName:"header__Nav",componentId:"sc-1wko3r4-0"})(["justify-content:space-between;align-items:center;display:flex;margin:48px auto;width:calc(76% + 121px);"]),CTAButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.$).attrs({type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.VQ.Primary,size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.Mp.Small}).withConfig({displayName:"header__CTAButton",componentId:"sc-1wko3r4-1"})(["padding:10px 16px;"]);const __WEBPACK_DEFAULT_EXPORT__=function Header({templateTitle,templateId,templateActions,canCreateStory}){const{createStoryFromTemplate,handleDetailsToggle}=templateActions||{};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Nav,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.$,{type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.VQ.Tertiary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.Ak.Square,size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.Mp.Small,"aria-label":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Close","web-stories"),onClick:handleDetailsToggle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.A,null)),canCreateStory&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(CTAButton,{onClick:()=>createStoryFromTemplate(templateId),"aria-label":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_7__.A)((0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Use %s template to create new story","web-stories"),templateTitle)},(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Use template","web-stories")))}},"./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/modal/templateDetails/header/index.js"),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/TemplateDetails/Header",component:___WEBPACK_IMPORTED_MODULE_1__.A,argTypes:{createStoryFromTemplate:{action:"create story from template clicked"},handleDetailsToggle:{action:"modal was toggled"}}},StorybookLayoutContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__StorybookLayoutContainer",componentId:"sc-w09fet-0"})(["margin-top:40px;height:100vh;"]),_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.PE.Provider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StorybookLayoutContainer,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.A,{templateActions:{...args},canCreateStory:!0})))}}},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);