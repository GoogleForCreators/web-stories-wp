"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6736],{"./packages/story-editor/src/components/library/panes/media/common/mediaGallery.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>mediaGallery});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var react_src=__webpack_require__("./packages/react/src/index.ts"),dist=__webpack_require__("./packages/story-editor/node_modules/react-photo-album/dist/index.mjs"),constants=__webpack_require__("./packages/story-editor/src/constants/index.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),polished_esm=__webpack_require__("./node_modules/polished/dist/polished.esm.js"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),loadingBar=__webpack_require__("./packages/design-system/src/components/loadingBar/loadingBar.tsx"),esm=__webpack_require__("./packages/story-editor/node_modules/react-blurhash/dist/esm/index.js"),v4=__webpack_require__("./packages/story-editor/node_modules/uuid/dist/esm-browser/v4.js"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts"),dots_fill_small=__webpack_require__("./packages/design-system/src/icons/dots_fill_small.svg"),popup=__webpack_require__("./packages/design-system/src/components/popup/popup.tsx"),popup_constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),menu=__webpack_require__("./packages/design-system/src/components/menu/menu.tsx"),app=__webpack_require__("./packages/story-editor/src/app/index.js"),shared=__webpack_require__("./packages/story-editor/src/components/library/panes/shared/index.js"),dropDownKeyEvents=__webpack_require__("./packages/story-editor/src/components/panels/utils/dropDownKeyEvents.js"),tracking_src=__webpack_require__("./packages/tracking/src/index.ts"),useSnackbar=__webpack_require__("./packages/design-system/src/contexts/snackbar/useSnackbar.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),api=__webpack_require__("./packages/story-editor/src/app/api/index.ts"),app_media=__webpack_require__("./packages/story-editor/src/app/media/index.js"),story=__webpack_require__("./packages/story-editor/src/app/story/index.ts"),dialog=__webpack_require__("./packages/story-editor/src/components/dialog/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function DeleteDialog(_ref){let{mediaId,type,onClose}=_ref;const{actions:{deleteMedia}}=(0,api.Ek)(),{showSnackbar}=(0,useSnackbar.D)(),{deleteMediaElement}=(0,app_media.EF)((_ref2=>{let{actions:{deleteMediaElement}}=_ref2;return{deleteMediaElement}})),{deleteElementsByResourceId}=(0,story.rB)((state=>({deleteElementsByResourceId:state.actions.deleteElementsByResourceId}))),onDelete=(0,react_src.I4)((async()=>{onClose();try{await deleteMedia(mediaId),deleteMediaElement({id:mediaId}),deleteElementsByResourceId({id:mediaId})}catch(err){(0,tracking_src.tz)("local_media_deletion",err.message),showSnackbar({message:(0,i18n.__)("Failed to delete media item.","web-stories"),dismissible:!0})}}),[deleteMedia,deleteMediaElement,deleteElementsByResourceId,mediaId,onClose,showSnackbar]),imageDialogTitle=(0,i18n.__)("Delete Image?","web-stories"),videoDialogTitle=(0,i18n.__)("Delete Video?","web-stories"),imageDialogDescription=(0,i18n.__)("You are about to permanently delete this image from your site. The image will appear broken in any content that uses it.","web-stories"),videoDialogDescription=(0,i18n.__)("You are about to permanently delete this video from your site. The video will appear broken in any content that uses it.","web-stories");return(0,jsx_runtime.jsxs)(dialog.Z,{isOpen:!0,onClose,title:"image"===type?imageDialogTitle:videoDialogTitle,secondaryText:(0,i18n.__)("Cancel","web-stories"),onPrimary:onDelete,primaryText:(0,i18n.__)("Delete","web-stories"),maxWidth:512,children:[(0,jsx_runtime.jsx)(typography_text.x.Paragraph,{size:types.TextSize.Small,children:"image"===type?imageDialogDescription:videoDialogDescription}),(0,jsx_runtime.jsx)(typography_text.x.Paragraph,{size:types.TextSize.Small,isBold:!0,children:(0,i18n.__)("This action can not be undone.","web-stories")})]})}DeleteDialog.displayName="DeleteDialog";const deleteDialog=DeleteDialog;var date_src=__webpack_require__("./packages/date/src/index.ts"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),getSmallestUrlForWidth=__webpack_require__("./packages/media/src/getSmallestUrlForWidth.ts"),textArea=__webpack_require__("./packages/design-system/src/components/textArea/textArea.tsx");const styledMediaThumbnail=(0,styled_components_browser_esm.iv)(["display:flex;width:","px;margin-right:28px;"],152),Image=styled_components_browser_esm.ZP.img.withConfig({displayName:"mediaEditDialog__Image",componentId:"sc-ctku7j-0"})(["",""],styledMediaThumbnail),Video=styled_components_browser_esm.ZP.video.withConfig({displayName:"mediaEditDialog__Video",componentId:"sc-ctku7j-1"})(["",""],styledMediaThumbnail),DialogBody=styled_components_browser_esm.ZP.div.withConfig({displayName:"mediaEditDialog__DialogBody",componentId:"sc-ctku7j-2"})(["display:flex;justify-content:left;align-items:flex-start;"]),MetadataTextContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"mediaEditDialog__MetadataTextContainer",componentId:"sc-ctku7j-3"})(["display:flex;flex-direction:column;margin:0 4px;"]),DateText=(0,styled_components_browser_esm.ZP)(typography_text.x.Span).withConfig({displayName:"mediaEditDialog__DateText",componentId:"sc-ctku7j-4"})(["margin-bottom:8px;"]),AssistiveTextArea=(0,styled_components_browser_esm.ZP)(textArea.Z).withConfig({displayName:"mediaEditDialog__AssistiveTextArea",componentId:"sc-ctku7j-5"})(["margin:20px 0 4px;"]),imageDialogTitle=(0,i18n.__)("Edit Image","web-stories"),videoDialogTitle=(0,i18n.__)("Edit Video","web-stories"),imageInputTitle=(0,i18n.__)("Assistive text","web-stories"),videoInputTitle=(0,i18n.__)("Video description","web-stories"),imageDialogDescription=(0,i18n.__)("Describe the appearance and function of the image. Leave empty if the image is purely decorative.","web-stories"),videoDialogDescription=(0,i18n.__)("For indexability and accessibility. Include any burned-in text inside the video.","web-stories");function MediaEditDialog(_ref){let{resource,onClose}=_ref;const{id,src,creationDate,width,height,type,alt,poster,mimeType}=resource,{actions:{updateMedia}}=(0,api.Ek)(),{updateMediaElement}=(0,app_media.EF)((_ref2=>{let{actions:{updateMediaElement}}=_ref2;return{updateMediaElement}})),{showSnackbar}=(0,useSnackbar.D)(),[altText,setAltText]=(0,react_src.eJ)(alt),parsedDate=(0,date_src.ZU)(creationDate),handleAltTextChange=(0,react_src.I4)((evt=>{setAltText(evt.target.value)}),[]),updateMediaItem=(0,react_src.I4)((async()=>{try{await updateMedia(id,{altText}),updateMediaElement({id,data:{alt:altText}}),onClose()}catch(err){(0,tracking_src.tz)("local_media_edit",err.message),showSnackbar({message:(0,i18n.__)("Failed to update, please try again.","web-stories"),dismissible:!0})}}),[altText,id,onClose,showSnackbar,updateMedia,updateMediaElement]),isImage="image"===type;return(0,jsx_runtime.jsx)(dialog.Z,{isOpen:!0,onClose,title:isImage?imageDialogTitle:videoDialogTitle,secondaryText:(0,i18n.__)("Cancel","web-stories"),onPrimary:updateMediaItem,primaryText:(0,i18n.__)("Save","web-stories"),children:(0,jsx_runtime.jsxs)(DialogBody,{children:["image"===type?(0,jsx_runtime.jsx)(Image,{src:(0,getSmallestUrlForWidth.Z)(152,resource),alt,loading:"lazy",crossOrigin:"anonymous",decoding:"async"}):(0,jsx_runtime.jsx)(Video,{crossOrigin:"anonymous",poster,preload:"metadata",muted:!0,children:(0,jsx_runtime.jsx)("source",{src,type:mimeType})},src),(0,jsx_runtime.jsxs)(MetadataTextContainer,{children:[(0,date_src.JY)(parsedDate)&&(0,jsx_runtime.jsx)(DateText,{size:types.TextSize.XSmall,children:(0,sprintf.Z)((0,i18n.__)("Uploaded: %s","web-stories"),(0,date_src.p6)(creationDate))}),(0,jsx_runtime.jsx)(typography_text.x.Span,{size:types.TextSize.Small,children:(0,sprintf.Z)((0,i18n.__)("%1$d x %2$d pixels","web-stories"),width,height)}),(0,jsx_runtime.jsx)(AssistiveTextArea,{value:altText,"aria-label":isImage?imageInputTitle:videoInputTitle,type:"text",placeholder:isImage?imageInputTitle:videoInputTitle,onChange:handleAltTextChange}),(0,jsx_runtime.jsx)(typography_text.x.Paragraph,{size:types.TextSize.Small,children:isImage?imageDialogDescription:videoDialogDescription})]})]})})}MediaEditDialog.displayName="MediaEditDialog";const mediaEditDialog=MediaEditDialog,MoreButton=(0,styled_components_browser_esm.ZP)(shared.Kk).withConfig({displayName:"dropDownMenu__MoreButton",componentId:"sc-1eq0xdj-0"})(["top:4px;right:4px;"]),DropDownContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"dropDownMenu__DropDownContainer",componentId:"sc-1eq0xdj-1"})(["margin-top:10px;"]),MenuContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"dropDownMenu__MenuContainer",componentId:"sc-1eq0xdj-2"})(["z-index:1;"]),menuStylesOverride=(0,styled_components_browser_esm.iv)(["min-width:160px;margin-top:0;li{display:block;}"]),MENU_OPTIONS_EDIT="edit",MENU_OPTIONS_DELETE="delete";const dropDownMenu=function DropDownMenu(_ref){let{resource,display,isMenuOpen,onMenuOpen,onMenuCancelled,onMenuSelected,setParentActive=noop.Z}=_ref;const groups=[{options:[{label:(0,i18n.__)("Edit meta data","web-stories"),value:MENU_OPTIONS_EDIT},{label:(0,i18n.__)("Delete from library","web-stories"),value:MENU_OPTIONS_DELETE}]}],[showDeleteDialog,setShowDeleteDialog]=(0,react_src.eJ)(!1),[showEditDialog,setShowEditDialog]=(0,react_src.eJ)(!1),moreButtonRef=(0,react_src.sO)(),onClose=(0,react_src.I4)((()=>{onMenuCancelled(),moreButtonRef.current?.focus(),setParentActive()}),[onMenuCancelled,setParentActive]),{canTranscodeResource}=(0,app.EF)((_ref2=>{let{state:{canTranscodeResource}}=_ref2;return{canTranscodeResource}})),onDeleteDialogClose=(0,react_src.I4)((()=>{setShowDeleteDialog(!1),onClose()}),[setShowDeleteDialog,onClose]),onEditDialogClose=(0,react_src.I4)((()=>{setShowEditDialog(!1),onClose()}),[setShowEditDialog,onClose]),listId=(0,react_src.Ye)((()=>`list-${(0,v4.Z)()}`),[]),buttonId=(0,react_src.Ye)((()=>`button-${(0,v4.Z)()}`),[]);return canTranscodeResource(resource)&&(0,jsx_runtime.jsxs)(MenuContainer,{children:[moreButtonRef.current&&(0,jsx_runtime.jsx)(dropDownKeyEvents.Z,{target:moreButtonRef.current}),(0,jsx_runtime.jsx)(MoreButton,{ref:moreButtonRef,onClick:onMenuOpen,"aria-label":(0,i18n.__)("More","web-stories"),"aria-pressed":isMenuOpen,"aria-haspopup":!0,"aria-expanded":isMenuOpen,"aria-owns":isMenuOpen?listId:null,id:buttonId,$display:display,tabIndex:display||isMenuOpen?0:-1,children:(0,jsx_runtime.jsx)(dots_fill_small.Z,{})}),(display||isMenuOpen)&&(0,jsx_runtime.jsx)(popup.Z,{anchor:moreButtonRef,placement:popup_constants.ug.BottomStart,isOpen:isMenuOpen,children:(0,jsx_runtime.jsx)(DropDownContainer,{children:(0,jsx_runtime.jsx)(menu.Z,{parentId:buttonId,listId,handleMenuItemSelect:(evt,value)=>{switch(onMenuSelected(),value){case MENU_OPTIONS_EDIT:setShowEditDialog(!0);break;case MENU_OPTIONS_DELETE:setShowDeleteDialog(!0)}},groups,onDismissMenu:onClose,hasMenuRole:!0,menuStylesOverride})})}),showDeleteDialog&&(0,jsx_runtime.jsx)(deleteDialog,{mediaId:resource.id,type:resource.type,onClose:onDeleteDialogClose}),showEditDialog&&(0,jsx_runtime.jsx)(mediaEditDialog,{resource,onClose:onEditDialogClose})]})};var tooltip=__webpack_require__("./packages/story-editor/src/components/tooltip/index.js"),utils_noop=__webpack_require__("./packages/story-editor/src/utils/noop.ts");const StyledText=(0,styled_components_browser_esm.ZP)(typography_text.x.Span).withConfig({displayName:"attribution__StyledText",componentId:"sc-dg18hp-0"})(["color:",";"],(_ref=>{let{theme,active}=_ref;return(0,polished_esm.m4)(theme.colors.standard.white,active?1:.6)})),Link=styled_components_browser_esm.ZP.a.withConfig({displayName:"attribution__Link",componentId:"sc-dg18hp-1"})(["display:block;position:absolute;left:0;bottom:0;width:100%;padding:8px;background-color:",";text-overflow:ellipsis;overflow:hidden;white-space:nowrap;text-decoration:none;"],(_ref2=>{let{theme,active}=_ref2;return(0,polished_esm.m4)(theme.colors.bg.primary,active?.8:.6)})),Attribution=_ref3=>{let{author,url}=_ref3;const[active,setActive]=(0,react_src.eJ)(!1),makeActive=()=>setActive(!0),makeInactive=()=>setActive(!1);return(0,jsx_runtime.jsx)(Link,{title:author,active,onPointerEnter:makeActive,onFocus:makeActive,onPointerLeave:makeInactive,onBlur:makeInactive,href:url,target:"_blank",rel:"noreferrer",children:(0,jsx_runtime.jsx)(StyledText,{size:types.TextSize.XSmall,children:author})})};Attribution.displayName="Attribution";const common_attribution=Attribution;var resourceList=__webpack_require__("./packages/media/src/resourceList.ts"),muted=__webpack_require__("./packages/design-system/src/icons/muted.svg"),libraryMoveable=__webpack_require__("./packages/story-editor/src/components/library/panes/shared/libraryMoveable.js"),dropTargets=__webpack_require__("./packages/story-editor/src/components/dropTargets/index.js"),insertionOverlay=__webpack_require__("./packages/story-editor/src/components/library/panes/shared/insertionOverlay.js");const styledTiles=(0,styled_components_browser_esm.iv)(["width:100%;cursor:pointer;transition:0.2s transform,0.15s opacity;border-radius:4px;opacity:0;object-fit:cover;"]),innerElement_Image=styled_components_browser_esm.ZP.img.withConfig({displayName:"innerElement__Image",componentId:"sc-qkk7ov-0"})(["",""],styledTiles),innerElement_Video=styled_components_browser_esm.ZP.video.withConfig({displayName:"innerElement__Video",componentId:"sc-qkk7ov-1"})([""," ",""],styledTiles,(_ref=>{let{showWithoutDelay}=_ref;return showWithoutDelay?"opacity: 1;":""})),DurationWrapper=styled_components_browser_esm.ZP.div.withConfig({displayName:"innerElement__DurationWrapper",componentId:"sc-qkk7ov-2"})(["position:absolute;bottom:8px;left:8px;background:",";border-radius:100px;height:18px;padding:0 6px;"],(_ref2=>{let{theme}=_ref2;return theme.colors.opacity.black64})),MuteWrapper=styled_components_browser_esm.ZP.div.withConfig({displayName:"innerElement__MuteWrapper",componentId:"sc-qkk7ov-3"})(["position:absolute;bottom:8px;right:8px;height:24px;width:24px;background:",";color:",";border-radius:100px;"],(_ref3=>{let{theme}=_ref3;return theme.colors.opacity.black64}),(_ref4=>{let{theme}=_ref4;return theme.colors.fg.primary})),Duration=(0,styled_components_browser_esm.ZP)(typography_text.x.Span).attrs({size:types.TextSize.XSmall}).withConfig({displayName:"innerElement__Duration",componentId:"sc-qkk7ov-4"})(["color:",";display:block;"],(_ref5=>{let{theme}=_ref5;return theme.colors.fg.primary})),CloneImg=styled_components_browser_esm.ZP.img.withConfig({displayName:"innerElement__CloneImg",componentId:"sc-qkk7ov-5"})(["opacity:0;width:",";height:",";position:absolute;"],(_ref6=>{let{width}=_ref6;return`${width}px`}),(_ref7=>{let{height}=_ref7;return`${height}px`}));const innerElement=(0,react_src.X$)((function InnerElement(_ref8){let{type,src,resource,alt,width,height,onClick,onLoad=noop.Z,showVideoDetail,mediaElement,active,isMuted}=_ref8;const newVideoPosterRef=(0,react_src.sO)(null),hasSetResourceTracker=(0,react_src.sO)(null),{handleDrag,handleDrop}=(0,dropTargets.H)((_ref9=>{let{state,actions}=_ref9;return{handleDrag:actions.handleDrag,handleDrop:actions.handleDrop,dropTargets:state.dropTargets,activeDropTargetId:state.activeDropTargetId}}),((prev,curr)=>{if(hasSetResourceTracker.current)return!1;if(null===hasSetResourceTracker.current)return hasSetResourceTracker.current=!1,!1;if(prev?.dropTargets&&curr?.dropTargets){const prevIds=Object.keys(prev.dropTargets),currentIds=Object.keys(curr.dropTargets);if(prevIds.join()!==currentIds.join())return!1}return prev?.activeDropTargetId===curr?.activeDropTargetId})),{setDraggingResource}=(0,dropTargets.H)((_ref10=>{let{actions:{setDraggingResource}}=_ref10;return{setDraggingResource}}));let media;(0,react_src.d4)((()=>{resource.poster&&(newVideoPosterRef.current=resource.poster)}),[resource.poster]);const{lengthFormatted,poster,mimeType}=resource,displayPoster=poster??newVideoPosterRef.current,thumbnailURL=displayPoster||(0,getSmallestUrlForWidth.Z)(width,resource),commonProps={width,height,alt,crossOrigin:"anonymous"},commonImageProps={...commonProps,onLoad:()=>{mediaElement.current&&(mediaElement.current.style.opacity=1),onLoad()},loading:"lazy",decoding:"async",draggable:!1},cloneProps={...commonImageProps,onLoad:void 0},imageProps={...commonImageProps,src:thumbnailURL},videoProps={...commonProps,title:alt,alt:null,loop:type===app_media.zc.Gif,muted:!0,preload:"metadata",poster:displayPoster,showWithoutDelay:active};if(type===app_media.zc.Image||type===app_media.zc.Sticker?(media=(0,jsx_runtime.jsx)(innerElement_Image,{...imageProps,ref:mediaElement},src),cloneProps.src=thumbnailURL):[app_media.zc.Video,app_media.zc.Gif].includes(type)&&(media=(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[poster&&!active?(0,jsx_runtime.jsx)(innerElement_Image,{...imageProps,ref:mediaElement},src):(0,jsx_runtime.jsx)(innerElement_Video,{...videoProps,ref:mediaElement,children:type===app_media.zc.Gif?resource.output.src&&(0,jsx_runtime.jsx)("source",{src:resource.output.src,type:resource.output.mimeType}):(0,jsx_runtime.jsx)("source",{src:(0,getSmallestUrlForWidth.Z)(width,resource),type:mimeType})},src),type===app_media.zc.Video&&showVideoDetail&&lengthFormatted&&(0,jsx_runtime.jsx)(DurationWrapper,{children:(0,jsx_runtime.jsx)(Duration,{children:lengthFormatted})}),type===app_media.zc.Video&&showVideoDetail&&isMuted&&(0,jsx_runtime.jsx)(MuteWrapper,{children:(0,jsx_runtime.jsx)(muted.Z,{})})]}),cloneProps.src=poster),!media)throw new Error("Invalid media element type.");const imageURL=type===app_media.zc.Image?thumbnailURL:poster;return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[media,active&&(0,jsx_runtime.jsx)(insertionOverlay.Z,{showIcon:!1}),(0,jsx_runtime.jsx)(libraryMoveable.Z,{active,handleDrag:event=>{hasSetResourceTracker.current||(resourceList.Z.set(resource.id,{url:thumbnailURL,type:"cached"}),setDraggingResource(resource),hasSetResourceTracker.current=!0),handleDrag(resource,event.clientX,event.clientY)},handleDragEnd:()=>{handleDrop(resource),hasSetResourceTracker.current=!1},type:resource.type,elementProps:{resource},onClick:onClick(imageURL),cloneElement:CloneImg,cloneProps})]})}));var keyboard=__webpack_require__("./packages/design-system/src/components/keyboard/keyboard.tsx"),plus_filled_small=__webpack_require__("./packages/design-system/src/icons/plus_filled_small.svg"),getElementProperties=__webpack_require__("./packages/story-editor/src/components/canvas/utils/getElementProperties.ts"),useStory=__webpack_require__("./packages/story-editor/src/app/story/useStory.ts"),useRovingTabIndex=__webpack_require__("./packages/story-editor/src/utils/useRovingTabIndex/index.js"),useFocusCanvas=__webpack_require__("./packages/story-editor/src/components/canvas/useFocusCanvas.ts");const insertionMenu_DropDownContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"insertionMenu__DropDownContainer",componentId:"sc-xjd4tf-0"})(["margin-top:10px;min-width:160px;"]),insertionMenu_MenuContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"insertionMenu__MenuContainer",componentId:"sc-xjd4tf-1"})(["z-index:1;"]),insertionMenu_menuStylesOverride=(0,styled_components_browser_esm.iv)(["min-width:160px;margin-top:0;li{display:block;}"]),insertionMenu_MENU_OPTIONS_INSERT="insert",insertionMenu_MENU_OPTIONS_ADD_BACKGROUND="addBackground";function InsertionMenu(_ref){let{resource,display,onInsert,width,index,isLocal=!1,setParentActive=noop.Z,setParentInactive=noop.Z}=_ref;const insertButtonRef=(0,react_src.sO)(),[isMenuOpen,setIsMenuOpen]=(0,react_src.eJ)(!1),onMenuOpen=(0,react_src.I4)((e=>{e.stopPropagation(),setIsMenuOpen(!0)}),[]),onMenuCancelled=(0,react_src.I4)((()=>{setIsMenuOpen(!1),insertButtonRef.current?.focus(),setParentActive()}),[setParentActive]),{currentBackgroundId,combineElements}=(0,useStory.Z)((state=>({currentBackgroundId:state.state.currentPage?.elements?.[0]?.id,combineElements:state.actions.combineElements}))),{type,poster}=resource,groups=[{options:[{label:["image","gif"].includes(type)?(0,i18n.__)("Insert image","web-stories"):(0,i18n.__)("Insert video","web-stories"),value:insertionMenu_MENU_OPTIONS_INSERT},{label:(0,i18n.__)("Add as background","web-stories"),value:insertionMenu_MENU_OPTIONS_ADD_BACKGROUND}]}];(0,useRovingTabIndex.Z)({ref:insertButtonRef},[],3);const focusCanvas=(0,useFocusCanvas.Z)();(0,keyboard.Ew)(isLocal?null:insertButtonRef,"tab",focusCanvas,[focusCanvas]);const listId=(0,react_src.Ye)((()=>`list-${(0,v4.Z)()}`),[]),buttonId=(0,react_src.Ye)((()=>`button-${(0,v4.Z)()}`),[]);return(0,jsx_runtime.jsxs)(insertionMenu_MenuContainer,{children:[(0,jsx_runtime.jsx)(shared.Kk,{ref:insertButtonRef,onClick:onMenuOpen,"aria-label":(0,i18n.__)("Open insertion menu","web-stories"),"aria-pressed":isMenuOpen,"aria-haspopup":!0,"aria-expanded":isMenuOpen,"aria-owns":isMenuOpen?listId:null,id:buttonId,$display:display,tabIndex:0===index?0:-1,children:(0,jsx_runtime.jsx)(plus_filled_small.Z,{})}),isMenuOpen&&(0,jsx_runtime.jsx)(popup.Z,{anchor:insertButtonRef,placement:popup_constants.ug.BottomStart,isOpen:isMenuOpen,children:(0,jsx_runtime.jsx)(insertionMenu_DropDownContainer,{children:(0,jsx_runtime.jsx)(menu.Z,{parentId:buttonId,listId,handleMenuItemSelect:(evt,value)=>{const thumbnailUrl=poster||(0,getSmallestUrlForWidth.Z)(width,resource),newElement=(0,getElementProperties.Z)(resource.type,{resource});switch(setIsMenuOpen(!1),value){case insertionMenu_MENU_OPTIONS_INSERT:onInsert(resource,thumbnailUrl);break;case insertionMenu_MENU_OPTIONS_ADD_BACKGROUND:combineElements({firstElement:newElement,secondId:currentBackgroundId})}setParentInactive()},groups,onDismissMenu:onMenuCancelled,hasMenuRole:!0,menuStylesOverride:insertionMenu_menuStylesOverride})})})]})}InsertionMenu.displayName="InsertionMenu";const insertionMenu=InsertionMenu,AUTOPLAY_PREVIEW_VIDEO_DELAY_MS=600,Container=styled_components_browser_esm.ZP.div.attrs((props=>({style:{width:props.width+"px",height:props.height+"px",margin:props.margin,backgroundColor:"transparent",color:"inherit",border:"none",padding:0}}))).withConfig({displayName:"mediaElement__Container",componentId:"sc-n7038j-0"})([""]),InnerContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"mediaElement__InnerContainer",componentId:"sc-n7038j-1"})(["position:relative;display:flex;margin-bottom:10px;background-color:",";"],(_ref=>{let{theme,$baseColor}=_ref;return $baseColor||(0,polished_esm.m4)(theme.colors.standard.black,.3)})),BlurhashContainer=(0,styled_components_browser_esm.ZP)(esm.E).withConfig({displayName:"mediaElement__BlurhashContainer",componentId:"sc-n7038j-2"})(["position:absolute !important;top:0;left:0;"]);function Element(_ref2){let{index,resource,width:requestedWidth,height:requestedHeight,margin,onInsert,providerType,canEditMedia}=_ref2;const{id:resourceId,src,type,width:originalWidth,height:originalHeight,alt,isMuted,baseColor,blurHash}=resource,{isCurrentResourceProcessing,isCurrentResourceUploading}=(0,app_media.EF)((_ref3=>{let{state}=_ref3;return{isCurrentResourceProcessing:state.isCurrentResourceProcessing,isCurrentResourceUploading:state.isCurrentResourceUploading}})),oRatio=originalWidth&&originalHeight?originalWidth/originalHeight:1,width=requestedWidth||requestedHeight/oRatio,height=requestedHeight||width/oRatio,mediaElement=(0,react_src.sO)(),[showVideoDetail,setShowVideoDetail]=(0,react_src.eJ)(!0),[active,setActive]=(0,react_src.eJ)(!1),[isMenuOpen,setIsMenuOpen]=(0,react_src.eJ)(!1),[isLoaded,setLoaded]=(0,react_src.eJ)(!1),makeActive=(0,react_src.I4)((()=>setActive(!0)),[]),makeInactive=(0,react_src.I4)((()=>setActive(!1)),[]),onMenuOpen=(0,react_src.I4)((()=>setIsMenuOpen(!0)),[]),onMenuCancelled=(0,react_src.I4)((()=>setIsMenuOpen(!1)),[]),onMenuSelected=(0,react_src.I4)((()=>{setIsMenuOpen(!1),setActive(!1)}),[]),[hoverTimer,setHoverTimer]=(0,react_src.eJ)(null),activeRef=(0,react_src.sO)(active);activeRef.current=active,(0,react_src.d4)((()=>{if(![app_media.zc.Video,app_media.zc.Gif].includes(type))return;const resetHoverTime=()=>{null!==hoverTimer&&(clearTimeout(hoverTimer),setHoverTimer(null))};if(!isMenuOpen)if(active){if(setShowVideoDetail(!1),mediaElement.current&&null===hoverTimer){const timer=setTimeout((()=>{activeRef.current&&src&&mediaElement.current.play().catch(utils_noop.Z)}),AUTOPLAY_PREVIEW_VIDEO_DELAY_MS);setHoverTimer(timer)}}else setShowVideoDetail(!0),resetHoverTime(),mediaElement.current&&mediaElement.current?.pause&&src&&(mediaElement.current.pause(),mediaElement.current.currentTime=0);return resetHoverTime}),[isMenuOpen,active,type,src,hoverTimer,setHoverTimer,activeRef]);const onClick=(0,react_src.I4)((thumbnailUrl=>()=>{onInsert(resource,thumbnailUrl)}),[onInsert,resource]),attribution=active&&resource.attribution?.author?.displayName&&resource.attribution?.author?.url&&(0,jsx_runtime.jsx)(common_attribution,{author:resource.attribution.author.displayName,url:resource.attribution.author.url}),ref=(0,react_src.sO)(),onLoad=(0,react_src.I4)((()=>setLoaded(!0)),[]),isPlaceholder=!isLoaded&&!active;return(0,jsx_runtime.jsx)(Container,{ref,"data-testid":`mediaElement-${type}`,"data-id":resourceId,className:"mediaElement",width,height,margin,onPointerEnter:makeActive,onFocus:makeActive,onPointerLeave:makeInactive,onBlur:makeInactive,tabIndex:"-1",children:(0,jsx_runtime.jsxs)(InnerContainer,{$baseColor:isPlaceholder&&baseColor,children:[(0,jsx_runtime.jsx)(innerElement,{type,src,mediaElement,resource,alt,isMuted,width,height,onClick,onLoad,showVideoDetail,active}),attribution,isPlaceholder&&blurHash&&(0,jsx_runtime.jsx)(BlurhashContainer,{hash:blurHash,width,height,punch:1}),(!src||isCurrentResourceProcessing(resourceId)||isCurrentResourceUploading(resourceId))&&(0,jsx_runtime.jsx)(loadingBar.F,{loadingMessage:(0,i18n.__)("Uploading media…","web-stories")}),(0,jsx_runtime.jsx)(insertionMenu,{resource,display:active,onInsert,width,index,isLocal:"local"===providerType,setParentActive:makeActive,setParentInactive:makeInactive}),"local"===providerType&&canEditMedia&&(0,jsx_runtime.jsx)(dropDownMenu,{resource,display:active,isMenuOpen,onMenuOpen,onMenuCancelled,onMenuSelected,setParentActive:makeActive})]})})}function MediaElement(_ref4){let{providerType="local",canEditMedia=!1,...props}=_ref4;const{isCurrentResourceProcessing,isCurrentResourceUploading}=(0,app_media.EF)((_ref5=>{let{state}=_ref5;return{isCurrentResourceProcessing:state.isCurrentResourceProcessing,isCurrentResourceUploading:state.isCurrentResourceUploading}})),{id:resourceId}=props.resource;return isCurrentResourceProcessing(resourceId)||isCurrentResourceUploading(resourceId)?(0,jsx_runtime.jsx)(tooltip.Z,{title:(0,i18n.__)("Uploading media…","web-stories"),children:(0,jsx_runtime.jsx)(Element,{...props,providerType,canEditMedia})}):(0,jsx_runtime.jsx)(Element,{...props,providerType,canEditMedia})}Element.displayName="Element",MediaElement.displayName="MediaElement";const mediaElement=(0,react_src.X$)(MediaElement);var styles=__webpack_require__("./packages/story-editor/src/components/library/panes/media/common/styles.js");const ROW_CONSTRAINTS={maxPhotos:2},ContainerRenderer=_ref=>{let{children,containerRef}=_ref;return(0,jsx_runtime.jsx)(styles.l0,{ref:containerRef,children})};ContainerRenderer.displayName="ContainerRenderer";const RowRenderer=_ref2=>{let{children}=_ref2;return children};function MediaGallery(_ref3){let{resources,uploadingResources=[],onInsert,providerType,canEditMedia=!1}=_ref3;const photos=[...uploadingResources.map((resource=>({key:`uploading-${resource.id}`,src:resource.src,width:resource.width,height:resource.height,resource}))),...resources.map((resource=>({key:resource.id,src:resource.src,width:resource.width,height:resource.height,resource})))].map(((photo,index)=>({...photo,index}))),imageRenderer=(0,react_src.I4)((_ref4=>{let{photo,layout}=_ref4;return(0,jsx_runtime.jsx)(mediaElement,{index:photo.index,margin:"0px 0px 8px 0px",resource:photo.resource,width:layout.width,height:layout.height,onInsert,providerType,canEditMedia},photo.key)}),[providerType,onInsert,canEditMedia]);return(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(dist.Z,{layout:"rows",photos,renderPhoto:imageRenderer,renderRowContainer:RowRenderer,renderContainer:ContainerRenderer,targetRowHeight:110,rowConstraints:ROW_CONSTRAINTS,spacing:8,defaultContainerWidth:constants.ZR})})}MediaGallery.displayName="MediaGallery";const mediaGallery=MediaGallery}}]);