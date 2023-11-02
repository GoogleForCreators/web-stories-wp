"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6734],{"./packages/design-system/src/icons/chevron_down_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgChevronDownSmall=_ref=>{let{title,titleId,...props}=_ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10,d:"m20 15-4 3-4-3"})))},__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgChevronDownSmall)},"./packages/design-system/src/icons/magnifier.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgMagnifier=_ref=>{let{title,titleId,...props}=_ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9 14.636a5.636 5.636 0 1 1 11.272 0 5.636 5.636 0 0 1-11.272 0Zm9.961 5.033a6.636 6.636 0 1 1 .707-.707l4.184 4.184a.5.5 0 1 1-.707.707l-4.184-4.184Z",clipRule:"evenodd"})))},__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgMagnifier)},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{z9:()=>Shortcut,Xl:()=>useEscapeToBlurEffect,yg:()=>useGlobalIsKeyPressed,xb:()=>useGlobalKeyDownEffect,Ew:()=>useKeyDownEffect,LP:()=>useKeyEffect});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.kr)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.qp)(context),batchingCallback=(0,src.iS)(callback,deps||[]);(0,src.d4)((()=>{const nodeEl=(0,utils.Lc)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.zO)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.x0)(nodeEl),handler=(0,utils.qs)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.eJ)(!1),handleBlur=(0,src.I4)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.d4)((()=>(window.addEventListener("blur",handleBlur),function(){window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.Lc)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut(_ref){let{component:Component,shortcut=""}=_ref;const chars=shortcut.split(" ");return(0,jsx_runtime.jsx)(Component,{"aria-label":(0,utils.k$)(shortcut),children:chars.map(((char,index)=>(0,jsx_runtime.jsx)(Component,{children:(0,utils.U2)(char)},`${index}-${char}`)))})}Shortcut.displayName="Shortcut"},"./packages/design-system/src/components/popup/popup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_utils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/utils/noop.ts"),_contexts__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),_utils__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts"),_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DEFAULT_TOP_OFFSET=0,DEFAULT_POPUP_Z_INDEX=2,DEFAULT_LEFT_OFFSET=0;const __WEBPACK_DEFAULT_EXPORT__=function Popup(_ref){let{anchor,dock,children,renderContents,placement=_constants__WEBPACK_IMPORTED_MODULE_3__.ug.Bottom,spacing,isOpen,fillWidth=!1,refCallback=_utils__WEBPACK_IMPORTED_MODULE_4__.Z,zIndex=DEFAULT_POPUP_Z_INDEX,ignoreMaxOffsetY,offsetOverride=!1,maxWidth}=_ref;const{topOffset=DEFAULT_TOP_OFFSET,leftOffset=DEFAULT_LEFT_OFFSET,isRTL=!1}=(0,_contexts__WEBPACK_IMPORTED_MODULE_5__.Z)(),[popupState,setPopupState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(null),isMounted=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.sO)(!1),popup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.sO)(null),positionPopup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.I4)((evt=>{if(!isMounted.current||!anchor?.current)return;if(evt instanceof Event&&evt.target instanceof Element&&popup.current?.contains(evt.target))return;const offset=anchor.current?(0,_utils__WEBPACK_IMPORTED_MODULE_6__.os)({placement,spacing,anchor,dock,popup,isRTL,topOffset,ignoreMaxOffsetY,offsetOverride}):_utils__WEBPACK_IMPORTED_MODULE_6__.tp,popupRect=popup.current?.getBoundingClientRect();setPopupState({offset:(()=>{if(!popupRect)return null;if(popupRect.x<=leftOffset)switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.TopEnd:return{...offset,x:isRTL?offset.x:popupRect.width+leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.Left:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.LeftStart:return{...offset,x:isRTL?offset.x:popupRect.width+-popupRect.x-leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.RightEnd:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.RightStart:case _constants__WEBPACK_IMPORTED_MODULE_3__.ug.Right:return{...offset,x:popupRect.width};default:return{...offset,x:popupRect.width/2+(isRTL?0:leftOffset)}}return isRTL&&popupRect.right>=offset.bodyRight-leftOffset?{...offset,x:offset.bodyRight-popupRect.width-leftOffset}:null})()||offset,height:popupRect?.height||null})}),[anchor,placement,spacing,dock,isRTL,topOffset,leftOffset,ignoreMaxOffsetY,offsetOverride]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.d4)((()=>(isMounted.current=!0,()=>{isMounted.current=!1})),[]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.d4)((()=>{popupState?.height&&popupState.height!==popup.current?.getBoundingClientRect()?.height&&positionPopup()}),[popupState?.height,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.bt)((()=>{if(isOpen)return isMounted.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isMounted.current=!1}}),[isOpen,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.bt)((()=>{isMounted.current&&refCallback(popup)}),[popupState,refCallback]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Bz)({current:document.body},positionPopup,[positionPopup]),popupState&&isOpen?(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.jz)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_constants__WEBPACK_IMPORTED_MODULE_3__.kZ,{ref:popup,fillWidth:Boolean(fillWidth),maxWidth,$offset:popupState.offset,topOffset,zIndex,transforms:(0,_utils__WEBPACK_IMPORTED_MODULE_7__.fg)(placement,isRTL),children:renderContents?renderContents({propagateDimensionChange:positionPopup}):children}),document.body):null}},"./packages/design-system/src/components/search/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LightTheme:()=>LightTheme,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_storybookUtils__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),_popup__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_search__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/search/search.tsx"),_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/storybookUtils/sampleData.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Search",args:{ariaClearLabel:"clear search",ariaInputLabel:"search for an image",disabled:!1,emptyText:"No options available",hasError:!1,hint:"default hint text",label:"Find an image",isRTL:!1,placeholder:"search",placement:_popup__WEBPACK_IMPORTED_MODULE_5__.ug.Bottom,popupZIndex:1},argTypes:{placement:{options:Object.values(_popup__WEBPACK_IMPORTED_MODULE_5__.ug),control:"select"},onChange:{action:"handleSearchValueChange"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_6__.ZP.div.withConfig({displayName:"stories__Container",componentId:"sc-l8gcrm-0"})(["width:400px;height:100vh;padding:12px 24px;background-color:",";"],(_ref=>{let{theme}=_ref;return theme.colors.bg.primary})),_default={render:function Render(_ref2){let{onChange,...args}=_ref2;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.eJ)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_7__.g0[2]),[inputValue,setInputValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.eJ)(""),options=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.Ye)((()=>inputValue&&0!==inputValue.length?_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_7__.g0.filter((_ref3=>{let{label,value}=_ref3;return label.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())||value.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())})):_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_7__.g0),[inputValue]),handleSearchValueChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.I4)((value=>{onChange(value),setInputValue(value)}),[onChange]),handleOnClear=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.I4)((()=>{setInputValue(""),setSelectedValue(null)}),[]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybookUtils__WEBPACK_IMPORTED_MODULE_8__.D,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_search__WEBPACK_IMPORTED_MODULE_9__.Z,{handleSearchValueChange,onClear:handleOnClear,options,selectedValue,...args})})})}},LightTheme={render:function Render(_ref4){let{onChange,...args}=_ref4;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.eJ)(),[inputValue,setInputValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.eJ)(""),options=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.Ye)((()=>inputValue&&0!==inputValue.length?_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_7__.g0.filter((_ref5=>{let{label,value}=_ref5;return label.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())||value.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())})):[]),[inputValue]),handleSearchValueChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.I4)((value=>{onChange(value),setInputValue(value)}),[onChange]),handleOnClear=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.I4)((()=>{setInputValue(""),setSelectedValue(null)}),[]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_search__WEBPACK_IMPORTED_MODULE_9__.Z,{handleSearchValueChange,onClear:handleOnClear,options,selectedValue,...args})})}}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DarkThemeProvider});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DarkThemeProvider=_ref=>{let{children}=_ref;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(styled_components__WEBPACK_IMPORTED_MODULE_2__.f6,{theme:_theme__WEBPACK_IMPORTED_MODULE_3__.r,children})};DarkThemeProvider.displayName="DarkThemeProvider"},"./packages/design-system/src/storybookUtils/sampleData.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Mf:()=>nestedDropDownOptions,g0:()=>basicDropDownOptions,kk:()=>shortDropDownOptions,r1:()=>reallyLongOptions,uB:()=>effectChooserOptions});const shortDropDownOptions=[{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"}],basicDropDownOptions=[{label:"label item one",value:"label-item-one"},{label:"label item two",value:"label-item-two"},{label:"label item three",value:"label-item-three"},{label:"label item four (disabled)",value:"label-item-four",disabled:!0},{label:"label item five (value is a number)",value:5},{label:"label item six (value is a boolean)",value:!0},{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"},{label:"parakeets",value:"parakeets"},{label:"lemurs",value:"lemurs"},{label:"ocelots",value:"ocelots"}],reallyLongOptions=[{label:"mad mad mad mad world",value:"tears for fears"},{label:"bring on the dancing horses",value:"echo"},{label:"one 2 three four, uno dos tres rumba",value:"pitbull"}],effectChooserOptions=[{value:"none",label:"none",width:"full"},{value:"drop in",label:"drop",width:"full"},{value:"fly in left-to-right",label:"fly in",width:"half"},{value:"fly in top-to-bottom",label:"fly in",width:"half"},{value:"fly in right-to-left",label:"fly in",width:"half"},{value:"fly in bottom-to-top",label:"fly in",width:"half"},{value:"pulse",label:"pulse",width:"full"},{value:"rotate in left-to-right",label:"rotate in",width:"half"},{value:"rotate in right-to-left",label:"rotate in",width:"half"},{value:"twirl",label:"twirl",width:"full"}],nestedDropDownOptions=[{label:"aliens",options:[{value:"alien-1",label:"ET"},{value:"alien-2",label:"Stitch"},{value:"alien-3",label:"Groot"},{value:"alien-4",label:"The Worm Guys"},{value:"alien-5",label:"Na'vi"},{value:"alien-6",label:"Arachnids"},{value:"alien-7",label:"The Predator"},{value:"alien-8",label:"Xenomorph"}]},{label:"dragons",options:[{value:"dragon-1",label:"Smaug"},{value:"dragon-2",label:"Mushu"},{value:"dragon-3",label:"Toothless"},{value:"dragon-4",label:"Falkor"},{value:"dragon-5",label:"Drogon"},{value:"dragon-6",label:"Kalessin"}]},{label:"dogs",options:[{value:"dog-1",label:"Snoopy"},{value:"dog-2",label:"Scooby"}]}]},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>focusableOutlineCSS,R:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["outline:none;box-shadow:",";"],(_ref=>{let{theme}=_ref;return`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`})),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/design-system/src/utils/useLiveRegion.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts");const __WEBPACK_DEFAULT_EXPORT__=function useLiveRegion(){let politeness=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"polite";const elementRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.sO)(null),ensureContainerExists=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.I4)((()=>{if(elementRef.current)return()=>{elementRef.current&&(document.body.removeChild(elementRef.current),elementRef.current=null)};const containerId="web-stories-aria-live-region-"+politeness,existingContainer=document.getElementById(containerId);if(existingContainer)return elementRef.current=existingContainer,()=>{elementRef.current=null};const container=document.createElement("div");return container.id=containerId,container.className="web-stories-aria-live-region",container.setAttribute("style","position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"),container.setAttribute("aria-live",politeness),container.setAttribute("aria-relevant","additions text"),container.setAttribute("aria-atomic","true"),document.body.appendChild(container),elementRef.current=container,()=>{document.body.removeChild(container),elementRef.current=null}}),[politeness]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.d4)(ensureContainerExists,[ensureContainerExists]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.I4)((message=>{if(!elementRef.current)return;ensureContainerExists();const regions=document.querySelectorAll(".web-stories-aria-live-region");for(const region of regions)region.textContent="";elementRef.current.textContent=message}),[ensureContainerExists])}},"./node_modules/core-js/internals/get-iterator-flattenable.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorMethod=__webpack_require__("./node_modules/core-js/internals/get-iterator-method.js");module.exports=function(obj,stringHandling){stringHandling&&"string"==typeof obj||anObject(obj);var method=getIteratorMethod(obj);return getIteratorDirect(anObject(void 0!==method?call(method,obj):obj))}},"./node_modules/core-js/modules/esnext.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./node_modules/core-js/modules/esnext.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorFlattenable=__webpack_require__("./node_modules/core-js/internals/get-iterator-flattenable.js"),createIteratorProxy=__webpack_require__("./node_modules/core-js/internals/iterator-create-proxy.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),IteratorProxy=createIteratorProxy((function(){for(var result,inner,iterator=this.iterator,mapper=this.mapper;;){if(inner=this.inner)try{if(!(result=anObject(call(inner.next,inner.iterator))).done)return result.value;this.inner=null}catch(error){iteratorClose(iterator,"throw",error)}if(result=anObject(call(this.next,iterator)),this.done=!!result.done)return;try{this.inner=getIteratorFlattenable(mapper(result.value,this.counter++),!1)}catch(error){iteratorClose(iterator,"throw",error)}}}));$({target:"Iterator",proto:!0,real:!0,forced:IS_PURE},{flatMap:function flatMap(mapper){return anObject(this),aCallable(mapper),new IteratorProxy(getIteratorDirect(this),{mapper,inner:null})}})},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);