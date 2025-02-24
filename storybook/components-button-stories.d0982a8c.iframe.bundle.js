"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[7512],{"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_6__.QB,_constants__WEBPACK_IMPORTED_MODULE_6__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_4__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function Button(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function ButtonAsLink(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/components/button/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DarkTheme:()=>DarkTheme,LightTheme:()=>LightTheme,PrebakedButtons:()=>PrebakedButtons,ToggleButtons:()=>ToggleButtons,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js"),__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js")),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),prop_types__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_8__),_theme__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_typography__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_typography__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_icons__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/icons/cross.svg"),_button__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_constants__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_toggleButton__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__("./packages/design-system/src/components/button/toggleButton.tsx"),_storybookUtils_darkThemeProvider__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Button",argTypes:{type:{options:Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.VQ),control:"select"},variant:{options:Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Ak),control:"select"},size:{options:Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Mp),control:"radio"}},args:{type:_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary,variant:_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,size:_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium}},Container=styled_components__WEBPACK_IMPORTED_MODULE_6__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-1szgqr5-0"})(["background-color:",";border:1px solid ",";display:flex;flex-direction:column;padding:20px;"],(props=>props.theme.colors.bg.primary),(props=>props.theme.colors.fg.black)),Row=styled_components__WEBPACK_IMPORTED_MODULE_6__.Ay.div.withConfig({displayName:"stories__Row",componentId:"sc-1szgqr5-1"})(["display:flex;flex-direction:row;flex-wrap:wrap;& > div{width:200px;margin:10px;p{padding-top:10px;}}"]);function ButtonContent(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_3__.c)(2),{variant}=t0;let t1;return $[0]!==variant?(t1=[_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Link].includes(variant)?"Standard Button":react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_7__.A,null),$[0]=variant,$[1]=t1):t1=$[1],t1}ButtonContent.propTypes={variant:prop_types__WEBPACK_IMPORTED_MODULE_8___default().oneOf(Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Ak))};const ButtonCombosToDisplay=args=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_9__.$,{as:"h2"},"Buttons by Variant, Size, and Type"),Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Ak).map((buttonVariant=>Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Mp).map((buttonSize=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,{key:`${buttonVariant}_${buttonSize}_row_storybook`},Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.VQ).map((buttonType=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:`${buttonVariant}_${buttonSize}_${buttonType}_storybook`},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_10__.$,{key:`${buttonVariant}_${buttonType}_storybook`,variant:buttonVariant,type:buttonType,size:buttonSize},react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonContent,{variant:buttonVariant})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,`variant: ${buttonVariant}`," ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),`size: ${buttonSize}`," ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),`type: ${buttonType}`))))))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_9__.$,{as:"h3",size:_theme__WEBPACK_IMPORTED_MODULE_12__.$.Small},"Button Demos"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_10__.x,_extends({href:""},args),"Link as Button"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,"Link as Button")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_10__.$,{type:_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary},"Just a really really long button to ensure edge cases!!!!!"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,"Edge case: really long")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_10__.$,{type:_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary},"Text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,"Edge case: short")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_10__.$,_extends({disabled:!0},args),"Text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,"Disabled button")))),DarkTheme={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils_darkThemeProvider__WEBPACK_IMPORTED_MODULE_13__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCombosToDisplay,args))}},LightTheme={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCombosToDisplay,args)}},TOGGLE_VARIANTS=[_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Circle,_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Square],ToggleButtonContainer=({isToggled,swapToggled,type})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__.Mp).map((buttonSize=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,{key:`${buttonSize}_row_storybook`},TOGGLE_VARIANTS.map((buttonVariant=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key:`${buttonVariant}_${buttonSize}_storybook`},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_toggleButton__WEBPACK_IMPORTED_MODULE_14__.f,{key:`${buttonVariant}_storybook`,variant:buttonVariant,size:buttonSize,isToggled,onClick:swapToggled,type},react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonContent,{variant:buttonVariant})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_11__.E.Paragraph,null,`variant: ${buttonVariant}`," ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),`size: ${buttonSize}`," ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),`is toggled: ${isToggled}`,type&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),`type: ${type}`))))))))),ToggleButtons={render:function Render(){const[isToggled,setToggled]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__.J0)(!1),swapToggled=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__.hb)((()=>setToggled((b=>!b))),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(ToggleButtonContainer,{isToggled,swapToggled}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils_darkThemeProvider__WEBPACK_IMPORTED_MODULE_13__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(ToggleButtonContainer,{isToggled,swapToggled})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ToggleButtonContainer,{isToggled,swapToggled,type:_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Quaternary}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils_darkThemeProvider__WEBPACK_IMPORTED_MODULE_13__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(ToggleButtonContainer,{isToggled,swapToggled,type:_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Quaternary})))},parameters:{controls:{include:[]}}},PrebakedButtons={render:function Render(args){const[isLocked,setLocked]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__.J0)(!1),swapLocked=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_4__.hb)((()=>setLocked((b=>!b))),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_toggleButton__WEBPACK_IMPORTED_MODULE_14__.m,_extends({isLocked,onClick:swapLocked},args)))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils_darkThemeProvider__WEBPACK_IMPORTED_MODULE_13__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_toggleButton__WEBPACK_IMPORTED_MODULE_14__.m,_extends({isLocked,onClick:swapLocked},args))))))},parameters:{controls:{include:[]}}}},"./packages/design-system/src/components/button/toggleButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>ToggleButton,m:()=>LockToggle});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_icons__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/icons/lock_closed.svg"),_icons__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/icons/lock_open.svg"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_button__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/button/button.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function ToggleButton(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(8);let rest,t1,type;$[0]!==t0?(({isToggled:t1,type,...rest}=t0),$[0]=t0,$[1]=rest,$[2]=t1,$[3]=type):(rest=$[1],t1=$[2],type=$[3]);const isToggled=void 0!==t1&&t1,actualType=type===_constants__WEBPACK_IMPORTED_MODULE_2__.VQ.Quaternary?type:isToggled?_constants__WEBPACK_IMPORTED_MODULE_2__.VQ.Secondary:_constants__WEBPACK_IMPORTED_MODULE_2__.VQ.Tertiary;let t2;return $[4]!==actualType||$[5]!==isToggled||$[6]!==rest?(t2=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_3__.$,_extends({},rest,{type:actualType,"aria-pressed":isToggled,isToggled})),$[4]=actualType,$[5]=isToggled,$[6]=rest,$[7]=t2):t2=$[7],t2}function LockToggle(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(9);let rest,t1;$[0]!==t0?(({isLocked:t1,...rest}=t0),$[0]=t0,$[1]=rest,$[2]=t1):(rest=$[1],t1=$[2]);const isLocked=void 0!==t1&&t1;let t2,t3;return $[3]!==isLocked?(t2=isLocked?react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_4__.A,null):react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_5__.A,null),$[3]=isLocked,$[4]=t2):t2=$[4],$[5]!==isLocked||$[6]!==rest||$[7]!==t2?(t3=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_3__.$,_extends({},rest,{"aria-pressed":isLocked,type:_constants__WEBPACK_IMPORTED_MODULE_2__.VQ.Tertiary,size:_constants__WEBPACK_IMPORTED_MODULE_2__.Mp.Small,variant:_constants__WEBPACK_IMPORTED_MODULE_2__.Ak.Square}),t2),$[5]=isLocked,$[6]=rest,$[7]=t2,$[8]=t3):t3=$[8],t3}},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.u,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.$.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus))))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{E:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight),Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)),(({disabled,theme})=>disabled?theme.colors.fg.disable:"auto")),Span,Kbd,Paragraph}},"./packages/design-system/src/icons/cross.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCross=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.854 9.146a.5.5 0 1 0-.708.708L15.293 16l-6.147 6.146a.5.5 0 0 0 .708.708L16 16.707l6.146 6.147a.5.5 0 0 0 .708-.708L16.707 16l6.147-6.146a.5.5 0 0 0-.708-.708L16 15.293z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCross)},"./packages/design-system/src/icons/lock_closed.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgLockClosed=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16 8a3 3 0 0 0-3 3v3h-1.5a1.5 1.5 0 0 0-1.5 1.5v7a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5H19v-3a3 3 0 0 0-3-3m2 6v-3a2 2 0 1 0-4 0v3zm-4.5 1h-2a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7m2.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLockClosed)},"./packages/design-system/src/icons/lock_open.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgLockOpen=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M17.816 8.415a3.023 3.023 0 0 0-4.161 1.129l-.255.447a.5.5 0 1 0 .87.494l.254-.447a2.023 2.023 0 0 1 2.786-.76 2.1 2.1 0 0 1 .75 2.844L16.964 14H11.5a1.5 1.5 0 0 0-1.5 1.5v7a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-2.379l.805-1.376.002-.005c.836-1.47.343-3.351-1.112-4.204M11.5 15a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zm4.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLockOpen)},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);