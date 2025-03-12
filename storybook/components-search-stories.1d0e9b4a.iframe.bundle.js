"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[4592],{"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut(t0){const $=(0,dist.c)(13),{component:Component,shortcut:t1}=t0,shortcut=void 0===t1?"":t1;let T0,t2,t3,t4;if($[0]!==Component||$[1]!==shortcut){const chars=shortcut.split(" ");let t4;T0=Component,$[5]!==shortcut?(t2=(0,utils._M)(shortcut),$[5]=shortcut,$[6]=t2):t2=$[6],$[7]!==Component?(t4=(char,index)=>react.createElement(Component,{key:`${index}-${char}`},(0,utils.KV)(char)),$[7]=Component,$[8]=t4):t4=$[8],t3=chars.map(t4),$[0]=Component,$[1]=shortcut,$[2]=T0,$[3]=t2,$[4]=t3}else T0=$[2],t2=$[3],t3=$[4];return $[9]!==T0||$[10]!==t2||$[11]!==t3?(t4=react.createElement(T0,{"aria-label":t2},t3),$[9]=T0,$[10]=t2,$[11]=t3,$[12]=t4):t4=$[12],t4}},"./packages/design-system/src/components/popup/popup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_utils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/utils/noop.ts"),_contexts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/contexts/popup/usePopup.ts"),_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/popup/utils/getOffset.ts"),_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts");const DEFAULT_TOP_OFFSET=0,DEFAULT_LEFT_OFFSET=0;const __WEBPACK_DEFAULT_EXPORT__=function Popup({anchor,dock,children,renderContents,placement=_constants__WEBPACK_IMPORTED_MODULE_2__.W.Bottom,spacing,isOpen,fillWidth=!1,refCallback=_utils__WEBPACK_IMPORTED_MODULE_3__.l,zIndex=2,ignoreMaxOffsetY,offsetOverride=!1,maxWidth}){const{topOffset=DEFAULT_TOP_OFFSET,leftOffset=DEFAULT_LEFT_OFFSET,isRTL=!1}=(0,_contexts__WEBPACK_IMPORTED_MODULE_4__.A)(),[popupState,setPopupState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null),isMountedRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(!1),popup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.li)(null),positionPopup=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((evt=>{if(!isMountedRef.current||!anchor?.current)return;if(evt instanceof Event&&evt.target instanceof Element&&popup.current?.contains(evt.target))return;const offset=anchor.current?(0,_utils__WEBPACK_IMPORTED_MODULE_5__.A3)({placement,spacing,anchor,dock,popup,isRTL,topOffset,ignoreMaxOffsetY,offsetOverride}):_utils__WEBPACK_IMPORTED_MODULE_5__.Oe,popupRect=popup.current?.getBoundingClientRect();setPopupState({offset:(()=>{if(!popupRect)return null;if(popupRect.x<=leftOffset)switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopEnd:return{...offset,x:isRTL?offset.x:popupRect.width+leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Left:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.LeftStart:return{...offset,x:isRTL?offset.x:popupRect.width+-popupRect.x-leftOffset};case _constants__WEBPACK_IMPORTED_MODULE_2__.W.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightEnd:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.RightStart:case _constants__WEBPACK_IMPORTED_MODULE_2__.W.Right:return{...offset,x:popupRect.width};default:return{...offset,x:popupRect.width/2+(isRTL?0:leftOffset)}}return isRTL&&popupRect.right>=offset.bodyRight-leftOffset?{...offset,x:offset.bodyRight-popupRect.width-leftOffset}:null})()||offset,height:popupRect?.height||null})}),[anchor,placement,spacing,dock,isRTL,topOffset,leftOffset,ignoreMaxOffsetY,offsetOverride]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>(isMountedRef.current=!0,()=>{isMountedRef.current=!1})),[]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.vJ)((()=>{popupState?.height&&popupState.height!==popup.current?.getBoundingClientRect()?.height&&positionPopup()}),[popupState?.height,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{if(isOpen)return isMountedRef.current=!0,positionPopup(),document.addEventListener("scroll",positionPopup,!0),()=>{document.removeEventListener("scroll",positionPopup,!0),isMountedRef.current=!1}}),[isOpen,positionPopup]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Nf)((()=>{isMountedRef.current&&refCallback(popup)}),[popupState,refCallback]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.pO)({current:document.body},positionPopup,[positionPopup]),popupState&&isOpen?(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.d5)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_constants__WEBPACK_IMPORTED_MODULE_2__.yK,{ref:popup,fillWidth:Boolean(fillWidth),maxWidth,$offset:popupState.offset,topOffset,zIndex,transforms:(0,_utils__WEBPACK_IMPORTED_MODULE_6__.s0)(placement,isRTL)},renderContents?renderContents({propagateDimensionChange:positionPopup}):children),document.body):null}},"./packages/design-system/src/components/search/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LightTheme:()=>LightTheme,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_storybookUtils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),_popup__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_search__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/search/search.tsx"),_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/storybookUtils/sampleData.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Search",args:{ariaClearLabel:"clear search",ariaInputLabel:"search for an image",disabled:!1,emptyText:"No options available",hasError:!1,hint:"default hint text",label:"Find an image",isRTL:!1,placeholder:"search",placement:_popup__WEBPACK_IMPORTED_MODULE_2__.W.Bottom,popupZIndex:1},argTypes:{placement:{options:Object.values(_popup__WEBPACK_IMPORTED_MODULE_2__.W),control:"select"},onChange:{action:"handleSearchValueChange"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-l8gcrm-0"})(["width:400px;height:100vh;padding:12px 24px;background-color:",";"],(({theme})=>theme.colors.bg.primary)),_default={render:function Render({onChange,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG[2]),[inputValue,setInputValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(""),options=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Kr)((()=>inputValue&&0!==inputValue.length?_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG.filter((({label,value})=>label.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())||value.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim()))):_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG),[inputValue]),handleSearchValueChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((value=>{onChange(value),setInputValue(value)}),[onChange]),handleOnClear=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((()=>{setInputValue(""),setSelectedValue(null)}),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_5__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_search__WEBPACK_IMPORTED_MODULE_6__.A,_extends({handleSearchValueChange,onClear:handleOnClear,options,selectedValue},args))))}},LightTheme={render:function Render({onChange,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(),[inputValue,setInputValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(""),options=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Kr)((()=>inputValue&&0!==inputValue.length?_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG.filter((({label,value})=>label.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim())||value.toString().toLowerCase().startsWith(inputValue.toLowerCase().trim()))):[]),[inputValue]),handleSearchValueChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((value=>{onChange(value),setInputValue(value)}),[onChange]),handleOnClear=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.hb)((()=>{setInputValue(""),setSelectedValue(null)}),[]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_search__WEBPACK_IMPORTED_MODULE_6__.A,_extends({handleSearchValueChange,onClear:handleOnClear,options,selectedValue},args)))}}},"./packages/design-system/src/icons/chevron_down_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgChevronDownSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:10,d:"m20 15-4 3-4-3"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgChevronDownSmall)},"./packages/design-system/src/icons/magnifier.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgMagnifier=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9 14.636a5.636 5.636 0 1 1 11.272 0 5.636 5.636 0 0 1-11.272 0m9.961 5.033a6.636 6.636 0 1 1 .707-.707l4.184 4.184a.5.5 0 1 1-.707.707z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgMagnifier)},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)},"./packages/design-system/src/storybookUtils/sampleData.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ae:()=>shortDropDownOptions,QS:()=>reallyLongOptions,jz:()=>effectChooserOptions,kG:()=>basicDropDownOptions,rc:()=>nestedDropDownOptions});const shortDropDownOptions=[{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"}],basicDropDownOptions=[{label:"label item one",value:"label-item-one"},{label:"label item two",value:"label-item-two"},{label:"label item three",value:"label-item-three"},{label:"label item four (disabled)",value:"label-item-four",disabled:!0},{label:"label item five (value is a number)",value:5},{label:"label item six (value is a boolean)",value:!0},{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"},{label:"parakeets",value:"parakeets"},{label:"lemurs",value:"lemurs"},{label:"ocelots",value:"ocelots"}],reallyLongOptions=[{label:"mad mad mad mad world",value:"tears for fears"},{label:"bring on the dancing horses",value:"echo"},{label:"one 2 three four, uno dos tres rumba",value:"pitbull"}],effectChooserOptions=[{value:"none",label:"none",width:"full"},{value:"drop in",label:"drop",width:"full"},{value:"fly in left-to-right",label:"fly in",width:"half"},{value:"fly in top-to-bottom",label:"fly in",width:"half"},{value:"fly in right-to-left",label:"fly in",width:"half"},{value:"fly in bottom-to-top",label:"fly in",width:"half"},{value:"pulse",label:"pulse",width:"full"},{value:"rotate in left-to-right",label:"rotate in",width:"half"},{value:"rotate in right-to-left",label:"rotate in",width:"half"},{value:"twirl",label:"twirl",width:"full"}],nestedDropDownOptions=[{label:"aliens",options:[{value:"alien-1",label:"ET"},{value:"alien-2",label:"Stitch"},{value:"alien-3",label:"Groot"},{value:"alien-4",label:"The Worm Guys"},{value:"alien-5",label:"Na'vi"},{value:"alien-6",label:"Arachnids"},{value:"alien-7",label:"The Predator"},{value:"alien-8",label:"Xenomorph"}]},{label:"dragons",options:[{value:"dragon-1",label:"Smaug"},{value:"dragon-2",label:"Mushu"},{value:"dragon-3",label:"Toothless"},{value:"dragon-4",label:"Falkor"},{value:"dragon-5",label:"Drogon"},{value:"dragon-6",label:"Kalessin"}]},{label:"dogs",options:[{value:"dog-1",label:"Snoopy"},{value:"dog-2",label:"Scooby"}]}]},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/design-system/src/utils/useLiveRegion.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts");const __WEBPACK_DEFAULT_EXPORT__=function useLiveRegion(politeness="polite"){const elementRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.li)(null),ensureContainerExists=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.hb)((()=>{if(elementRef.current)return()=>{elementRef.current&&(document.body.removeChild(elementRef.current),elementRef.current=null)};const containerId="web-stories-aria-live-region-"+politeness,existingContainer=document.getElementById(containerId);if(existingContainer)return elementRef.current=existingContainer,()=>{elementRef.current=null};const container=document.createElement("div");return container.id=containerId,container.className="web-stories-aria-live-region",container.setAttribute("style","position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"),container.setAttribute("aria-live",politeness),container.setAttribute("aria-relevant","additions text"),container.setAttribute("aria-atomic","true"),document.body.appendChild(container),elementRef.current=container,()=>{document.body.removeChild(container),elementRef.current=null}}),[politeness]);return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.vJ)(ensureContainerExists,[ensureContainerExists]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.hb)((message=>{if(!elementRef.current)return;ensureContainerExists();const regions=document.querySelectorAll(".web-stories-aria-live-region");for(const region of regions)region.textContent="";elementRef.current.textContent=message}),[ensureContainerExists])}}}]);