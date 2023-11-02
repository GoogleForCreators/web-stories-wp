"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5088],{"./packages/design-system/src/components/checkbox/checkbox.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_icons__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/icons/checkmark.svg"),_theme_helpers__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Border=styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP.div.withConfig({displayName:"checkbox__Border",componentId:"sc-5lv9m4-0"})((_ref=>{let{theme}=_ref;return(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.iv)(["position:absolute;height:","px;width:","px;border-radius:",";border:","px solid ",";pointer-events:none;"],24,24,theme.borders.radius.small,1,theme.colors.border.defaultNormal)})),StyledCheckmark=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP)(_icons__WEBPACK_IMPORTED_MODULE_4__.Z).attrs({role:"img"}).withConfig({displayName:"checkbox__StyledCheckmark",componentId:"sc-5lv9m4-1"})(["height:auto;width:32px;color:",";"],(_ref2=>{let{theme}=_ref2;return theme.colors.fg.primary})),CheckboxContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP.div.withConfig({displayName:"checkbox__CheckboxContainer",componentId:"sc-5lv9m4-2"})((_ref3=>{let{theme}=_ref3;return(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.iv)(["position:relative;display:flex;justify-content:center;align-items:center;height:","px;width:","px;min-height:","px;min-width:","px;input[type='checkbox']{position:absolute;width:","px;height:","px;margin:0;padding:0;opacity:0;cursor:pointer;:disabled{~ ","{border-color:",";}~ ","{color:",";}}&:focus-visible:not(:active) ~ ","{",";}:active ~ ","{border-color:",";box-shadow:0 0 0 8px ",";}}"],24,24,24,24,25,25,Border,theme.colors.border.disable,StyledCheckmark,theme.colors.fg.disable,Border,(0,_theme_helpers__WEBPACK_IMPORTED_MODULE_5__.R)(theme.colors.border.focus),Border,theme.colors.border.defaultNormal,theme.colors.shadow.active)})),__WEBPACK_DEFAULT_EXPORT__=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Gp)(((_ref4,ref)=>{let{checked,disabled,className="",...props}=_ref4;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(CheckboxContainer,{className,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input",{type:"checkbox",ref,checked:Boolean(checked),disabled,"aria-checked":checked,...props}),checked&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StyledCheckmark,{"aria-label":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_6__.__)("Checked","web-stories")}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Border,{})]})}))},"./packages/wp-dashboard/src/components/editorSettings/videoCache/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>stories});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts"),v4=__webpack_require__("./packages/wp-dashboard/node_modules/uuid/dist/esm-browser/v4.js"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),checkbox_checkbox=__webpack_require__("./packages/design-system/src/components/checkbox/checkbox.tsx"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function VideoCacheSettings(_ref){let{isEnabled=!1,updateSettings}=_ref;const videoCacheId=(0,src.Ye)((()=>`video-cache-${(0,v4.Z)()}`),[]),onChange=(0,src.I4)((()=>updateSettings({videoCache:!isEnabled})),[updateSettings,isEnabled]);return(0,jsx_runtime.jsxs)(components.O3,{children:[(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(components.B5,{children:(0,i18n.__)("Video Cache","web-stories")})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(components.ke,{htmlFor:videoCacheId,children:[(0,jsx_runtime.jsx)(checkbox_checkbox.Z,{id:videoCacheId,"data-testid":"video-cache-settings-checkbox",onChange,checked:Boolean(isEnabled)}),(0,jsx_runtime.jsx)(components._T,{size:types.TextSize.Small,"aria-checked":Boolean(isEnabled),children:(0,i18n.__)("Reduce hosting costs and improve user experience by serving videos from the Google cache.","web-stories")})]})})]})}VideoCacheSettings.displayName="VideoCacheSettings";const stories={title:"Dashboard/Views/EditorSettings/VideoCache",component:VideoCacheSettings,args:{isEnabled:!0},argTypes:{updateSettings:{action:"updateSettings fired"}}},_default={render:function Render(args){return(0,jsx_runtime.jsx)(VideoCacheSettings,{...args})}}},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/wp-dashboard/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);