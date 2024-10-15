"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6980],{"./packages/design-system/src/icons/chevron_down_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgChevronDownSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10,d:"m20 15-4 3-4-3"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgChevronDownSmall)},"./packages/design-system/src/icons/cross.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCross=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.854 9.146a.5.5 0 1 0-.708.708L15.293 16l-6.147 6.146a.5.5 0 0 0 .708.708L16 16.707l6.146 6.147a.5.5 0 0 0 .708-.708L16.707 16l6.147-6.146a.5.5 0 0 0-.708-.708L16 15.293z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCross)},"./packages/design-system/src/icons/exclamation_outline.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgExclamationOutline=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16 9a7 7 0 1 0 0 14 7 7 0 0 0 0-14m0-1a8 8 0 1 0 0 16 8 8 0 0 0 0-16m0 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-.5-2a.5.5 0 0 0 1 0v-4a.5.5 0 0 0-1 0z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgExclamationOutline)},"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_3__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_4__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_6__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_6__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_5__.QB,_constants__WEBPACK_IMPORTED_MODULE_5__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_3__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";min-width:1px;min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_7__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_7__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_6__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_6__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_4__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function Button({size=_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonRectangle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Circle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCircle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Square:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonSquare,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Icon:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonIcon,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Link:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonLink,elementProps,children);default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function ButtonAsLink({size=_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorRectangle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Circle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorCircle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Square:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorSquare,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Icon:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorIcon,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Link:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorLink,elementProps,children);default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/components/disclosure/disclosure.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_icons__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/icons/chevron_down_small.svg");const rotate={up:[180,0],down:[0,180],left:[-90,0],right:[90,0]},__WEBPACK_DEFAULT_EXPORT__=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_1__.A).withConfig({displayName:"disclosure__Disclosure",componentId:"sc-1xdydn4-0"})(["height:","px;width:auto;margin:0 -10px;color:",";transition:transform ",";transform:",";"],_theme__WEBPACK_IMPORTED_MODULE_2__.i.ICON_SIZE,(({disabled,theme})=>disabled?theme.colors.fg.disable:theme.colors.fg.secondary),(({duration=0})=>duration),(({direction="down",$isOpen=!1})=>{const[whenClosed,whenOpen]=rotate[direction];return`rotate(${$isOpen?whenOpen:whenClosed}deg);`}))},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts"));const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut({component:Component,shortcut=""}){const chars=shortcut.split(" ");return react.createElement(Component,{"aria-label":(0,utils._M)(shortcut)},chars.map(((char,index)=>react.createElement(Component,{key:`${index}-${char}`},(0,utils.KV)(char)))))}},"./packages/design-system/src/components/popup/popup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_utils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/utils/noop.ts"),_contexts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts");const DEFAULT_TOP_OFFSET=0,DEFAULT_LEFT_OFFSET=0;const __WEBPACK_DEFAULT_EXPORT__=function Popup({anchor,dock,children,renderContents,placement=_constants__WEBPACK_IMPORTED_MODULE_2__.W.Bottom,spacing,isOpen,fillWidth=!1,refCallback=_utils__WEBPACK_IMPORTED_MODULE_3__.l,zIndex=2,ignoreMaxOffsetY,offsetOverride=!1,maxWidth}){const{topOffset=DEFAULT_TOP_OFFSET,leftOffset=DEFAULT_LEFT_OFFSET,isRTL=!1}=(0,_contexts__WEBPACK_IMPORTED_MODULE_4__.A)(),[popupState,setPopupState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null),isMounted=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(!1),popup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(null),positionPopup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((evt=>{if(!isMounted.current||!anchor?.current)return;if(evt instanceof Event&&evt.target instanceof Element&&popup.current?.contains(evt.target))return;const offset=anchor.current?(0,_utils__WEBPACK_IMPORTED_MODULE_5__.A3)({placement,spacing,anchor,dock,popup,isRTL,topOffset,ignoreMaxOffsetY,offsetOverride}):_utils__WEBPACK_IMPORTED_MODULE_5__.Oe,popupRect=popup.current?.getBoundingClientRect();setPopupState({offset:(()=>{if(!popupRect)return null;if(popupRect.x<=leftOffset)switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopEnd:return{...offset,x:isRTL?offset.x:popupRect.width+leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Left:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftStart:return{...offset,x:isRTL?offset.x:popupRect.width+-popupRect.x-leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Right:return{...offset,x:popupRect.width};default:return{...offset,x:popupRect.width/2+(isRTL?0:leftOffset)}}return isRTL&&popupRect.right>=offset.bodyRight-leftOffset?{...offset,x:offset.bodyRight-popupRect.width-leftOffset}:null})()||offset,height:popupRect?.height||null})}),[anchor,placement,spacing,dock,isRTL,topOffset,leftOffset,ignoreMaxOffsetY,offsetOverride]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>(isMounted.current=!0,()=>{isMounted.current=!1})),[]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>{popupState?.height&&popupState.height!==popup.current?.getBoundingClientRect()?.height&&positionPopup()}),[popupState?.height,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{if(isOpen)return isMounted.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isMounted.current=!1}}),[isOpen,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{isMounted.current&&refCallback(popup)}),[popupState,refCallback]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.pO)({current:document.body},positionPopup,[positionPopup]),popupState&&isOpen?(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.d5)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_constants__WEBPACK_IMPORTED_MODULE_2__.yK,{ref:popup,fillWidth:Boolean(fillWidth),maxWidth,$offset:popupState.offset,topOffset,zIndex,transforms:(0,_utils__WEBPACK_IMPORTED_MODULE_6__.s0)(placement,isRTL)},renderContents?renderContents({propagateDimensionChange:positionPopup}):children),document.body):null}},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.u,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.$.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus))))},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/design-system/src/utils/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{E:()=>FOCUSABLE_SELECTORS,R:()=>KEYS});const KEYS={DOWN:"ArrowDown",LEFT:"ArrowLeft",RIGHT:"ArrowRight",UP:"ArrowUp",ENTER:"Enter",SPACE:"Space",TAB:"Tab"},FOCUSABLE_SELECTORS=["button:not(:disabled)","[href]","input:not(:disabled)","select:not(:disabled)","textarea:not(:disabled)",'[tabindex]:not([tabindex="-1"])']},"./packages/i18n/src/translateWithMarkup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>translateWithMarkup});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts"));function transform(node,mapping={}){const result=[];do{result.push(transformNode(node,mapping)),node=node.nextSibling}while(null!==node);return result}function transformNode(node,mapping={}){const{childNodes,nodeType,textContent}=node;if(Node.TEXT_NODE===nodeType)return textContent;const children=node.hasChildNodes()?Array.from(childNodes).map((child=>transform(child,mapping))):null,{localName}=node;return localName in mapping?(0,src.Ob)(mapping[localName],{},children):(0,src.n)(localName,null,children)}const VOID_ELEMENTS=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];const translateWithMarkup=function TranslateWithMarkup({mapping={},children}){mapping=Object.fromEntries(Object.entries(mapping).map((([k,v])=>[k.toLowerCase(),v])));const foundVoidElements=Object.keys(mapping).filter((tag=>VOID_ELEMENTS.includes(tag))).join(" ");if(foundVoidElements.length>0)throw new Error(`Found disallowed void elements in TranslateWithMarkup map: ${foundVoidElements}`);const node=(new DOMParser).parseFromString(children,"text/html").body.firstChild;return node?react.createElement(src.FK,null,transform(node,mapping).map(((element,index)=>react.createElement(src.FK,{key:index},element)))):null}},"./packages/story-editor/src/components/checklist/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{EmptyState:()=>EmptyState,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/i18n/src/i18n.ts"),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/story-editor/src/components/checklist/index.js"),_utils_noop__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/story-editor/src/utils/noop.ts"),_secondaryPopup__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/story-editor/src/components/secondaryPopup/index.js"),_checklistContent__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/story-editor/src/components/checklist/checklistContent/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Stories Editor/Components/Checklist",component:___WEBPACK_IMPORTED_MODULE_1__.bY},Page=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Page",componentId:"sc-7ayvdl-0"})(["position:relative;display:flex;align-items:flex-end;height:300px;width:900px;background-color:",";"],(({theme})=>theme.colors.bg.primary)),Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-7ayvdl-1"})(["position:relative;margin-left:20px;margin-bottom:10px;"]),EmptyState=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Page,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_secondaryPopup__WEBPACK_IMPORTED_MODULE_2__.Ay,{popupId:"1234",isOpen:!0,ariaLabel:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Checklist","web-stories")},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_secondaryPopup__WEBPACK_IMPORTED_MODULE_2__._B,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_secondaryPopup__WEBPACK_IMPORTED_MODULE_2__.IS,{onClose:_utils_noop__WEBPACK_IMPORTED_MODULE_6__.l,label:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Checklist","web-stories"),popupId:"1234"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checklistContent__WEBPACK_IMPORTED_MODULE_3__.HY,null)))))},"./packages/story-editor/src/components/directionAware/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/stylis-plugin-rtl/dist/stylis-rtl.js"),_app__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/story-editor/src/app/index.js");Object.defineProperty(stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1__.Ay,"name",{value:"stylisRTLPlugin"});const withRTLPlugins=[stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1__.Ay],withoutRTLPlugins=[];const __WEBPACK_DEFAULT_EXPORT__=function DirectionAware({children}){const{isRTL}=(0,_app__WEBPACK_IMPORTED_MODULE_2__.UK)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_3__.ID,{stylisPlugins:isRTL?withRTLPlugins:withoutRTLPlugins},children)}},"./packages/story-editor/src/components/panels/shared/styles.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>focusStyle,t:()=>inputContainerStyleOverride});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts");const focusStyle=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["",";"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_1__.Q(theme.colors.border.focus,theme.colors.bg.secondary))),inputContainerStyleOverride=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":focus-within{",";}"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_1__.g(theme.colors.border.focus,theme.colors.bg.secondary)))},"./packages/story-editor/src/components/tooltip/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>Tooltip});var react=__webpack_require__("./node_modules/react/index.js"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),tooltip=__webpack_require__("./packages/design-system/src/components/tooltip/tooltip.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function Tooltip({hasTail=!0,placement=constants.W.Bottom,...props}){return react.createElement(tooltip.A,_extends({placement,hasTail},props))}},"./packages/story-editor/src/constants/zIndex.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{GM:()=>Z_INDEX_FOOTER,Gu:()=>Z_INDEX_RECORDING_MODE,PK:()=>Z_INDEX_GRID_VIEW_SLIDER,Ry:()=>Z_INDEX_FLOATING_MENU,VT:()=>Z_INDEX_CANVAS_SIDE_MENU_RECORDING_MODE,Vg:()=>Z_INDEX_EDIT_LAYER,Xl:()=>Z_INDEX_STORY_DETAILS,ll:()=>Z_INDEX_CANVAS_SIDE_MENU,mD:()=>Z_INDEX_NAV_LAYER,qR:()=>Z_INDEX_LIBRARY_ACTION_BUTTON});const Z_INDEX_STORY_DETAILS=10,Z_INDEX_CANVAS_SIDE_MENU=3,Z_INDEX_FLOATING_MENU=4,Z_INDEX_EDIT_LAYER=3,Z_INDEX_NAV_LAYER=5,Z_INDEX_RECORDING_MODE=6,Z_INDEX_CANVAS_SIDE_MENU_RECORDING_MODE=7,Z_INDEX_FOOTER=3,Z_INDEX_GRID_VIEW_SLIDER=11,Z_INDEX_LIBRARY_ACTION_BUTTON=20}}]);