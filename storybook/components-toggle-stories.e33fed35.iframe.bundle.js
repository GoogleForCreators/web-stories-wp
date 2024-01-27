"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[2547],{"./packages/design-system/src/icons/checkmark_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgCheckmarkSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M19.853 13.145a.5.5 0 0 1 .003.707l-4.959 5.004a.5.5 0 0 1-.71 0l-2.042-2.06a.5.5 0 0 1 .71-.705l1.687 1.702 4.603-4.645a.5.5 0 0 1 .708-.003",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCheckmarkSmall)},"./packages/design-system/src/components/toggle/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_toggle__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/toggle/toggle.tsx"),___WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Toggle",component:_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,args:{label:"label"},argTypes:{onChange:{action:"onChange"}},parameters:{controls:{exclude:["className","checked","disabled"]}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.ZP.div.withConfig({displayName:"stories__Container",componentId:"sc-rhfhhd-0"})(["display:grid;row-gap:20px;padding:20px 40px;background-color:",";border:1px solid ",";max-width:400px;"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.standard.black)),Row=styled_components__WEBPACK_IMPORTED_MODULE_4__.ZP.div.withConfig({displayName:"stories__Row",componentId:"sc-rhfhhd-1"})(["display:grid;grid-template-columns:repeat(4,1fr);grid-column:1 / -1;label{display:flex;align-items:center;}"]),_default={render:function Render(args){const[inputState,setInputState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)({oneLight:!1,twoLight:!0,threeLight:!1,fourLight:!0,oneDark:!1,twoDark:!0,threeDark:!1,fourDark:!0}),handleChange=event=>{const name=event.target.name,value=event.target.checked;args.onChange(`${name} is: ${value}`),setInputState((prevState=>({...prevState,[name]:value})))};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_5__.s,{as:"h1",children:"Toggle"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Container,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Row,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Normal"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Normal"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Disabled"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Disabled"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Row,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"one-light","aria-label":"toggle-one-light",name:"oneLight",checked:inputState.oneLight,onChange:handleChange}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"two-light","aria-label":"toggle-two-light",name:"twoLight",checked:inputState.twoLight,onChange:handleChange}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"three-light","aria-label":"toggle-three-light",name:"threeLight",checked:inputState.threeLight,onChange:handleChange,disabled:!0}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"four-light","aria-label":"toggle-four-light",name:"fourLight",checked:inputState.fourLight,onChange:handleChange,disabled:!0})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_storybookUtils__WEBPACK_IMPORTED_MODULE_7__.D,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Container,{darkMode:!0,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Row,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Normal"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Normal"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Disabled"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_6__.x.Paragraph,{children:"Disabled"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Row,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"one-dark","aria-label":"toggle-one-dark",name:"oneDark",checked:inputState.oneDark,onChange:handleChange}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"two-dark","aria-label":"toggle-two-dark",name:"twoDark",checked:inputState.twoDark,onChange:handleChange}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"three-dark","aria-label":"toggle-three-dark",name:"threeDark",checked:inputState.threeDark,onChange:handleChange,disabled:!0}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_toggle__WEBPACK_IMPORTED_MODULE_3__.Z,{id:"four-dark","aria-label":"toggle-four-dark",name:"fourDark",checked:inputState.fourDark,onChange:handleChange,disabled:!0})]})]})})]})}}},"./packages/design-system/src/components/toggle/toggle.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/icons/checkmark_small.svg"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Wrapper=styled_components__WEBPACK_IMPORTED_MODULE_2__.ZP.div.withConfig({displayName:"toggle__Wrapper",componentId:"sc-3bc7bd-0"})(["padding:","px;"],4),Background=styled_components__WEBPACK_IMPORTED_MODULE_2__.ZP.div.withConfig({displayName:"toggle__Background",componentId:"sc-3bc7bd-1"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.iv)(["position:absolute;top:-","px;left:-","px;height:","px;width:","px;background-color:transparent;border-radius:",";border:","px solid ",";pointer-events:none;transition:all 0.3s;"],1,1,20,44,theme.borders.radius.x_large,1,theme.colors.border.defaultNormal))),Circle=styled_components__WEBPACK_IMPORTED_MODULE_2__.ZP.span.withConfig({displayName:"toggle__Circle",componentId:"sc-3bc7bd-2"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.iv)(["pointer-events:none;:after{content:'';position:absolute;top:","px;left:","px;height:","px;width:","px;background-color:",";border-radius:",";cursor:pointer;transition:background-color 0.3s,border-color 0.3s,left 0.15s;}"],-5,-5,28,28,theme.colors.fg.secondary,theme.borders.radius.round))),IconContainer=styled_components__WEBPACK_IMPORTED_MODULE_2__.ZP.div.withConfig({displayName:"toggle__IconContainer",componentId:"sc-3bc7bd-3"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.iv)(["position:absolute;width:","px;top:","px;left:","px;z-index:1;opacity:0;transition:opacity 0.15s;pointer-events:none;svg{color:",";}"],32,-6,19,theme.colors.standard.white))),ToggleContainer=styled_components__WEBPACK_IMPORTED_MODULE_2__.ZP.div.withConfig({displayName:"toggle__ToggleContainer",componentId:"sc-3bc7bd-4"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.iv)(["position:relative;height:","px;width:","px;background-color:transparent;border-radius:",";input[type='checkbox']{position:absolute;top:-","px;left:-","px;height:","px;width:","px;margin:0;opacity:0;cursor:pointer;:disabled{cursor:default;~ ","{border-color:",";}:checked ~ ","{background-color:",";border-color:",";}~ ",":after{background-color:",";}:checked ~ ",":after{background-color:",";}~ "," svg{color:",";}}&:focus-visible{~ ","{outline:none;box-shadow:0 0 0 5px ",",0 0 0 7px ",";}}:checked{~ ","{background-color:",";border-color:",";}~ ",":after{left:","px;background-color:",";}~ ","{opacity:1;}}:hover{:not(:disabled) ~ ","{border-color:",";}:checked:not(:disabled) ~ ","{background-color:",";border-color:",";}}:active{~ ","{box-shadow:0 0 0 8px ",";}}}"],20,44,theme.borders.radius.x_large,.5,.5,20,44,Background,theme.colors.fg.disable,Background,theme.colors.fg.disable,theme.colors.fg.disable,Circle,theme.colors.fg.disable,Circle,theme.colors.bg.secondary,IconContainer,theme.colors.fg.disable,Background,theme.colors.bg.primary,theme.colors.border.focus,Background,theme.colors.interactiveBg.positivePress,theme.colors.interactiveBg.positivePress,Circle,21,theme.colors.interactiveBg.positiveNormal,IconContainer,Background,theme.colors.fg.secondary,Background,theme.colors.interactiveBg.positiveHover,theme.colors.interactiveBg.positiveHover,Background,theme.colors.shadow.active)));function Toggle({className,...inputProps}){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Wrapper,{className,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(ToggleContainer,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input",{type:"checkbox",...inputProps}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Background,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(IconContainer,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_icons__WEBPACK_IMPORTED_MODULE_3__.Z,{})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Circle,{})]})})}Toggle.displayName="Toggle";const __WEBPACK_DEFAULT_EXPORT__=Toggle},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.ZP.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.y,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.TextSize.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.L(theme.colors.border.focus))))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{y:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{x:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight),Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)),(({disabled,theme})=>disabled?theme.colors.fg.disable:"auto")),Span,Kbd,Paragraph}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DarkThemeProvider});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DarkThemeProvider=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(styled_components__WEBPACK_IMPORTED_MODULE_2__.f6,{theme:_theme__WEBPACK_IMPORTED_MODULE_3__.r,children});DarkThemeProvider.displayName="DarkThemeProvider"},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>expandTextPreset,_:()=>expandPresetStyles});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.TextSize),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>focusableOutlineCSS,R:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);