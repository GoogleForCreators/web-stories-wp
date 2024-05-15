"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9684],{"./packages/dashboard/src/components/cardGallery/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>cardGallery});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),useGridViewKeys=__webpack_require__("./packages/design-system/src/components/keyboard/gridview/useGridViewKeys.ts"),constants=__webpack_require__("./packages/dashboard/src/constants/index.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),button_button=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),button_constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts");const pictureCss=(0,styled_components_browser_esm.AH)(["picture{display:block;& > img{display:block;height:100%;width:100%;object-fit:fill;border-radius:",";border:",";}}"],(({theme})=>theme.borders.radius.medium),(({theme})=>`1px solid ${theme.colors.border.defaultNormal}`)),GalleryContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"cardGallery__GalleryContainer",componentId:"sc-8jnrkn-0"})(["flex:1;display:flex;justify-content:space-between;align-items:start;"]),DisplayPage=styled_components_browser_esm.Ay.div.withConfig({displayName:"cardGallery__DisplayPage",componentId:"sc-8jnrkn-1"})(["overflow:hidden;width:38.6%;margin-left:2.1%;"," @media screen and (min-width:1600px){width:45.2%;margin-left:2.4%;}"],pictureCss);DisplayPage.propTypes={$isThreeRows:prop_types_default().bool};const Thumbnails=styled_components_browser_esm.Ay.div.withConfig({displayName:"cardGallery__Thumbnails",componentId:"sc-8jnrkn-2"})(["position:relative;display:grid;width:52.3%;grid-template-columns:repeat(3,1fr);column-gap:8px;row-gap:16px;margin-right:16px;@media screen and (min-width:1600px){width:59.3%;grid-template-columns:repeat(4,1fr);}"]),ThumbnailButton=(0,styled_components_browser_esm.Ay)(button_button.$).attrs({type:button_constants.VQ.Plain}).withConfig({displayName:"cardGallery__ThumbnailButton",componentId:"sc-8jnrkn-3"})(["display:block;height:100%;padding:0;border:none;background-color:transparent;position:relative;&:active{background-color:transparent;}"," ",";"],(({$isSelected,theme})=>$isSelected&&(0,styled_components_browser_esm.AH)(["&:after{content:'';position:absolute;box-sizing:border-box;width:100%;height:100%;display:block;top:0;right:0;border-radius:",";border:4px solid ",";}"],theme.borders.radius.medium,theme.colors.interactiveBg.active)),pictureCss);ThumbnailButton.propTypes={$isSelected:prop_types_default().bool};var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function getPosterAltCopy(pageNumber){return(0,sprintf.A)((0,i18n.__)("Poster of template page %s","web-stories"),pageNumber)}function CardGallery({galleryPosters,isRTL,galleryLabel}){const[selectedGridItemIndex,setSelectedGridItemIndex]=(0,src.J0)(0),[focusedGridItemIndex,setFocusedGridItemIndex]=(0,src.J0)(),containerRef=(0,src.li)(),gridRef=(0,src.li)(),posterRefs=(0,src.li)({}),handleMiniCardClick=(0,src.hb)((index=>{setSelectedGridItemIndex(index),setFocusedGridItemIndex(index)}),[]),handleGalleryItemFocus=(0,src.hb)((index=>{setFocusedGridItemIndex(index)}),[]);(0,src.vJ)((()=>{galleryPosters&&(setSelectedGridItemIndex(0),setFocusedGridItemIndex())}),[galleryPosters]),(0,useGridViewKeys.A)({containerRef,gridRef,itemRefs:posterRefs,isRTL,currentItemId:focusedGridItemIndex,items:galleryPosters});const GalleryItems=(0,src.Kr)((()=>galleryPosters.map(((poster,index)=>{const key=`gallery_item_${index}`,pageNumber=index+1,isFocusIndex=focusedGridItemIndex?focusedGridItemIndex===index:selectedGridItemIndex===index;return(0,jsx_runtime.jsx)("div",{ref:el=>{posterRefs.current[index]=el},onFocus:()=>handleGalleryItemFocus(index),children:(0,jsx_runtime.jsx)(ThumbnailButton,{$isSelected:selectedGridItemIndex===index,tabIndex:isFocusIndex?0:-1,onClick:()=>handleMiniCardClick(index),"aria-label":selectedGridItemIndex===index?(0,sprintf.A)((0,i18n.__)("Page %s (current page)","web-stories"),pageNumber):(0,sprintf.A)((0,i18n.__)("Page %s","web-stories"),pageNumber),children:(0,jsx_runtime.jsxs)("picture",{children:[(0,jsx_runtime.jsx)("source",{srcSet:poster.webp,type:"image/webp"}),(0,jsx_runtime.jsx)("source",{srcSet:poster.png,type:"image/png"}),(0,jsx_runtime.jsx)("img",{src:poster.png,decoding:"async",alt:getPosterAltCopy(pageNumber),width:constants.qs,height:constants.PO})]})})},key)}))),[galleryPosters,selectedGridItemIndex,focusedGridItemIndex,handleGalleryItemFocus,handleMiniCardClick]);return(0,jsx_runtime.jsxs)(GalleryContainer,{ref:containerRef,children:[(0,jsx_runtime.jsx)(Thumbnails,{ref:gridRef,role:"group","aria-label":galleryLabel,"data-testid":"mini-cards-container",children:GalleryItems}),(0,jsx_runtime.jsx)(DisplayPage,{children:galleryPosters[selectedGridItemIndex]&&(0,jsx_runtime.jsxs)("picture",{children:[(0,jsx_runtime.jsx)("source",{srcSet:galleryPosters[selectedGridItemIndex].webp,type:"image/webp"}),(0,jsx_runtime.jsx)("source",{srcSet:galleryPosters[selectedGridItemIndex].png,type:"image/png"}),(0,jsx_runtime.jsx)("img",{src:galleryPosters[selectedGridItemIndex].png,decoding:"async",alt:(0,sprintf.A)((0,i18n.__)("Active Page Preview - Page %s","web-stories"),selectedGridItemIndex+1),width:constants.qs,height:constants.PO})]})})]})}CardGallery.displayName="CardGallery";const cardGallery=CardGallery},"./packages/dashboard/src/components/cardGallery/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/components/cardGallery/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const demoPosterGroup=[{id:0,webp:"https://placekitten.com/g/200/300",png:"https://placekitten.com/g/200/300"},{id:1,webp:"https://placekitten.com/g/200/300",png:"https://placekitten.com/g/200/300"},{id:2,webp:"https://placekitten.com/g/200/300",png:"https://placekitten.com/g/200/300"},{id:3,webp:"https://placekitten.com/g/200/300",png:"https://placekitten.com/g/200/300"}],__WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Components/CardGallery",component:___WEBPACK_IMPORTED_MODULE_1__.A,args:{isRTL:!1,galleryLabel:"my aria label text"},parameters:{controls:{exclude:["galleryPosters"]}}},CardGalleryContainer=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.div.withConfig({displayName:"stories__CardGalleryContainer",componentId:"sc-b1yxrn-0"})(["padding:20px;"]),_default={render:function Render(args){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(CardGalleryContainer,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_1__.A,{galleryPosters:demoPosterGroup,...args})})}}},"./packages/design-system/src/components/button/button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,x:()=>ButtonAsLink});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_theme__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/theme/constants/index.ts"),_constants__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const base=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["display:flex;align-items:center;justify-content:space-around;padding:0;margin:0;background:transparent;border:none;cursor:pointer;color:",";",";",";&:active{background-color:",";color:",";}&:disabled,&[aria-disabled='true']{pointer-events:none;background-color:",";color:",";}transition:background-color ",",color ",";"],(({theme})=>theme.colors.fg.primary),(({theme})=>_theme__WEBPACK_IMPORTED_MODULE_4__.Q(theme.colors.border.focus)),(({theme,size})=>_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:{...theme.typography.presets.label[size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_7__.$.Small:_theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium]},theme})),(({theme})=>theme.colors.interactiveBg.active),(({theme})=>theme.colors.interactiveFg.active),(({theme})=>theme.colors.interactiveBg.disable),(({theme})=>theme.colors.fg.disable),_constants__WEBPACK_IMPORTED_MODULE_6__.QB,_constants__WEBPACK_IMPORTED_MODULE_6__.QB),anchorBase=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["&:hover,&:focus{color:",";}"],(({theme})=>theme.colors.interactiveFg.active)),buttonColors={[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Primary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";color:",";&:active{background-color:",";color:",";}&:hover,&:focus{background-color:",";color:"," !important;}"],theme.colors.interactiveBg.brandNormal,theme.colors.interactiveFg.brandNormal,theme.colors.interactiveBg.active,theme.colors.interactiveFg.active,theme.colors.interactiveBg.brandHover,theme.colors.interactiveFg.brandHover),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Secondary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled{&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.secondaryNormal,theme.colors.interactiveBg.secondaryHover,theme.colors.interactiveBg.disable),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Tertiary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";&:hover,&:focus{background-color:",";}&:disabled,&[aria-disabled='true']{background-color:",";&:hover,&:focus{background-color:",";}}"],theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryHover,theme.colors.interactiveBg.tertiaryNormal,theme.colors.interactiveBg.tertiaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Quaternary]:({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["background-color:",";border:1px solid ",";&:hover{border-color:",";}&:focus{box-shadow:none;border-color:",";}&:active{border-color:",";background-color:",";}",";"," &:disabled,&[aria-disabled='true']{border-color:",";background-color:",";}"],theme.colors.interactiveBg.quaternaryNormal,theme.colors.border.defaultNormal,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryHover,theme.colors.border.quaternaryActive,theme.colors.interactiveBg.quaternaryNormal,_theme__WEBPACK_IMPORTED_MODULE_4__.Q,(({isToggled})=>isToggled&&(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-color:",";"],theme.colors.border.defaultPress)),theme.colors.border.disable,theme.colors.interactiveBg.quaternaryNormal),[_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain]:(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)([""])},rectangle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";min-width:1px;min-height:1em;border-radius:",";padding:",";"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?"8px 16px":"18px 32px")),square=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";border-radius:",";"," svg{width:","px;height:","px;}"],(({$type})=>$type&&buttonColors[$type]),(({theme})=>theme.borders.radius.small),(({size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["width:","px;height:","px;"],size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE,size===_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small?_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE:_theme__WEBPACK_IMPORTED_MODULE_8__.i.LARGE_BUTTON_SIZE)),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE),circle=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["border-radius:",";"],(({theme})=>theme.borders.radius.round)),icon=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";width:","px;height:","px;svg{width:100%;height:100%;}"],(({$type})=>$type&&buttonColors[$type]),_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE,_theme__WEBPACK_IMPORTED_MODULE_8__.i.ICON_SIZE);function getTextSize(size){switch(size){case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Small:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Small;case _constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium:default:return _theme__WEBPACK_IMPORTED_MODULE_7__.$.Medium}}const link=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",""],(({theme,size})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.AH)(["",";color:",";border-radius:0;:hover{color:",";}&:active,&:disabled,&[aria-disabled='true']{background-color:",";}"],_theme__WEBPACK_IMPORTED_MODULE_5__.s({preset:theme.typography.presets.link[getTextSize(size)],theme}),theme.colors.fg.linkNormal,theme.colors.fg.linkHover,theme.colors.opacity.footprint))),ButtonRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonRectangle",componentId:"sc-1wfpfsz-0"})([""," ",""],base,rectangle),AnchorRectangle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorRectangle",componentId:"sc-1wfpfsz-1"})([""," "," ",""],base,anchorBase,rectangle),ButtonSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonSquare",componentId:"sc-1wfpfsz-2"})([""," ",""],base,square),AnchorSquare=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorSquare",componentId:"sc-1wfpfsz-3"})([""," "," ",""],base,anchorBase,square),ButtonCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonCircle",componentId:"sc-1wfpfsz-4"})([""," "," ",""],base,square,circle),AnchorCircle=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorCircle",componentId:"sc-1wfpfsz-5"})([""," "," "," ",""],base,anchorBase,square,circle),ButtonIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonIcon",componentId:"sc-1wfpfsz-6"})([""," ",""],base,icon),AnchorIcon=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorIcon",componentId:"sc-1wfpfsz-7"})([""," "," ",""],base,anchorBase,icon),ButtonLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.button.withConfig({displayName:"button__ButtonLink",componentId:"sc-1wfpfsz-8"})([""," ",""],base,link),AnchorLink=styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay.a.withConfig({displayName:"button__AnchorLink",componentId:"sc-1wfpfsz-9"})([""," "," ",""],base,anchorBase,link),Button=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function Button({size=_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ButtonRectangle,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ButtonCircle,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ButtonSquare,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ButtonIcon,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ButtonLink,{...elementProps,children});default:return null}})),ButtonAsLink=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((function ButtonAsLink({size=_constants__WEBPACK_IMPORTED_MODULE_6__.Mp.Medium,type=_constants__WEBPACK_IMPORTED_MODULE_6__.VQ.Plain,variant=_constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle,children,...rest},ref){const elementProps={ref,size,$type:type,...rest};switch(variant){case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Rectangle:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AnchorRectangle,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Circle:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AnchorCircle,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Square:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AnchorSquare,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Icon:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AnchorIcon,{...elementProps,children});case _constants__WEBPACK_IMPORTED_MODULE_6__.Ak.Link:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AnchorLink,{...elementProps,children});default:return null}}))},"./packages/design-system/src/components/button/constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ak:()=>ButtonVariant,Mp:()=>ButtonSize,QB:()=>BUTTON_TRANSITION_TIMING,VQ:()=>ButtonType});let ButtonType=function(ButtonType){return ButtonType.Primary="primary",ButtonType.Secondary="secondary",ButtonType.Tertiary="tertiary",ButtonType.Quaternary="quaternary",ButtonType.Plain="plain",ButtonType}({}),ButtonSize=function(ButtonSize){return ButtonSize.Small="small",ButtonSize.Medium="medium",ButtonSize}({}),ButtonVariant=function(ButtonVariant){return ButtonVariant.Circle="circle",ButtonVariant.Rectangle="rectangle",ButtonVariant.Square="square",ButtonVariant.Icon="icon",ButtonVariant.Link="link",ButtonVariant}({});const BUTTON_TRANSITION_TIMING="0.3s ease 0s"},"./packages/design-system/src/components/keyboard/gridview/useGridViewKeys.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>gridview_useGridViewKeys});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts"),keyboard=__webpack_require__("./packages/design-system/src/components/keyboard/keyboard.tsx");function focusOnPage(page){const button=page?.querySelector("button, a");button&&button.focus()}function getArrowDir(key,pos,neg,isRTL){const rtlDir=isRTL?-1:1;return key===pos?rtlDir:key===neg?-1*rtlDir:0}function getGridColumnAndRowCount(grid,pageCount){let prevX,columns=0;for(const el of grid.children){const{x}=el.getBoundingClientRect();if(void 0!==prevX&&x<prevX)break;prevX=x,columns++}return{rows:Math.ceil(pageCount/columns),columns}}function getRow(index,numColumns){return Math.ceil((index+1)/numColumns)}function getColumn(index,numColumns){return index%numColumns+1}function getIndex({row,column,numRows,numColumns,numItems}){if(row>numRows||row<=0||column>numColumns||column<=0)return-1;const index=numColumns*(row-1)+(column-1);return index>=numItems?numItems-1:index}const gridview_useGridViewKeys=function useGridViewKeys({currentItemId,items,containerRef,gridRef,itemRefs,isRTL,arrangeItem}){const[focusedItemId,setFocusedItemId]=(0,src.J0)(null),itemIds=(0,src.Kr)((()=>items.map((({id})=>id))),[items]);(0,src.vJ)((()=>{setFocusedItemId(currentItemId)}),[currentItemId]),(0,keyboard._h)(containerRef,{key:["up","down","left","right"]},(({key})=>{switch(key){case"ArrowLeft":case"ArrowRight":{const dir=getArrowDir(key,"ArrowRight","ArrowLeft",isRTL);if(0===dir)return;const nextIndex=(null!==focusedItemId?itemIds.indexOf(focusedItemId):-1)+dir;if(nextIndex<0||nextIndex===itemIds.length)return;const itemId=itemIds[nextIndex];setFocusedItemId(itemId);const item=itemRefs?.current?.[itemId];focusOnPage(item);break}case"ArrowUp":case"ArrowDown":{if(!gridRef.current)return;const{rows:numRows,columns:numColumns}=getGridColumnAndRowCount(gridRef.current,itemIds.length),currentIndex=null!==focusedItemId?itemIds.indexOf(focusedItemId):-1,dir="ArrowDown"===key?1:-1,nextIndex=getIndex({row:getRow(currentIndex,numColumns)+dir,column:getColumn(currentIndex,numColumns),numRows,numColumns,numItems:itemIds.length});if(nextIndex<0)return;const itemId=itemIds[nextIndex];setFocusedItemId(itemId);const item=itemRefs?.current?.[itemId];focusOnPage(item);break}}}),[focusedItemId,isRTL,itemIds,itemRefs,gridRef,currentItemId]),(0,keyboard._h)(containerRef,{key:["mod+up","mod+down","mod+left","mod+right"],shift:!0},(e=>{const{key,shiftKey}=e;let nextIndex,canArrange=!1;switch(e.preventDefault(),key){case"ArrowLeft":case"ArrowRight":{const dir=getArrowDir(key,"ArrowRight","ArrowLeft",isRTL);if(0===dir)return;const currentIndex=null!==focusedItemId?itemIds.indexOf(focusedItemId):-1;nextIndex=currentIndex,shiftKey?nextIndex=dir<0?0:itemIds.length-1:nextIndex+=dir,canArrange=nextIndex!==currentIndex&&nextIndex>=0&&nextIndex<=itemIds.length-1;break}case"ArrowUp":case"ArrowDown":{if(!gridRef.current)return;const{rows:numRows,columns:numColumns}=getGridColumnAndRowCount(gridRef.current,itemIds.length),currentIndex=null!==focusedItemId?itemIds.indexOf(focusedItemId):-1,dir="ArrowDown"===key?1:-1;if(nextIndex=getIndex({row:getRow(currentIndex,numColumns)+dir,column:getColumn(currentIndex,numColumns),numRows,numColumns,numItems:itemIds.length}),nextIndex<0)return;break}}canArrange&&void 0!==nextIndex&&arrangeItem&&focusedItemId&&arrangeItem(focusedItemId,nextIndex)}),[currentItemId,itemIds,isRTL,gridRef,itemRefs,focusedItemId,arrangeItem])}},"./packages/design-system/src/components/keyboard/keyboard.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{rm:()=>Shortcut,A0:()=>useEscapeToBlurEffect,A3:()=>useGlobalIsKeyPressed,pP:()=>useGlobalKeyDownEffect,_h:()=>useKeyDownEffect,wk:()=>useKeyEffect});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts");const keyboard_keys={undo:"mod+z",redo:"shift+mod+z",delete:["del","backspace"],clone:"mod+d"},context=(0,src.q6)({keys:keyboard_keys});var utils=__webpack_require__("./packages/design-system/src/components/keyboard/utils.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const globalRef={current:null};function setGlobalRef(){globalRef.current||(globalRef.current=document.documentElement)}function useKeyEffectInternal(refOrNode,keyNameOrSpec,type,callback,deps){const{keys}=(0,src.NT)(context),batchingCallback=(0,src.T0)(callback,deps||[]);(0,src.vJ)((()=>{const nodeEl=(0,utils.RS)(refOrNode);if(!nodeEl)return;if(nodeEl.nodeType!==Node.ELEMENT_NODE&&nodeEl.nodeType!==Node.DOCUMENT_NODE)throw new Error("only an element or a document node can be used");const keySpec=(0,utils.Zg)(keys,keyNameOrSpec);if(1===keySpec.key.length&&""===keySpec.key[0])return;const mousetrap=(0,utils.iJ)(nodeEl),handler=(0,utils.Eh)(nodeEl,keySpec,batchingCallback);return mousetrap.bind(keySpec.key,handler,type),()=>{mousetrap.unbind(keySpec.key,type)}}),[batchingCallback,keys])}function useKeyEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,void 0,callback,deps)}function useKeyDownEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keydown",callback,deps)}function useKeyUpEffect(refOrNode,keyNameOrSpec,callback,deps){useKeyEffectInternal(refOrNode,keyNameOrSpec,"keyup",callback,deps)}function useGlobalKeyDownEffect(keyNameOrSpec,callback,deps){setGlobalRef(),useKeyDownEffect(globalRef,keyNameOrSpec,callback,deps)}function useGlobalIsKeyPressed(keyNameOrSpec,deps){return setGlobalRef(),function useIsKeyPressed(refOrNode,keyNameOrSpec,deps){const[isKeyPressed,setIsKeyPressed]=(0,src.J0)(!1),handleBlur=(0,src.hb)((()=>{setIsKeyPressed(!1)}),[]);return(0,src.vJ)((()=>(window.addEventListener("blur",handleBlur),()=>{window.removeEventListener("blur",handleBlur)})),[handleBlur]),useKeyDownEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!0)),deps),useKeyUpEffect(refOrNode,keyNameOrSpec,(()=>setIsKeyPressed(!1)),deps),isKeyPressed}(globalRef,keyNameOrSpec,deps)}function useEscapeToBlurEffect(refOrNode,deps){useKeyDownEffect(refOrNode,{key:"esc",editable:!0},(()=>{const nodeEl=(0,utils.RS)(refOrNode),{activeElement}=document;nodeEl&&activeElement&&nodeEl.contains(activeElement)&&activeElement.blur()}),deps)}function Shortcut({component:Component,shortcut=""}){const chars=shortcut.split(" ");return(0,jsx_runtime.jsx)(Component,{"aria-label":(0,utils._M)(shortcut),children:chars.map(((char,index)=>(0,jsx_runtime.jsx)(Component,{children:(0,utils.KV)(char)},`${index}-${char}`)))})}Shortcut.displayName="Shortcut"},"./packages/design-system/src/components/keyboard/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Eh:()=>createKeyHandler,KV:()=>prettifyShortcut,RS:()=>getNodeFromRefOrNode,Zg:()=>resolveKeySpec,_M:()=>createShortcutAriaLabel,fi:()=>isPlatformMacOS,iJ:()=>getOrCreateMousetrap});__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.flat-map.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/i18n/src/i18n.ts"),mousetrap__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/mousetrap/mousetrap.js"),mousetrap__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_3__);const PROP="__WEB_STORIES_MT__",NON_EDITABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","range","reset","hidden"],CLICKABLE_INPUT_TYPES=["submit","button","checkbox","radio","image","file","reset"];function getOrCreateMousetrap(node){return node[PROP]||(node[PROP]=new(mousetrap__WEBPACK_IMPORTED_MODULE_3___default())(node))}function getNodeFromRefOrNode(refOrNode){return refOrNode&&"current"in refOrNode?refOrNode.current:refOrNode}function resolveKeySpec(keyDict,keyNameOrSpec){const keySpec="string"==typeof keyNameOrSpec||Array.isArray(keyNameOrSpec)?{key:keyNameOrSpec}:keyNameOrSpec,{key:keyOrArray,shift=!1,repeat=!0,clickable=!0,editable=!1,dialog=!1,allowDefault=!1}=keySpec,allKeys=function addMods(keys,shift){if(!shift)return keys;return keys.concat(keys.map((key=>`shift+${key}`)))}((new Array).concat(keyOrArray).flatMap((key=>keyDict[key]||key)),shift);return{key:allKeys,shift,clickable,repeat,editable,dialog,allowDefault}}function createKeyHandler(keyTarget,{repeat:repeatAllowed,editable:editableAllowed,clickable:clickableAllowed,dialog:dialogAllowed,allowDefault=!1},callback){return evt=>{const{repeat,target}=evt;if((repeatAllowed||!repeat)&&(editableAllowed||!function isEditableTarget({tagName,isContentEditable,type,...rest}){if("readOnly"in rest&&!0===rest.readOnly)return!1;if(isContentEditable||"TEXTAREA"===tagName)return!0;if("INPUT"===tagName)return!NON_EDITABLE_INPUT_TYPES.includes(type);return!1}(target))&&(clickableAllowed||!function isClickableTarget({tagName,type}){if(["BUTTON","A"].includes(tagName))return!0;if("INPUT"===tagName)return CLICKABLE_INPUT_TYPES.includes(type);return!1}(target))&&(dialogAllowed||!function crossesDialogBoundary(target,keyTarget){if(1!==target.nodeType)return!1;const dialog=target.closest('dialog,[role="dialog"]');return dialog&&keyTarget!==dialog&&keyTarget.contains(dialog)}(target,keyTarget)))return callback(evt),allowDefault}}function isPlatformMacOS(){const{platform}=window.navigator;return platform.includes("Mac")||["iPad","iPhone"].includes(platform)}function getKeyForOS(key){const isMacOS=isPlatformMacOS();return{alt:isMacOS?"⌥":"Alt",ctrl:isMacOS?"^":"Ctrl",mod:isMacOS?"⌘":"Ctrl",cmd:"⌘",shift:isMacOS?"⇧":"Shift"}[key]||key}function createShortcutAriaLabel(shortcut){const isMacOS=isPlatformMacOS(),command=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Command","web-stories"),control=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),option=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Option","web-stories"),alt=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Alt","web-stories"),replacementKeyMap={alt:isMacOS?option:alt,mod:isMacOS?command:control,ctrl:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Control","web-stories"),shift:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Shift","web-stories"),delete:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Delete","web-stories"),cmd:command,",":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Comma","web-stories"),".":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Period","web-stories"),"`":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Backtick","web-stories")},delimiter=isMacOS?" ":"+";return shortcut.toLowerCase().replace("alt",replacementKeyMap.alt).replace("ctrl",replacementKeyMap.ctrl).replace("mod",replacementKeyMap.mod).replace("cmd",replacementKeyMap.cmd).replace("shift",replacementKeyMap.shift).replace("delete",replacementKeyMap.delete).replace(",",replacementKeyMap[","]).replace(".",replacementKeyMap["."]).replace("`",replacementKeyMap["`"]).split(/[\s+]/).map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}function prettifyShortcut(shortcut){const delimiter=isPlatformMacOS()?"":"+";return shortcut.toLowerCase().replace("alt",getKeyForOS("alt")).replace("ctrl",getKeyForOS("ctrl")).replace("mod",getKeyForOS("mod")).replace("cmd",getKeyForOS("cmd")).replace("shift",getKeyForOS("shift")).replace("left","←").replace("up","↑").replace("right","→").replace("down","↓").replace("delete","⌫").replace("enter","⏎").split("+").map((s=>s.charAt(0).toUpperCase()+s.slice(1))).join(delimiter)}},"./packages/design-system/src/theme/helpers/expandPresetStyles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>expandPresetStyles,x:()=>expandTextPreset});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts");const expandPresetStyles=({preset,theme})=>preset?(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["font-family:",";font-size:","px;font-weight:",";letter-spacing:","px;line-height:","px;text-decoration:none;"],theme.typography.family.primary,preset.size,preset.weight,preset.letterSpacing,preset.lineHeight):(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)([""]),expandTextPreset=presetSelector=>({theme})=>expandPresetStyles({preset:presetSelector(theme.typography.presets,_types__WEBPACK_IMPORTED_MODULE_1__.$),theme})},"./packages/design-system/src/theme/helpers/outline.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q:()=>focusableOutlineCSS,g:()=>focusCSS});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const focusCSS=(accent,background)=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["outline:none;box-shadow:",";"],(({theme})=>`0px 0px 0 2px ${background||theme.colors.bg.primary}, 0px 0px 0 4px ${"string"==typeof accent?accent:theme.colors.border.focus}`)),focusableOutlineCSS=(colorOrProps,background)=>{const accent="string"==typeof colorOrProps?colorOrProps:colorOrProps?.theme?.colors?.border?.focus;return(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["&:focus-visible{",";}"],focusCSS(accent,background))}}}]);