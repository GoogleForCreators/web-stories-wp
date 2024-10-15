"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[394],{"./packages/design-system/src/components/textArea/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/textArea/textArea.tsx"),_storybookUtils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),___WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/TextArea",component:___WEBPACK_IMPORTED_MODULE_2__.A,args:{label:"label",hint:"Hint",placeholder:"placeholder"},argTypes:{onHandleChange:{action:"onChange"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-1b9un4h-0"})(["display:grid;row-gap:20px;padding:20px 50px;background-color:",";border:1px solid ",";"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.standard.black)),Row=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Row",componentId:"sc-1b9un4h-1"})(["display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));grid-column:1 / -1;grid-column-gap:60px;label{display:flex;align-items:center;}"]),_default={render:function Render({onHandleChange,...args}){const[inputState,setInputState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)({oneLight:"Light mode text",twoLight:"disabled",threeLight:"disabled",fourLight:"limited",oneDark:"Dark mode text",twoDark:"",threeDark:"",fourDark:""}),handleChange=event=>{const name=event.target.name,value=event.target.value;onHandleChange(`${name} changed to: ${value}`),setInputState((prevState=>({...prevState,[name]:value})))};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_4__.$,{as:"h1"},"Textarea"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.E.Paragraph,{isBold:!0},"Normal"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-one",id:"one-light",name:"oneLight",value:inputState.oneLight,onChange:handleChange},args))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.E.Paragraph,{isBold:!0},"Error"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-two",id:"two-light",name:"twoLight",value:inputState.twoLight,onChange:handleChange},args,{hasError:!0}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.E.Paragraph,{isBold:!0},"Disabled"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"disabled-input-one",id:"three-light",name:"threeLight",value:inputState.threeLight,onChange:handleChange},args,{disabled:!0}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.E.Paragraph,{isBold:!0},"With Counter"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-four",id:"four-light",name:"fourLight",value:inputState.fourLight,onChange:handleChange},args,{showCount:!0,maxLength:20}))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_6__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,{darkMode:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-four",id:"one-dark",name:"oneDark",value:inputState.oneDark,onChange:handleChange},args)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-five",id:"two-dark",name:"twoDark",value:inputState.twoDark,onChange:handleChange},args,{hasError:!0})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"disabled-input-two",id:"three-dark",name:"threeDark",value:inputState.threeDark,onChange:handleChange},args,{disabled:!0})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({"aria-label":"input-four",id:"four-dark",name:"fourDark",value:inputState.fourDark,onChange:handleChange},args,{showCount:!0,maxLength:200}))))))}}},"./packages/design-system/src/components/textArea/textArea.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/scrollbar.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme_helpers__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_typography__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const Container=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"textArea__Container",componentId:"sc-1wx5wxx-0"})(["position:relative;width:100%;min-width:100px;"]),CounterText=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_3__.E.Span).attrs({size:_theme__WEBPACK_IMPORTED_MODULE_4__.$.XSmall}).withConfig({displayName:"textArea__CounterText",componentId:"sc-1wx5wxx-1"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),Label=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_3__.E.Label).withConfig({displayName:"textArea__Label",componentId:"sc-1wx5wxx-2"})(["margin-bottom:12px;"]),Hint=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_3__.E.Paragraph).attrs({size:_theme__WEBPACK_IMPORTED_MODULE_4__.$.Small}).withConfig({displayName:"textArea__Hint",componentId:"sc-1wx5wxx-3"})(["margin-top:12px;color:",";"],(({hasError,theme})=>theme.colors.fg[hasError?"negative":"tertiary"])),InputContainer=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"textArea__InputContainer",componentId:"sc-1wx5wxx-4"})((({focused,hasError,theme,styleOverride})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border:1px solid ",";border-radius:",";overflow:hidden;",";:focus-within{",";}",";"],theme.colors.border[hasError?"negativeNormal":"defaultNormal"],theme.borders.radius.small,focused&&!hasError&&(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["border-color:",";"],theme.colors.border.defaultActive),(0,_theme_helpers__WEBPACK_IMPORTED_MODULE_5__.g)(theme.colors.border.focus),styleOverride))),StyledTextArea=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.textarea.withConfig({displayName:"textArea__StyledTextArea",componentId:"sc-1wx5wxx-5"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["height:100%;width:100%;padding:0;background-color:inherit;border:none;outline:none;color:",";resize:none;box-shadow:none;",";",";:focus{box-shadow:none;}:disabled{color:",";border-color:",";}:active{color:",";}::placeholder{color:",";}"],theme.colors.fg.primary,_theme__WEBPACK_IMPORTED_MODULE_6__.W,_theme__WEBPACK_IMPORTED_MODULE_7__.s({preset:theme.typography.presets.paragraph[_theme__WEBPACK_IMPORTED_MODULE_4__.$.Small],theme}),theme.colors.fg.disable,theme.colors.border.disable,theme.colors.fg.primary,theme.colors.fg.tertiary))),Counter=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"textArea__Counter",componentId:"sc-1wx5wxx-6"})(["text-align:right;align-self:flex-end;span{color:",";}"],(({theme})=>theme.colors.fg.tertiary)),TextArea=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((({className,disabled,hasError,hint,id,label,onBlur,onFocus,value,showCount=!1,maxLength,isIndeterminate=!1,containerStyleOverride="",...props},ref)=>{const textAreaId=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Kr)((()=>id||(0,uuid__WEBPACK_IMPORTED_MODULE_8__.A)()),[id]),hasCounter=showCount&&"number"==typeof maxLength&&maxLength>0,[isFocused,setIsFocused]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(!1),[hasBeenSelected,setHasBeenSelected]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(!1);let displayedValue=value;return isIndeterminate&&(displayedValue=""),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,{className},label&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(Label,{htmlFor:textAreaId,disabled},label),react__WEBPACK_IMPORTED_MODULE_0__.createElement(InputContainer,{focused:isFocused,hasError,styleOverride:containerStyleOverride},react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledTextArea,_extends({id:textAreaId,disabled,ref:input=>{"function"==typeof ref?ref(input):ref&&(ref.current=input),input&&isFocused&&!hasBeenSelected&&(input.select(),setHasBeenSelected(!0))},onFocus:e=>{onFocus?.(e),setIsFocused(!0),setHasBeenSelected(!1)},onBlur:e=>{onBlur?.(e),setIsFocused(!1)},value:displayedValue,maxLength},props)),hasCounter&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(Counter,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(CounterText,null,`${String(value).length}/${maxLength}`))),hint&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hint,{hasError},hint))}));TextArea.displayName="TextArea";const __WEBPACK_DEFAULT_EXPORT__=TextArea},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.u,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.$.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus))))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{E:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight),Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)),(({disabled,theme})=>disabled?theme.colors.fg.disable:"auto")),Span,Kbd,Paragraph}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);