"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[2169],{"./packages/design-system/src/components/menu/list/components.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Jg:()=>ListItemLabelDisplayText,PC:()=>NoOptionsContainer,ck:()=>ListItem,fq:()=>ListItemDisplayText,lL:()=>NoOptionsMessage,u6:()=>ListItemLabel,yq:()=>ListGroup});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_typography__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const ListGroup=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.ul.withConfig({displayName:"list__ListGroup",componentId:"sc-1qrqs02-0"})(["list-style-type:none;margin:6px 0;display:block;padding-inline-start:0;margin-block-start:0;margin-block-end:0;width:100%;"]),ListItemLabel=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.withConfig({displayName:"list__ListItemLabel",componentId:"sc-1qrqs02-1"})(["display:flex;padding:6px 2px 6px 8px;margin:4px 8px;align-items:center;"]),ListItem=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.withConfig({displayName:"list__ListItem",componentId:"sc-1qrqs02-2"})(["position:relative;display:grid;grid-template-columns:32px 1fr;padding:6px 8px;margin:4px 8px;align-items:center;",""],(({disabled,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["border-radius:",";cursor:",";",";&:hover{background-color:",";}"," svg{color:",";}& > span{grid-column-start:2;}"],theme.borders.radius.small,disabled?"default":"pointer",_theme__WEBPACK_IMPORTED_MODULE_1__.Q(theme.colors.border.focus),theme.colors.bg.tertiary,disabled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["pointer-events:none;span{color:",";}"],theme.colors.fg.secondary),theme.colors.fg.primary))),ListItemDisplayText=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Span).withConfig({displayName:"list__ListItemDisplayText",componentId:"sc-1qrqs02-3"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["color:",";"],theme.colors.fg.primary))),ListItemLabelDisplayText=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Span).withConfig({displayName:"list__ListItemLabelDisplayText",componentId:"sc-1qrqs02-4"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["color:",";"],theme.colors.form.dropDownSubtitle))),NoOptionsContainer=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.div.withConfig({displayName:"list__NoOptionsContainer",componentId:"sc-1qrqs02-5"})(["display:flex;align-items:center;justify-items:center;width:100%;"]),NoOptionsMessage=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_2__.E.Paragraph).withConfig({displayName:"list__NoOptionsMessage",componentId:"sc-1qrqs02-6"})(["padding:6px 16px;margin:4px auto;color:",";"],(({theme})=>theme.colors.fg.secondary))},"./packages/design-system/src/components/menu/menu.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>menu});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),src=__webpack_require__("./packages/react/src/index.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),scrollbar=__webpack_require__("./packages/design-system/src/theme/helpers/scrollbar.ts");const KEYS_SHIFT_FOCUS=["up","down","left","right"],KEYS_CLOSE_MENU=["esc","tab"],KEYS_SELECT_ITEM=["space","enter"],MenuContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"menu__MenuContainer",componentId:"sc-1he0ofy-0"})((({dropDownHeight=208,styleOverride="",theme,isAbsolute})=>(0,styled_components_browser_esm.AH)(["position:relative;display:flex;flex-direction:row;flex-wrap:wrap;width:calc(100% - 2px);max-height:","px;overflow-x:visible;overflow-y:auto;overscroll-behavior:none auto;z-index:2;margin-top:16px;margin-bottom:8px;padding:4px 0;background-color:",";border-radius:",";border:1px solid ",";",";",";",";"],dropDownHeight,theme.colors.bg.primary,theme.borders.radius.small,theme.colors.divider.primary,isAbsolute&&(0,styled_components_browser_esm.AH)(["position:absolute;top:0;left:0;right:0;"]),styleOverride,scrollbar.W)));function isNullOrUndefinedOrEmptyString(val){return null==val||""===val}var keyboard=__webpack_require__("./packages/design-system/src/components/keyboard/keyboard.tsx");function _temp2(){}function _temp(t0){const{options}=t0;return options}var types=__webpack_require__("./packages/design-system/src/theme/types.ts"),components=__webpack_require__("./packages/design-system/src/components/menu/list/components.ts");const emptyList=t0=>{const $=(0,dist.c)(2),{emptyText}=t0;if(!emptyText)return null;let t1;return $[0]!==emptyText?(t1=react.createElement(components.PC,null,react.createElement(components.lL,{size:types.$.XSmall},emptyText)),$[0]=emptyText,$[1]=t1):t1=$[1],t1};var utils=__webpack_require__("./packages/design-system/src/components/menu/utils.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),checkmark_small=__webpack_require__("./packages/design-system/src/icons/checkmark_small.svg");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const ActiveIcon=(0,styled_components_browser_esm.Ay)(checkmark_small.A).withConfig({displayName:"defaultListItem__ActiveIcon",componentId:"sc-1ws89z1-0"})(["position:absolute;left:4px;top:50%;transform:translateY(-50%);"]),defaultListItem=(0,src.Rf)((function DefaultListItem(t0,ref){const $=(0,dist.c)(14);let isSelected,option,rest,t1,t2,t3;return $[0]!==t0?(({option,isSelected,...rest}=t0),$[0]=t0,$[1]=isSelected,$[2]=option,$[3]=rest):(isSelected=$[1],option=$[2],rest=$[3]),$[4]!==isSelected?(t1=isSelected&&react.createElement(ActiveIcon,{"data-testid":"dropdownMenuItem_active_icon","aria-label":(0,i18n.__)("Selected","web-stories"),width:32,height:32}),$[4]=isSelected,$[5]=t1):t1=$[5],$[6]!==option.label?(t2=react.createElement(components.fq,{size:types.$.Small},option.label),$[6]=option.label,$[7]=t2):t2=$[7],$[8]!==option.disabled||$[9]!==ref||$[10]!==rest||$[11]!==t1||$[12]!==t2?(t3=react.createElement(components.ck,_extends({},rest,{ref,disabled:option.disabled,"aria-disabled":option.disabled}),t1,t2),$[8]=option.disabled,$[9]=ref,$[10]=rest,$[11]=t1,$[12]=t2,$[13]=t3):t3=$[13],t3}));const groupLabel=function GroupLabel(t0){const $=(0,dist.c)(5),{label}=t0;if(!label)return null;const t1=`dropDownMenuLabel-${label}`;let t2,t3;return $[0]!==label?(t2=react.createElement(components.Jg,{size:types.$.XSmall},label),$[0]=label,$[1]=t2):t2=$[1],$[2]!==t1||$[3]!==t2?(t3=react.createElement(components.u6,{id:t1,role:"presentation"},t2),$[2]=t1,$[3]=t2,$[4]=t3):t3=$[4],t3};function list_extends(){return list_extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},list_extends.apply(null,arguments)}const list=t0=>{const $=(0,dist.c)(11),{isManyGroups,label,listId,children,role:t1}=t0,role=void 0===t1?"group":t1;let t2;$[0]!==isManyGroups||$[1]!==label||$[2]!==listId?(t2=isManyGroups?{"aria-label":label}:{"aria-labelledby":listId},$[0]=isManyGroups,$[1]=label,$[2]=listId,$[3]=t2):t2=$[3];const groupAria=t2;let t3,t4;return $[4]!==label?(t3=label&&react.createElement(groupLabel,{label}),$[4]=label,$[5]=t3):t3=$[5],$[6]!==children||$[7]!==groupAria||$[8]!==role||$[9]!==t3?(t4=react.createElement(components.yq,list_extends({role},groupAria),t3,children),$[6]=children,$[7]=groupAria,$[8]=role,$[9]=t3,$[10]=t4):t4=$[10],t4};const listGroup=function ListGroup({groups,activeValue,listLength,listId,hasMenuRole,handleMenuItemSelect,renderItem,optionsRef}){const ListItem=renderItem||defaultListItem,isManyGroups=groups.length>1;return react.createElement(react.Fragment,null,groups.map((({label,options},groupIndex)=>react.createElement(list,{key:label||`menuGroup_${groupIndex}`,isManyGroups,label,listId,role:hasMenuRole?"menu":"listbox"},options.map(((groupOption,optionIndex)=>{const isSelected=groupOption.value===activeValue,optionInset=(0,utils.q)(groups,groupIndex,optionIndex);return react.createElement(ListItem,{key:String(groupOption.value),"aria-posinset":optionInset+1,"aria-selected":isSelected,"aria-setsize":listLength,id:`dropDownMenuItem-${String(groupOption.value)}`,isSelected,onClick:evt=>!groupOption.disabled&&handleMenuItemSelect(evt.nativeEvent,groupOption.value),option:groupOption,role:hasMenuRole?"menuitem":"option",ref:el=>{el&&optionsRef?.current&&(optionsRef.current[optionInset]=el)},tabIndex:0})}))))))};const menu=function Menu(t0){const $=(0,dist.c)(38),{dropDownHeight,emptyText,menuStylesOverride,hasMenuRole,handleReturnToParent,isMenuFocused:t1,isRTL,groups:t2,listId,handleMenuItemSelect,onDismissMenu,renderItem,activeValue,menuAriaLabel,parentId,isAbsolute:t3}=t0,isMenuFocused=void 0===t1||t1;let t4;$[0]!==t2?(t4=void 0===t2?[]:t2,$[0]=t2,$[1]=t4):t4=$[1];const groups=t4,isAbsolute=void 0!==t3&&t3,listRef=(0,src.li)(null);let t5;$[2]===Symbol.for("react.memo_cache_sentinel")?(t5=[],$[2]=t5):t5=$[2];const optionsRef=(0,src.li)(t5);let t6;$[3]!==activeValue||$[4]!==groups||$[5]!==handleMenuItemSelect||$[6]!==handleReturnToParent||$[7]!==isRTL||$[8]!==listRef||$[9]!==onDismissMenu?(t6={activeValue,handleMenuItemSelect,isRTL,groups,listRef,onDismissMenu,handleReturnToParent},$[3]=activeValue,$[4]=groups,$[5]=handleMenuItemSelect,$[6]=handleReturnToParent,$[7]=isRTL,$[8]=listRef,$[9]=onDismissMenu,$[10]=t6):t6=$[10];const{focusedIndex,listLength}=function useDropDownMenu(t0){const $=(0,dist.c)(58),{activeValue,handleMenuItemSelect,handleReturnToParent,isRTL,groups:t1,listRef,onDismissMenu}=t0;let t2;$[0]!==t1?(t2=void 0===t1?[]:t1,$[0]=t1,$[1]=t2):t2=$[1];const groups=t2;let t3,t4;$[2]!==groups?(t3=()=>groups.flatMap(_temp),t4=[groups],$[2]=groups,$[3]=t3,$[4]=t4):(t3=$[3],t4=$[4]);const allOptions=(0,src.Kr)(t3,t4),listLength=allOptions.length,[focusedValue,setFocusedValue]=(0,src.J0)(activeValue);let t5,t6;$[5]!==allOptions||$[6]!==focusedValue?(t5=()=>allOptions.findIndex((option=>String(option?.value)===String(focusedValue))),t6=[allOptions,focusedValue],$[5]=allOptions,$[6]=focusedValue,$[7]=t5,$[8]=t6):(t5=$[7],t6=$[8]);const getFocusedIndex=(0,src.hb)(t5,t6);let t7,t8,t10,t9;$[9]!==focusedValue||$[10]!==getFocusedIndex||$[11]!==setFocusedValue?(t7=()=>{isNullOrUndefinedOrEmptyString(focusedValue)||-1===getFocusedIndex()&&setFocusedValue(null)},$[9]=focusedValue,$[10]=getFocusedIndex,$[11]=setFocusedValue,$[12]=t7):t7=$[12],$[13]!==focusedValue||$[14]!==getFocusedIndex?(t8=[focusedValue,getFocusedIndex],$[13]=focusedValue,$[14]=getFocusedIndex,$[15]=t8):t8=$[15],(0,src.vJ)(t7,t8),$[16]!==focusedValue||$[17]!==getFocusedIndex?(t9=()=>isNullOrUndefinedOrEmptyString(focusedValue)?0:getFocusedIndex(),t10=[focusedValue,getFocusedIndex],$[16]=focusedValue,$[17]=getFocusedIndex,$[18]=t10,$[19]=t9):(t10=$[18],t9=$[19]);const focusedIndex=(0,src.Kr)(t9,t10);let t11,t12;$[20]!==allOptions||$[21]!==focusedIndex||$[22]!==setFocusedValue?(t11=offset=>setFocusedValue(allOptions[focusedIndex+offset].value),$[20]=allOptions,$[21]=focusedIndex,$[22]=setFocusedValue,$[23]=t11):t11=$[23],$[24]!==allOptions||$[25]!==focusedIndex?(t12=[allOptions,focusedIndex],$[24]=allOptions,$[25]=focusedIndex,$[26]=t12):t12=$[26];const handleMoveFocus=(0,src.hb)(t11,t12);let t13,t14;$[27]!==focusedIndex||$[28]!==handleMoveFocus||$[29]!==handleReturnToParent||$[30]!==isRTL||$[31]!==listLength?(t13=t15=>{const{key}=t15,isForward=["ArrowUp",isRTL?"ArrowRight":"ArrowLeft"].includes(key),isBackward=["ArrowDown",isRTL?"ArrowLeft":"ArrowRight"].includes(key);isForward?0===focusedIndex?handleReturnToParent?.():handleMoveFocus(-1):isBackward&&focusedIndex<listLength-1&&handleMoveFocus(1)},t14=[focusedIndex,handleMoveFocus,handleReturnToParent,isRTL,listLength],$[27]=focusedIndex,$[28]=handleMoveFocus,$[29]=handleReturnToParent,$[30]=isRTL,$[31]=listLength,$[32]=t13,$[33]=t14):(t13=$[32],t14=$[33]);const handleFocusChange=(0,src.hb)(t13,t14);let t15,t16;$[34]!==allOptions||$[35]!==focusedIndex||$[36]!==focusedValue||$[37]!==handleMenuItemSelect?(t15=event=>{const isDisabledItem=allOptions[focusedIndex]?.disabled;if(isDisabledItem)return _temp2;const selectedValue=focusedValue||allOptions[focusedIndex].value;return handleMenuItemSelect(event,selectedValue)},t16=[allOptions,focusedIndex,focusedValue,handleMenuItemSelect],$[34]=allOptions,$[35]=focusedIndex,$[36]=focusedValue,$[37]=handleMenuItemSelect,$[38]=t15,$[39]=t16):(t15=$[38],t16=$[39]);const handleMenuItemEnter=(0,src.hb)(t15,t16);let t17,t18,t19,t20,t21,t22,t23,t24,t25,t26,t27;return $[40]===Symbol.for("react.memo_cache_sentinel")?(t17={key:KEYS_SELECT_ITEM,shift:!0},$[40]=t17):t17=$[40],$[41]!==handleMenuItemEnter?(t18=[handleMenuItemEnter],$[41]=handleMenuItemEnter,$[42]=t18):t18=$[42],(0,keyboard._h)(listRef,t17,handleMenuItemEnter,t18),$[43]===Symbol.for("react.memo_cache_sentinel")?(t19={key:KEYS_CLOSE_MENU},$[43]=t19):t19=$[43],$[44]!==onDismissMenu?(t20=event_0=>onDismissMenu?.(event_0),t21=[onDismissMenu],$[44]=onDismissMenu,$[45]=t20,$[46]=t21):(t20=$[45],t21=$[46]),(0,keyboard._h)(listRef,t19,t20,t21),$[47]===Symbol.for("react.memo_cache_sentinel")?(t22={key:KEYS_SHIFT_FOCUS},$[47]=t22):t22=$[47],$[48]!==handleFocusChange?(t23=[handleFocusChange],$[48]=handleFocusChange,$[49]=t23):t23=$[49],(0,keyboard._h)(listRef,t22,handleFocusChange,t23),$[50]!==onDismissMenu?(t24=event_1=>onDismissMenu?.(event_1),$[50]=onDismissMenu,$[51]=t24):t24=$[51],$[52]===Symbol.for("react.memo_cache_sentinel")?(t25=[],$[52]=t25):t25=$[52],(0,src.g$)(listRef,t24,t25),$[53]!==focusedIndex||$[54]!==focusedValue||$[55]!==listLength?(t26=()=>({focusedValue,focusedIndex,listLength}),t27=[focusedIndex,focusedValue,listLength],$[53]=focusedIndex,$[54]=focusedValue,$[55]=listLength,$[56]=t26,$[57]=t27):(t26=$[56],t27=$[57]),(0,src.Kr)(t26,t27)}(t6);let t7,t8,t9,t10;return $[11]!==focusedIndex||$[12]!==isMenuFocused||$[13]!==listRef?.current||$[14]!==optionsRef?(t7=()=>{const listEl=listRef?.current;if(!listEl||null===focusedIndex||!isMenuFocused)return;if(-1===focusedIndex)return void listEl.scrollTo(0,0);const highlightedOptionEl=optionsRef.current[focusedIndex];highlightedOptionEl&&(highlightedOptionEl.focus(),listEl.scrollTo?.(0,highlightedOptionEl.offsetTop-listEl.clientHeight/2))},$[11]=focusedIndex,$[12]=isMenuFocused,$[13]=listRef?.current,$[14]=optionsRef,$[15]=t7):t7=$[15],$[16]!==focusedIndex||$[17]!==isMenuFocused?(t8=[focusedIndex,isMenuFocused],$[16]=focusedIndex,$[17]=isMenuFocused,$[18]=t8):t8=$[18],(0,src.vJ)(t7,t8),$[19]!==activeValue||$[20]!==emptyText||$[21]!==groups||$[22]!==handleMenuItemSelect||$[23]!==hasMenuRole||$[24]!==listId||$[25]!==listLength||$[26]!==optionsRef||$[27]!==renderItem?(t9=0===groups.length?react.createElement(emptyList,{emptyText}):react.createElement(listGroup,{groups,activeValue,listId,listLength,hasMenuRole,handleMenuItemSelect,renderItem,optionsRef}),$[19]=activeValue,$[20]=emptyText,$[21]=groups,$[22]=handleMenuItemSelect,$[23]=hasMenuRole,$[24]=listId,$[25]=listLength,$[26]=optionsRef,$[27]=renderItem,$[28]=t9):t9=$[28],$[29]!==dropDownHeight||$[30]!==isAbsolute||$[31]!==listId||$[32]!==listRef||$[33]!==menuAriaLabel||$[34]!==menuStylesOverride||$[35]!==parentId||$[36]!==t9?(t10=react.createElement(MenuContainer,{id:listId,dropDownHeight,styleOverride:menuStylesOverride,ref:listRef,"aria-label":menuAriaLabel,"aria-labelledby":parentId,"aria-expanded":"true",isAbsolute},t9),$[29]=dropDownHeight,$[30]=isAbsolute,$[31]=listId,$[32]=listRef,$[33]=menuAriaLabel,$[34]=menuStylesOverride,$[35]=parentId,$[36]=t9,$[37]=t10):t10=$[37],t10}},"./packages/design-system/src/components/menu/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isValid(opt){return"object"==typeof opt&&void 0!==opt.value}function getGroups(source){if(0===source.length)return[];if(source.some((opt=>"object"==typeof opt&&"options"in opt))){return source.map((group=>({...group,options:(group.options||[]).filter(isValid)}))).filter((({options})=>options.length>0))}const options=source.filter(isValid);return options.length?[{options}]:[]}function getInset(groups,i,j){return groups.slice(0,i).map((({options})=>options.length)).reduce(((a,b)=>a+b),0)+j}__webpack_require__.d(__webpack_exports__,{f:()=>getGroups,q:()=>getInset})},"./packages/design-system/src/icons/checkmark_small.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCheckmarkSmall=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M19.853 13.145a.5.5 0 0 1 .003.707l-4.959 5.004a.5.5 0 0 1-.71 0l-2.042-2.06a.5.5 0 0 1 .71-.705l1.687 1.702 4.603-4.645a.5.5 0 0 1 .708-.003",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCheckmarkSmall)}}]);