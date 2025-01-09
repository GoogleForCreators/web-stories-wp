"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[3169],{"./packages/design-system/src/icons/table.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgTable=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.5 9A1.5 1.5 0 0 0 8 10.5v11A1.5 1.5 0 0 0 9.5 23h13a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 22.5 9h-13m3 1h-3a.5.5 0 0 0-.5.5V13h3.5zM9 14v4h3.5v-4zm0 5v2.5a.5.5 0 0 0 .5.5h3v-3zm4.5 3h9a.5.5 0 0 0 .5-.5V19h-9.5zm9.5-4v-4h-9.5v4zm0-5v-2.5a.5.5 0 0 0-.5-.5h-9v3z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgTable)},"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_6__.QB,_constants__WEBPACK_IMPORTED_MODULE_6__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_4__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function Button(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function ButtonAsLink(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/components/tooltip/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LightMode:()=>LightMode,TooltipWithChangingTextOnClick:()=>TooltipWithChangingTextOnClick,TooltipWithChangingTextOnInterval:()=>TooltipWithChangingTextOnInterval,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),_icons__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/icons/table.svg"),_button__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_button__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_popup__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),___WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/tooltip/tooltip.tsx"),_typography__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Tooltip",args:{hasTail:!0,placement:_popup__WEBPACK_IMPORTED_MODULE_2__.W.Bottom,colorShortcut:"mod+z",colorTitle:"Page background colors cannot have opacity",iconShortcut:"Shortcut for icon",iconTitle:"To save draft click enter",buttonShortcut:"Shortcut for button",buttonTitle:"Tooltip message over a button"},argTypes:{placement:{options:Object.values(_popup__WEBPACK_IMPORTED_MODULE_2__.W),control:"select"},colorShortcut:{name:"Shortcut for color"},colorTitle:{name:"Title for color"},iconShortcut:{name:"Shortcut for icon"},iconTitle:{name:"Title for icon"},buttonShortcut:{name:"Shortcut for button"},buttonTitle:{name:"Title for button"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-1sryy4p-0"})(["display:flex;align-items:center;justify-content:center;width:600px;height:400px;background-color:",";padding:30px;p{margin:10px;}"],(props=>props.theme.colors.bg.primary)),Color=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Color",componentId:"sc-1sryy4p-1"})(["width:20px;height:20px;border-radius:50%;background-color:red;"]),_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_3__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_4__.w},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.colorShortcut,title:args.colorTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Color,null)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.iconShortcut,title:args.iconTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,variant:_button__WEBPACK_IMPORTED_MODULE_7__.Ak.Icon},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_8__.A,{"aria-hidden":!0}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.buttonShortcut,title:args.buttonTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,size:_button__WEBPACK_IMPORTED_MODULE_7__.Mp.Small},"I am just a normal button"))))}},LightMode={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.colorShortcut,title:args.colorTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Color,null)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.iconShortcut,title:args.iconTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,variant:_button__WEBPACK_IMPORTED_MODULE_7__.Ak.Icon},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_8__.A,{"aria-hidden":!0}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.buttonShortcut,title:args.buttonTitle},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,size:_button__WEBPACK_IMPORTED_MODULE_7__.Mp.Small},"I am just a normal button")))}},tooltipTitles=["initial tooltip title","secondary tooltip title but quite a bit longer"],TooltipWithChangingTextOnClick={render:function Render(args){const[currentTooltipIndex,setCurrentTooltipIndex]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(0),handleTooltipTextChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((()=>{setCurrentTooltipIndex((existingIndex=>1===existingIndex?0:1))}),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_9__.E,null,"Click button to change tooltip title."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.iconShortcut,title:tooltipTitles[currentTooltipIndex]},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,size:_button__WEBPACK_IMPORTED_MODULE_7__.Mp.Small,onClick:handleTooltipTextChange},"Switch view")))},parameters:{controls:{include:["hasTail","placement","Shortcut for icon"]}}},TooltipWithChangingTextOnInterval={render:function Render(args){const[currentTooltipIndex,setCurrentTooltipIndex]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(0),[isTooltipIntervalActive,setIsTooltipIntervalActive]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(!1);(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>{let interval;return isTooltipIntervalActive&&(interval=setInterval((()=>setCurrentTooltipIndex((existingIndex=>1===existingIndex?0:1))),1e3)),()=>interval&&clearInterval(interval)}),[isTooltipIntervalActive]);const handleToggleButtonFocus=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((()=>setIsTooltipIntervalActive((currentActiveState=>!currentActiveState))),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_9__.E,null,"Place focus on button to begin updating tooltip text with interval behind the scenes, remove focus to stop."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_5__.A,{hasTail:args.hasTail,placement:args.placement,shortcut:args.iconShortcut,title:tooltipTitles[currentTooltipIndex]},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_6__.$,{type:_button__WEBPACK_IMPORTED_MODULE_7__.VQ.Primary,size:_button__WEBPACK_IMPORTED_MODULE_7__.Mp.Small,onFocus:handleToggleButtonFocus,onBlur:handleToggleButtonFocus},"Switch view")))},parameters:{controls:{include:["hasTail","placement","Shortcut for icon"]}}}},"./packages/design-system/src/components/tooltip/tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>tooltip});var react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),src=__webpack_require__("./packages/react/src/index.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts"),usePopup=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),getOffset=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),getTransforms=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts");const SvgForTail=styled_components_browser_esm.Ay.svg.withConfig({displayName:"tail__SvgForTail",componentId:"sc-bxihlv-0"})(["position:absolute;width:0;height:0;"]),Tail=styled_components_browser_esm.Ay.span.withConfig({displayName:"tail__Tail",componentId:"sc-bxihlv-1"})(["@supports (clip-path:url('#","')){position:absolute;display:block;height:","px;width:","px;",";background-color:inherit;border:none;border-bottom:none;clip-path:url('#","');}"],"tooltip-tail",8,34,(({placement,translateX,isRTL})=>(({placement,translateX,isRTL})=>{switch(placement){case constants.W.Top:case constants.W.TopStart:case constants.W.TopEnd:return(0,styled_components_browser_esm.AH)(["bottom:-","px;/*! @noflip */ transform:translateX(","px) rotate(180deg);"],7,translateX);case constants.W.Bottom:case constants.W.BottomStart:case constants.W.BottomEnd:return(0,styled_components_browser_esm.AH)(["top:-","px;/*! @noflip */ transform:translateX(","px);"],7,translateX);case constants.W.Left:case constants.W.LeftStart:case constants.W.LeftEnd:return(0,styled_components_browser_esm.AH)(["right:-","px;transform:rotate(",");"],20,isRTL?"-90deg":"90deg");case constants.W.Right:case constants.W.RightStart:case constants.W.RightEnd:return(0,styled_components_browser_esm.AH)(["left:-","px;transform:rotate(",");"],20,isRTL?"90deg":"-90deg");default:return""}})({placement,translateX,isRTL})),"tooltip-tail");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const DEFAULT_LEFT_OFFSET=0,Wrapper=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__Wrapper",componentId:"sc-128lmkf-0"})(["position:relative;"]),TooltipContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__TooltipContainer",componentId:"sc-128lmkf-1"})(["margin:0;display:flex;justify-content:center;align-items:center;text-align:center;flex-direction:row;max-width:14em;transition:0.4s opacity;opacity:",";pointer-events:",";z-index:",";border-radius:4px;background-color:",";filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25));",""],(({shown})=>shown?1:0),(({shown})=>shown?"all":"none"),(({zIndex})=>zIndex),(({theme})=>theme.colors.inverted.bg.primary),(({styleOverride})=>styleOverride)),TooltipText=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).withConfig({displayName:"tooltip__TooltipText",componentId:"sc-128lmkf-2"})(["color:",";padding:10px;"],(({theme})=>theme.colors.inverted.fg.primary)),getBoundingBoxCenter=({x,width})=>x+width/2;let lastVisibleDelayedTooltip=0;const tooltip=function Tooltip({title,shortcut="",hasTail=!1,placement=constants.W.Bottom,children,onFocus=noop.l,onBlur=noop.l,isDelayed=!1,forceAnchorRef,className,popupZIndexOverride,styleOverride,...props}){const{leftOffset=DEFAULT_LEFT_OFFSET,isRTL}=(0,usePopup.A)(),[shown,setShown]=(0,src.J0)(!1),[arrowDelta,setArrowDelta]=(0,src.J0)(0),anchorRef=(0,src.li)(null),tooltipRef=(0,src.li)(null),placementRef=(0,src.li)(placement),[dynamicPlacement,setDynamicPlacement]=(0,src.J0)(placement),isMountedRef=(0,src.li)(!1),[popupState,setPopupState]=(0,src.J0)({}),isPopupMountedRef=(0,src.li)(!1),popupRef=(0,src.li)(null),isOpen=Boolean(shown&&(shortcut||title)),[dynamicOffset,setDynamicOffset]=(0,src.J0)({}),spacing=(0,src.Kr)((()=>({x:placement.startsWith("left")||placement.startsWith("right")?8:0,y:placement.startsWith("top")||placement.startsWith("bottom")?8:0})),[placement]),getAnchor=(0,src.hb)((()=>forceAnchorRef||anchorRef),[forceAnchorRef]),positionPopup=(0,src.hb)((()=>{isPopupMountedRef.current&&anchorRef?.current&&setPopupState({offset:anchorRef.current?(0,getOffset.A3)({placement:dynamicPlacement,spacing,anchor:getAnchor(),popup:popupRef,isRTL,ignoreMaxOffsetY:!0}):void 0})}),[dynamicPlacement,spacing,getAnchor,isRTL]),positionPlacement=(0,src.hb)((({offset},{left,right,height})=>{if(!offset)return;const neededVerticalSpace=offset.y+height+8,shouldMoveToTop=dynamicPlacement.startsWith("bottom")&&neededVerticalSpace>=window.innerHeight,isOverFlowingLeft=Math.trunc(left)<(isRTL?0:leftOffset),isOverFlowingRight=isRTL&&Math.trunc(right)>offset.bodyRight-leftOffset;shouldMoveToTop?dynamicPlacement.endsWith("-start")?setDynamicPlacement(constants.W.TopStart):dynamicPlacement.endsWith("-end")?setDynamicPlacement(constants.W.TopEnd):setDynamicPlacement(constants.W.Top):isOverFlowingLeft?setDynamicOffset({x:(isRTL?0:leftOffset)-left}):isOverFlowingRight&&setDynamicOffset({x:offset.bodyRight-right-leftOffset})}),[dynamicPlacement,isRTL,leftOffset]),positionArrow=(0,src.hb)((()=>{const anchor=getAnchor(),anchorElBoundingBox=anchor.current?.getBoundingClientRect(),tooltipElBoundingBox=tooltipRef.current?.getBoundingClientRect();if(!tooltipElBoundingBox||!anchorElBoundingBox)return;positionPlacement(popupState,tooltipElBoundingBox);const delta=getBoundingBoxCenter(anchorElBoundingBox)-getBoundingBoxCenter(tooltipElBoundingBox);setArrowDelta(delta)}),[positionPlacement,popupState,getAnchor]),resetPlacement=(0,src.YQ)((()=>{setDynamicPlacement(placementRef.current)}),100),delayRef=(0,src.li)(null),onHover=(0,src.hb)((()=>{const handle=()=>{isMountedRef.current&&setShown(!0)};if(isDelayed){performance.now()-lastVisibleDelayedTooltip<500&&handle(),delayRef.current&&clearTimeout(delayRef.current),delayRef.current=setTimeout(handle,1e3)}else handle()}),[isDelayed]),onHoverOut=(0,src.hb)((()=>{setShown(!1),resetPlacement(),isDelayed&&delayRef.current&&(clearTimeout(delayRef.current),shown&&(lastVisibleDelayedTooltip=performance.now()))}),[resetPlacement,isDelayed,shown]);return(0,src.vJ)((()=>(isMountedRef.current=!0,()=>{isMountedRef.current=!1})),[]),(0,src.vJ)((()=>(isPopupMountedRef.current=!0,()=>{isPopupMountedRef.current=!1})),[]),(0,src.Nf)((()=>{if(isOpen)return isPopupMountedRef.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isPopupMountedRef.current=!1}}),[isOpen,positionPopup]),(0,src.Nf)((()=>{isPopupMountedRef.current&&positionArrow()}),[positionArrow]),(0,src.pO)({current:document.body},positionPopup,[positionPopup]),react.createElement(react.Fragment,null,react.createElement(Wrapper,_extends({onPointerEnter:onHover,onPointerLeave:onHoverOut,onFocus:e=>{setShown(!0),onFocus(e)},onBlur:e_0=>{setShown(!1),onBlur(e_0),resetPlacement()},ref:anchorRef},props),children),popupState?.offset&&isOpen?(0,src.d5)(react.createElement(constants.yK,{ref:popupRef,$offset:dynamicOffset?{...popupState.offset,x:(popupState.offset?.x||0)+(dynamicOffset?.x||0)}:popupState.offset,noOverFlow:!0,zIndex:popupZIndexOverride||2,transforms:(0,getTransforms.s0)(dynamicPlacement,isRTL)},react.createElement(TooltipContainer,{className,ref:tooltipRef,shown,zIndex:popupZIndexOverride||2,styleOverride},react.createElement(TooltipText,{size:types.$.XSmall},shortcut?`${title} (${(0,utils.KV)(shortcut)})`:title),hasTail&&react.createElement(react.Fragment,null,react.createElement(SvgForTail,null,react.createElement("clipPath",{id:"tooltip-tail",clipPathUnits:"objectBoundingBox"},react.createElement("path",{d:"M1,1 L0.868,1 C0.792,1,0.72,0.853,0.676,0.606 L0.585,0.098 C0.562,-0.033,0.513,-0.033,0.489,0.098 L0.399,0.606 C0.355,0.853,0.283,1,0.207,1 L0,1 L1,1"}))),react.createElement(Tail,{placement:dynamicPlacement,translateX:-(dynamicOffset?.x||0)||arrowDelta,isRTL})))),document.body):null)}},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);