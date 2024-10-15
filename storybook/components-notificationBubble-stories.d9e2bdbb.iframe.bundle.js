"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[2695],{"./packages/design-system/src/components/notificationBubble/notificationBubble.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/helpers/fullSize.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/centerContent.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_types__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/notificationBubble/types.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function getBubbleWidth(numDigits){return 9*(numDigits-1)}const Bubble=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"notificationBubble__Bubble",componentId:"sc-1o8hryh-0"})([""," position:relative;height:","px;width:","px;",";"],(({theme,variant})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["color:",";background-color:",";border-radius:",";"],theme.colors.fg.primary,theme.colors.bg[variant],theme.borders.radius.round)),24,(({digitLen})=>24+getBubbleWidth(digitLen)),(({digitLen,$isSmall})=>$isSmall&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["height:","px;width:","px;"],20,20+getBubbleWidth(digitLen)))),Inner=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"notificationBubble__Inner",componentId:"sc-1o8hryh-1"})([""," "," ",";font-weight:",";color:",";user-select:none;"],_theme__WEBPACK_IMPORTED_MODULE_2__.O,_theme__WEBPACK_IMPORTED_MODULE_3__.F,(({$isSmall,theme})=>_theme__WEBPACK_IMPORTED_MODULE_4__.x((({paragraph},sizes)=>paragraph[$isSmall?sizes.XSmall:sizes.Small]))({theme})),(({theme})=>theme.typography.weight.bold),(({$invertColor,theme})=>$invertColor?theme.colors.inverted.fg.primary:theme.colors.fg.primary));const __WEBPACK_DEFAULT_EXPORT__=function NotificationBubble({notificationCount,isSmall,variant=_types__WEBPACK_IMPORTED_MODULE_5__.I.Accent,invertTextColor,...props}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Bubble,_extends({variant,$isSmall:isSmall,digitLen:notificationCount?.toString().length||1},props),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Inner,{$invertColor:invertTextColor,$isSmall:isSmall},notificationCount))}},"./packages/design-system/src/components/notificationBubble/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_4__=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")),_typography__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_storybookUtils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/notificationBubble/notificationBubble.tsx"),___WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/notificationBubble/types.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/NotificationBubble",component:___WEBPACK_IMPORTED_MODULE_2__.A,args:{isSmall:!1,invertTextColor:!1,notificationCount:6},parameters:{controls:{exclude:["variant"]}}},VARIANT_OPTIONS=Object.values(___WEBPACK_IMPORTED_MODULE_3__.I),Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-1fguc1t-0"})(["display:grid;row-gap:20px;padding:20px 50px;background-color:",";border:1px solid ",";"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.standard.black)),Row=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Row",componentId:"sc-1fguc1t-1"})(["display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr;grid-column:1 / -1;label{display:flex;align-items:center;}"]),_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_5__.$,null,"Notification Bubble"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,VARIANT_OPTIONS.map((variant=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({key:variant,variant},args)))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_6__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,VARIANT_OPTIONS.map((variant=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,_extends({key:variant,variant},args))))))))}}},"./packages/design-system/src/components/notificationBubble/types.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{I:()=>BubbleVariant});let BubbleVariant=function(BubbleVariant){return BubbleVariant.Primary="primary",BubbleVariant.Secondary="secondary",BubbleVariant.Tertiary="tertiary",BubbleVariant.Quaternary="quaternary",BubbleVariant.Positive="positive",BubbleVariant.Negative="negative",BubbleVariant.Accent="accent",BubbleVariant}({})},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.u,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.$.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus))))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)},"./packages/design-system/src/theme/helpers/centerContent.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>centerContent});const centerContent=(0,__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js").AH)(["display:flex;align-items:center;justify-content:center;"])},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/fullSize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{N:()=>fullSizeRelative,O:()=>fullSizeAbsolute});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const fullSizeAbsolute=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["position:absolute;top:0;right:0;bottom:0;left:0;"]),fullSizeRelative=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["position:relative;top:0;left:0;height:100%;width:100%;"])},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);