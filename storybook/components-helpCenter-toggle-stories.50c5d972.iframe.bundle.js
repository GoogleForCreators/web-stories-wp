(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9451],{"./packages/design-system/src/icons/chevron_down_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgChevronDownSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10,d:"m20 15-4 3-4-3"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgChevronDownSmall)},"./packages/design-system/src/icons/question_mark_outline.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,_path2,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgQuestionMarkOutline=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16 9a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-8 7a8 8 0 1 1 16 0 8 8 0 0 1-16 0",clipRule:"evenodd"})),_path2||(_path2=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",d:"M15.438 17.268q0-.61.235-1.012.234-.403.84-.963.493-.44.703-.744.222-.318.222-.756 0-.585-.382-.94-.384-.365-1.062-.365-.617 0-.988.354-.359.341-.543.853l-.963-.402q.26-.707.877-1.244.63-.549 1.617-.549.741 0 1.308.305.569.292.877.817.321.525.321 1.17 0 .672-.346 1.147-.333.463-.864.939-.407.366-.592.695-.186.33-.186.768v.513h-1.074zm.543 3.232a.8.8 0 0 1-.567-.22.78.78 0 0 1-.223-.56q0-.317.223-.537a.78.78 0 0 1 .568-.232q.32 0 .543.232a.7.7 0 0 1 .234.537.76.76 0 0 1-.234.56.74.74 0 0 1-.543.22"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgQuestionMarkOutline)},"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_3__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_4__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_6__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_6__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_5__.QB,_constants__WEBPACK_IMPORTED_MODULE_5__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_3__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_7__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_7__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_6__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_6__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_4__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function Button({size=_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonRectangle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Circle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonCircle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Square:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonSquare,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Icon:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonIcon,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Link:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonLink,elementProps,children);default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function ButtonAsLink({size=_constants__WEBPACK_IMPORTED_MODULE_5__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_5__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Rectangle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorRectangle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Circle:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorCircle,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Square:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorSquare,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Icon:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorIcon,elementProps,children);case _constants__WEBPACK_IMPORTED_MODULE_5__.Ak.Link:return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AnchorLink,elementProps,children);default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/components/disclosure/disclosure.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_icons__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/icons/chevron_down_small.svg");const rotate={up:[180,0],down:[0,180],left:[-90,0],right:[90,0]},__WEBPACK_DEFAULT_EXPORT__=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_1__.A).withConfig({displayName:"disclosure__Disclosure",componentId:"sc-1xdydn4-0"})(["height:","px;width:auto;margin:0 -10px;color:",";transition:transform ",";transform:",";"],_theme__WEBPACK_IMPORTED_MODULE_2__.i.ICON_SIZE,(({disabled,theme})=>disabled?theme.colors.fg.disable:theme.colors.fg.secondary),(({duration=0})=>duration),(({direction="down",$isOpen=!1})=>{const[whenClosed,whenOpen]=rotate[direction];return`rotate(${$isOpen?whenOpen:whenClosed}deg);`}))},"./packages/design-system/src/components/tooltip/tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>tooltip});var react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),src=__webpack_require__("./packages/react/src/index.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts"),usePopup=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),getOffset=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),getTransforms=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts");const SvgForTail=styled_components_browser_esm.Ay.svg.withConfig({displayName:"tail__SvgForTail",componentId:"sc-bxihlv-0"})(["position:absolute;width:0;height:0;"]),Tail=styled_components_browser_esm.Ay.span.withConfig({displayName:"tail__Tail",componentId:"sc-bxihlv-1"})(["@supports (clip-path:url('#","')){position:absolute;display:block;height:","px;width:","px;",";background-color:inherit;border:none;border-bottom:none;clip-path:url('#","');}"],"tooltip-tail",8,34,(({placement,translateX,isRTL})=>(({placement,translateX,isRTL})=>{switch(placement){case constants.W.Top:case constants.W.TopStart:case constants.W.TopEnd:return(0,styled_components_browser_esm.AH)(["bottom:-","px;/*! @noflip */ transform:translateX(","px) rotate(180deg);"],7,translateX);case constants.W.Bottom:case constants.W.BottomStart:case constants.W.BottomEnd:return(0,styled_components_browser_esm.AH)(["top:-","px;/*! @noflip */ transform:translateX(","px);"],7,translateX);case constants.W.Left:case constants.W.LeftStart:case constants.W.LeftEnd:return(0,styled_components_browser_esm.AH)(["right:-","px;transform:rotate(",");"],20,isRTL?"-90deg":"90deg");case constants.W.Right:case constants.W.RightStart:case constants.W.RightEnd:return(0,styled_components_browser_esm.AH)(["left:-","px;transform:rotate(",");"],20,isRTL?"90deg":"-90deg");default:return""}})({placement,translateX,isRTL})),"tooltip-tail");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const DEFAULT_LEFT_OFFSET=0,Wrapper=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__Wrapper",componentId:"sc-128lmkf-0"})(["position:relative;"]),TooltipContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__TooltipContainer",componentId:"sc-128lmkf-1"})(["margin:0;display:flex;justify-content:center;align-items:center;text-align:center;flex-direction:row;max-width:14em;transition:0.4s opacity;opacity:",";pointer-events:",";z-index:",";border-radius:4px;background-color:",";filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25));",""],(({shown})=>shown?1:0),(({shown})=>shown?"all":"none"),(({zIndex})=>zIndex),(({theme})=>theme.colors.inverted.bg.primary),(({styleOverride})=>styleOverride)),TooltipText=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).withConfig({displayName:"tooltip__TooltipText",componentId:"sc-128lmkf-2"})(["color:",";padding:10px;"],(({theme})=>theme.colors.inverted.fg.primary)),getBoundingBoxCenter=({x,width})=>x+width/2;let lastVisibleDelayedTooltip=0;const tooltip=function Tooltip({title,shortcut="",hasTail=!1,placement=constants.W.Bottom,children,onFocus=noop.l,onBlur=noop.l,isDelayed=!1,forceAnchorRef,className,popupZIndexOverride,styleOverride,...props}){const{leftOffset=DEFAULT_LEFT_OFFSET,isRTL}=(0,usePopup.A)(),[shown,setShown]=(0,src.J0)(!1),[arrowDelta,setArrowDelta]=(0,src.J0)(0),anchorRef=(0,src.li)(null),tooltipRef=(0,src.li)(null),placementRef=(0,src.li)(placement),[dynamicPlacement,setDynamicPlacement]=(0,src.J0)(placement),isMounted=(0,src.li)(!1),[popupState,setPopupState]=(0,src.J0)({}),isPopupMounted=(0,src.li)(!1),popup=(0,src.li)(null),isOpen=Boolean(shown&&(shortcut||title)),[dynamicOffset,setDynamicOffset]=(0,src.J0)({}),spacing=(0,src.Kr)((()=>({x:placement.startsWith("left")||placement.startsWith("right")?8:0,y:placement.startsWith("top")||placement.startsWith("bottom")?8:0})),[placement]),getAnchor=(0,src.hb)((()=>forceAnchorRef||anchorRef),[forceAnchorRef]),positionPopup=(0,src.hb)((()=>{isPopupMounted.current&&anchorRef?.current&&setPopupState({offset:anchorRef.current?(0,getOffset.A3)({placement:dynamicPlacement,spacing,anchor:getAnchor(),popup,isRTL,ignoreMaxOffsetY:!0}):void 0})}),[dynamicPlacement,spacing,getAnchor,isRTL]),positionPlacement=(0,src.hb)((({offset},{left,right,height})=>{if(!offset)return;const neededVerticalSpace=offset.y+height+8,shouldMoveToTop=dynamicPlacement.startsWith("bottom")&&neededVerticalSpace>=window.innerHeight,isOverFlowingLeft=Math.trunc(left)<(isRTL?0:leftOffset),isOverFlowingRight=isRTL&&Math.trunc(right)>offset.bodyRight-leftOffset;shouldMoveToTop?dynamicPlacement.endsWith("-start")?setDynamicPlacement(constants.W.TopStart):dynamicPlacement.endsWith("-end")?setDynamicPlacement(constants.W.TopEnd):setDynamicPlacement(constants.W.Top):isOverFlowingLeft?setDynamicOffset({x:(isRTL?0:leftOffset)-left}):isOverFlowingRight&&setDynamicOffset({x:offset.bodyRight-right-leftOffset})}),[dynamicPlacement,isRTL,leftOffset]),positionArrow=(0,src.hb)((()=>{const anchor=getAnchor(),anchorElBoundingBox=anchor.current?.getBoundingClientRect(),tooltipElBoundingBox=tooltipRef.current?.getBoundingClientRect();if(!tooltipElBoundingBox||!anchorElBoundingBox)return;positionPlacement(popupState,tooltipElBoundingBox);const delta=getBoundingBoxCenter(anchorElBoundingBox)-getBoundingBoxCenter(tooltipElBoundingBox);setArrowDelta(delta)}),[positionPlacement,popupState,getAnchor]),resetPlacement=(0,src.YQ)((()=>{setDynamicPlacement(placementRef.current)}),100),delay=(0,src.li)(null),onHover=(0,src.hb)((()=>{const handle=()=>{isMounted.current&&setShown(!0)};if(isDelayed){performance.now()-lastVisibleDelayedTooltip<500&&handle(),delay.current&&clearTimeout(delay.current),delay.current=setTimeout(handle,1e3)}else handle()}),[isDelayed]),onHoverOut=(0,src.hb)((()=>{setShown(!1),resetPlacement(),isDelayed&&delay.current&&(clearTimeout(delay.current),shown&&(lastVisibleDelayedTooltip=performance.now()))}),[resetPlacement,isDelayed,shown]);return(0,src.vJ)((()=>(isMounted.current=!0,()=>{isMounted.current=!1})),[]),(0,src.vJ)((()=>(isPopupMounted.current=!0,()=>{isPopupMounted.current=!1})),[]),(0,src.Nf)((()=>{if(isOpen)return isPopupMounted.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isPopupMounted.current=!1}}),[isOpen,positionPopup]),(0,src.Nf)((()=>{isPopupMounted.current&&positionArrow()}),[positionArrow]),(0,src.pO)({current:document.body},positionPopup,[positionPopup]),react.createElement(react.Fragment,null,react.createElement(Wrapper,_extends({onPointerEnter:onHover,onPointerLeave:onHoverOut,onFocus:e=>{setShown(!0),onFocus(e)},onBlur:e=>{setShown(!1),onBlur(e),resetPlacement()},ref:anchorRef},props),children),popupState?.offset&&isOpen?(0,src.d5)(react.createElement(constants.yK,{ref:popup,$offset:dynamicOffset?{...popupState.offset,x:(popupState.offset?.x||0)+(dynamicOffset?.x||0)}:popupState.offset,noOverFlow:!0,zIndex:popupZIndexOverride||2,transforms:(0,getTransforms.s0)(dynamicPlacement,isRTL)},react.createElement(TooltipContainer,{className,ref:tooltipRef,shown,zIndex:popupZIndexOverride||2,styleOverride},react.createElement(TooltipText,{size:types.$.XSmall},shortcut?`${title} (${(0,utils.KV)(shortcut)})`:title),hasTail&&react.createElement(react.Fragment,null,react.createElement(SvgForTail,null,react.createElement("clipPath",{id:"tooltip-tail",clipPathUnits:"objectBoundingBox"},react.createElement("path",{d:"M1,1 L0.868,1 C0.792,1,0.72,0.853,0.676,0.606 L0.585,0.098 C0.562,-0.033,0.513,-0.033,0.489,0.098 L0.399,0.606 C0.355,0.853,0.283,1,0.207,1 L0,1 L1,1"}))),react.createElement(Tail,{placement:dynamicPlacement,translateX:-(dynamicOffset?.x||0)||arrowDelta,isRTL})))),document.body):null)}},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/story-editor/src/components/helpCenter/toggle/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{l:()=>Toggle});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/i18n/src/sprintf.ts"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/icons/question_mark_outline.svg"),_toggleButton__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/story-editor/src/components/toggleButton/index.js"),_utils_noop__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/story-editor/src/utils/noop.ts");function Toggle({isOpen=!1,popupId="",onClick=_utils_noop__WEBPACK_IMPORTED_MODULE_2__.l,notificationCount=0}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_toggleButton__WEBPACK_IMPORTED_MODULE_1__.f,{"aria-owns":popupId,"aria-label":notificationCount>0?(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_3__.A)((0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__._n)("Help Center: %s unread notification","Help Center: %s unread notifications",notificationCount,"web-stories"),notificationCount):(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Help Center","web-stories"),onClick,isOpen,label:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Help","web-stories"),MainIcon:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.A,notificationCount})}},"./packages/story-editor/src/components/helpCenter/toggle/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Toggle:()=>Toggle,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/global/styles.ts"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/story-editor/src/components/helpCenter/toggle/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"Stories Editor/Components/Help Center",args:{notificationCount:6}},Bg=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Bg",componentId:"sc-2a3hti-0"})(["position:relative;top:0;left:0;height:100vh;background-color:",";padding:50px;"],(({theme})=>theme.colors.bg.primary)),Toggle={render:function Render(args){const[isOpen,setIsOpen]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(!1);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_3__.NP,{theme:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.w},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.P,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Bg,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.l,_extends({isOpen,onClick:()=>setIsOpen((v=>!v))},args))))}}},"./packages/story-editor/src/components/toggleButton/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{f:()=>ToggleButton});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_8__),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("./packages/design-system/src/components/disclosure/disclosure.tsx"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_tooltip__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/story-editor/src/components/tooltip/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const Button=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$).withConfig({displayName:"toggleButton__Button",componentId:"sc-1de7s10-0"})(["width:auto;display:flex;align-items:center;justify-content:space-between;border-width:1px;border-style:solid;padding:0 10px;white-space:nowrap;"," > :not(svg):last-child{margin-right:0;}.main-icon{height:","px;width:auto;margin:-8px;display:block;}"],(({isOpen,hasText,height=36,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["height:","px;min-width:","px;color:",";border-color:",";background-color:",";",""],height,height,theme.colors.fg.primary,isOpen?theme.colors.bg.secondary:theme.colors.border.defaultNormal,isOpen?theme.colors.bg.secondary:theme.colors.bg.primary,hasText&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.s({preset:{...theme.typography.presets.paragraph[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.$.Small]},theme})))),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.i.ICON_SIZE);Button.propTypes={hasText:prop_types__WEBPACK_IMPORTED_MODULE_8___default().bool,isOpen:prop_types__WEBPACK_IMPORTED_MODULE_8___default().bool,height:prop_types__WEBPACK_IMPORTED_MODULE_8___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_8___default().number,prop_types__WEBPACK_IMPORTED_MODULE_8___default().string])};const badgeText=_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.w.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.$.Small],CountBadge=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.E.Span).withConfig({displayName:"toggleButton__CountBadge",componentId:"sc-1de7s10-1"})(["",""],(({size=22,fontSize=badgeText.size,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["min-width:","px;width:auto;height:","px;padding:0 ","px;margin:0 8px;display:flex;align-items:center;justify-content:center;color:",";background-color:",";border-radius:9999px;font-size:","px;line-height:0;"],size,size,size/4,theme.colors.fg.primary,theme.colors.bg.quaternary,fontSize)));CountBadge.propTypes={size:prop_types__WEBPACK_IMPORTED_MODULE_8___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_8___default().number,prop_types__WEBPACK_IMPORTED_MODULE_8___default().string]),fontSize:prop_types__WEBPACK_IMPORTED_MODULE_8___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_8___default().number,prop_types__WEBPACK_IMPORTED_MODULE_8___default().string])};const ToggleButton=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((({copy,isOpen=!1,notificationCount=0,MainIcon,label,shortcut,popupZIndexOverride,hasMenuList=!1,...rest},ref)=>{const hasNotifications=notificationCount>0;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tooltip__WEBPACK_IMPORTED_MODULE_2__.A,{hasTail:!0,title:label,placement:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.W.Top,shortcut,popupZIndexOverride},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Button,_extends({ref,"aria-haspopup":!0,"aria-pressed":isOpen,"aria-expanded":isOpen,hasText:Boolean(copy),isOpen,isSquare:!hasNotifications,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__.VQ.Tertiary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__.Ak.Rectangle,size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__.Mp.Medium},rest),MainIcon&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(MainIcon,{className:"main-icon"}),copy,hasNotifications&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(CountBadge,null,notificationCount),hasMenuList&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_13__.A,{direction:"down",$isOpen:isOpen})))}));ToggleButton.displayName="ToggleButton"},"./packages/story-editor/src/components/tooltip/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>Tooltip});var react=__webpack_require__("./node_modules/react/index.js"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),tooltip=__webpack_require__("./packages/design-system/src/components/tooltip/tooltip.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function Tooltip({hasTail=!0,placement=constants.W.Bottom,...props}){return react.createElement(tooltip.A,_extends({placement,hasTail},props))}},"./packages/story-editor/src/utils/noop.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function noop(){}__webpack_require__.d(__webpack_exports__,{l:()=>noop})},"./node_modules/prop-types/factoryWithThrowingShims.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var ReactPropTypesSecret=__webpack_require__("./node_modules/prop-types/lib/ReactPropTypesSecret.js");function emptyFunction(){}function emptyFunctionWithReset(){}emptyFunctionWithReset.resetWarningCache=emptyFunction,module.exports=function(){function shim(props,propName,componentName,location,propFullName,secret){if(secret!==ReactPropTypesSecret){var err=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw err.name="Invariant Violation",err}}function getShim(){return shim}shim.isRequired=shim;var ReactPropTypes={array:shim,bigint:shim,bool:shim,func:shim,number:shim,object:shim,string:shim,symbol:shim,any:shim,arrayOf:getShim,element:shim,elementType:shim,instanceOf:getShim,node:shim,objectOf:getShim,oneOf:getShim,oneOfType:getShim,shape:getShim,exact:getShim,checkPropTypes:emptyFunctionWithReset,resetWarningCache:emptyFunction};return ReactPropTypes.PropTypes=ReactPropTypes,ReactPropTypes}},"./node_modules/prop-types/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/prop-types/factoryWithThrowingShims.js")()},"./node_modules/prop-types/lib/ReactPropTypesSecret.js":module=>{"use strict";module.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}}]);