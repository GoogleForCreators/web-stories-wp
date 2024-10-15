"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[2954],{"./packages/design-system/src/icons/pencil.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgPencil=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"m17.672 11.579-7.514 7.514a.5.5 0 0 0-.137.256l-.51 2.552a.5.5 0 0 0 .588.588l2.552-.51a.5.5 0 0 0 .255-.137l7.515-7.515zm3.346-2.64a1.5 1.5 0 0 0-2.12 0L9.45 18.386a1.5 1.5 0 0 0-.41.766l-.511 2.552a1.5 1.5 0 0 0 1.765 1.766l2.552-.51a1.5 1.5 0 0 0 .767-.411l9.446-9.447a1.5 1.5 0 0 0 0-2.121z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgPencil)},"./packages/media/src/blob.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{H8:()=>isBlobURL,eW:()=>revokeBlob,gO:()=>createBlob});const blobCache={};function createBlob(file){const url=window.URL.createObjectURL(file);return blobCache[url]=file,url}function revokeBlob(url){(function getBlob(url){return blobCache[url]})(url)&&window.URL.revokeObjectURL(url),delete blobCache[url]}function isBlobURL(url){return!!url&&url.startsWith("blob:")}},"./packages/media/src/readFile.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=function readFile(file){const reader=new FileReader;return new Promise(((resolve,reject)=>{reader.addEventListener("load",(()=>{resolve(new Uint8Array(reader.result))})),reader.addEventListener("error",(()=>{reject(new Error(`Could not read file ${file.name}`))})),reader.readAsArrayBuffer(file)}))}},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$D:()=>Error,$j:()=>MenuContainer,BO:()=>SettingForm,Cw:()=>UploadedContainer,IT:()=>VisuallyHiddenLabel,J2:()=>TestConnectionButton,Q2:()=>ConnectionHelperText,Qe:()=>MultilineForm,Rw:()=>TextInputHelperText,Sb:()=>CheckboxLabel,Zs:()=>CheckboxLabelText,gH:()=>InlineLink,gq:()=>GridItemButton,gu:()=>Logo,hi:()=>SettingsTextInput,kQ:()=>InlineForm,nq:()=>SettingHeading,o5:()=>CenterMutedText,rF:()=>LogoMenuButton,rW:()=>SettingSubheading,xE:()=>GridItemContainer,yY:()=>SaveButton});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.Zo).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.$).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.s({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.N).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Mp.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.VQ.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Ak.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))},"./packages/wp-dashboard/src/components/editorSettings/publisherLogo/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>stories});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js"),__webpack_require__("./packages/react/src/index.ts")),readFile=__webpack_require__("./packages/media/src/readFile.ts"),blob=__webpack_require__("./packages/media/src/blob.ts"),dashboard_src=__webpack_require__("./packages/dashboard/src/index.js");const rawPublisherLogos=[{id:577,src:"https://picsum.photos/96",title:"dummy image 1",active:!0},{id:584,src:"https://picsum.photos/97",title:"dummy image 2",active:!1},{id:582,src:"https://picsum.photos/98",title:"dummy image 3",active:!1},{id:581,src:"https://picsum.photos/99",title:"dummy image 4",active:!1}];var i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),useGridViewKeys=__webpack_require__("./packages/design-system/src/components/keyboard/gridview/useGridViewKeys.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),pencil=__webpack_require__("./packages/design-system/src/icons/pencil.svg"),contextMenu=__webpack_require__("./packages/design-system/src/components/contextMenu/contextMenu.tsx"),components_link=__webpack_require__("./packages/design-system/src/components/contextMenu/components/link.tsx"),components_button=__webpack_require__("./packages/design-system/src/components/contextMenu/components/button.tsx"),components_separator=__webpack_require__("./packages/design-system/src/components/contextMenu/components/separator.tsx");prop_types_default().shape({value:prop_types_default().number,set:prop_types_default().func}).isRequired,prop_types_default().number,prop_types_default().bool,prop_types_default().arrayOf(prop_types_default().shape({disabled:prop_types_default().bool,href:prop_types_default().string,label:prop_types_default().string.isRequired,openNewTab:prop_types_default().bool,onClick:prop_types_default().func,onFocus:prop_types_default().func})).isRequired,prop_types_default().func.isRequired,prop_types_default().shape({url:prop_types_default().string,title:prop_types_default().string,id:prop_types_default().number,active:prop_types_default().bool}).isRequired;const popoverLogoContextMenu=function PopoverLogoContextMenu({isActive,idx,publisherLogo,contextMenuId,onMenuItemToggle,items}){const isPopoverMenuOpen=contextMenuId.value===publisherLogo.id,tabIndex=isActive?0:-1,onMoreButtonSelected=(0,src.hb)((openMenuLogoId=>contextMenuId.set(openMenuLogoId)),[contextMenuId]),handleDismiss=(0,src.hb)((()=>onMoreButtonSelected(-1)),[onMoreButtonSelected]);return react.createElement(components.$j,null,react.createElement(components.rF,{tabIndex,isActive,menuOpen:isPopoverMenuOpen,"data-testid":`publisher-logo-context-menu-button-${idx}`,"aria-label":(0,sprintf.A)((0,i18n.__)("Publisher logo menu for %s","web-stories"),publisherLogo.title),onClick:e=>{e.preventDefault(),onMenuItemToggle(isPopoverMenuOpen?null:publisherLogo.id),onMoreButtonSelected(isPopoverMenuOpen?-1:publisherLogo.id)},onFocus:()=>{onMenuItemToggle(isPopoverMenuOpen?null:publisherLogo.id)}},react.createElement(pencil.A,{"aria-hidden":"true"})),react.createElement(contextMenu.A,{animate:!0,isOpen:isPopoverMenuOpen,"data-testid":`publisher-logo-context-menu-${idx}`,onDismiss:handleDismiss},items.map((({label,separator,...props})=>{const MenuItem=props.href?components_link.A:components_button.A;return react.createElement(src.FK,{key:label},"top"===separator&&react.createElement(components_separator.A,null),react.createElement(MenuItem,props,label),"bottom"===separator&&react.createElement(components_separator.A,null))}))))},GridItem=(0,src.Rf)((({contextMenuId,index,onMenuItemToggle,onRemoveLogo,onUpdateDefaultLogo,publisherLogo,setFocusedPublisherLogoId,showLogoContextMenu,isFocused},ref)=>{const items=[{label:(0,i18n.__)("Set as Default","web-stories"),onClick:ev=>{ev.preventDefault(),onUpdateDefaultLogo(publisherLogo)},disabled:publisherLogo.active},{label:(0,i18n.__)("Delete","web-stories"),onClick:ev=>{ev.preventDefault(),onRemoveLogo(publisherLogo,index)}}];return react.createElement(components.xE,{ref,role:"listitem",active:publisherLogo.active,"data-testid":`publisher-logo-${index}`},react.createElement(components.gq,{onFocus:()=>{setFocusedPublisherLogoId(publisherLogo.id)},"data-testid":`uploaded-publisher-logo-${index}`,isSelected:isFocused,tabIndex:isFocused?0:-1,onClick:e=>{e.preventDefault(),setFocusedPublisherLogoId(publisherLogo.id)},"aria-label":(0,sprintf.A)((0,i18n.__)("Publisher Logo %s","web-stories"),publisherLogo.title)},react.createElement(components.gu,{src:publisherLogo.url,alt:publisherLogo.title})),publisherLogo.active&&react.createElement(components.o5,{size:types.$.XSmall},(0,i18n.__)("Default","web-stories")),showLogoContextMenu&&react.createElement(popoverLogoContextMenu,{isActive:isFocused,idx:index,items,publisherLogo,onMenuItemToggle,contextMenuId}))}));GridItem.displayName="GridItem";const TEXT={SECTION_HEADING:(0,i18n.__)("Publisher Logo","web-stories"),UPLOAD_CONTEXT:(0,i18n.__)("Upload your logos here and they will become available to any stories you create.","web-stories"),CLICK_CONTEXT:(0,i18n.__)("Click on logo to set as default if you want that logo to be used on default logo for all your stories.","web-stories"),REMOVAL:(0,i18n.__)("Removing a logo from your settings won't remove it from any stories using that logo.","web-stories"),INSTRUCTIONS:(0,i18n.__)("Avoid vector files, such as svg or eps. Logos should be at least 96x96 pixels and a perfect square. The background should not be transparent.","web-stories"),SUBMIT:(0,i18n.__)("Upload logo","web-stories"),ARIA_LABEL:(0,i18n.__)("Click to upload a new logo","web-stories"),HELPER_UPLOAD:(0,i18n.__)("Drag a jpg, png, or static gif in this box. Or click “Upload logo” below.","web-stories")};const publisherLogo=function PublisherLogoSettings({canUploadFiles,onAddLogos,onRemoveLogo,onUpdateDefaultLogo,isLoading,publisherLogos,uploadError}){const{isRTL,allowedImageMimeTypes}=(0,dashboard_src.UK)(),containerRef=(0,src.li)(),gridRef=(0,src.li)(),itemRefs=(0,src.li)({}),[focusedPublisherLogoId,setFocusedPublisherLogoId]=(0,src.J0)(null),[indexRemoved,setIndexRemoved]=(0,src.J0)(null),[contextMenuId,setContextMenuId]=(0,src.J0)(null),hasOnlyOneLogo=1===publisherLogos.length,publisherLogoCount=(0,src.li)(publisherLogos.length),handleRemoveLogoClick=(0,src.hb)(((publisherLogo,idx)=>{setContextMenuId(-1),onRemoveLogo?.(publisherLogo),setIndexRemoved(idx),publisherLogoCount.current=publisherLogos.length}),[onRemoveLogo,publisherLogos.length]),handleUpdateDefaultLogo=(0,src.hb)((publisherLogo=>{setContextMenuId(-1),onUpdateDefaultLogo?.(publisherLogo)}),[onUpdateDefaultLogo]);(0,src.vJ)((()=>{if(Boolean(indexRemoved?.toString())&&publisherLogos.length!==publisherLogoCount.current){if(0===publisherLogos.length)return containerRef.current?.getElementsByTagName("input")[0].focus();const moveItemFocusByIndex=indexRemoved>0?publisherLogos[indexRemoved-1]:publisherLogos[0];return setFocusedPublisherLogoId(moveItemFocusByIndex.id),itemRefs.current[moveItemFocusByIndex.id].firstChild.focus(),setIndexRemoved(null)}}),[indexRemoved,publisherLogos,setFocusedPublisherLogoId]),(0,useGridViewKeys.A)({containerRef,gridRef,itemRefs,isRTL,currentItemId:focusedPublisherLogoId,items:publisherLogos});const onMenuItemToggle=(0,src.hb)((newMenuId=>{setFocusedPublisherLogoId(newMenuId)}),[]);return(0,src.g$)(containerRef,(()=>{setFocusedPublisherLogoId(null),setContextMenuId(null)}),[]),react.createElement(components.BO,null,react.createElement("div",null,react.createElement(components.nq,null,TEXT.SECTION_HEADING),react.createElement(components.rW,{size:types.$.Small},TEXT.UPLOAD_CONTEXT),react.createElement(components.rW,{size:types.$.Small},TEXT.CLICK_CONTEXT),react.createElement(components.rW,{size:types.$.Small},TEXT.REMOVAL)),react.createElement("div",{ref:containerRef,"data-testid":"publisher-logos-container"},publisherLogos.length>0&&react.createElement(components.Cw,{tabIndex:0,ref:gridRef,role:"list","aria-label":(0,i18n.__)("Viewing existing publisher logos","web-stories")},publisherLogos.map(((publisherLogo,idx)=>react.createElement(GridItem,{key:publisherLogo.id,ref:el=>{itemRefs.current[publisherLogo.id]=el},contextMenuId:{set:setContextMenuId,value:contextMenuId},index:idx,isFocused:focusedPublisherLogoId===publisherLogo.id,onMenuItemToggle,onRemoveLogo:handleRemoveLogoClick,onUpdateDefaultLogo:handleUpdateDefaultLogo,publisherLogo,setFocusedPublisherLogoId,showLogoContextMenu:!hasOnlyOneLogo})))),uploadError&&react.createElement(components.$D,{role:"alert"},uploadError),canUploadFiles&&react.createElement(react.Fragment,null,react.createElement(dashboard_src.ef,{onSubmit:onAddLogos,id:"settings_publisher_logos",isLoading,label:TEXT.SUBMIT,isMultiple:!0,ariaLabel:TEXT.ARIA_LABEL,instructionalText:TEXT.HELPER_UPLOAD,acceptableFormats:Object.values(allowedImageMimeTypes)}),react.createElement(components.rW,{size:types.$.Small},TEXT.INSTRUCTIONS))))};function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const stories={title:"Dashboard/Views/EditorSettings/PublisherLogo",component:publisherLogo,args:{canUploadFiles:!0,isLoading:!1,uploadError:""},argTypes:{onAddLogos:{action:"onSubmit fired"},onRemoveLogo:{action:"onDelete fired"}},parameters:{controls:{exclude:["publisherLogos"]}}},_default={render:function Render(args){const[uploadedContent,setUploadedContent]=(0,src.J0)(rawPublisherLogos),handleAddLogos=(0,src.hb)((async newPublisherLogos=>{args.onAddLogos(newPublisherLogos);const newUploads=await Promise.all(newPublisherLogos.map((async file=>{const arr=await(0,readFile.A)(file),src=(0,blob.gO)(new Blob([arr],{type:file.type}));return{id:src,url:src,title:file.name}})));setUploadedContent((existingUploads=>[...existingUploads,...newUploads]))}),[args]),handleRemoveLogo=(0,src.hb)((deleteLogo=>{args.onRemoveLogo(deleteLogo),setUploadedContent((existingUploadedContent=>existingUploadedContent.filter((uploadedLogo=>uploadedLogo.id!==deleteLogo.id))))}),[args]);return react.createElement(dashboard_src.sG,{config:{allowedImageMimeTypes:{}}},react.createElement(publisherLogo,_extends({onAddLogos:handleAddLogos,onRemoveLogo:handleRemoveLogo,publisherLogos:uploadedContent},args)))}}}}]);