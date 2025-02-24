"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5367],{"./packages/design-system/src/components/typography/link/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{N:()=>Link});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts"),_icons__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/icons/launch.svg");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const StyledLaunch=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_4__.A).withConfig({displayName:"link__StyledLaunch",componentId:"sc-qlyh5o-0"})(["width:12px;margin-left:0.5ch;margin-bottom:2px;stroke-width:0;vertical-align:text-bottom;"]),StyledAnchor=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"link__StyledAnchor",componentId:"sc-qlyh5o-1"})(["",";"],(({size,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";",";color:",";text-decoration:none;cursor:pointer;vertical-align:baseline;:hover{color:",";}:focus{color:"," !important;}",""],_styles__WEBPACK_IMPORTED_MODULE_5__.u,_theme__WEBPACK_IMPORTED_MODULE_6__.s({preset:theme.typography.presets.link[size],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.fg.linkNormal,_theme__WEBPACK_IMPORTED_MODULE_7__.Q(theme.colors.border.focus))));function ConditionalSpanWrapper(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(3),{isWrapped,children}=t0;let t1;return $[0]!==children||$[1]!==isWrapped?(t1=isWrapped?react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,children):react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,children),$[0]=children,$[1]=isWrapped,$[2]=t1):t1=$[2],t1}const Link=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function Link(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(15);let children,props,t1;$[0]!==t0?(({children,size:t1,...props}=t0),$[0]=t0,$[1]=children,$[2]=props,$[3]=t1):(children=$[1],props=$[2],t1=$[3]);const size=void 0===t1?_theme__WEBPACK_IMPORTED_MODULE_8__.$.Medium:t1,isExternalLink="_blank"===props.target;let t2,t3,t4;return $[4]!==isExternalLink?(t2=isExternalLink&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledLaunch,null),$[4]=isExternalLink,$[5]=t2):t2=$[5],$[6]!==children||$[7]!==isExternalLink||$[8]!==t2?(t3=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ConditionalSpanWrapper,{isWrapped:isExternalLink},children,t2),$[6]=children,$[7]=isExternalLink,$[8]=t2,$[9]=t3):t3=$[9],$[10]!==props||$[11]!==ref||$[12]!==size||$[13]!==t3?(t4=react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledAnchor,_extends({ref,size},props),t3),$[10]=props,$[11]=ref,$[12]=size,$[13]=t3,$[14]=t4):t4=$[14],t4}))},"./packages/design-system/src/components/typography/link/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ExternalLink:()=>ExternalLink,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),___WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js"),__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx")),___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Typography/Link",component:___WEBPACK_IMPORTED_MODULE_3__.N},textTextSizes=___WEBPACK_IMPORTED_MODULE_4__.i.TYPOGRAPHY.TEXT_SIZES,_default={render:function Render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,textTextSizes.map((presetSize=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_3__.N,{key:`${presetSize}_text_link`,size:presetSize,href:"https://example.com"},`${presetSize} - Click here for more information`,react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null)))))}},ExternalLink=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_3__.N,{href:"https://example.com",target:"_blank",rel:"noreferrer"},"Support")},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/icons/launch.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,_path2,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgLaunch=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 24 24","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),_path2||(_path2=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLaunch)},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);