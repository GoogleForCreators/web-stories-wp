"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[1889],{"./packages/dashboard/src/components/tooltip/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{m:()=>Tooltip});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),tooltip=__webpack_require__("./packages/design-system/src/components/tooltip/tooltip.tsx"),config=__webpack_require__("./packages/dashboard/src/app/config/index.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function Tooltip(t0){const $=(0,dist.c)(6);let props,t1;$[0]!==t0?(({placement:t1,...props}=t0),$[0]=t0,$[1]=props,$[2]=t1):(props=$[1],t1=$[2]);const placement=void 0===t1?constants.W.Bottom:t1,{isRTL}=(0,config.U)(),derivedPlacement=isRTL?constants.Tb[placement]:placement;let t2;return $[3]!==derivedPlacement||$[4]!==props?(t2=react.createElement(tooltip.A,_extends({placement:derivedPlacement},props)),$[3]=derivedPlacement,$[4]=props,$[5]=t2):t2=$[5],t2}Tooltip.propTypes={children:prop_types_default().node.isRequired,hasTail:prop_types_default().bool,placement:prop_types_default().oneOf(Object.values(constants.W)),onBlur:prop_types_default().func,onFocus:prop_types_default().func,shortcut:prop_types_default().string,title:prop_types_default().oneOfType([prop_types_default().node,prop_types_default().string]),forceAnchorRef:prop_types_default().object,styleOverride:prop_types_default().object,className:prop_types_default().string,isDelayed:prop_types_default().bool,popupZIndexOverride:prop_types_default().number}},"./packages/dashboard/src/components/viewStyleBar/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>ViewStyleBar});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/icons/table.svg"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/icons/box4.svg"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),_tooltip__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/components/tooltip/index.js");const Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"viewStyleBar__Container",componentId:"sc-17r9rf0-0"})(["display:flex;justify-content:flex-end;align-items:center;"]),ToggleButton=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.button.withConfig({displayName:"viewStyleBar__ToggleButton",componentId:"sc-17r9rf0-1"})(["border:none;border-radius:",";"," padding:0;background:transparent;cursor:pointer;&:hover svg{color:",";}&:active svg{color:",";}"],(({theme})=>theme.borders.radius.small),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.Q,(({theme})=>theme.colors.interactiveFg.hover),(({theme})=>theme.colors.interactiveFg.active));function ViewStyleBar(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(12),{onPress,layoutStyle}=t0,t1=_constants__WEBPACK_IMPORTED_MODULE_2__.us[layoutStyle],t2=_constants__WEBPACK_IMPORTED_MODULE_2__.us[layoutStyle];let t3,t4,t5,t6;return $[0]!==layoutStyle?(t3=layoutStyle===_constants__WEBPACK_IMPORTED_MODULE_2__._D.GRID&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.A,{height:"32px",width:"32px","data-testid":"list-icon"}),$[0]=layoutStyle,$[1]=t3):t3=$[1],$[2]!==layoutStyle?(t4=layoutStyle===_constants__WEBPACK_IMPORTED_MODULE_2__._D.LIST&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.A,{height:"32px",width:"32px","data-testid":"grid-icon"}),$[2]=layoutStyle,$[3]=t4):t4=$[3],$[4]!==onPress||$[5]!==t2||$[6]!==t3||$[7]!==t4?(t5=react__WEBPACK_IMPORTED_MODULE_0__.createElement(ToggleButton,{"aria-label":t2,onClick:onPress},t3,t4),$[4]=onPress,$[5]=t2,$[6]=t3,$[7]=t4,$[8]=t5):t5=$[8],$[9]!==t1||$[10]!==t5?(t6=react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tooltip__WEBPACK_IMPORTED_MODULE_3__.m,{title:t1,placement:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.W.BottomEnd,hasTail:!0},t5)),$[9]=t1,$[10]=t5,$[11]=t6):t6=$[11],t6}ViewStyleBar.propTypes={onPress:prop_types__WEBPACK_IMPORTED_MODULE_9___default().func,layoutStyle:prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOf([_constants__WEBPACK_IMPORTED_MODULE_2__._D.GRID,_constants__WEBPACK_IMPORTED_MODULE_2__._D.LIST]).isRequired}},"./packages/design-system/src/components/tooltip/tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>tooltip});var react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),src=__webpack_require__("./packages/react/src/index.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts"),usePopup=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),getOffset=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),getTransforms=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts");const SvgForTail=styled_components_browser_esm.Ay.svg.withConfig({displayName:"tail__SvgForTail",componentId:"sc-bxihlv-0"})(["position:absolute;width:0;height:0;"]),Tail=styled_components_browser_esm.Ay.span.withConfig({displayName:"tail__Tail",componentId:"sc-bxihlv-1"})(["@supports (clip-path:url('#","')){position:absolute;display:block;height:","px;width:","px;",";background-color:inherit;border:none;border-bottom:none;clip-path:url('#","');}"],"tooltip-tail",8,34,(({placement,translateX,isRTL})=>(({placement,translateX,isRTL})=>{switch(placement){case constants.W.Top:case constants.W.TopStart:case constants.W.TopEnd:return(0,styled_components_browser_esm.AH)(["bottom:-","px;/*! @noflip */ transform:translateX(","px) rotate(180deg);"],7,translateX);case constants.W.Bottom:case constants.W.BottomStart:case constants.W.BottomEnd:return(0,styled_components_browser_esm.AH)(["top:-","px;/*! @noflip */ transform:translateX(","px);"],7,translateX);case constants.W.Left:case constants.W.LeftStart:case constants.W.LeftEnd:return(0,styled_components_browser_esm.AH)(["right:-","px;transform:rotate(",");"],20,isRTL?"-90deg":"90deg");case constants.W.Right:case constants.W.RightStart:case constants.W.RightEnd:return(0,styled_components_browser_esm.AH)(["left:-","px;transform:rotate(",");"],20,isRTL?"90deg":"-90deg");default:return""}})({placement,translateX,isRTL})),"tooltip-tail");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const DEFAULT_LEFT_OFFSET=0,Wrapper=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__Wrapper",componentId:"sc-128lmkf-0"})(["position:relative;"]),TooltipContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"tooltip__TooltipContainer",componentId:"sc-128lmkf-1"})(["margin:0;display:flex;justify-content:center;align-items:center;text-align:center;flex-direction:row;max-width:14em;transition:0.4s opacity;opacity:",";pointer-events:",";z-index:",";border-radius:4px;background-color:",";filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25));",""],(({shown})=>shown?1:0),(({shown})=>shown?"all":"none"),(({zIndex})=>zIndex),(({theme})=>theme.colors.inverted.bg.primary),(({styleOverride})=>styleOverride)),TooltipText=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).withConfig({displayName:"tooltip__TooltipText",componentId:"sc-128lmkf-2"})(["color:",";padding:10px;"],(({theme})=>theme.colors.inverted.fg.primary)),getBoundingBoxCenter=({x,width})=>x+width/2;let lastVisibleDelayedTooltip=0;const tooltip=function Tooltip({title,shortcut="",hasTail=!1,placement=constants.W.Bottom,children,onFocus=noop.l,onBlur=noop.l,isDelayed=!1,forceAnchorRef,className,popupZIndexOverride,styleOverride,...props}){const{leftOffset=DEFAULT_LEFT_OFFSET,isRTL}=(0,usePopup.A)(),[shown,setShown]=(0,src.J0)(!1),[arrowDelta,setArrowDelta]=(0,src.J0)(0),anchorRef=(0,src.li)(null),tooltipRef=(0,src.li)(null),placementRef=(0,src.li)(placement),[dynamicPlacement,setDynamicPlacement]=(0,src.J0)(placement),isMountedRef=(0,src.li)(!1),[popupState,setPopupState]=(0,src.J0)({}),isPopupMountedRef=(0,src.li)(!1),popupRef=(0,src.li)(null),isOpen=Boolean(shown&&(shortcut||title)),[dynamicOffset,setDynamicOffset]=(0,src.J0)({}),spacing=(0,src.Kr)((()=>({x:placement.startsWith("left")||placement.startsWith("right")?8:0,y:placement.startsWith("top")||placement.startsWith("bottom")?8:0})),[placement]),getAnchor=(0,src.hb)((()=>forceAnchorRef||anchorRef),[forceAnchorRef]),positionPopup=(0,src.hb)((()=>{isPopupMountedRef.current&&anchorRef?.current&&setPopupState({offset:anchorRef.current?(0,getOffset.A3)({placement:dynamicPlacement,spacing,anchor:getAnchor(),popup:popupRef,isRTL,ignoreMaxOffsetY:!0}):void 0})}),[dynamicPlacement,spacing,getAnchor,isRTL]),positionPlacement=(0,src.hb)((({offset},{left,right,height})=>{if(!offset)return;const neededVerticalSpace=offset.y+height+8,shouldMoveToTop=dynamicPlacement.startsWith("bottom")&&neededVerticalSpace>=window.innerHeight,isOverFlowingLeft=Math.trunc(left)<(isRTL?0:leftOffset),isOverFlowingRight=isRTL&&Math.trunc(right)>offset.bodyRight-leftOffset;shouldMoveToTop?dynamicPlacement.endsWith("-start")?setDynamicPlacement(constants.W.TopStart):dynamicPlacement.endsWith("-end")?setDynamicPlacement(constants.W.TopEnd):setDynamicPlacement(constants.W.Top):isOverFlowingLeft?setDynamicOffset({x:(isRTL?0:leftOffset)-left}):isOverFlowingRight&&setDynamicOffset({x:offset.bodyRight-right-leftOffset})}),[dynamicPlacement,isRTL,leftOffset]),positionArrow=(0,src.hb)((()=>{const anchor=getAnchor(),anchorElBoundingBox=anchor.current?.getBoundingClientRect(),tooltipElBoundingBox=tooltipRef.current?.getBoundingClientRect();if(!tooltipElBoundingBox||!anchorElBoundingBox)return;positionPlacement(popupState,tooltipElBoundingBox);const delta=getBoundingBoxCenter(anchorElBoundingBox)-getBoundingBoxCenter(tooltipElBoundingBox);setArrowDelta(delta)}),[positionPlacement,popupState,getAnchor]),resetPlacement=(0,src.YQ)((()=>{setDynamicPlacement(placementRef.current)}),100),delayRef=(0,src.li)(null),onHover=(0,src.hb)((()=>{const handle=()=>{isMountedRef.current&&setShown(!0)};if(isDelayed){performance.now()-lastVisibleDelayedTooltip<500&&handle(),delayRef.current&&clearTimeout(delayRef.current),delayRef.current=setTimeout(handle,1e3)}else handle()}),[isDelayed]),onHoverOut=(0,src.hb)((()=>{setShown(!1),resetPlacement(),isDelayed&&delayRef.current&&(clearTimeout(delayRef.current),shown&&(lastVisibleDelayedTooltip=performance.now()))}),[resetPlacement,isDelayed,shown]);return(0,src.vJ)((()=>(isMountedRef.current=!0,()=>{isMountedRef.current=!1})),[]),(0,src.vJ)((()=>(isPopupMountedRef.current=!0,()=>{isPopupMountedRef.current=!1})),[]),(0,src.Nf)((()=>{if(isOpen)return isPopupMountedRef.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isPopupMountedRef.current=!1}}),[isOpen,positionPopup]),(0,src.Nf)((()=>{isPopupMountedRef.current&&positionArrow()}),[positionArrow]),(0,src.pO)({current:document.body},positionPopup,[positionPopup]),react.createElement(react.Fragment,null,react.createElement(Wrapper,_extends({onPointerEnter:onHover,onPointerLeave:onHoverOut,onFocus:e=>{setShown(!0),onFocus(e)},onBlur:e_0=>{setShown(!1),onBlur(e_0),resetPlacement()},ref:anchorRef},props),children),popupState?.offset&&isOpen?(0,src.d5)(react.createElement(constants.yK,{ref:popupRef,$offset:dynamicOffset?{...popupState.offset,x:(popupState.offset?.x||0)+(dynamicOffset?.x||0)}:popupState.offset,noOverFlow:!0,zIndex:popupZIndexOverride||2,transforms:(0,getTransforms.s0)(dynamicPlacement,isRTL)},react.createElement(TooltipContainer,{className,ref:tooltipRef,shown,zIndex:popupZIndexOverride||2,styleOverride},react.createElement(TooltipText,{size:types.$.XSmall},shortcut?`${title} (${(0,utils.KV)(shortcut)})`:title),hasTail&&react.createElement(react.Fragment,null,react.createElement(SvgForTail,null,react.createElement("clipPath",{id:"tooltip-tail",clipPathUnits:"objectBoundingBox"},react.createElement("path",{d:"M1,1 L0.868,1 C0.792,1,0.72,0.853,0.676,0.606 L0.585,0.098 C0.562,-0.033,0.513,-0.033,0.489,0.098 L0.399,0.606 C0.355,0.853,0.283,1,0.207,1 L0,1 L1,1"}))),react.createElement(Tail,{placement:dynamicPlacement,translateX:-(dynamicOffset?.x||0)||arrowDelta,isRTL})))),document.body):null)}},"./packages/design-system/src/icons/box4.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgBox4=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.5 8A1.5 1.5 0 0 0 8 9.5v4A1.5 1.5 0 0 0 9.5 15h4a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 13.5 8zM9 9.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5zM18.5 8A1.5 1.5 0 0 0 17 9.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 22.5 8zM18 9.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5zM9.5 17A1.5 1.5 0 0 0 8 18.5v4A1.5 1.5 0 0 0 9.5 24h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5zM9 18.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5zm9.5-1.5a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5zm-.5 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgBox4)},"./packages/design-system/src/icons/table.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgTable=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.5 9A1.5 1.5 0 0 0 8 10.5v11A1.5 1.5 0 0 0 9.5 23h13a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 22.5 9h-13m3 1h-3a.5.5 0 0 0-.5.5V13h3.5zM9 14v4h3.5v-4zm0 5v2.5a.5.5 0 0 0 .5.5h3v-3zm4.5 3h9a.5.5 0 0 0 .5-.5V19h-9.5zm9.5-4v-4h-9.5v4zm0-5v-2.5a.5.5 0 0 0-.5-.5h-9v3z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgTable)}}]);