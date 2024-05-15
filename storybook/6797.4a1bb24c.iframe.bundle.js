"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6797],{"./packages/design-system/src/icons/checkmark_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const SvgCheckmarkSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M19.853 13.145a.5.5 0 0 1 .003.707l-4.959 5.004a.5.5 0 0 1-.71 0l-2.042-2.06a.5.5 0 0 1 .71-.705l1.687 1.702 4.603-4.645a.5.5 0 0 1 .708-.003",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCheckmarkSmall)},"./packages/design-system/src/components/menu/list/components.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Jg:()=>ListItemLabelDisplayText,PC:()=>NoOptionsContainer,ck:()=>ListItem,fq:()=>ListItemDisplayText,lL:()=>NoOptionsMessage,u6:()=>ListItemLabel,yq:()=>ListGroup});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_typography__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const ListGroup=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.ul.withConfig({displayName:"list__ListGroup",componentId:"sc-1qrqs02-0"})(["list-style-type:none;margin:6px 0;display:block;padding-inline-start:0;margin-block-start:0;margin-block-end:0;width:100%;"]),ListItemLabel=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.withConfig({displayName:"list__ListItemLabel",componentId:"sc-1qrqs02-1"})(["display:flex;padding:6px 2px 6px 8px;margin:4px 8px;align-items:center;"]),ListItem=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.withConfig({displayName:"list__ListItem",componentId:"sc-1qrqs02-2"})(["position:relative;display:grid;grid-template-columns:32px 1fr;padding:6px 8px;margin:4px 8px;align-items:center;",""],(({disabled,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["border-radius:",";cursor:",";",";&:hover{background-color:",";}"," svg{color:",";}& > span{grid-column-start:2;}"],theme.borders.radius.small,disabled?"default":"pointer",_theme__WEBPACK_IMPORTED_MODULE_1__.Q(theme.colors.border.focus),theme.colors.bg.tertiary,disabled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["pointer-events:none;span{color:",";}"],theme.colors.fg.secondary),theme.colors.fg.primary))),ListItemDisplayText=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Span).withConfig({displayName:"list__ListItemDisplayText",componentId:"sc-1qrqs02-3"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["color:",";"],theme.colors.fg.primary))),ListItemLabelDisplayText=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Span).withConfig({displayName:"list__ListItemLabelDisplayText",componentId:"sc-1qrqs02-4"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["color:",";"],theme.colors.form.dropDownSubtitle))),NoOptionsContainer=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.div.withConfig({displayName:"list__NoOptionsContainer",componentId:"sc-1qrqs02-5"})(["display:flex;align-items:center;justify-items:center;width:100%;"]),NoOptionsMessage=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Paragraph).withConfig({displayName:"list__NoOptionsMessage",componentId:"sc-1qrqs02-6"})(["padding:6px 16px;margin:4px auto;color:",";"],(({theme})=>theme.colors.fg.secondary))},"./packages/design-system/src/components/menu/menu.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>menu});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),scrollbar=__webpack_require__("./packages/design-system/src/theme/helpers/scrollbar.ts");const KEYS_SHIFT_FOCUS=["up","down","left","right"],KEYS_CLOSE_MENU=["esc","tab"],KEYS_SELECT_ITEM=["space","enter"],MenuContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"menu__MenuContainer",componentId:"sc-1he0ofy-0"})((({dropDownHeight=208,styleOverride="",theme,isAbsolute})=>(0,styled_components_browser_esm.AH)(["position:relative;display:flex;flex-direction:row;flex-wrap:wrap;width:calc(100% - 2px);max-height:","px;overflow-x:visible;overflow-y:auto;overscroll-behavior:none auto;z-index:2;margin-top:16px;margin-bottom:8px;padding:4px 0;background-color:",";border-radius:",";border:1px solid ",";",";",";",";"],dropDownHeight,theme.colors.bg.primary,theme.borders.radius.small,theme.colors.divider.primary,isAbsolute&&(0,styled_components_browser_esm.AH)(["position:absolute;top:0;left:0;right:0;"]),styleOverride,scrollbar.W)));__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.flat-map.js");function isNullOrUndefinedOrEmptyString(val){return null==val||""===val}var keyboard=__webpack_require__("./packages/design-system/src/components/keyboard/keyboard.tsx");var types=__webpack_require__("./packages/design-system/src/theme/types.ts"),components=__webpack_require__("./packages/design-system/src/components/menu/list/components.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const EmptyList=({emptyText})=>emptyText?(0,jsx_runtime.jsx)(components.PC,{children:(0,jsx_runtime.jsx)(components.lL,{size:types.$.XSmall,children:emptyText})}):null;EmptyList.displayName="EmptyList";const emptyList=EmptyList;__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var utils=__webpack_require__("./packages/design-system/src/components/menu/utils.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),checkmark_small=__webpack_require__("./packages/design-system/src/icons/checkmark_small.svg");const ActiveIcon=(0,styled_components_browser_esm.Ay)(checkmark_small.A).withConfig({displayName:"defaultListItem__ActiveIcon",componentId:"sc-1ws89z1-0"})(["position:absolute;left:4px;top:50%;transform:translateY(-50%);"]),defaultListItem=(0,src.Rf)((function DefaultListItem({option,isSelected,...rest},ref){return(0,jsx_runtime.jsxs)(components.ck,{...rest,ref,disabled:option.disabled,"aria-disabled":option.disabled,children:[isSelected&&(0,jsx_runtime.jsx)(ActiveIcon,{"data-testid":"dropdownMenuItem_active_icon","aria-label":(0,i18n.__)("Selected","web-stories"),width:32,height:32}),(0,jsx_runtime.jsx)(components.fq,{size:types.$.Small,children:option.label})]})}));function GroupLabel({label}){return label?(0,jsx_runtime.jsx)(components.u6,{id:`dropDownMenuLabel-${label}`,role:"presentation",children:(0,jsx_runtime.jsx)(components.Jg,{size:types.$.XSmall,children:label})}):null}GroupLabel.displayName="GroupLabel";const groupLabel=GroupLabel,List=({isManyGroups,label,listId,children,role="group"})=>{const groupAria=isManyGroups?{"aria-label":label}:{"aria-labelledby":listId};return(0,jsx_runtime.jsxs)(components.yq,{role,...groupAria,children:[label&&(0,jsx_runtime.jsx)(groupLabel,{label}),children]})};List.displayName="List";const list=List;const listGroup=function ListGroup({groups,activeValue,listLength,listId,hasMenuRole,handleMenuItemSelect,renderItem,optionsRef}){const ListItem=renderItem||defaultListItem,isManyGroups=groups.length>1;return(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:groups.map((({label,options},groupIndex)=>(0,jsx_runtime.jsx)(list,{isManyGroups,label,listId,role:hasMenuRole?"menu":"listbox",children:options.map(((groupOption,optionIndex)=>{const isSelected=groupOption.value===activeValue,optionInset=(0,utils.q)(groups,groupIndex,optionIndex);return(0,jsx_runtime.jsx)(ListItem,{"aria-posinset":optionInset+1,"aria-selected":isSelected,"aria-setsize":listLength,id:`dropDownMenuItem-${String(groupOption.value)}`,isSelected,onClick:evt=>!groupOption.disabled&&handleMenuItemSelect(evt.nativeEvent,groupOption.value),option:groupOption,role:hasMenuRole?"menuitem":"option",ref:el=>{el&&optionsRef?.current&&(optionsRef.current[optionInset]=el)},tabIndex:0},String(groupOption.value))}))},label||`menuGroup_${groupIndex}`)))})};function Menu({dropDownHeight,emptyText,menuStylesOverride,hasMenuRole,handleReturnToParent,isMenuFocused=!0,isRTL,groups=[],listId,handleMenuItemSelect,onDismissMenu,renderItem,activeValue,menuAriaLabel,parentId,isAbsolute=!1}){const listRef=(0,src.li)(null),optionsRef=(0,src.li)([]),{focusedIndex,listLength}=function useDropDownMenu({activeValue,handleMenuItemSelect,handleReturnToParent,isRTL,groups=[],listRef,onDismissMenu}){const allOptions=(0,src.Kr)((()=>groups.flatMap((({options})=>options))),[groups]),listLength=allOptions.length,[focusedValue,setFocusedValue]=(0,src.J0)(activeValue),getFocusedIndex=(0,src.hb)((()=>allOptions.findIndex((option=>String(option?.value)===String(focusedValue)))),[allOptions,focusedValue]);(0,src.vJ)((()=>{isNullOrUndefinedOrEmptyString(focusedValue)||-1===getFocusedIndex()&&setFocusedValue(null)}),[focusedValue,getFocusedIndex]);const focusedIndex=(0,src.Kr)((()=>isNullOrUndefinedOrEmptyString(focusedValue)?0:getFocusedIndex()),[focusedValue,getFocusedIndex]),handleMoveFocus=(0,src.hb)((offset=>setFocusedValue(allOptions[focusedIndex+offset].value)),[allOptions,focusedIndex]),handleFocusChange=(0,src.hb)((({key})=>{const isForward=["ArrowUp",isRTL?"ArrowRight":"ArrowLeft"].includes(key),isBackward=["ArrowDown",isRTL?"ArrowLeft":"ArrowRight"].includes(key);isForward?0===focusedIndex?handleReturnToParent?.():handleMoveFocus(-1):isBackward&&focusedIndex<listLength-1&&handleMoveFocus(1)}),[focusedIndex,handleMoveFocus,handleReturnToParent,isRTL,listLength]),handleMenuItemEnter=(0,src.hb)((event=>{const isDisabledItem=allOptions[focusedIndex]?.disabled;if(isDisabledItem)return()=>{};const selectedValue=focusedValue||allOptions[focusedIndex].value;return handleMenuItemSelect(event,selectedValue)}),[allOptions,focusedIndex,focusedValue,handleMenuItemSelect]);return(0,keyboard._h)(listRef,{key:KEYS_SELECT_ITEM,shift:!0},handleMenuItemEnter,[handleMenuItemEnter]),(0,keyboard._h)(listRef,{key:KEYS_CLOSE_MENU},(event=>onDismissMenu?.(event)),[onDismissMenu]),(0,keyboard._h)(listRef,{key:KEYS_SHIFT_FOCUS},handleFocusChange,[handleFocusChange]),(0,src.g$)(listRef,(event=>onDismissMenu?.(event)),[]),(0,src.Kr)((()=>({focusedValue,focusedIndex,listLength})),[focusedIndex,focusedValue,listLength])}({activeValue,handleMenuItemSelect,isRTL,groups,listRef,onDismissMenu,handleReturnToParent});return(0,src.vJ)((()=>{const listEl=listRef?.current;if(!listEl||null===focusedIndex||!isMenuFocused)return;if(-1===focusedIndex)return void listEl.scrollTo(0,0);const highlightedOptionEl=optionsRef.current[focusedIndex];highlightedOptionEl&&(highlightedOptionEl.focus(),listEl.scrollTo?.(0,highlightedOptionEl.offsetTop-listEl.clientHeight/2))}),[focusedIndex,isMenuFocused]),(0,jsx_runtime.jsx)(MenuContainer,{id:listId,dropDownHeight,styleOverride:menuStylesOverride,ref:listRef,"aria-label":menuAriaLabel,"aria-labelledby":parentId,"aria-expanded":"true",isAbsolute,children:0===groups.length?(0,jsx_runtime.jsx)(emptyList,{emptyText}):(0,jsx_runtime.jsx)(listGroup,{groups,activeValue,listId,listLength,hasMenuRole,handleMenuItemSelect,renderItem,optionsRef})})}Menu.displayName="Menu";const menu=Menu},"./packages/design-system/src/components/menu/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>getGroups,q:()=>getInset});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.reduce.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.some.js");function isValid(opt){return"object"==typeof opt&&void 0!==opt.value}function getGroups(source){if(0===source.length)return[];if(source.some((opt=>"object"==typeof opt&&"options"in opt))){return source.map((group=>({...group,options:(group.options||[]).filter(isValid)}))).filter((({options})=>options.length>0))}const options=source.filter(isValid);return options.length?[{options}]:[]}function getInset(groups,i,j){return groups.slice(0,i).map((({options})=>options.length)).reduce(((a,b)=>a+b),0)+j}}}]);