(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5474],{"./packages/design-system/src/icons/launch.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,_path2,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgLaunch=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 24 24","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),_path2||(_path2=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgLaunch)},"./packages/dashboard/src/components/storyMenu/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{AY:()=>MoreVerticalButton,Ay:()=>StoryMenu});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_7__=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/i18n/src/i18n.ts")),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/contextMenu/contextMenu.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/link.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/separator.tsx"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/icons/index.ts");const CONTEXT_MENU_BUTTON_CLASS="context-menu-button",MoreVerticalButton=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.button.withConfig({displayName:"storyMenu__MoreVerticalButton",componentId:"sc-1vaaobv-0"})(["display:flex;background:transparent;padding:0 8px;opacity:",";transition:opacity ease-in-out 300ms;cursor:pointer;color:",";& > svg{width:4px;max-height:100%;}border:0;border-radius:",";",";"],(({menuOpen,isVisible})=>menuOpen||isVisible?1:0),(({theme,$isInverted})=>$isInverted?theme.colors.inverted.fg.primary:theme.colors.interactiveFg.brandNormal),(({theme})=>theme.borders.radius.small),(({theme,$isInverted})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.Q(!1,!!$isInverted&&theme.colors.standard.black)));MoreVerticalButton.propTypes={menuOpen:prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool};const MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"storyMenu__MenuContainer",componentId:"sc-1vaaobv-1"})(["position:relative;align-self:",";text-align:right;"," & > div{margin:0;}"],(({verticalAlign="flex-start"})=>verticalAlign),(({$menuStyleOverrides})=>$menuStyleOverrides));function StoryMenu({contextMenuId,onMoreButtonSelected,storyId,verticalAlign,menuItems,itemActive,tabIndex,menuStyleOverrides,menuLabel,isInverted}){const isPopoverMenuOpen=contextMenuId===storyId,handleDismiss=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.hb)((evt=>onMoreButtonSelected(evt,-1)),[onMoreButtonSelected]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(MenuContainer,{verticalAlign,"data-testid":`story-context-menu-${storyId}`,$menuStyleOverrides:menuStyleOverrides},react__WEBPACK_IMPORTED_MODULE_0__.createElement(MoreVerticalButton,{"data-testid":`story-context-button-${storyId}`,tabIndex,menuOpen:isPopoverMenuOpen,isVisible:itemActive,"aria-label":menuLabel||(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("More Options","web-stories"),onClick:evt=>onMoreButtonSelected(evt,isPopoverMenuOpen?-1:storyId),className:CONTEXT_MENU_BUTTON_CLASS,$isInverted:isInverted},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons__WEBPACK_IMPORTED_MODULE_3__.MoreVertical,null)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.A,{animate:!0,isOpen:isPopoverMenuOpen,onDismiss:handleDismiss},menuItems.map((({label,separator,...props})=>{const MenuItem=props.href?_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.A:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.A;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.FK,{key:label},"top"===separator&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MenuItem,props,label),"bottom"===separator&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A,null))}))))}MenuContainer.propTypes={verticalAlign:prop_types__WEBPACK_IMPORTED_MODULE_6___default().oneOf(["center","flex-start","flex-end"])}},"./packages/dashboard/src/components/storyMenu/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/storyMenu/index.js"),_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/constants/index.ts");const Container=styled_components__WEBPACK_IMPORTED_MODULE_4__.Ay.div.withConfig({displayName:"stories__Container",componentId:"sc-gen2yp-0"})(["margin:200px 0 0 50px;width:300px;display:flex;justify-content:space-between;border:1px solid gray;&:hover ",",&:active ","{opacity:1;}"],___WEBPACK_IMPORTED_MODULE_2__.AY,___WEBPACK_IMPORTED_MODULE_2__.AY),__WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Components/StoryMenu",component:___WEBPACK_IMPORTED_MODULE_2__.Ay},_default={render:function Render(){const[contextMenuId,setContextMenuId]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.J0)(-1);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"Hover over me to see menu button"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.Ay,{onMoreButtonSelected:setContextMenuId,contextMenuId,onMenuItemSelected:()=>{setContextMenuId(-1)},menuItems:_constants__WEBPACK_IMPORTED_MODULE_3__.TU,story:{id:1,status:"publish",title:"Sample Story"}}))}}},"./packages/design-system/src/components/contextMenu/components/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_typography_link__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_contextMenuProvider__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/contextMenu/contextMenuProvider/useContextMenu.ts"),_styles__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/contextMenu/components/styles.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const StyledLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_typography_link__WEBPACK_IMPORTED_MODULE_3__.N).withConfig({displayName:"link__StyledLink",componentId:"sc-7h28r8-0"})(["",";background-color:transparent;text-decoration:none;:active,:hover,:focus,:active *,:hover *,:focus *{color:"," !important;}:hover{background-color:",";}:active{background-color:",";}"],_styles__WEBPACK_IMPORTED_MODULE_4__.L,(({theme})=>theme.colors.fg.primary),(({theme})=>theme.colors.interactiveBg.secondaryHover),(({theme})=>theme.colors.interactiveBg.secondaryPress));const __WEBPACK_DEFAULT_EXPORT__=function Link({id,onBlur,onClick,onFocus,openNewTab,...props}){const{focusedId,onDismiss,onMenuItemBlur,onMenuItemFocus}=(0,_contextMenuProvider__WEBPACK_IMPORTED_MODULE_5__.A)((({state,actions})=>({focusedId:state.focusedId,onDismiss:actions.onDismiss,onMenuItemBlur:actions.onMenuItemBlur,onMenuItemFocus:actions.onMenuItemFocus}))),autoGeneratedId=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Kr)(uuid__WEBPACK_IMPORTED_MODULE_6__.A,[]),elementId=id||autoGeneratedId,newTabProps=openNewTab?{target:"_blank",rel:"noreferrer"}:{};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledLink,_extends({id:elementId,tabIndex:focusedId===elementId?0:-1,role:"menuitem",onBlur:evt=>{onMenuItemBlur(),onBlur?.(evt)},onClick:evt=>{onClick?.(evt),onDismiss(evt.nativeEvent)},onFocus:evt=>{onMenuItemFocus(elementId),onFocus?.(evt)}},newTabProps,props))}},"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Eh:()=>createKeyHandler,KV:()=>prettifyShortcut,RS:()=>getNodeFromRefOrNode,Zg:()=>resolveKeySpec,_M:()=>createShortcutAriaLabel,fi:()=>isPlatformMacOS,iJ:()=>getOrCreateMousetrap});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.flat-map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_3__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_3___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).flatMap((key=>keyDict[key]||key)),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1},callback){return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget({tagName,isContentEditable,type,...rest}){if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget({tagName,type}){if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/components/typography/link/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{N:()=>Link});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_styles__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/icons/launch.svg");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const StyledLaunch=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_3__.A).withConfig({displayName:"link__StyledLaunch",componentId:"sc-qlyh5o-0"})(["width:12px;margin-left:0.5ch;margin-bottom:2px;stroke-width:0;vertical-align:text-bottom;"]),StyledAnchor=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.a.withConfig({displayName:"link__StyledAnchor",componentId:"sc-qlyh5o-1"})(["",";"],(({size,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["",";",";color:",";text-decoration:none;cursor:pointer;vertical-align:baseline;:hover{color:",";}:focus{color:"," !important;}",""],_styles__WEBPACK_IMPORTED_MODULE_4__.u,_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.link[size],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.fg.linkNormal,_theme__WEBPACK_IMPORTED_MODULE_6__.Q(theme.colors.border.focus))));function ConditionalSpanWrapper({isWrapped,children}){return isWrapped?react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,children):react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,children)}const Link=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function Link({children,size=_theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium,...props},ref){const isExternalLink="_blank"===props.target;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledAnchor,_extends({ref,size},props),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ConditionalSpanWrapper,{isWrapped:isExternalLink},children,isExternalLink&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledLaunch,null)))}))},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{u:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/utils/noop.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{l:()=>noop});const noop=()=>{}},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./node_modules/prop-types/factoryWithThrowingShims.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var ReactPropTypesSecret=__webpack_require__("./node_modules/prop-types/lib/ReactPropTypesSecret.js");function emptyFunction(){}function emptyFunctionWithReset(){}emptyFunctionWithReset.resetWarningCache=emptyFunction,module.exports=function(){function shim(props,propName,componentName,location,propFullName,secret){if(secret!==ReactPropTypesSecret){var err=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw err.name="Invariant Violation",err}}function getShim(){return shim}shim.isRequired=shim;var ReactPropTypes={array:shim,bigint:shim,bool:shim,func:shim,number:shim,object:shim,string:shim,symbol:shim,any:shim,arrayOf:getShim,element:shim,elementType:shim,instanceOf:getShim,node:shim,objectOf:getShim,oneOf:getShim,oneOfType:getShim,shape:getShim,exact:getShim,checkPropTypes:emptyFunctionWithReset,resetWarningCache:emptyFunction};return ReactPropTypes.PropTypes=ReactPropTypes,ReactPropTypes}},"./node_modules/prop-types/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/prop-types/factoryWithThrowingShims.js")()},"./node_modules/prop-types/lib/ReactPropTypesSecret.js":module=>{"use strict";module.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var getRandomValues,rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&!(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return(byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]).toLowerCase()}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();var rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(var i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);