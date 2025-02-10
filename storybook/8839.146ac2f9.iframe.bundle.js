"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[8839],{"./packages/design-system/src/icons/chevron_down_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgChevronDownSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10,d:"m20 15-4 3-4-3"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgChevronDownSmall)},"./packages/design-system/src/components/disclosure/disclosure.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_icons__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/icons/chevron_down_small.svg");const rotate={up:[180,0],down:[0,180],left:[-90,0],right:[90,0]},__WEBPACK_DEFAULT_EXPORT__=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_1__.A).withConfig({displayName:"disclosure__Disclosure",componentId:"sc-1xdydn4-0"})(["height:","px;width:auto;margin:0 -10px;color:",";transition:transform ",";transform:",";"],_theme__WEBPACK_IMPORTED_MODULE_2__.i.ICON_SIZE,(({disabled,theme})=>disabled?theme.colors.fg.disable:theme.colors.fg.secondary),(({duration=0})=>duration),(({direction="down",$isOpen=!1})=>{const[whenClosed,whenOpen]=rotate[direction];return`rotate(${$isOpen?whenOpen:whenClosed}deg);`}))},"./packages/design-system/src/components/dropDown/dropdown.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>dropdown});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),src=__webpack_require__("./packages/react/src/index.ts"),v4=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),menu_menu=__webpack_require__("./packages/design-system/src/components/menu/menu.tsx"),constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),popup=__webpack_require__("./packages/design-system/src/components/popup/popup.tsx"),useForwardedRef=__webpack_require__("./packages/design-system/src/utils/useForwardedRef.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const DropDownContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"dropDown__DropDownContainer",componentId:"sc-vmb8nl-0"})(["display:flex;flex-direction:column;width:100%;"]),Hint=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).attrs({size:types.$.Small}).withConfig({displayName:"dropDown__Hint",componentId:"sc-vmb8nl-1"})(["margin-top:12px;padding-left:2px;color:",";"],(({theme,hasError})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary));var select_select=__webpack_require__("./packages/design-system/src/components/dropDown/select/select.tsx"),utils=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.find.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.flat-map.js"),__webpack_require__("./packages/design-system/src/components/menu/utils.ts")),useLiveRegion=__webpack_require__("./packages/design-system/src/utils/useLiveRegion.ts");function _temp(optionSet){return optionSet.options}function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const dropdown=(0,src.Rf)((function DropDown(t0,forwardedRef){const $=(0,dist.c)(90);let ariaLabel,className,disabled,dropDownLabel,hasError,hint,isKeepMenuOpenOnSelection,onMenuItemClick,popupZIndex,rest,t1,t2,t3,t4,t5,t6,t7;$[0]!==t0?(({ariaLabel,disabled,dropDownLabel,hasError,hint,isKeepMenuOpenOnSelection,onMenuItemClick,options:t1,placement:t2,popupFillWidth:t3,popupZIndex,isInline:t4,selectedValue:t5,direction:t6,className,...rest}=t0),$[0]=t0,$[1]=ariaLabel,$[2]=className,$[3]=disabled,$[4]=dropDownLabel,$[5]=hasError,$[6]=hint,$[7]=isKeepMenuOpenOnSelection,$[8]=onMenuItemClick,$[9]=popupZIndex,$[10]=rest,$[11]=t1,$[12]=t2,$[13]=t3,$[14]=t4,$[15]=t5,$[16]=t6):(ariaLabel=$[1],className=$[2],disabled=$[3],dropDownLabel=$[4],hasError=$[5],hint=$[6],isKeepMenuOpenOnSelection=$[7],onMenuItemClick=$[8],popupZIndex=$[9],rest=$[10],t1=$[11],t2=$[12],t3=$[13],t4=$[14],t5=$[15],t6=$[16]),$[17]!==t1?(t7=void 0===t1?[]:t1,$[17]=t1,$[18]=t7):t7=$[18];const options=t7,placement=void 0===t2?constants.W.Bottom:t2,popupFillWidth=void 0===t3||t3,isInline=void 0!==t4&&t4,selectedValue=void 0===t5?"":t5,direction=void 0===t6?"down":t6,ref=(0,useForwardedRef.A)(forwardedRef),[dynamicPlacement,setDynamicPlacement]=(0,src.J0)(placement);let t8;$[19]!==options||$[20]!==selectedValue?(t8={options,selectedValue},$[19]=options,$[20]=selectedValue,$[21]=t8):t8=$[21];const{activeOption,setIsOpen,isOpen,groups}=function useDropDown(t0){const $=(0,dist.c)(20),{options:t1,selectedValue}=t0;let t2;$[0]!==t1?(t2=void 0===t1?[]:t1,$[0]=t1,$[1]=t2):t2=$[1];const options=t2,[isOpen,_setIsOpen]=(0,src.J0)(!1),speak=(0,useLiveRegion.A)("assertive");let t3;$[2]===Symbol.for("react.memo_cache_sentinel")?(t3={leading:!0,trailing:!1},$[2]=t3):t3=$[2];const setIsOpen=(0,src.YQ)(_setIsOpen,300,t3);let t4,t5;$[3]!==options?(t4=()=>(0,utils.f)(options),t5=[options],$[3]=options,$[4]=t4,$[5]=t5):(t4=$[4],t5=$[5]);const groups=(0,src.Kr)(t4,t5);let t6,t7;$[6]!==groups||$[7]!==selectedValue?(t6=()=>selectedValue&&0!==groups.length?groups.flatMap(_temp).find((option=>String(option.value).toLowerCase()===String(selectedValue).toLowerCase())):null,t7=[selectedValue,groups],$[6]=groups,$[7]=selectedValue,$[8]=t6,$[9]=t7):(t6=$[8],t7=$[9]);const activeOption=(0,src.Kr)(t6,t7);let t8,t9,t10;return $[10]!==isOpen||$[11]!==options.length||$[12]!==speak?(t8=()=>{if(isOpen){const message=options.length?(0,sprintf.A)((0,i18n._n)("%d result found, use left and right or up and down arrow keys to navigate.","%d results found, use left and right or up and down arrow keys to navigate.",options.length,"web-stories"),String(options.length)):(0,i18n.__)("No results found.","web-stories");speak(message)}},t9=[isOpen,options.length,speak],$[10]=isOpen,$[11]=options.length,$[12]=speak,$[13]=t8,$[14]=t9):(t8=$[13],t9=$[14]),(0,src.vJ)(t8,t9),$[15]!==activeOption||$[16]!==groups||$[17]!==isOpen||$[18]!==setIsOpen?(t10={activeOption,groups,isOpen,setIsOpen},$[15]=activeOption,$[16]=groups,$[17]=isOpen,$[18]=setIsOpen,$[19]=t10):t10=$[19],t10}(t8);let t9,t10;$[22]!==dynamicPlacement||$[23]!==setDynamicPlacement?(t9=popupRef=>{if(!popupRef.current)return;const{bottom,top}=popupRef.current.getBoundingClientRect();dynamicPlacement.startsWith("bottom")&&bottom>=window.innerHeight&&setDynamicPlacement(constants.W.Top),dynamicPlacement.startsWith("top")&&top<=0&&setDynamicPlacement(constants.W.Bottom)},$[22]=dynamicPlacement,$[23]=setDynamicPlacement,$[24]=t9):t9=$[24],$[25]!==dynamicPlacement?(t10=[dynamicPlacement],$[25]=dynamicPlacement,$[26]=t10):t10=$[26];const positionPlacement=(0,src.hb)(t9,t10);let t11,t12;$[27]!==setIsOpen?(t11=event=>{event.preventDefault(),setIsOpen(dropdown_temp)},t12=[setIsOpen],$[27]=setIsOpen,$[28]=t11,$[29]=t12):(t11=$[28],t12=$[29]);const handleSelectClick=(0,src.hb)(t11,t12);let t13,t14;$[30]!==placement||$[31]!==ref.current||$[32]!==setDynamicPlacement||$[33]!==setIsOpen?(t13=()=>{setIsOpen(!1),ref.current?.focus(),setDynamicPlacement(placement)},$[30]=placement,$[31]=ref.current,$[32]=setDynamicPlacement,$[33]=setIsOpen,$[34]=t13):t13=$[34],$[35]!==placement||$[36]!==ref||$[37]!==setIsOpen?(t14=[setIsOpen,ref,placement],$[35]=placement,$[36]=ref,$[37]=setIsOpen,$[38]=t14):t14=$[38];const handleDismissMenu=(0,src.hb)(t13,t14);let t15,t16;$[39]!==handleDismissMenu||$[40]!==isKeepMenuOpenOnSelection||$[41]!==onMenuItemClick?(t15=(event_0,menuItem)=>{onMenuItemClick?.(event_0,menuItem),isKeepMenuOpenOnSelection||handleDismissMenu()},t16=[handleDismissMenu,isKeepMenuOpenOnSelection,onMenuItemClick],$[39]=handleDismissMenu,$[40]=isKeepMenuOpenOnSelection,$[41]=onMenuItemClick,$[42]=t15,$[43]=t16):(t15=$[42],t16=$[43]);const handleMenuItemClick=(0,src.hb)(t15,t16);let t17;$[44]===Symbol.for("react.memo_cache_sentinel")?(t17=[],$[44]=t17):t17=$[44];const listId=(0,src.Kr)(_temp2,t17);let t18;$[45]===Symbol.for("react.memo_cache_sentinel")?(t18=[],$[45]=t18):t18=$[45];const selectButtonId=(0,src.Kr)(_temp3,t18),t19=activeOption?.value;let t20,t21;$[46]!==ariaLabel||$[47]!==dropDownLabel?(t20=(0,sprintf.A)((0,i18n.__)("%s Option List Selector","web-stories"),ariaLabel||dropDownLabel),$[46]=ariaLabel,$[47]=dropDownLabel,$[48]=t20):t20=$[48],$[49]!==groups||$[50]!==handleDismissMenu||$[51]!==handleMenuItemClick||$[52]!==isInline||$[53]!==listId||$[54]!==rest||$[55]!==selectButtonId||$[56]!==t19||$[57]!==t20?(t21=react.createElement(menu_menu.A,_extends({activeValue:t19,parentId:selectButtonId,listId,menuAriaLabel:t20,onDismissMenu:handleDismissMenu,handleMenuItemSelect:handleMenuItemClick,groups,isAbsolute:isInline},rest)),$[49]=groups,$[50]=handleDismissMenu,$[51]=handleMenuItemClick,$[52]=isInline,$[53]=listId,$[54]=rest,$[55]=selectButtonId,$[56]=t19,$[57]=t20,$[58]=t21):t21=$[58];const menu=t21,t22=activeOption?.label,t23=ariaLabel||dropDownLabel;let t24,t25,t26,t27;return $[59]!==direction||$[60]!==disabled||$[61]!==dropDownLabel||$[62]!==handleSelectClick||$[63]!==hasError||$[64]!==isOpen||$[65]!==listId||$[66]!==ref||$[67]!==rest||$[68]!==selectButtonId||$[69]!==t22||$[70]!==t23?(t24=react.createElement(select_select.A,_extends({activeItemLabel:t22,"aria-pressed":isOpen,"aria-disabled":disabled,"aria-expanded":isOpen,"aria-label":t23,"aria-owns":listId,disabled,dropDownLabel,hasError,id:selectButtonId,isOpen,onSelectClick:handleSelectClick,direction,ref},rest)),$[59]=direction,$[60]=disabled,$[61]=dropDownLabel,$[62]=handleSelectClick,$[63]=hasError,$[64]=isOpen,$[65]=listId,$[66]=ref,$[67]=rest,$[68]=selectButtonId,$[69]=t22,$[70]=t23,$[71]=t24):t24=$[71],$[72]!==disabled||$[73]!==dynamicPlacement||$[74]!==isInline||$[75]!==isOpen||$[76]!==menu||$[77]!==popupFillWidth||$[78]!==popupZIndex||$[79]!==positionPlacement||$[80]!==ref?(t25=!disabled&&isInline?isOpen&&menu:react.createElement(popup.A,{anchor:ref,isOpen,placement:dynamicPlacement,refCallback:positionPlacement,fillWidth:popupFillWidth,zIndex:popupZIndex,ignoreMaxOffsetY:!0},menu),$[72]=disabled,$[73]=dynamicPlacement,$[74]=isInline,$[75]=isOpen,$[76]=menu,$[77]=popupFillWidth,$[78]=popupZIndex,$[79]=positionPlacement,$[80]=ref,$[81]=t25):t25=$[81],$[82]!==hasError||$[83]!==hint?(t26=hint&&react.createElement(Hint,{hasError},hint),$[82]=hasError,$[83]=hint,$[84]=t26):t26=$[84],$[85]!==className||$[86]!==t24||$[87]!==t25||$[88]!==t26?(t27=react.createElement(DropDownContainer,{className},t24,t25,t26),$[85]=className,$[86]=t24,$[87]=t25,$[88]=t26,$[89]=t27):t27=$[89],t27}));function dropdown_temp(prevIsOpen){return!prevIsOpen}function _temp2(){return`list-${(0,v4.A)()}`}function _temp3(){return`select-button-${(0,v4.A)()}`}},"./packages/design-system/src/components/dropDown/select/select.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>select_select});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),src=__webpack_require__("./packages/react/src/index.ts"),disclosure=__webpack_require__("./packages/design-system/src/components/disclosure/disclosure.tsx"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),outline=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const SelectButton=styled_components_browser_esm.Ay.button.withConfig({displayName:"select__SelectButton",componentId:"sc-9ab8mb-0"})((({theme,hasError,$isOpen,selectButtonStylesOverride,autoHeight})=>(0,styled_components_browser_esm.AH)(["width:100%;height:",";display:flex;align-items:center;justify-content:space-between;border-radius:",";background-color:",";border:1px solid ",";padding:8px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;"," &:hover{border-color:",";}"," &:disabled{pointer-events:none;border-color:",";&:hover{border-color:",";}label,span,svg{color:",";}}",";"],autoHeight?"auto":"36px",theme.borders.radius.small,theme.colors.opacity.footprint,theme.colors.border[$isOpen?"defaultActive":"defaultNormal"],outline.Q,theme.colors.border[$isOpen?"defaultActive":"defaultHover"],hasError&&(0,styled_components_browser_esm.AH)([""," border-color:",";&:active,&:hover,&:focus{border-color:",";}"],outline.Q(theme.colors.interactiveBg.negativeNormal),theme.colors.interactiveBg.negativeNormal,theme.colors.interactiveBg.negativeHover),theme.colors.border.disable,theme.colors.border.disable,theme.colors.fg.disable,selectButtonStylesOverride))),Value=(0,styled_components_browser_esm.Ay)(typography_text.E.Span).attrs({size:types.$.Small}).withConfig({displayName:"select__Value",componentId:"sc-9ab8mb-1"})(["max-width:100%;padding-right:12px;color:",";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",";"],(({theme})=>theme.colors.fg.primary),(({selectValueStylesOverride})=>selectValueStylesOverride)),LabelText=(0,styled_components_browser_esm.Ay)(typography_text.E.Span).attrs({size:types.$.Small}).withConfig({displayName:"select__LabelText",componentId:"sc-9ab8mb-2"})(["color:",";padding-right:8px;white-space:nowrap;overflow:hidden;text-overflow:clip;"],(({theme})=>theme.colors.fg.secondary)),Label=styled_components_browser_esm.Ay.span.withConfig({displayName:"select__Label",componentId:"sc-9ab8mb-3"})(["display:flex;align-items:center;color:",";cursor:pointer;"],(({theme})=>theme.colors.fg.secondary));function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const select_select=(0,src.Rf)(((t0,ref)=>{const $=(0,dist.c)(34);let activeItemLabel,activeItemRenderer,disabled,dropDownLabel,hasError,isOpen,onSelectClick,rest,t1,t2;$[0]!==t0?(({activeItemLabel,activeItemRenderer,disabled,dropDownLabel,hasError,isOpen,onSelectClick,placeholder:t1,direction:t2,...rest}=t0),$[0]=t0,$[1]=activeItemLabel,$[2]=activeItemRenderer,$[3]=disabled,$[4]=dropDownLabel,$[5]=hasError,$[6]=isOpen,$[7]=onSelectClick,$[8]=rest,$[9]=t1,$[10]=t2):(activeItemLabel=$[1],activeItemRenderer=$[2],disabled=$[3],dropDownLabel=$[4],hasError=$[5],isOpen=$[6],onSelectClick=$[7],rest=$[8],t1=$[9],t2=$[10]);const placeholder=void 0===t1?"":t1,direction=void 0===t2?"down":t2,ValueRenderer=activeItemRenderer,t3=Boolean(activeItemRenderer);let t4,t5,t6,t7,t8;return $[11]!==ValueRenderer||$[12]!==activeItemLabel||$[13]!==placeholder||$[14]!==rest?(t4=ValueRenderer?react.createElement(ValueRenderer,null):react.createElement(Value,{selectValueStylesOverride:rest.selectValueStylesOverride},activeItemLabel||placeholder),$[11]=ValueRenderer,$[12]=activeItemLabel,$[13]=placeholder,$[14]=rest,$[15]=t4):t4=$[15],$[16]!==dropDownLabel?(t5=dropDownLabel&&react.createElement(LabelText,null,dropDownLabel),$[16]=dropDownLabel,$[17]=t5):t5=$[17],$[18]!==direction||$[19]!==isOpen?(t6=react.createElement(disclosure.A,{direction,$isOpen:isOpen}),$[18]=direction,$[19]=isOpen,$[20]=t6):t6=$[20],$[21]!==t5||$[22]!==t6?(t7=react.createElement(Label,null,t5,t6),$[21]=t5,$[22]=t6,$[23]=t7):t7=$[23],$[24]!==disabled||$[25]!==hasError||$[26]!==isOpen||$[27]!==onSelectClick||$[28]!==ref||$[29]!==rest||$[30]!==t3||$[31]!==t4||$[32]!==t7?(t8=react.createElement(SelectButton,_extends({"aria-haspopup":!0,$isOpen:isOpen,disabled,hasError,onClick:onSelectClick,ref,autoHeight:t3},rest),t4,t7),$[24]=disabled,$[25]=hasError,$[26]=isOpen,$[27]=onSelectClick,$[28]=ref,$[29]=rest,$[30]=t3,$[31]=t4,$[32]=t7,$[33]=t8):t8=$[33],t8}))},"./packages/design-system/src/components/popup/popup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_utils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/utils/noop.ts"),_contexts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts");const DEFAULT_TOP_OFFSET=0,DEFAULT_LEFT_OFFSET=0;const __WEBPACK_DEFAULT_EXPORT__=function Popup({anchor,dock,children,renderContents,placement=_constants__WEBPACK_IMPORTED_MODULE_2__.W.Bottom,spacing,isOpen,fillWidth=!1,refCallback=_utils__WEBPACK_IMPORTED_MODULE_3__.l,zIndex=2,ignoreMaxOffsetY,offsetOverride=!1,maxWidth}){const{topOffset=DEFAULT_TOP_OFFSET,leftOffset=DEFAULT_LEFT_OFFSET,isRTL=!1}=(0,_contexts__WEBPACK_IMPORTED_MODULE_4__.A)(),[popupState,setPopupState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null),isMountedRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(!1),popup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(null),positionPopup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((evt=>{if(!isMountedRef.current||!anchor?.current)return;if(evt instanceof Event&&evt.target instanceof Element&&popup.current?.contains(evt.target))return;const offset=anchor.current?(0,_utils__WEBPACK_IMPORTED_MODULE_5__.A3)({placement,spacing,anchor,dock,popup,isRTL,topOffset,ignoreMaxOffsetY,offsetOverride}):_utils__WEBPACK_IMPORTED_MODULE_5__.Oe,popupRect=popup.current?.getBoundingClientRect();setPopupState({offset:(()=>{if(!popupRect)return null;if(popupRect.x<=leftOffset)switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopEnd:return{...offset,x:isRTL?offset.x:popupRect.width+leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Left:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftStart:return{...offset,x:isRTL?offset.x:popupRect.width+-popupRect.x-leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Right:return{...offset,x:popupRect.width};default:return{...offset,x:popupRect.width/2+(isRTL?0:leftOffset)}}return isRTL&&popupRect.right>=offset.bodyRight-leftOffset?{...offset,x:offset.bodyRight-popupRect.width-leftOffset}:null})()||offset,height:popupRect?.height||null})}),[anchor,placement,spacing,dock,isRTL,topOffset,leftOffset,ignoreMaxOffsetY,offsetOverride]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>(isMountedRef.current=!0,()=>{isMountedRef.current=!1})),[]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>{popupState?.height&&popupState.height!==popup.current?.getBoundingClientRect()?.height&&positionPopup()}),[popupState?.height,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{if(isOpen)return isMountedRef.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isMountedRef.current=!1}}),[isOpen,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{isMountedRef.current&&refCallback(popup)}),[popupState,refCallback]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.pO)({current:document.body},positionPopup,[positionPopup]),popupState&&isOpen?(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.d5)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_constants__WEBPACK_IMPORTED_MODULE_2__.yK,{ref:popup,fillWidth:Boolean(fillWidth),maxWidth,$offset:popupState.offset,topOffset,zIndex,transforms:(0,_utils__WEBPACK_IMPORTED_MODULE_6__.s0)(placement,isRTL)},renderContents?renderContents({propagateDimensionChange:positionPopup}):children),document.body):null}},"./packages/design-system/src/utils/useLiveRegion.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts");const __WEBPACK_DEFAULT_EXPORT__=function useLiveRegion(politeness="polite"){const elementRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.li)(null),ensureContainerExists=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.hb)((()=>{if(elementRef.current)return()=>{elementRef.current&&(document.body.removeChild(elementRef.current),elementRef.current=null)};const containerId="web-stories-aria-live-region-"+politeness,existingContainer=document.getElementById(containerId);if(existingContainer)return elementRef.current=existingContainer,()=>{elementRef.current=null};const container=document.createElement("div");return container.id=containerId,container.className="web-stories-aria-live-region",container.setAttribute("style","position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"),container.setAttribute("aria-live",politeness),container.setAttribute("aria-relevant","additions text"),container.setAttribute("aria-atomic","true"),document.body.appendChild(container),elementRef.current=container,()=>{document.body.removeChild(container),elementRef.current=null}}),[politeness]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.vJ)(ensureContainerExists,[ensureContainerExists]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.hb)((message=>{if(!elementRef.current)return;ensureContainerExists();const regions=document.querySelectorAll(".web-stories-aria-live-region");for(const region of regions)region.textContent="";elementRef.current.textContent=message}),[ensureContainerExists])}}}]);