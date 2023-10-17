"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[8724],{"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{z9:()=>Shortcut,Xl:()=>useEscapeToBlurEffect,yg:()=>useGlobalIsKeyPressed,xb:()=>useGlobalKeyDownEffect,Ew:()=>useKeyDownEffect,LP:()=>useKeyEffect});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.kr)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.qp)(context),batchingCallback=(0,src.iS)(callback,deps||[]);(0,src.d4)((()=>{const nodeEl=(0,utils.Lc)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.zO)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.x0)(nodeEl),handler=(0,utils.qs)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.eJ)(!1),handleBlur=(0,src.I4)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.d4)((()=>(window.addEventListener("blur",handleBlur),function(){window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.Lc)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut(_ref){let{component:Component,shortcut=""}=_ref;const chars=shortcut.split(" ");return(0,jsx_runtime.jsx)(Component,{"aria-label":(0,utils.k$)(shortcut),children:chars.map(((char,index)=>(0,jsx_runtime.jsx)(Component,{children:(0,utils.U2)(char)},`${index}-${char}`)))})}Shortcut.displayName="Shortcut"},"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Lc:()=>getNodeFromRefOrNode,U2:()=>prettifyShortcut,k$:()=>createShortcutAriaLabel,qs:()=>createKeyHandler,vx:()=>isPlatformMacOS,x0:()=>getOrCreateMousetrap,zO:()=>resolveKeySpec});var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_0__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_0___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).map((key=>keyDict[key]||key)).flat(),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,_ref,callback){let{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1}=_ref;return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget(_ref3){let{tagName,isContentEditable,type,...rest}=_ref3;if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget(_ref2){let{tagName,type}=_ref2;if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/components/menu/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LightTheme:()=>LightTheme,NoOptionsMenu:()=>NoOptionsMenu,OverriddenAnimationProofOfConcept:()=>OverriddenAnimationProofOfConcept,ReallyLongLabelsMenu:()=>ReallyLongLabelsMenu,SubMenus:()=>SubMenus,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),prop_types__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_8__),_storybookUtils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/storybookUtils/darkThemeProvider.js"),___WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/components/menu/menu.tsx"),_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/storybookUtils/sampleData.js"),_utils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/menu/utils.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"DesignSystem/Components/Menu",args:{dropDownHeight:100,hasMenuRole:!0,isRTL:!1,menuAriaLabel:"default aria label",parentId:"id-menu-associates-with"},argTypes:{onMenuItemClick:{action:"onMenuItemClick"},onDismissMenu:{action:"onDismissMenu occurred"}}},Container=styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP.div.withConfig({displayName:"stories__Container",componentId:"sc-6pozex-0"})(["width:","px;height:100vh;padding:12px 24px;background-color:",";"],(_ref=>{let{narrow}=_ref;return narrow?150:400}),(_ref2=>{let{theme}=_ref2;return theme.colors.bg.primary})),StyledEffectListItem=styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP.li.withConfig({displayName:"stories__StyledEffectListItem",componentId:"sc-6pozex-1"})(["border:none;background:",";border-radius:4px;height:48px;position:relative;overflow:hidden;font-family:'Teko',sans-serif;font-size:20px;line-height:1;color:white;text-transform:uppercase;transition:background 0.1s linear;grid-column-start:",";&:focus{background:",";}"],(_ref3=>{let{active}=_ref3;return active?"#5732A3":"#333"}),(_ref4=>{let{width}=_ref4;return"full"===width?"span 4":"span 2"}),(_ref5=>{let{active}=_ref5;return active?"#5732A3":"#B488FC"})),styleOverrideForAnimationEffectMenu=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.iv)(["width:276px;display:inline-block;background:black;ul{display:grid;justify-content:center;gap:15px 3px;grid-template-columns:repeat(4,58px);padding:15px;position:relative;}"]),_basicDropDownOptions=(0,_utils__WEBPACK_IMPORTED_MODULE_4__.getOptions)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__.g0),_effectChooserOptions=(0,_utils__WEBPACK_IMPORTED_MODULE_4__.getOptions)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__.uB),_nestedDropDownOptions=(0,_utils__WEBPACK_IMPORTED_MODULE_4__.getOptions)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__.Mf),_reallyLongOptions=(0,_utils__WEBPACK_IMPORTED_MODULE_4__.getOptions)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__.r1),_default={render:function Render(_ref6){let{onMenuItemClick,...args}=_ref6;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(_storybookUtils_sampleData__WEBPACK_IMPORTED_MODULE_5__.g0[2].value);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_storybookUtils__WEBPACK_IMPORTED_MODULE_6__.D,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{options:_basicDropDownOptions,listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,...args})})})}},LightTheme={render:function Render(_ref7){let{onMenuItemClick,...args}=_ref7;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(null);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{emptyText:"No options available",options:_basicDropDownOptions,listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,...args})})}},NoOptionsMenu={render:function Render(_ref8){let{onMenuItemClick,...args}=_ref8;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(null);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{emptyText:"No options available",options:[],listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,...args})})}},ReallyLongLabelsMenu={render:function Render(_ref9){let{onMenuItemClick,...args}=_ref9;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(null);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{narrow:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{emptyText:"No options available",options:_reallyLongOptions,listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,...args})})}},SubMenus={render:function Render(_ref10){let{onMenuItemClick,...args}=_ref10;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)("dog-2");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{emptyText:"No options available",options:_nestedDropDownOptions,listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,...args})})}},RenderItemOverride=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Gp)(((_ref11,ref)=>{let{option,isSelected,...rest}=_ref11;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StyledEffectListItem,{ref,width:option.width,active:isSelected,...rest,children:option.label})}));RenderItemOverride.propTypes={option:prop_types__WEBPACK_IMPORTED_MODULE_8___default().object,isSelected:prop_types__WEBPACK_IMPORTED_MODULE_8___default().bool};const OverriddenAnimationProofOfConcept={render:function Render(_ref12){let{onMenuItemClick,...args}=_ref12;const[selectedValue,setSelectedValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(null);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_storybookUtils__WEBPACK_IMPORTED_MODULE_6__.D,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Container,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_7__.Z,{emptyText:"No options available",options:_effectChooserOptions,listId:"list-id",onMenuItemClick:(_,newValue)=>{onMenuItemClick(newValue),setSelectedValue(newValue)},activeValue:selectedValue,menuStylesOverride:styleOverrideForAnimationEffectMenu,renderItem:RenderItemOverride,...args})})})}}},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{y:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=_ref=>{let{theme}=_ref;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)}},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{x:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=_ref=>{let{isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme}=_ref;return(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight)},Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(_ref2=>{let{isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme}=_ref2;return(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)}),(_ref3=>{let{disabled,theme}=_ref3;return disabled?theme.colors.fg.disable:"auto"})),Span,Kbd,Paragraph}},"./packages/design-system/src/storybookUtils/darkThemeProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DarkThemeProvider});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DarkThemeProvider=_ref=>{let{children}=_ref;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(styled_components__WEBPACK_IMPORTED_MODULE_2__.f6,{theme:_theme__WEBPACK_IMPORTED_MODULE_3__.r,children})};DarkThemeProvider.displayName="DarkThemeProvider"},"./packages/design-system/src/storybookUtils/sampleData.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Mf:()=>nestedDropDownOptions,g0:()=>basicDropDownOptions,kk:()=>shortDropDownOptions,r1:()=>reallyLongOptions,uB:()=>effectChooserOptions});const shortDropDownOptions=[{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"}],basicDropDownOptions=[{label:"label item one",value:"label-item-one"},{label:"label item two",value:"label-item-two"},{label:"label item three",value:"label-item-three"},{label:"label item four (disabled)",value:"label-item-four",disabled:!0},{label:"label item five (value is a number)",value:5},{label:"label item six (value is a boolean)",value:!0},{label:"drafts",value:"drafts"},{label:"cats",value:"cats"},{label:"dogs",value:"dogs"},{label:"parakeets",value:"parakeets"},{label:"lemurs",value:"lemurs"},{label:"ocelots",value:"ocelots"}],reallyLongOptions=[{label:"mad mad mad mad world",value:"tears for fears"},{label:"bring on the dancing horses",value:"echo"},{label:"one 2 three four, uno dos tres rumba",value:"pitbull"}],effectChooserOptions=[{value:"none",label:"none",width:"full"},{value:"drop in",label:"drop",width:"full"},{value:"fly in left-to-right",label:"fly in",width:"half"},{value:"fly in top-to-bottom",label:"fly in",width:"half"},{value:"fly in right-to-left",label:"fly in",width:"half"},{value:"fly in bottom-to-top",label:"fly in",width:"half"},{value:"pulse",label:"pulse",width:"full"},{value:"rotate in left-to-right",label:"rotate in",width:"half"},{value:"rotate in right-to-left",label:"rotate in",width:"half"},{value:"twirl",label:"twirl",width:"full"}],nestedDropDownOptions=[{label:"aliens",options:[{value:"alien-1",label:"ET"},{value:"alien-2",label:"Stitch"},{value:"alien-3",label:"Groot"},{value:"alien-4",label:"The Worm Guys"},{value:"alien-5",label:"Na'vi"},{value:"alien-6",label:"Arachnids"},{value:"alien-7",label:"The Predator"},{value:"alien-8",label:"Xenomorph"}]},{label:"dragons",options:[{value:"dragon-1",label:"Smaug"},{value:"dragon-2",label:"Mushu"},{value:"dragon-3",label:"Toothless"},{value:"dragon-4",label:"Falkor"},{value:"dragon-5",label:"Drogon"},{value:"dragon-6",label:"Kalessin"}]},{label:"dogs",options:[{value:"dog-1",label:"Snoopy"},{value:"dog-2",label:"Scooby"}]}]},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>expandTextPreset,_:()=>expandPresetStyles});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=_ref=>{let{preset,theme}=_ref;return preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)([""])},expandTextPreset=presetSelector=>_ref2=>{let{theme}=_ref2;return expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.TextSize),theme})}},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>focusableOutlineCSS,R:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["outline:none;box-shadow:",";"],(_ref=>{let{theme}=_ref;return`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`})),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);