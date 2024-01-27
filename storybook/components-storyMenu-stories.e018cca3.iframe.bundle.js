"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[4513],{"./packages/design-system/src/icons/launch.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,_path2,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgLaunch=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 24 24","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),_path2||(_path2=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLaunch)},"./packages/dashboard/src/components/storyMenu/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{ZP:()=>StoryMenu,qO:()=>MoreVerticalButton});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/i18n/src/i18n.ts"),prop_types__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__),styled_components__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/contextMenu/contextMenu.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/link.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/separator.tsx"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/icons/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const CONTEXT_MENU_BUTTON_CLASS="context-menu-button",MoreVerticalButton=styled_components__WEBPACK_IMPORTED_MODULE_5__.ZP.button.withConfig({displayName:"storyMenu__MoreVerticalButton",componentId:"sc-1vaaobv-0"})(["display:flex;background:transparent;padding:0 8px;opacity:",";transition:opacity ease-in-out 300ms;cursor:pointer;color:",";& > svg{width:4px;max-height:100%;}border:0;border-radius:",";",";"],(({menuOpen,isVisible})=>menuOpen||isVisible?1:0),(({theme,$isInverted})=>$isInverted?theme.colors.inverted.fg.primary:theme.colors.interactiveFg.brandNormal),(({theme})=>theme.borders.radius.small),(({theme,$isInverted})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.L(!1,!!$isInverted&&theme.colors.standard.black)));MoreVerticalButton.propTypes={menuOpen:prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool};const MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_5__.ZP.div.withConfig({displayName:"storyMenu__MenuContainer",componentId:"sc-1vaaobv-1"})(["position:relative;align-self:",";text-align:right;"," & > div{margin:0;}"],(({verticalAlign="flex-start"})=>verticalAlign),(({$menuStyleOverrides})=>$menuStyleOverrides));function StoryMenu({contextMenuId,onMoreButtonSelected,storyId,verticalAlign,menuItems,itemActive,tabIndex,menuStyleOverrides,menuLabel,isInverted}){const isPopoverMenuOpen=contextMenuId===storyId,handleDismiss=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.I4)((evt=>onMoreButtonSelected(evt,-1)),[onMoreButtonSelected]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(MenuContainer,{verticalAlign,"data-testid":`story-context-menu-${storyId}`,$menuStyleOverrides:menuStyleOverrides,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MoreVerticalButton,{"data-testid":`story-context-button-${storyId}`,tabIndex,menuOpen:isPopoverMenuOpen,isVisible:itemActive,"aria-label":menuLabel||(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("More Options","web-stories"),onClick:evt=>onMoreButtonSelected(evt,isPopoverMenuOpen?-1:storyId),className:CONTEXT_MENU_BUTTON_CLASS,$isInverted:isInverted,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_icons__WEBPACK_IMPORTED_MODULE_3__.MoreVertical,{})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Z,{animate:!0,isOpen:isPopoverMenuOpen,onDismiss:handleDismiss,children:menuItems.map((({label,separator,...props})=>{const MenuItem=props.href?_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Z:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.Z;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.HY,{children:["top"===separator&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__.Z,{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MenuItem,{...props,children:label}),"bottom"===separator&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_12__.Z,{})]},label)}))})]})}MenuContainer.propTypes={verticalAlign:prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOf(["center","flex-start","flex-end"])},StoryMenu.displayName="StoryMenu"},"./packages/dashboard/src/components/storyMenu/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/storyMenu/index.js"),_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Container=styled_components__WEBPACK_IMPORTED_MODULE_5__.ZP.div.withConfig({displayName:"stories__Container",componentId:"sc-gen2yp-0"})(["margin:200px 0 0 50px;width:300px;display:flex;justify-content:space-between;border:1px solid gray;&:hover ",",&:active ","{opacity:1;}"],___WEBPACK_IMPORTED_MODULE_2__.qO,___WEBPACK_IMPORTED_MODULE_2__.qO),__WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Components/StoryMenu",component:___WEBPACK_IMPORTED_MODULE_2__.ZP},_default={render:function Render(){const[contextMenuId,setContextMenuId]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.eJ)(-1);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(Container,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p",{children:"Hover over me to see menu button"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(___WEBPACK_IMPORTED_MODULE_2__.ZP,{onMoreButtonSelected:setContextMenuId,contextMenuId,onMenuItemSelected:()=>{setContextMenuId(-1)},menuItems:_constants__WEBPACK_IMPORTED_MODULE_3__.LW,story:{id:1,status:"publish",title:"Sample Story"}})]})}}},"./packages/design-system/src/components/contextMenu/components/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_typography_link__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_contextMenuProvider__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/contextMenu/contextMenuProvider/useContextMenu.ts"),_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/styles.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const StyledLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP)(_typography_link__WEBPACK_IMPORTED_MODULE_4__.r).withConfig({displayName:"link__StyledLink",componentId:"sc-7h28r8-0"})(["",";background-color:transparent;text-decoration:none;:active,:hover,:focus,:active *,:hover *,:focus *{color:"," !important;}:hover{background-color:",";}:active{background-color:",";}"],_styles__WEBPACK_IMPORTED_MODULE_5__.z,(({theme})=>theme.colors.fg.primary),(({theme})=>theme.colors.interactiveBg.secondaryHover),(({theme})=>theme.colors.interactiveBg.secondaryPress));function Link({id,onBlur,onClick,onFocus,openNewTab,...props}){const{focusedId,onDismiss,onMenuItemBlur,onMenuItemFocus}=(0,_contextMenuProvider__WEBPACK_IMPORTED_MODULE_6__.Z)((({state,actions})=>({focusedId:state.focusedId,onDismiss:actions.onDismiss,onMenuItemBlur:actions.onMenuItemBlur,onMenuItemFocus:actions.onMenuItemFocus}))),autoGeneratedId=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Ye)(uuid__WEBPACK_IMPORTED_MODULE_7__.Z,[]),elementId=id||autoGeneratedId,newTabProps=openNewTab?{target:"_blank",rel:"noreferrer"}:{};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StyledLink,{id:elementId,tabIndex:focusedId===elementId?0:-1,role:"menuitem",onBlur:evt=>{onMenuItemBlur(),onBlur?.(evt)},onClick:evt=>{onClick?.(evt),onDismiss(evt.nativeEvent)},onFocus:evt=>{onMenuItemFocus(elementId),onFocus?.(evt)},...newTabProps,...props})}Link.displayName="Link";const __WEBPACK_DEFAULT_EXPORT__=Link},"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Lc:()=>getNodeFromRefOrNode,U2:()=>prettifyShortcut,k$:()=>createShortcutAriaLabel,qs:()=>createKeyHandler,vx:()=>isPlatformMacOS,x0:()=>getOrCreateMousetrap,zO:()=>resolveKeySpec});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_1__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_1___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).map((key=>keyDict[key]||key)).flat(),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1},callback){return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget({tagName,isContentEditable,type,...rest}){if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget({tagName,type}){if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/components/typography/link/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{r:()=>Link});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts"),_icons__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/icons/launch.svg"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const StyledLaunch=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP)(_icons__WEBPACK_IMPORTED_MODULE_4__.Z).withConfig({displayName:"link__StyledLaunch",componentId:"sc-qlyh5o-0"})(["width:12px;margin-left:0.5ch;margin-bottom:2px;stroke-width:0;vertical-align:text-bottom;"]),StyledAnchor=styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP.a.withConfig({displayName:"link__StyledAnchor",componentId:"sc-qlyh5o-1"})(["",";"],(({size,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.iv)(["",";",";color:",";text-decoration:none;cursor:pointer;vertical-align:baseline;:hover{color:",";}:focus{color:"," !important;}",""],_styles__WEBPACK_IMPORTED_MODULE_5__.y,_theme__WEBPACK_IMPORTED_MODULE_6__._({preset:theme.typography.presets.link[size],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.fg.linkNormal,_theme__WEBPACK_IMPORTED_MODULE_7__.L(theme.colors.border.focus))));function ConditionalSpanWrapper({isWrapped,children}){return isWrapped?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span",{children}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children})}const Link=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Gp)((function Link({children,size=_theme__WEBPACK_IMPORTED_MODULE_8__.TextSize.Medium,...props},ref){const isExternalLink="_blank"===props.target;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StyledAnchor,{ref,size,...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(ConditionalSpanWrapper,{isWrapped:isExternalLink,children:[children,isExternalLink&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(StyledLaunch,{})]})})}))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{y:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>expandTextPreset,_:()=>expandPresetStyles});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.TextSize),theme})},"./packages/design-system/src/utils/noop.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>noop});const noop=()=>{}},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);