"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5930],{"./packages/design-system/src/icons/checkmark.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCheckmark=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M23.847 10.14a.5.5 0 0 1 .013.707l-10.625 11a.5.5 0 0 1-.72 0L8.14 17.318a.5.5 0 0 1 .72-.695l4.015 4.157L23.14 10.153a.5.5 0 0 1 .707-.013",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCheckmark)},"./packages/design-system/src/icons/letter_i_outline.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgLetterIOutline=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16 23a7 7 0 1 0 0-14 7 7 0 0 0 0 14m0 1a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m.5 2a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLetterIOutline)},"./packages/design-system/src/components/chip/chip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme_helpers__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const getChipBackgroundColor=({theme,active,disabled})=>active&&!disabled?theme.colors.interactiveBg.secondaryNormal:"transparent",Infix=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"chip__Infix",componentId:"sc-oghxqk-0"})(["display:inline-block;margin-right:",";margin-left:",";height:28px;"],(({before=!1})=>before?"-8px":"4px"),(({before=!1})=>before?"4px":"-8px")),StyledChip=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.span.withConfig({displayName:"chip__StyledChip",componentId:"sc-oghxqk-1"})(["padding:0 12px;background:transparent;border:none;&:focus{outline:none;}"]),ChipContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"chip__ChipContainer",componentId:"sc-oghxqk-2"})((({theme,disabled})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:inline-flex;justify-content:center;align-items:center;height:36px;padding:0;background-color:",";border:1px solid ",";border-radius:",";transition:all 0.3s ease-in-out;transition-property:background-color,border-color,height,width,transform;cursor:",";"," :active{background-color:",";}:hover:not(:active){border-color:",";}",",","{white-space:nowrap;cursor:",";color:",";",";}"],getChipBackgroundColor,disabled?theme.colors.border.disable:theme.colors.interactiveBg.secondaryNormal,theme.borders.radius.x_large,disabled?"default":"pointer",_theme_helpers__WEBPACK_IMPORTED_MODULE_4__.Q,getChipBackgroundColor({theme,active:!0,disabled}),disabled?theme.colors.border.disable:theme.colors.border.defaultHover,Infix,StyledChip,disabled?"default":"pointer",disabled?theme.colors.fg.disable:theme.colors.fg.primary,_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.paragraph[_theme__WEBPACK_IMPORTED_MODULE_6__.$.Small],theme})))),Chip=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)(((t0,ref)=>{const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(17);let children,prefix,props,suffix,t1,t2,t3,t4;return $[0]!==t0?(({children,prefix,suffix,...props}=t0),$[0]=t0,$[1]=children,$[2]=prefix,$[3]=props,$[4]=suffix):(children=$[1],prefix=$[2],props=$[3],suffix=$[4]),$[5]!==prefix?(t1=prefix&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(Infix,{before:!0},prefix),$[5]=prefix,$[6]=t1):t1=$[6],$[7]!==children?(t2=react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledChip,null,children),$[7]=children,$[8]=t2):t2=$[8],$[9]!==suffix?(t3=suffix&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(Infix,null,suffix),$[9]=suffix,$[10]=t3):t3=$[10],$[11]!==props||$[12]!==ref||$[13]!==t1||$[14]!==t2||$[15]!==t3?(t4=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ChipContainer,_extends({ref},props),t1,t2,t3),$[11]=props,$[12]=ref,$[13]=t1,$[14]=t2,$[15]=t3,$[16]=t4):t4=$[16],t4}));Chip.displayName="Chip";const __WEBPACK_DEFAULT_EXPORT__=Chip},"./packages/design-system/src/components/chip/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/chip/chip.tsx"),_icons__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/icons/checkmark.svg"),_icons__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/icons/letter_i_outline.svg"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/theme.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Chip",component:___WEBPACK_IMPORTED_MODULE_2__.A,argTypes:{onClick:{action:"clicked"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-gaoyy6-0"})(["background-color:",";padding:30px;display:flex;gap:20px;"],(props=>props.theme.colors.bg.primary)),CHIP_STATES=[{name:"Normal"},{name:"Active",active:!0},{name:"Disabled",disabled:!0},{name:"with Suffix",suffix:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_4__.A,{height:28,width:28})},{name:"with Prefix",prefix:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_5__.A,{height:28,width:28}),active:!0},{name:"Suffix & Prefix",prefix:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_5__.A,{height:28,width:28}),suffix:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_4__.A,{height:28,width:28}),disabled:!0}],_default={render:function Render(args){const chips=CHIP_STATES.map((({name,...state})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({key:name,onClick:()=>args.onClick(name)},state),name)));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,chips),react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_3__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_6__.w},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,chips)))}}},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);