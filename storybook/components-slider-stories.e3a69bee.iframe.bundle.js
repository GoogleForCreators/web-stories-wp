"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5743],{"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});var react=__webpack_require__("./node_modules/react/index.js"),dist=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js"),__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js")),src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut(t0){const $=(0,dist.c)(13),{component:Component,shortcut:t1}=t0,shortcut=void 0===t1?"":t1;let T0,t2,t3,t4;if($[0]!==Component||$[1]!==shortcut){const chars=shortcut.split(" ");let t4;T0=Component,$[5]!==shortcut?(t2=(0,utils._M)(shortcut),$[5]=shortcut,$[6]=t2):t2=$[6],$[7]!==Component?(t4=(char,index)=>react.createElement(Component,{key:`${index}-${char}`},(0,utils.KV)(char)),$[7]=Component,$[8]=t4):t4=$[8],t3=chars.map(t4),$[0]=Component,$[1]=shortcut,$[2]=T0,$[3]=t2,$[4]=t3}else T0=$[2],t2=$[3],t3=$[4];return $[9]!==T0||$[10]!==t2||$[11]!==t3?(t4=react.createElement(T0,{"aria-label":t2},t3),$[9]=T0,$[10]=t2,$[11]=t3,$[12]=t4):t4=$[12],t4}},"./packages/design-system/src/components/slider/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_storybookUtils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),___WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/slider/slider.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const Container=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-n0h430-0"})(["padding:50px;background-color:",";border:1px solid ",";"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.standard.black)),__WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Slider",component:___WEBPACK_IMPORTED_MODULE_3__.A,args:{thumbSize:24,min:0,max:100,majorStep:10,minorStep:1},parameters:{controls:{exclude:["handleChange","value","suffix"]}}},_default={render:function Render(args){const[lightValue,setLightValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(0),[darkValue,setDarkValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(0);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_4__.E.Paragraph,null,"Percentage:"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_3__.A,_extends({},args,{handleChange:setLightValue,value:lightValue,suffix:"%"}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybookUtils__WEBPACK_IMPORTED_MODULE_5__.J,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_4__.E.Paragraph,null,"Milliseconds:"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_3__.A,_extends({},args,{handleChange:setDarkValue,value:darkValue,suffix:"ms"})))))}}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/theme.ts");const DarkThemeProvider=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(styled_components__WEBPACK_IMPORTED_MODULE_1__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_2__.w},children)}}]);