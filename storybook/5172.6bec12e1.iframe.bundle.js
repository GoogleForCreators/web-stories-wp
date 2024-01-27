"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5172],{"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Lc:()=>getNodeFromRefOrNode,U2:()=>prettifyShortcut,k$:()=>createShortcutAriaLabel,qs:()=>createKeyHandler,vx:()=>isPlatformMacOS,x0:()=>getOrCreateMousetrap,zO:()=>resolveKeySpec});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_1__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_1___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).map((key=>keyDict[key]||key)).flat(),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1},callback){return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget({tagName,isContentEditable,type,...rest}){if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget({tagName,type}){if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/components/popup/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ng:()=>RTL_PLACEMENT,kZ:()=>PopupContainer,ug:()=>Placement});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");let Placement=function(Placement){return Placement.Top="top",Placement.TopStart="top-start",Placement.TopEnd="top-end",Placement.Bottom="bottom",Placement.BottomStart="bottom-start",Placement.BottomEnd="bottom-end",Placement.Right="right",Placement.RightStart="right-start",Placement.RightEnd="right-end",Placement.Left="left",Placement.LeftStart="left-start",Placement.LeftEnd="left-end",Placement}({});const RTL_PLACEMENT={[Placement.Top]:Placement.Top,[Placement.TopStart]:Placement.TopStart,[Placement.TopEnd]:Placement.TopEnd,[Placement.Bottom]:Placement.Bottom,[Placement.BottomEnd]:Placement.BottomEnd,[Placement.BottomStart]:Placement.BottomStart,[Placement.Right]:Placement.Left,[Placement.RightStart]:Placement.LeftStart,[Placement.RightEnd]:Placement.LeftEnd,[Placement.Left]:Placement.Right,[Placement.LeftStart]:Placement.RightStart,[Placement.LeftEnd]:Placement.RightEnd},PopupContainer=styled_components__WEBPACK_IMPORTED_MODULE_0__.ZP.div.withConfig({displayName:"constants__PopupContainer",componentId:"sc-1f3rwe8-0"})(["/*! @noflip */ "," /*! @noflip */ left:0px;top:0px;position:fixed;",";max-height:",";"],(({$offset:{x,y,width},fillWidth,transforms="",zIndex,maxWidth})=>{const widthProp={};return fillWidth&&(maxWidth?widthProp.minWidth=`${width}px`:widthProp.width=`${width}px`),maxWidth&&!widthProp.width&&(widthProp.maxWidth=`${maxWidth}px`),{transform:`translate(${x}px, ${y}px) ${transforms}`,...widthProp,zIndex}}),(({noOverFlow})=>noOverFlow?"":"overflow-y: auto;"),(({topOffset=0})=>`calc(100vh - ${topOffset}px)`))},"./packages/design-system/src/components/popup/utils/getOffset.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{os:()=>getOffset,tp:()=>EMPTY_OFFSET});var _constants__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),_getTransforms__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/components/popup/utils/getTransforms.ts");const EMPTY_OFFSET={x:0,y:0,width:0,height:0,bodyRight:0};function getOffset({placement,spacing,anchor,dock,popup,isRTL,ignoreMaxOffsetY,offsetOverride,topOffset=0}){if(!anchor.current)return EMPTY_OFFSET;const anchorRect=anchor.current.getBoundingClientRect(),bodyRect=document.body.getBoundingClientRect(),popupRect=popup.current?.getBoundingClientRect(),dockRect=dock?.current?.getBoundingClientRect();popupRect&&(popupRect.height=Math.max(popupRect.height,popup.current?.scrollHeight||0),popupRect.width=Math.max(popupRect.width,popup.current?.scrollWidth||0));const{height=0,width=0}=popupRect||{},{x:spacingH=0,y:spacingV=0}=spacing||{},offsetX=function getXOffset(placement,spacing=0,anchorRect,dockRect,isRTL){const leftAligned=(dockRect?dockRect.left:anchorRect.left)-spacing,rightAligned=(dockRect?dockRect.right:anchorRect.right)+spacing,centerAligned=dockRect?dockRect.left+dockRect.width/2:anchorRect.left+anchorRect.width/2;switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Left:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.LeftStart:return isRTL?rightAligned:leftAligned;case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.TopEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Right:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.RightEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.RightStart:return isRTL?leftAligned:rightAligned;case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Bottom:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Top:return centerAligned;default:return 0}}(placement,spacingH,anchorRect,dockRect,isRTL),maxOffsetX=isRTL?bodyRect.width-(0,_getTransforms__WEBPACK_IMPORTED_MODULE_1__.iV)(placement,isRTL)*width:bodyRect.width-width-(0,_getTransforms__WEBPACK_IMPORTED_MODULE_1__.iV)(placement,isRTL)*width,offsetY=function getYOffset(placement,spacing=0,anchorRect){switch(placement){case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Bottom:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.BottomStart:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.BottomEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.LeftEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.RightEnd:return anchorRect.top+anchorRect.height+spacing;case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Top:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.TopStart:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.TopEnd:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.LeftStart:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.RightStart:return anchorRect.top-spacing;case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Right:case _constants__WEBPACK_IMPORTED_MODULE_0__.ug.Left:return anchorRect.top+anchorRect.height/2;default:return 0}}(placement,spacingV,anchorRect),maxOffsetY=bodyRect.height+bodyRect.y-height-(0,_getTransforms__WEBPACK_IMPORTED_MODULE_1__.K$)(placement)*height,offset={width:anchorRect.width,height:anchorRect.height,bodyRight:bodyRect?.right};return offsetOverride?{x:offsetX,y:offsetY,...offset}:{x:Math.max(0,Math.min(offsetX,maxOffsetX)),y:ignoreMaxOffsetY?offsetY:Math.max(topOffset,Math.min(offsetY,maxOffsetY)),...offset}}},"./packages/design-system/src/components/popup/utils/getTransforms.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K$:()=>getYTransforms,fg:()=>getTransforms,iV:()=>getXTransforms});var _constants__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/components/popup/constants.ts");function getXTransforms(placement,isRTL){return placement.startsWith("left")?isRTL?0:-1:placement.startsWith("right")||placement.endsWith("-start")?isRTL?-1:0:placement.endsWith("-end")?isRTL?0:-1:-.5}function getYTransforms(placement){return placement.startsWith("top")||placement===_constants__WEBPACK_IMPORTED_MODULE_0__.ug.RightEnd||placement===_constants__WEBPACK_IMPORTED_MODULE_0__.ug.LeftEnd?-1:placement===_constants__WEBPACK_IMPORTED_MODULE_0__.ug.Right||placement===_constants__WEBPACK_IMPORTED_MODULE_0__.ug.Left?-.5:0}function getTransforms(placement,isRTL){const xTransforms=getXTransforms(placement,isRTL),yTransforms=getYTransforms(placement);if(!xTransforms&&!yTransforms)return"";return`translate(${100*(xTransforms||0)}%, ${100*(yTransforms||0)}%)`}},"./packages/design-system/src/components/typography/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{y:()=>defaultTypographyStyle});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const defaultTypographyStyle=({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";color:",";margin:0;padding:0;&:focus{box-shadow:none;}"],theme.typography.family.primary,theme.colors.fg.primary)},"./packages/design-system/src/components/typography/text/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{x:()=>Text});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const textCss=({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.paragraph[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.paragraph[size].weight),Paragraph=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.p.withConfig({displayName:"text__Paragraph",componentId:"sc-1kd0vh8-0"})(["",";"],textCss),Span=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.span.withConfig({displayName:"text__Span",componentId:"sc-1kd0vh8-1"})(["",";"],textCss),Kbd=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.kbd.withConfig({displayName:"text__Kbd",componentId:"sc-1kd0vh8-2"})(["",";background-color:transparent;white-space:nowrap;"],textCss),Text={Label:styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.label.withConfig({displayName:"text__Label",componentId:"sc-1kd0vh8-3"})(["",";color:",";"],(({isBold=!1,size=_theme__WEBPACK_IMPORTED_MODULE_0__.TextSize.Medium,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["",";",";font-weight:",";"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.label[size],theme}),isBold?theme.typography.weight.bold:theme.typography.presets.label[size].weight)),(({disabled,theme})=>disabled?theme.colors.fg.disable:"auto")),Span,Kbd,Paragraph}},"./packages/design-system/src/contexts/popup/context.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=(0,__webpack_require__("./packages/react/src/index.ts").kr)({isRTL:!1,leftOffset:0,topOffset:0})},"./packages/design-system/src/contexts/popup/usePopup.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts"),_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/contexts/popup/context.ts");const __WEBPACK_DEFAULT_EXPORT__=function usePopup(selector=_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.yR){return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.Sz)(_context__WEBPACK_IMPORTED_MODULE_1__.Z,selector)}},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>expandTextPreset,_:()=>expandPresetStyles});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.TextSize),theme})},"./packages/design-system/src/utils/noop.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>noop});const noop=()=>{}}}]);