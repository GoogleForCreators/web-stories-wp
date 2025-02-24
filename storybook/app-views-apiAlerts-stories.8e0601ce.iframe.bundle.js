"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6895],{"./node_modules/core-js/modules/es.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./packages/dashboard/src/app/api/useApi.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>useApi});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts"),_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/app/api/context.js");function useApi(t0){const selector=void 0===t0?_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.D_:t0;return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.i7)(_context__WEBPACK_IMPORTED_MODULE_1__.A,selector)}},"./packages/dashboard/src/app/api/useApiAlerts.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_compiler_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/contexts/snackbar/useSnackbar.ts"),_useApi__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/app/api/useApi.js");function _temp(t0){const{state:t1}=t0,{stories:t2,templates:t3}=t1,{error:storyError}=t2,{error:templateError}=t3;return{storyError,templateError}}const __WEBPACK_DEFAULT_EXPORT__=function useApiAlerts(){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_0__.c)(10),{storyError:storyError_0,templateError:templateError_0}=(0,_useApi__WEBPACK_IMPORTED_MODULE_2__.A)(_temp),{showSnackbar}=(0,_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.d)();let t0;$[0]!==showSnackbar?(t0=message=>showSnackbar({message,dismissible:!0}),$[0]=showSnackbar,$[1]=t0):t0=$[1];const debouncedShowSnackbar=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.YQ)(t0,200);let t1,t2,t3,t4;$[2]!==debouncedShowSnackbar||$[3]!==storyError_0?(t1=()=>{storyError_0?.id&&debouncedShowSnackbar(storyError_0.message)},t2=[storyError_0,debouncedShowSnackbar],$[2]=debouncedShowSnackbar,$[3]=storyError_0,$[4]=t1,$[5]=t2):(t1=$[4],t2=$[5]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)(t1,t2),$[6]!==debouncedShowSnackbar||$[7]!==templateError_0?(t3=()=>{templateError_0?.id&&debouncedShowSnackbar(templateError_0.message)},t4=[templateError_0,debouncedShowSnackbar],$[6]=debouncedShowSnackbar,$[7]=templateError_0,$[8]=t3,$[9]=t4):(t3=$[8],t4=$[9]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)(t3,t4)}},"./packages/dashboard/src/app/views/apiAlerts/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/contexts/snackbar/snackbarProvider.tsx"),_api_context__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/app/api/context.js"),_api_useApiAlerts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/src/app/api/useApiAlerts.js");const SnackbarView=()=>{const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(1);let t0;return(0,_api_useApiAlerts__WEBPACK_IMPORTED_MODULE_4__.A)(),$[0]===Symbol.for("react.memo_cache_sentinel")?(t0=react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null),$[0]=t0):t0=$[0],t0},__WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/DashboardSnackbar",component:SnackbarView},storyErrors=[{message:"I am an error about loading stories."},{message:"I am another error about loading stories."},{message:"Error updating story."},{message:"Something is really not working!"},{message:"I am the last preloaded error for stories in this storybook."}],templateErrors=[{message:"I am a template error."},{message:"I am another template error."},{message:"I am the third template error."},{message:"Something is really not working (still)!"},{message:"I am the last preloaded error for templates in this storybook."}],_default={render:function Render(){const[storyError,setStoryError]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.J0)(),[storyErrorIndexToAdd,setStoryErrorIndexToAdd]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.J0)(0),[templateError,setTemplateError]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.J0)(),[templateErrorIndexToAdd,setTemplateErrorIndexToAdd]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.J0)(0);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_api_context__WEBPACK_IMPORTED_MODULE_3__.A.Provider,{value:{state:{stories:{error:storyError},templates:{error:templateError},settings:{error:{}},media:{error:{}}}}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.$,{type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary,onClick:()=>{setStoryErrorIndexToAdd(storyErrorIndexToAdd+1),setStoryError({...storyErrors[storyErrorIndexToAdd],id:Date.now()})},isDisabled:storyErrorIndexToAdd>storyErrors.length-1},storyErrorIndexToAdd>storyErrors.length-1?"No more practice story alerts":"Add practice story alert"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.$,{type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary,onClick:()=>{setTemplateErrorIndexToAdd(templateErrorIndexToAdd+1),setTemplateError({...templateErrors[templateErrorIndexToAdd],id:Date.now()})},isDisabled:templateErrorIndexToAdd>templateErrors.length-1},templateErrorIndexToAdd>templateErrors.length-1?"No more practice template alerts":"Add practice template alert"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(SnackbarView,null)))}}},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_6__.QB,_constants__WEBPACK_IMPORTED_MODULE_6__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_4__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function Button(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Rf)((function ButtonAsLink(t0,ref){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(26);let children,rest,t1,t2,t3;$[0]!==t0?(({size:t1,type:t2,variant:t3,children,...rest}=t0),$[0]=t0,$[1]=children,$[2]=rest,$[3]=t1,$[4]=t2,$[5]=t3):(children=$[1],rest=$[2],t1=$[3],t2=$[4],t3=$[5]);const size=void 0===t1?_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:t1,type=void 0===t2?_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain:t2,variant=void 0===t3?_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:t3;let t4;$[6]!==ref||$[7]!==rest||$[8]!==size||$[9]!==type?(t4={ref,size,$type:type,...rest},$[6]=ref,$[7]=rest,$[8]=size,$[9]=type,$[10]=t4):t4=$[10];const elementProps=t4;switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:{let t5;return $[11]!==children||$[12]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorRectangle,elementProps,children),$[11]=children,$[12]=elementProps,$[13]=t5):t5=$[13],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:{let t5;return $[14]!==children||$[15]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorCircle,elementProps,children),$[14]=children,$[15]=elementProps,$[16]=t5):t5=$[16],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:{let t5;return $[17]!==children||$[18]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorSquare,elementProps,children),$[17]=children,$[18]=elementProps,$[19]=t5):t5=$[19],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:{let t5;return $[20]!==children||$[21]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorIcon,elementProps,children),$[20]=children,$[21]=elementProps,$[22]=t5):t5=$[22],t5}case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:{let t5;return $[23]!==children||$[24]!==elementProps?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorLink,elementProps,children),$[23]=children,$[24]=elementProps,$[25]=t5):t5=$[25],t5}default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/contexts/snackbar/context.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=(0,__webpack_require__("./packages/react/src/index.ts").q6)({showSnackbar:()=>!1,clearSnackbar:()=>!1,removeSnack:()=>!1,currentSnacks:[],placement:""})},"./packages/design-system/src/contexts/snackbar/snackbarProvider.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_4__=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.find.js"),__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js")),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/react/src/index.ts"),uuid__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_context__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/contexts/snackbar/context.ts");const __WEBPACK_DEFAULT_EXPORT__=function SnackbarProvider(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_4__.c)(20),{children,placement:t1}=t0,placement=void 0===t1?"bottom":t1;let t2;$[0]===Symbol.for("react.memo_cache_sentinel")?(t2=[],$[0]=t2):t2=$[0];const[notifications,setNotifications]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__.J0)(t2);let t3,t4;$[1]!==setNotifications?(t3=toRemove=>{setNotifications((currentNotifications=>currentNotifications.filter((item=>Array.isArray(toRemove)?!toRemove.find((t4=>{const{id}=t4;return id===item.id})):item.id!==toRemove.id))))},$[1]=setNotifications,$[2]=t3):t3=$[2],$[3]===Symbol.for("react.memo_cache_sentinel")?(t4=[],$[3]=t4):t4=$[3];const remove=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__.hb)(t3,t4);let t5,t6;$[4]!==setNotifications?(t5=notification=>{const newNotification={id:(0,uuid__WEBPACK_IMPORTED_MODULE_6__.A)(),...notification};setNotifications((currentNotifications_0=>[...currentNotifications_0,newNotification]))},$[4]=setNotifications,$[5]=t5):t5=$[5],$[6]===Symbol.for("react.memo_cache_sentinel")?(t6=[],$[6]=t6):t6=$[6];const create=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__.hb)(t5,t6);let t7,t8;$[7]!==setNotifications?(t7=()=>{setNotifications([])},$[7]=setNotifications,$[8]=t7):t7=$[8],$[9]===Symbol.for("react.memo_cache_sentinel")?(t8=[],$[9]=t8):t8=$[9];const clear=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__.hb)(t7,t8);let t10,t9;$[10]!==clear||$[11]!==create||$[12]!==notifications||$[13]!==placement||$[14]!==remove?(t9=()=>({showSnackbar:create,clearSnackbar:clear,removeSnack:remove,currentSnacks:notifications,placement}),t10=[create,clear,remove,notifications,placement],$[10]=clear,$[11]=create,$[12]=notifications,$[13]=placement,$[14]=remove,$[15]=t10,$[16]=t9):(t10=$[15],t9=$[16]);const state=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_5__.Kr)(t9,t10);let t11;return $[17]!==children||$[18]!==state?(t11=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_context__WEBPACK_IMPORTED_MODULE_7__.A.Provider,{value:state},children),$[17]=children,$[18]=state,$[19]=t11):t11=$[19],t11}},"./packages/design-system/src/contexts/snackbar/useSnackbar.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{d:()=>useSnackbar});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts"),_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/contexts/snackbar/context.ts");function useSnackbar(t0){const selector=void 0===t0?_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.D_:t0;return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.i7)(_context__WEBPACK_IMPORTED_MODULE_1__.A,selector)}},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);