"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[7663],{"./packages/design-system/src/components/dropDown/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LightTheme:()=>LightTheme,NoOptionsMenu:()=>NoOptionsMenu,OverriddenAnimationProofOfConcept:()=>OverriddenAnimationProofOfConcept,ReallyLongLabelsMenu:()=>ReallyLongLabelsMenu,ShortMenu:()=>ShortMenu,SubMenus:()=>SubMenus,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),prop_types__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_8__),_storybookUtils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),_popup__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_typography__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),___WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/components/dropDown/dropdown.tsx"),_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/storybookUtils/sampleData.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/DropDown",args:{hasError:!1,hint:"default hint text",placeholder:"select a value",ariaLabel:"ariaLabel",dropDownLabel:"label",isKeepMenuOpenOnSelection:!0,isRTL:!1,disabled:!1,placement:_popup__WEBPACK_IMPORTED_MODULE_2__.W.Top,popupZIndex:1},argTypes:{placement:{options:Object.values(_popup__WEBPACK_IMPORTED_MODULE_2__.W),control:"select"},onMenuItemClick:{action:"onMenuItemClick"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-3q6gnl-0"})(["width:","px;height:100vh;padding:12px 24px;background-color:",";"],(({narrow})=>narrow?150:400),(({theme})=>theme.colors.bg.primary)),StyledEffectListItem=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.li.withConfig({displayName:"stories__StyledEffectListItem",componentId:"sc-3q6gnl-1"})(["border:none;background:",";border-radius:4px;height:48px;position:relative;overflow:hidden;font-family:'Teko',sans-serif;font-size:20px;line-height:1;color:white;text-transform:uppercase;transition:background 0.1s linear;grid-column-start:",";&:focus{background:",";}"],(({active})=>active?"#5732A3":"#333"),(({width})=>"full"===width?"span 4":"span 2"),(({active})=>active?"#5732A3":"#B488FC")),styleOverrideForAnimationEffectMenu=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["width:276px;display:inline-block;background:black;ul{display:grid;justify-content:center;gap:15px 3px;grid-template-columns:repeat(4,58px);padding:15px;position:relative;}"]),_default={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG[2].value);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_5__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_typography__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph,null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus luctus ex eu maximus. Nam cursus nulla massa, vel porta nisi mattis et. Vivamus vitae massa nulla. Sed enim velit, iaculis ut pharetra vitae, sagittis et dui. In sollicitudin lectus vel rhoncus auctor. Morbi pulvinar nisl sed mi fringilla, vitae bibendum felis egestas."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG,selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args))))}},LightTheme={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG[2].value);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG,selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args)))}},shortenedOptions=_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.kG.slice(0,3),ShortMenu={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:shortenedOptions,selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args)))}},NoOptionsMenu={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:[],selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args)))}},ReallyLongLabelsMenu={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,{narrow:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.QS,selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args)))}},SubMenus={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)("dog-2");return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.rc,selectedValue,onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)}},args)))}},RenderItemOverride=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((({option,isSelected,...rest},ref)=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledEffectListItem,_extends({ref,width:option.width,active:isSelected},rest),option.label)));RenderItemOverride.propTypes={option:prop_types__WEBPACK_IMPORTED_MODULE_8___default().object,isSelected:prop_types__WEBPACK_IMPORTED_MODULE_8___default().bool};const OverriddenAnimationProofOfConcept={render:function Render({onMenuItemClick,...args}){const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(null);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_5__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_7__.A,_extends({emptyText:"No options available",options:_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_4__.jz,selectedValue,onMenuItemClick:(event,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},menuStylesOverride:styleOverrideForAnimationEffectMenu,renderItem:RenderItemOverride},args))))}}},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts"));const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut({component:Component,shortcut=""}){const chars=shortcut.split(" ");return react.createElement(Component,{"aria-label":(0,utils._M)(shortcut)},chars.map(((char,index)=>react.createElement(Component,{key:`${index}-${char}`},(0,utils.KV)(char)))))}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)},"./packages/design-system/src/storybookUtils/sampleData.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ae:()=>shortDropDownOptions,QS:()=>reallyLongOptions,jz:()=>effectChooserOptions,kG:()=>basicDropDownOptions,rc:()=>nestedDropDownOptions});const shortDropDownOptions=[{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"}],basicDropDownOptions=[{label:"label item one",value:"label-item-one"},{label:"label item two",value:"label-item-two"},{label:"label item three",value:"label-item-three"},{label:"label item four (disabled)",value:"label-item-four",disabled:!0},{label:"label item five (value is a number)",value:5},{label:"label item six (value is a boolean)",value:!0},{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"},{label:"parakeets",value:"parakeets"},{label:"lemurs",value:"lemurs"},{label:"ocelots",value:"ocelots"}],reallyLongOptions=[{label:"mad mad mad mad world",value:"tears for fears"},{label:"bring on the dancing horses",value:"echo"},{label:"one 2 three four, uno dos tres rumba",value:"pitbull"}],effectChooserOptions=[{value:"none",label:"none",width:"full"},{value:"drop in",label:"drop",width:"full"},{value:"fly in left-to-right",label:"fly in",width:"half"},{value:"fly in top-to-bottom",label:"fly in",width:"half"},{value:"fly in right-to-left",label:"fly in",width:"half"},{value:"fly in bottom-to-top",label:"fly in",width:"half"},{value:"pulse",label:"pulse",width:"full"},{value:"rotate in left-to-right",label:"rotate in",width:"half"},{value:"rotate in right-to-left",label:"rotate in",width:"half"},{value:"twirl",label:"twirl",width:"full"}],nestedDropDownOptions=[{label:"aliens",options:[{value:"alien-1",label:"ET"},{value:"alien-2",label:"Stitch"},{value:"alien-3",label:"Groot"},{value:"alien-4",label:"The Worm Guys"},{value:"alien-5",label:"Na'vi"},{value:"alien-6",label:"Arachnids"},{value:"alien-7",label:"The Predator"},{value:"alien-8",label:"Xenomorph"}]},{label:"dragons",options:[{value:"dragon-1",label:"Smaug"},{value:"dragon-2",label:"Mushu"},{value:"dragon-3",label:"Toothless"},{value:"dragon-4",label:"Falkor"},{value:"dragon-5",label:"Drogon"},{value:"dragon-6",label:"Kalessin"}]},{label:"dogs",options:[{value:"dog-1",label:"Snoopy"},{value:"dog-2",label:"Scooby"}]}]},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/design-system/src/utils/useForwardedRef.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts");const __WEBPACK_DEFAULT_EXPORT__=function useForwardedRef(ref){const wrappedRef=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.li)({current:null}),reference=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.li)(null);return Object.defineProperty(wrappedRef.current,"current",{get:()=>reference.current,set:value=>{if(!Object.is(reference.current,value)){if(reference.current=value,!ref)return;"function"==typeof ref?ref(reference.current):ref.current=reference.current}}}),wrappedRef.current}},"./node_modules/core-js/modules/esnext.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);