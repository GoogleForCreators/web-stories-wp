"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[1343],{"./packages/design-system/src/components/hex/hex.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>hex});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts"),polished_esm=__webpack_require__("./node_modules/polished/dist/polished.esm.js"),getPreviewText=__webpack_require__("./packages/patterns/src/getPreviewText.ts");const src_getHexFromValue=function getHexFromValue(value){const val=(value||"").toUpperCase().trim().replace(/^#/,"");return/[^0-9a-f]/i.test(val)?null:6===val.length?val:1===val.length?val.repeat(6):2===val.length?val.repeat(3):3===val.length?val.replace(/./g,"$&$&"):4===val.length?`${val.substring(0,2).repeat(2)}${val.substring(2)}`:null};var keyboard=__webpack_require__("./packages/design-system/src/components/keyboard/keyboard.tsx"),input=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const HexInput=(0,src.Rf)((function Hex({value,placeholder,onChange,...rest},ref){const[inputValue,setInputValue]=(0,src.J0)(null),inputRef=(0,src.li)(null),skipValidationRef=(0,src.li)(!1),previewText=(0,getPreviewText.A)(value);(0,src.vJ)((()=>setInputValue(previewText)),[previewText]);const handleInputChange=(0,src.hb)((evt=>{const val=evt.target.value.trim().replace(/^#/,"");setInputValue(val)}),[]),validateAndSubmitInput=(0,src.hb)((()=>{const hex=src_getHexFromValue(String(inputValue))??previewText;if(setInputValue(hex),hex!==previewText){const{red:r,green:g,blue:b}=(0,polished_esm.kN)(`#${String(hex)}`),a=value.color.a;onChange({color:{r,g,b,a}})}}),[inputValue,previewText,onChange,value]),handleEnter=(0,src.hb)((()=>{validateAndSubmitInput()}),[validateAndSubmitInput]),handleInputBlur=(0,src.hb)((()=>{skipValidationRef.current||validateAndSubmitInput(),skipValidationRef.current=!1}),[validateAndSubmitInput]),handleEsc=(0,src.hb)((()=>{setInputValue(previewText),skipValidationRef.current=!0;const availableRef=ref&&"current"in ref?ref:inputRef;availableRef.current?.blur()}),[previewText,ref]);return(0,keyboard._h)(inputRef,{key:["escape"],editable:!0},handleEsc,[handleEsc]),(0,keyboard._h)(inputRef,{key:["enter"],editable:!0},handleEnter,[handleEnter]),(0,jsx_runtime.jsx)(input.A,{ref:ref||inputRef,value:inputValue||"",onChange:handleInputChange,onBlur:handleInputBlur,placeholder,...rest})})),hex=HexInput},"./packages/design-system/src/components/hex/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/hex/hex.tsx"),_storybookUtils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/HexInput",component:___WEBPACK_IMPORTED_MODULE_3__.A,args:{label:"Normal",hint:"Hint"},argTypes:{handleOnChange:{action:"on change"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-hz5gzi-0"})(["display:grid;row-gap:20px;padding:20px 50px;background-color:",";border:1px solid ",";"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.standard.black)),Row=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Row",componentId:"sc-hz5gzi-1"})(["display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));grid-column:1 / -1;grid-column-gap:60px;label{display:flex;align-items:center;}"]),_default={render:function Render({handleOnChange,...args}){const[inputState,setInputState]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)({oneLight:{color:{r:255,g:255,b:255}},oneDark:{color:{r:0,g:0,b:0}}}),handleChange=event=>{if(handleOnChange(event),!event?.target)return;const name=event.target.name,value=event.target.value;setInputState((prevState=>({...prevState,[name]:value})))};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_5__.$,{as:"h1",children:"Hex Input"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Row,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.A,{"aria-label":"input-one",id:"one-light",name:"oneLight",value:inputState.oneLight,onChange:handleChange,placeholder:"placeholder",...args})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_storybookUtils__WEBPACK_IMPORTED_MODULE_6__.J,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{darkMode:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Row,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.A,{"aria-label":"input-four",id:"one-dark",name:"oneDark",value:inputState.oneDark,onChange:handleChange,placeholder:"placeholder",...args})})})})]})}}},"./packages/design-system/src/components/input/input.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme_helpers__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styled__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/input/styled.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const InputContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"input__InputContainer",componentId:"sc-3nq9b0-0"})((({focused,hasError,theme,styleOverride})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:flex;align-items:center;justify-content:space-between;height:36px;padding:4px 12px;border:1px solid ",";border-radius:",";overflow:hidden;",";",";:focus-within{",";}",";"],theme.colors.border[hasError?"negativeNormal":"defaultNormal"],theme.borders.radius.small,focused&&!hasError&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-color:",";"],theme.colors.border.defaultActive),focused&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["","{color:",";}"],_styled__WEBPACK_IMPORTED_MODULE_4__.sZ,theme.colors.fg.primary),(0,_theme_helpers__WEBPACK_IMPORTED_MODULE_5__.g)(theme.colors.border.focus),styleOverride))),Input=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((({inputClassName,className,disabled,hasError,hint,id,label,onBlur,onFocus,hasFocus=!1,suffix,unit="",value="",isIndeterminate=!1,containerStyleOverride="",...props},ref)=>{const inputId=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Kr)((()=>id||(0,uuid__WEBPACK_IMPORTED_MODULE_6__.A)()),[id]),[isFocused,setIsFocused]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(hasFocus),[hasBeenSelected,setHasBeenSelected]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(!1);let displayedValue=value;unit&&"string"==typeof value&&value.length&&(displayedValue=`${value}${isFocused?"":`${unit}`}`),isIndeterminate&&(displayedValue="");const hasSuffix=Boolean(suffix);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_styled__WEBPACK_IMPORTED_MODULE_4__.mc,{className,children:[label&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_styled__WEBPACK_IMPORTED_MODULE_4__.JU,{htmlFor:inputId,disabled,children:label}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(InputContainer,{focused:isFocused,hasError,styleOverride:containerStyleOverride,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_styled__WEBPACK_IMPORTED_MODULE_4__.aE,{id:inputId,disabled,ref:input=>{"function"==typeof ref?ref(input):ref&&(ref.current=input),input&&isFocused&&!hasBeenSelected&&(input.select(),setHasBeenSelected(!0))},onFocus:e=>{onFocus?.(e),setIsFocused(!0),setHasBeenSelected(!1)},onBlur:e=>{onBlur?.(e),setIsFocused(!1)},value:displayedValue,hasSuffix,className:inputClassName,...props}),hasSuffix&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_styled__WEBPACK_IMPORTED_MODULE_4__.sZ,{size:_theme__WEBPACK_IMPORTED_MODULE_7__.$.Small,onClick:()=>setIsFocused(!0),children:suffix})]}),hint&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_styled__WEBPACK_IMPORTED_MODULE_4__.Ck,{hasError,children:hint})]})}));Input.displayName="Input";const __WEBPACK_DEFAULT_EXPORT__=Input},"./packages/design-system/src/components/input/styled.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ck:()=>Hint,JU:()=>Label,aE:()=>BaseInput,mc:()=>Container,sZ:()=>Suffix});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_typography__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/types.ts");const Container=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.div.withConfig({displayName:"styled__Container",componentId:"sc-61rjdo-0"})(["position:relative;display:inline-block;width:100%;min-width:40px;"]),Label=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_1__.E.Label).withConfig({displayName:"styled__Label",componentId:"sc-61rjdo-1"})(["margin-bottom:12px;display:inline-block;"]),Hint=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_1__.E.Paragraph).withConfig({displayName:"styled__Hint",componentId:"sc-61rjdo-2"})(["display:inline-block;margin-top:12px;color:",";"],(({hasError,theme})=>theme.colors.fg[hasError?"negative":"tertiary"])),Suffix=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_1__.E.Span).withConfig({displayName:"styled__Suffix",componentId:"sc-61rjdo-3"})(["background:transparent;color:",";white-space:nowrap;svg{width:32px;height:32px;margin:2px -10px;display:block;}"],(({theme})=>theme.colors.fg.tertiary)),BaseInput=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.input.withConfig({displayName:"styled__BaseInput",componentId:"sc-61rjdo-4"})((({hasSuffix,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["height:100%;width:100%;padding:0;"," background-color:inherit;border:none;outline:none;box-shadow:none;color:",";",";::placeholder{color:",";}:disabled{color:",";border-color:",";& ~ ","{color:",";}}:focus{box-shadow:none;}:active:enabled{color:",";}"],hasSuffix&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["padding-right:8px;"]),theme.colors.fg.primary,_theme__WEBPACK_IMPORTED_MODULE_2__.s({preset:{...theme.typography.presets.paragraph[_theme__WEBPACK_IMPORTED_MODULE_3__.$.Small]},theme}),theme.colors.fg.tertiary,theme.colors.fg.disable,theme.colors.border.disable,Suffix,theme.colors.fg.disable,theme.colors.fg.primary)))},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut({component:Component,shortcut=""}){const chars=shortcut.split(" ");return(0,jsx_runtime.jsx)(Component,{"aria-label":(0,utils._M)(shortcut),children:chars.map(((char,index)=>(0,jsx_runtime.jsx)(Component,{children:(0,utils.KV)(char)},`${index}-${char}`)))})}Shortcut.displayName="Shortcut"},"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Eh:()=>createKeyHandler,KV:()=>prettifyShortcut,RS:()=>getNodeFromRefOrNode,Zg:()=>resolveKeySpec,_M:()=>createShortcutAriaLabel,fi:()=>isPlatformMacOS,iJ:()=>getOrCreateMousetrap});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.flat-map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_3__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_3___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).flatMap((key=>keyDict[key]||key)),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1},callback){return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget({tagName,isContentEditable,type,...rest}){if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget({tagName,type}){if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/components/typography/headline/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Headline});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const Headline=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.h1.withConfig({displayName:"headline__Headline",componentId:"sc-yhwct1-0"})(["",";"," ",""],_styles__WEBPACK_IMPORTED_MODULE_1__.u,(({theme,size=_theme__WEBPACK_IMPORTED_MODULE_2__.$.Medium})=>_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.headline[size],theme})),(({as,theme})=>"a"===as&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([":hover{color:",";}",""],theme.colors.fg.linkHover,_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus))))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{E:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight),Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.$.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.u,_theme__WEBPACK_IMPORTED_MODULE_3__.s({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)),(({disabled,theme})=>disabled?theme.colors.fg.disable:"auto")),Span,Kbd,Paragraph}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>DarkThemeProvider});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DarkThemeProvider=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(styled_components__WEBPACK_IMPORTED_MODULE_2__.NP,{theme:_theme__WEBPACK_IMPORTED_MODULE_3__.w,children});DarkThemeProvider.displayName="DarkThemeProvider"},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}},"./packages/patterns/src/getPreviewText.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/i18n/src/i18n.ts"),_types__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/patterns/src/types.ts");const __WEBPACK_DEFAULT_EXPORT__=function getPreviewText(pattern){if(!pattern)return null;switch(pattern.type){case _types__WEBPACK_IMPORTED_MODULE_0__.$1.Radial:return(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Radial","web-stories");case _types__WEBPACK_IMPORTED_MODULE_0__.$1.Linear:return(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Linear","web-stories");case _types__WEBPACK_IMPORTED_MODULE_0__.$1.Solid:default:{const{color:{r,g,b}}=pattern;return function printRGB(r,g,b){const hex=v=>v.toString(16).padStart(2,"0");return`${hex(r)}${hex(g)}${hex(b)}`.toUpperCase()}(r,g,b)}}}},"./packages/patterns/src/types.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$1:()=>PatternType,Gw:()=>PatternPropType});var prop_types__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);let PatternType=function(PatternType){return PatternType.Solid="solid",PatternType.Linear="linear",PatternType.Radial="radial",PatternType}({});const HexPropType=prop_types__WEBPACK_IMPORTED_MODULE_0___default().shape({r:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired,g:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired,b:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired,a:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number}),ColorStopPropType=prop_types__WEBPACK_IMPORTED_MODULE_0___default().shape({color:HexPropType.isRequired,position:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired}),PatternPropType=prop_types__WEBPACK_IMPORTED_MODULE_0___default().shape({type:prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOf(Object.values(PatternType)),color:HexPropType,stops:prop_types__WEBPACK_IMPORTED_MODULE_0___default().arrayOf(ColorStopPropType),rotation:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number,alpha:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number,center:prop_types__WEBPACK_IMPORTED_MODULE_0___default().shape({x:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired,y:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired}),size:prop_types__WEBPACK_IMPORTED_MODULE_0___default().shape({w:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired,h:prop_types__WEBPACK_IMPORTED_MODULE_0___default().number.isRequired})})},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);