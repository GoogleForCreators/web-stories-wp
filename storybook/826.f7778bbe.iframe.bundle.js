"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[826],{"./packages/design-system/src/icons/checkmark.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCheckmark=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M23.847 10.14a.5.5 0 0 1 .013.707l-10.625 11a.5.5 0 0 1-.72 0L8.14 17.318a.5.5 0 0 1 .72-.695l4.015 4.157L23.14 10.153a.5.5 0 0 1 .707-.013",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCheckmark)},"./packages/design-system/src/icons/cross.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgCross=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9.854 9.146a.5.5 0 1 0-.708.708L15.293 16l-6.147 6.146a.5.5 0 0 0 .708.708L16 16.707l6.146 6.147a.5.5 0 0 0 .708-.708L16.707 16l6.147-6.146a.5.5 0 0 0-.708-.708L16 15.293z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgCross)},"./packages/design-system/src/icons/magnifier.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgMagnifier=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M9 14.636a5.636 5.636 0 1 1 11.272 0 5.636 5.636 0 0 1-11.272 0m9.961 5.033a6.636 6.636 0 1 1 .707-.707l4.184 4.184a.5.5 0 1 1-.707.707z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgMagnifier)},"./packages/design-system/src/components/datalist/datalist.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>datalist});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.find.js"),__webpack_require__("./packages/react/src/index.ts")),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),outline=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),useForwardedRef=__webpack_require__("./packages/design-system/src/utils/useForwardedRef.ts"),select_select=__webpack_require__("./packages/design-system/src/components/dropDown/select/select.tsx"),popup=__webpack_require__("./packages/design-system/src/components/popup/popup.tsx"),v4=__webpack_require__("./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),expandPresetStyles=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),magnifier=__webpack_require__("./packages/design-system/src/icons/magnifier.svg"),cross=__webpack_require__("./packages/design-system/src/icons/cross.svg"),button_button=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SearchContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"searchInput__SearchContainer",componentId:"sc-1jy0xcc-0"})(["position:relative;width:100%;"]),inputIconStyles=(0,styled_components_browser_esm.AH)(["position:absolute;display:flex;justify-content:center;align-items:center;top:50%;width:30px;padding:0;margin:0;transform:translateY(-50%);background-color:transparent;border:none;> svg{height:100%;width:auto;color:",";fill:",";}"],(({theme})=>theme.colors.fg.primary),(({theme})=>theme.colors.fg.primary)),SearchIconContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"searchInput__SearchIconContainer",componentId:"sc-1jy0xcc-1"})([""," left:0;height:28px;"],inputIconStyles),ClearButton=(0,styled_components_browser_esm.Ay)(button_button.$).attrs({variant:constants.Ak.Icon}).withConfig({displayName:"searchInput__ClearButton",componentId:"sc-1jy0xcc-2"})(["",";right:0;height:20.5px;opacity:0.4;"],inputIconStyles),Input=styled_components_browser_esm.Ay.input.attrs({type:"search",role:"combobox","aria-autocomplete":"list"}).withConfig({displayName:"searchInput__Input",componentId:"sc-1jy0xcc-3"})(["width:100%;padding:6px 20px 6px 30px;border-radius:",";background:",";border:1px solid ",";color:",";"," &::-ms-clear{display:none;}&:placeholder-shown{text-overflow:ellipsis;}&::-webkit-input-placeholder{text-overflow:ellipsis;}&::-moz-placeholder{text-overflow:ellipsis;}&::-webkit-search-decoration,&::-webkit-search-cancel-button,&::-webkit-search-results-button,&::-webkit-search-results-decoration{appearance:none;}&:focus{border-color:",";}"],(({theme})=>theme.borders.radius.small),(({theme})=>theme.colors.bg.primary),(({theme})=>theme.colors.border.defaultActive),(({theme})=>theme.colors.fg.primary),expandPresetStyles.x((({paragraph},{Small})=>paragraph[Small])),(({theme})=>theme.colors.border.focus)),searchInput=(0,src.Rf)((function SearchInput({isExpanded,onClose,value,onChange,focusFontListFirstOption=noop.l,placeholder=(0,i18n.__)("Search","web-stories"),...rest},ref){const handleKeyPress=(0,src.hb)((evt=>{evt.stopPropagation();const{key}=evt;"Escape"===key?onClose():"ArrowDown"===key&&focusFontListFirstOption()}),[onClose,focusFontListFirstOption]);return react.createElement(SearchContainer,null,react.createElement(Input,_extends({ref,"aria-expanded":isExpanded,value,onKeyDown:handleKeyPress,placeholder,size:Math.min(placeholder.length,35),onChange:evt=>onChange(evt.target.value),"aria-label":(0,i18n.__)("Search","web-stories")},rest)),react.createElement(SearchIconContainer,null,react.createElement(magnifier.A,null)),value.trim().length>0&&react.createElement(ClearButton,{onClick:()=>onChange("")},react.createElement(cross.A,null)))}));__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.flat-map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.reduce.js");const createOptionFilter=options=>keyword=>options.filter((({name})=>name.toLowerCase().includes(keyword.toLowerCase()))),isKeywordFilterable=keyword=>keyword.trim().length>=2,Container=styled_components_browser_esm.Ay.div.withConfig({displayName:"container__Container",componentId:"sc-1g4yn9j-0"})(["position:relative;display:flex;flex-direction:row;flex-wrap:wrap;width:100%;min-width:120px;z-index:2;background-color:",";border-radius:",";padding:5px;margin-top:16px;"," "," ",";"],(({theme})=>theme.colors.bg.primary),(({theme})=>theme.borders.radius.small),(({isInline})=>isInline&&(0,styled_components_browser_esm.AH)(["position:absolute;margin-top:0;padding:0;min-width:initial;width:initial;"])),(({theme,hasDropDownBorder})=>hasDropDownBorder&&(0,styled_components_browser_esm.AH)(["border:1px solid ",";"],theme.colors.border.defaultNormal)),(({$containerStyleOverrides})=>$containerStyleOverrides));const container=(0,src.Rf)((function OptionsContainerWithRef({onClose,isOpen,getOptionsByQuery,hasSearch,renderContents,isInline,hasDropDownBorder=!1,containerStyleOverrides,title,placeholder},inputRef){const ref=(0,src.li)(null),[searchKeyword,setSearchKeyword]=(0,src.J0)(""),[queriedOptions,setQueriedOptions]=(0,src.J0)(null),[isExpanded,setIsExpanded]=(0,src.J0)(!0),[trigger,setTrigger]=(0,src.J0)(0);(0,src.g$)(ref,onClose,[onClose]);const debounceHandleLoadOptions=(0,src.YQ)((()=>{getOptionsByQuery?.(searchKeyword)?.then(setQueriedOptions)}),500);(0,src.vJ)((()=>{getOptionsByQuery&&isKeywordFilterable(searchKeyword)?debounceHandleLoadOptions():setQueriedOptions(null)}),[getOptionsByQuery,searchKeyword,debounceHandleLoadOptions]),(0,src.vJ)((()=>{isOpen&&inputRef&&"current"in inputRef&&inputRef.current&&inputRef.current.focus()}),[isOpen,inputRef]);const listId=(0,src.Kr)((()=>`list-${(0,v4.A)()}`),[]);return react.createElement(Container,{role:"dialog",title,ref,isInline,hasDropDownBorder,$containerStyleOverrides:containerStyleOverrides},hasSearch&&react.createElement(searchInput,{ref:inputRef,value:searchKeyword,onChange:setSearchKeyword,onClose,isExpanded,focusFontListFirstOption:()=>setTrigger((v=>v+1)),"aria-owns":listId,placeholder}),renderContents({searchKeyword,setIsExpanded,trigger,queriedOptions,listId}))}));__webpack_require__("./node_modules/core-js/modules/esnext.iterator.for-each.js");var types=__webpack_require__("./packages/design-system/src/theme/types.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),styled=__webpack_require__("./packages/design-system/src/components/datalist/list/styled.ts");function defaultRenderer_extends(){return defaultRenderer_extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},defaultRenderer_extends.apply(null,arguments)}const defaultRenderer=(0,src.Rf)((function DefaultRendererWithRef({option,value,...rest},ref){return react.createElement(styled.ph,defaultRenderer_extends({key:option.id},rest,{ref}),value===option.id&&react.createElement(styled.cp,{"aria-label":(0,i18n.__)("Selected","web-stories")}),react.createElement(styled.kh,null,option.name))})),StyledLabel=(0,styled_components_browser_esm.Ay)(typography_text.E.Span).attrs({size:types.$.XSmall}).withConfig({displayName:"list__StyledLabel",componentId:"sc-1d6dyqc-0"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary));const list_list=(0,src.ph)((0,src.Rf)((function OptionListWithRef({keyword="",value="",onSelect=noop.l,onClose=noop.l,onExpandedChange=noop.l,focusTrigger=0,options=[],primaryOptions,primaryLabel,priorityOptionGroups=[],searchResultsLabel,renderer:OptionRenderer=defaultRenderer,onObserve,focusSearch=noop.l,listId,listStyleOverrides,noMatchesFoundLabel=(0,i18n.__)("No matches found","web-stories")},forwardedListRef){const listRef=(0,useForwardedRef.A)(forwardedListRef),optionsRef=(0,src.li)([]),[focusIndex,setFocusIndex]=(0,src.J0)(-1),userSeenOptions=(0,src.li)([]),filteredListGroups=(0,src.Kr)((()=>isKeywordFilterable(keyword)&&options?[{label:searchResultsLabel,options:createOptionFilter(options)(keyword)}]:[...priorityOptionGroups?.length?priorityOptionGroups:[],{label:primaryLabel,options:primaryOptions}]),[keyword,options,priorityOptionGroups,primaryOptions,primaryLabel,searchResultsLabel]),currentListRef=listRef.current,observer=(0,src.Kr)((()=>currentListRef?new window.IntersectionObserver((entries=>{if(onObserve){const newlySeenOptions=entries.filter((entry=>entry.isIntersecting)).map((entry=>entry.target)).filter((t=>t instanceof HTMLElement)).map((target=>target.dataset.option)).filter((o=>Boolean(o)));userSeenOptions.current=((array,...keys)=>[...new Set(array.concat(keys))])(userSeenOptions.current,...newlySeenOptions),onObserve(userSeenOptions.current)}}),{root:currentListRef,rootMargin:"60px"}):null),[onObserve,currentListRef]);(0,src.Nf)((()=>{const renderedOptions=optionsRef.current;return onObserve&&renderedOptions.forEach((option=>option&&observer?.observe(option))),()=>{onObserve&&renderedOptions.forEach((option=>option&&observer?.unobserve(option))),optionsRef.current=[]}}),[observer,onObserve,filteredListGroups,OptionRenderer]);const filteredOptions=(0,src.Kr)((()=>filteredListGroups.flatMap((({options})=>options))),[filteredListGroups]),handleKeyPress=(0,src.hb)((evt=>{const{key}=evt;evt.stopPropagation(),evt.preventDefault(),"Tab"===key&&evt.shiftKey&&focusSearch(),"Escape"===key?onClose():"Enter"===key?filteredOptions[focusIndex]&&onSelect(filteredOptions[focusIndex]):"ArrowUp"===key?setFocusIndex((index=>Math.max(0,index-1))):"ArrowDown"===key&&setFocusIndex((index=>Math.min(filteredOptions.length-1,index+1)))}),[focusIndex,filteredOptions,onClose,onSelect,focusSearch]);(0,src.g$)(listRef,(()=>setFocusIndex(-1)),[]),(0,src.vJ)((()=>{const listEl=listRef.current;if(!listEl)return;if(-1===focusIndex)return void listEl.scrollTo(0,0);const highlightedOptionEl=optionsRef.current[focusIndex];highlightedOptionEl&&(highlightedOptionEl.focus(),listEl.scrollTo(0,highlightedOptionEl.offsetTop-listEl.clientHeight/2))}),[focusIndex,filteredOptions,keyword,onClose,listRef]);const isExpanded=filteredOptions.length>0;return(0,src.vJ)((()=>onExpandedChange(isExpanded)),[onExpandedChange,isExpanded]),(0,src.vJ)((()=>{focusTrigger>0&&setFocusIndex(0)}),[focusTrigger]),filteredOptions.length<=0?react.createElement(styled.IE,null,noMatchesFoundLabel):react.createElement(styled.B8,{ref:listRef,tabIndex:0,id:listId,role:"listbox",onKeyDown:handleKeyPress,"aria-label":(0,i18n.__)("Option List Selector","web-stories"),"aria-required":!1,$listStyleOverrides:listStyleOverrides},filteredListGroups.map(((group,i)=>{const groupLabelId=`group-${(0,v4.A)()}`;return group.options.length>0&&react.createElement(styled._e,{key:groupLabelId,role:"group","aria-labelledby":groupLabelId},group.label&&react.createElement(styled.WL,{id:groupLabelId,role:"presentation"},react.createElement(StyledLabel,null,group.label)),group.options.map(((option,j)=>{const optionInset=((groups,i,j)=>groups.slice(0,i).map((group=>group.options.length)).reduce(((a,b)=>a+b),0)+j)(filteredListGroups,i,j);return react.createElement(OptionRenderer,{key:option.id||"",role:"option",tabIndex:-1,"aria-selected":value===option.id,"aria-posinset":optionInset+1,"aria-setsize":filteredOptions.length,"data-option":option.id,onClick:()=>onSelect(option),ref:el=>optionsRef.current[optionInset]=el,option,value})})))})))})));function datalist_extends(){return datalist_extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},datalist_extends.apply(null,arguments)}const focusStyle=(0,styled_components_browser_esm.AH)(["",";"],(({theme})=>outline.Q(theme.colors.border.focus,theme.colors.bg.secondary))),datalist_Container=styled_components_browser_esm.Ay.div.withConfig({displayName:"datalist__Container",componentId:"sc-jbfg0f-0"})(["display:flex;flex-direction:column;flex-grow:1;"]),datalist=(0,src.Rf)((function Datalist({onChange,disabled=!1,selectedId,options,hasSearch=!1,getOptionsByQuery,onObserve,primaryOptions,primaryLabel,priorityOptionGroups,searchResultsLabel,renderer,activeItemRenderer,isInline=!1,dropDownLabel="",highlightStylesOverride,hasDropDownBorder=!1,zIndex,listStyleOverrides,containerStyleOverrides,title,dropdownButtonLabel,className,offsetOverride=!1,noMatchesFoundLabel,searchPlaceholder,maxWidth,getPrimaryOptions,...rest},forwardedRef){const ref=(0,useForwardedRef.A)(forwardedRef),searchRef=(0,src.li)(null),listRef=(0,src.li)(null);if(!options&&!getOptionsByQuery)throw new Error("Dropdown initiated with invalid params: options or getOptionsByQuery has to be set");hasSearch||(primaryOptions=options);const[isOpen,setIsOpen]=(0,src.J0)(!1),[_primaryOptions,_setPrimaryOptions]=(0,src.J0)([]),closeDropDown=(0,src.hb)((()=>{setIsOpen(!1),ref.current?.focus()}),[ref]),toggleDropDown=(0,src.hb)((()=>setIsOpen((val=>!val))),[]),debouncedCloseDropDown=(0,src.YQ)(closeDropDown,100),handleSelect=(0,src.hb)((option=>{onChange(option),setIsOpen(!1),ref.current?.focus()}),[onChange,ref]),focusSearch=(0,src.hb)((()=>{searchRef.current?.focus()}),[]),list=react.createElement(container,{ref:searchRef,isOpen,onClose:debouncedCloseDropDown,getOptionsByQuery,hasSearch,isInline,title,hasDropDownBorder,containerStyleOverrides,placeholder:searchPlaceholder,renderContents:({searchKeyword,setIsExpanded,trigger,queriedOptions,listId})=>react.createElement(list_list,{ref:listRef,listId,value:selectedId,keyword:searchKeyword,onSelect:handleSelect,onClose:debouncedCloseDropDown,onExpandedChange:setIsExpanded,focusTrigger:trigger,onObserve,options:options||queriedOptions,primaryOptions:_primaryOptions,primaryLabel,priorityOptionGroups,searchResultsLabel,focusSearch,renderer,listStyleOverrides,noMatchesFoundLabel})});(0,src.vJ)((()=>{getPrimaryOptions?getPrimaryOptions().then((res=>{_setPrimaryOptions(res)})):primaryOptions&&_setPrimaryOptions(primaryOptions)}),[_setPrimaryOptions,getOptionsByQuery,getPrimaryOptions,primaryOptions]);const selectedOption=_primaryOptions.find((({id})=>id===selectedId));return react.createElement(datalist_Container,{className},react.createElement(select_select.A,datalist_extends({"aria-pressed":isOpen,"aria-haspopup":!0,"aria-expanded":isOpen,ref,activeItemLabel:selectedOption?.name,activeItemRenderer,dropDownLabel,onSelectClick:toggleDropDown,selectButtonStylesOverride:highlightStylesOverride||focusStyle,"aria-label":dropdownButtonLabel,isOpen,disabled},rest)),isOpen&&!disabled&&isInline&&list,!disabled&&!isInline&&react.createElement(popup.A,{anchor:ref,isOpen,zIndex,offsetOverride,maxWidth:maxWidth||240,fillWidth:!0},list))}))},"./packages/design-system/src/components/datalist/list/styled.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B8:()=>List,IE:()=>NoResult,WL:()=>GroupLabel,_e:()=>GroupList,cp:()=>Selected,kh:()=>OverflowEllipses,ph:()=>ListElement});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/icons/checkmark.svg"),_typography__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts");const List=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.div.withConfig({displayName:"styled__List",componentId:"sc-12ll0ao-0"})(["width:100%;overflow-x:visible;overflow-y:auto;overscroll-behavior:none auto;max-height:305px;padding:4px;margin:10px 0 0 0;font-size:14px;text-align:left;list-style:none;border-radius:",";"," ",""],(({theme})=>theme.borders.radius.small),_theme__WEBPACK_IMPORTED_MODULE_1__.Q,(({$listStyleOverrides})=>$listStyleOverrides)),GroupList=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.ul.withConfig({displayName:"styled__GroupList",componentId:"sc-12ll0ao-1"})(["margin:0;padding:0;"]),GroupLabel=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.withConfig({displayName:"styled__GroupLabel",componentId:"sc-12ll0ao-2"})(["background:transparent;padding:8px;margin:0;"]),ListElement=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.li.attrs((({fontFamily})=>({style:{fontFamily}}))).withConfig({displayName:"styled__ListElement",componentId:"sc-12ll0ao-3"})(["display:flex;align-items:center;position:relative;padding:6px 16px;margin:6px 0 0 0;cursor:pointer;background-clip:padding-box;color:",";border-radius:",";"," "," line-height:16px;:first-of-type{margin-top:0;}:hover{background-color:",";}:focus{outline:none;}"],(({theme})=>theme.colors.fg.primary),(({theme})=>theme.borders.radius.small),_theme__WEBPACK_IMPORTED_MODULE_2__.x((({label},{Small})=>label[Small])),_theme__WEBPACK_IMPORTED_MODULE_1__.Q,(({theme})=>theme.colors.interactiveBg.tertiaryHover)),Selected=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_3__.A).withConfig({displayName:"styled__Selected",componentId:"sc-12ll0ao-4"})(["width:16px;min-width:16px;height:auto;margin-right:4px;color:",";"],(({theme})=>theme.colors.fg.primary)),NoResult=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay)(_typography__WEBPACK_IMPORTED_MODULE_4__.E.Paragraph).attrs((()=>({size:_theme__WEBPACK_IMPORTED_MODULE_5__.$.XSmall}))).withConfig({displayName:"styled__NoResult",componentId:"sc-12ll0ao-5"})(["width:100%;padding:13px 11px;margin:0;text-align:center;color:",";"],(({theme})=>theme.colors.fg.secondary)),OverflowEllipses=styled_components__WEBPACK_IMPORTED_MODULE_0__.Ay.span.withConfig({displayName:"styled__OverflowEllipses",componentId:"sc-12ll0ao-6"})(["white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"])},"./packages/i18n/src/translateWithMarkup.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>translateWithMarkup});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts"));function transform(node,mapping={}){const result=[];do{result.push(transformNode(node,mapping)),node=node.nextSibling}while(null!==node);return result}function transformNode(node,mapping={}){const{childNodes,nodeType,textContent}=node;if(Node.TEXT_NODE===nodeType)return textContent;const children=node.hasChildNodes()?Array.from(childNodes).map((child=>transform(child,mapping))):null,{localName}=node;return localName in mapping?(0,src.Ob)(mapping[localName],{},children):(0,src.n)(localName,null,children)}const VOID_ELEMENTS=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];const translateWithMarkup=function TranslateWithMarkup({mapping={},children}){mapping=Object.fromEntries(Object.entries(mapping).map((([k,v])=>[k.toLowerCase(),v])));const foundVoidElements=Object.keys(mapping).filter((tag=>VOID_ELEMENTS.includes(tag))).join(" ");if(foundVoidElements.length>0)throw new Error(`Found disallowed void elements in TranslateWithMarkup map: ${foundVoidElements}`);const node=(new DOMParser).parseFromString(children,"text/html").body.firstChild;return node?react.createElement(src.FK,null,transform(node,mapping).map(((element,index)=>react.createElement(src.FK,{key:index},element)))):null}}}]);