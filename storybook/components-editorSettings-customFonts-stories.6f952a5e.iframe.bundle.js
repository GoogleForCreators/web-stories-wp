"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[6290],{"./packages/design-system/src/icons/trash.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _path,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const SvgTrash=({title,titleId,...props})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32","aria-labelledby":titleId},props),title?react__WEBPACK_IMPORTED_MODULE_0__.createElement("title",{id:titleId},title):null,_path||(_path=react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M14 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V11h-4zM13 11H8.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H19V9.5A1.5 1.5 0 0 0 17.5 8h-3A1.5 1.5 0 0 0 13 9.5zm-2.5 3a.5.5 0 0 1 .5.5v7a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-7a.5.5 0 0 1 1 0v7a2.5 2.5 0 0 1-2.5 2.5h-7a2.5 2.5 0 0 1-2.5-2.5v-7a.5.5 0 0 1 .5-.5m3.5.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m4.5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0z",clipRule:"evenodd"}))),__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(SvgTrash)},"./packages/i18n/src/translateToExclusiveList.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _sprintf__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/i18n/src/sprintf.ts"),_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/i18n/src/i18n.ts");const __WEBPACK_DEFAULT_EXPORT__=function translateToExclusiveList(options){switch(options.length){case 0:return"";case 1:return options[0];case 2:return(0,_sprintf__WEBPACK_IMPORTED_MODULE_0__.A)((0,_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("%1$s or %2$s","web-stories"),options[0],options[1]);default:return(0,_sprintf__WEBPACK_IMPORTED_MODULE_0__.A)((0,_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("%1$s, or %2$s","web-stories"),options.slice(0,options.length-1).join((0,_i18n__WEBPACK_IMPORTED_MODULE_1__.__)(", ","web-stories")),options[options.length-1])}}},"./packages/url/src/url.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function toAbsoluteUrl(base,path){try{return new URL(path,base).href}catch{return path}}function isValidUrl(url){try{return new URL(url),!0}catch{return!1}}function withProtocol(url,protocol="https"){return/^(http:\/\/|https:\/\/|tel:|mailto:)/.test(url)?url:`${protocol}://${url}`}function withoutProtocol(url){return url.replace(/^(http:\/\/|https:\/\/|tel:|mailto:)/,"")}__webpack_require__.d(__webpack_exports__,{AY:()=>isValidUrl,oK:()=>toAbsoluteUrl,rM:()=>withoutProtocol,x6:()=>withProtocol})},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$D:()=>Error,$j:()=>MenuContainer,BO:()=>SettingForm,Cw:()=>UploadedContainer,IT:()=>VisuallyHiddenLabel,J2:()=>TestConnectionButton,Q2:()=>ConnectionHelperText,Qe:()=>MultilineForm,Rw:()=>TextInputHelperText,Sb:()=>CheckboxLabel,Zs:()=>CheckboxLabelText,gH:()=>InlineLink,gq:()=>GridItemButton,gu:()=>Logo,hi:()=>SettingsTextInput,kQ:()=>InlineForm,nq:()=>SettingHeading,o5:()=>CenterMutedText,rF:()=>LogoMenuButton,rW:()=>SettingSubheading,xE:()=>GridItemContainer,yY:()=>SaveButton});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.Zo).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.$).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.s({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.N).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Mp.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.VQ.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Ak.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))},"./packages/wp-dashboard/src/components/editorSettings/customFonts/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>stories});var react=__webpack_require__("./node_modules/react/index.js"),src=(__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.filter.js"),__webpack_require__("./packages/react/src/index.ts"));const rawCustomFonts=[{id:1,url:"https://font.test/font-url-1.ttf",family:"Dummy Font 1"},{id:2,url:"https://font.test/font-url-2.otf",family:"Dummy Font 2"},{id:3,url:"https://font.test/font-url-3.woff",family:"Dummy Font 3"}];__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js");var i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),translateToExclusiveList=__webpack_require__("./packages/i18n/src/translateToExclusiveList.ts"),url=__webpack_require__("./packages/url/src/url.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),outline=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),button_button=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),useLiveRegion=__webpack_require__("./packages/design-system/src/utils/useLiveRegion.ts"),useSnackbar=__webpack_require__("./packages/design-system/src/contexts/snackbar/useSnackbar.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),trash=__webpack_require__("./packages/design-system/src/icons/trash.svg"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),tracking_src=__webpack_require__("./packages/tracking/src/index.ts"),dashboard_src=__webpack_require__("./packages/dashboard/src/index.js"),components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js"),src_constants=__webpack_require__("./packages/wp-dashboard/src/constants/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),theme=__webpack_require__("./packages/design-system/src/theme/theme.ts"),dialog=__webpack_require__("./packages/design-system/src/components/dialog/dialog.tsx");function ConfirmationDialog(t0){const $=(0,dist.c)(18),{onClose,onPrimary}=t0;let t1,t2,t3,t4,t5,t6,t7,t8,t9,t10;return $[0]===Symbol.for("react.memo_cache_sentinel")?(t1=(0,i18n.__)("Delete Font","web-stories"),$[0]=t1):t1=$[0],$[1]!==onClose?(t2=()=>onClose(),$[1]=onClose,$[2]=t2):t2=$[2],$[3]===Symbol.for("react.memo_cache_sentinel")?(t3=(0,i18n.__)("Cancel","web-stories"),$[3]=t3):t3=$[3],$[4]!==t2?(t4=react.createElement(button_button.$,{type:constants.VQ.Tertiary,size:constants.Mp.Small,onClick:t2},t3),$[4]=t2,$[5]=t4):t4=$[5],$[6]!==onPrimary?(t5=()=>onPrimary(),$[6]=onPrimary,$[7]=t5):t5=$[7],$[8]===Symbol.for("react.memo_cache_sentinel")?(t6=(0,i18n.__)("Delete Font","web-stories"),$[8]=t6):t6=$[8],$[9]!==t5?(t7=react.createElement(button_button.$,{type:constants.VQ.Primary,size:constants.Mp.Small,onClick:t5},t6),$[9]=t5,$[10]=t7):t7=$[10],$[11]!==t4||$[12]!==t7?(t8=react.createElement(react.Fragment,null,t4,t7),$[11]=t4,$[12]=t7,$[13]=t8):t8=$[13],$[14]===Symbol.for("react.memo_cache_sentinel")?(t9=react.createElement(typography_text.E.Paragraph,{size:types.$.Small},(0,i18n.__)("Deleting a font will delete it from every previous story it’s in. Would you like to proceed?","web-stories")),$[14]=t9):t9=$[14],$[15]!==onClose||$[16]!==t8?(t10=react.createElement(styled_components_browser_esm.NP,{theme:theme.w},react.createElement(dialog.A,{isOpen:!0,onClose,title:t1,actions:t8},t9)),$[15]=onClose,$[16]=t8,$[17]=t10):t10=$[17],t10}ConfirmationDialog.propTypes={onClose:prop_types_default().func.isRequired,onPrimary:prop_types_default().func.isRequired};const confirmationDialog=ConfirmationDialog;const utils_getFontDataFromUrl=async function getFontDataFromUrl(fontURL){const{load}=await Promise.all([__webpack_require__.e(3326),__webpack_require__.e(8635)]).then(__webpack_require__.bind(__webpack_require__,"./node_modules/opentype.js/dist/opentype.module.js")),fontInfo=await load(fontURL);return{name:fontInfo.names.fullName.en,family:fontInfo.names.fullName.en,weights:[400],styles:["regular"],variants:[[0,400]],service:"custom",fallbacks:["sans-serif"],metrics:{upm:fontInfo.unitsPerEm,asc:fontInfo.ascender,des:fontInfo.descender,tAsc:fontInfo.tables.os2.sTypoAscender,tDes:fontInfo.tables.os2.sTypoDescender,tLGap:fontInfo.tables.os2.sTypoLineGap,wAsc:fontInfo.tables.os2.usWinAscent,wDes:fontInfo.tables.os2.usWinDescent,xH:fontInfo.tables.os2.sxHeight,capH:fontInfo.tables.os2.sCapHeight,yMin:fontInfo.tables.head.yMin,yMax:fontInfo.tables.head.yMax,hAsc:fontInfo.tables.hhea.ascender,hDes:fontInfo.tables.hhea.descender,lGap:fontInfo.tables.hhea.lineGap}}},TEXT={ADD_CONTEXT:(0,i18n.__)("Add and manage your custom and brand fonts via link here. They’ll appear in your font list in the editor.","web-stories"),REMOVAL:(0,i18n.__)("Removing a font from this settings page will remove it from your font list in all stories.","web-stories"),SECTION_HEADING:(0,i18n.__)("Custom Fonts","web-stories"),LABEL:(0,i18n.__)("Insert Font URL","web-stories"),INPUT_CONTEXT:(0,i18n.__)("Insert a public URL to a font file. Allowed formats are .otf, .ttf, .woff.","web-stories"),INPUT_ERROR:(0,i18n.__)("Invalid URL format","web-stories"),SUBMIT_BUTTON:(0,i18n.__)("Add Font","web-stories"),FONTS_HEADING:(0,i18n.__)("Current Fonts","web-stories"),FONTS_CONTEXT:(0,i18n.__)("Deleting fonts will delete them from your in-editor font list and all previous stories.","web-stories")},AddButton=(0,styled_components_browser_esm.Ay)(components.yY).withConfig({displayName:"customFonts__AddButton",componentId:"sc-4md0nd-0"})(["min-width:90px;margin-top:32px;"]),InputsWrapper=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__InputsWrapper",componentId:"sc-4md0nd-1"})(["margin-top:8px;"]),FontsWrapper=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__FontsWrapper",componentId:"sc-4md0nd-2"})(["margin-top:34px;"]),ListHeading=(0,styled_components_browser_esm.Ay)(typography_text.E.Span).withConfig({displayName:"customFonts__ListHeading",componentId:"sc-4md0nd-3"})(["margin-bottom:10px;display:inline-block;"]),FontsList=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__FontsList",componentId:"sc-4md0nd-4"})(["padding:12px 0;border:",";:focus-within{","}"],(({theme})=>`1px solid ${theme.colors.divider.primary}`),(({theme})=>outline.g(theme.colors.border.focus))),DeleteButton=(0,styled_components_browser_esm.Ay)(button_button.$).withConfig({displayName:"customFonts__DeleteButton",componentId:"sc-4md0nd-5"})(["visibility:hidden;opacity:0;transition:visibility 0s,opacity ease-in-out 300ms;&:focus{","}"],(({theme})=>outline.g(theme.colors.border.focus))),FontRow=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__FontRow",componentId:"sc-4md0nd-6"})(["padding:0 12px;display:flex;height:32px;width:100%;justify-content:space-between;transition:background-color ease-in-out 300ms;&[aria-selected='true'],&:hover,&:focus{background-color:",";button{visibility:visible;opacity:1;}}"],(({theme})=>theme.colors.bg.secondary)),FontData=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__FontData",componentId:"sc-4md0nd-7"})(["line-height:32px;white-space:nowrap;display:flex;font-size:14px;max-width:calc(100% - 32px);align-items:center;"]),StyledText=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).attrs({as:"span"}).withConfig({displayName:"customFonts__StyledText",componentId:"sc-4md0nd-8"})([""]),FontUrl=(0,styled_components_browser_esm.Ay)(StyledText).withConfig({displayName:"customFonts__FontUrl",componentId:"sc-4md0nd-9"})(["color:",";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"],(({theme})=>theme.colors.fg.tertiary)),Divider=styled_components_browser_esm.Ay.div.withConfig({displayName:"customFonts__Divider",componentId:"sc-4md0nd-10"})(["width:4px;height:4px;background-color:",";border-radius:",";margin:0 6px;align-self:center;"],(({theme})=>theme.colors.standard.black),(({theme})=>theme.borders.radius.round)),ALLOWED_FONT_TYPES=[".otf",".ttf",".woff"];const customFonts=function CustomFontsSettings({customFonts=[],addCustomFont,deleteCustomFont}){const speak=(0,useLiveRegion.A)(),[fontUrl,setFontUrl]=(0,src.J0)(""),[inputError,setInputError]=(0,src.J0)(""),[showDialog,setShowDialog]=(0,src.J0)(!1),[toDelete,setToDelete]=(0,src.J0)(null),canSave=!inputError&&fontUrl,currentFontsContainerRef=(0,src.li)(null),currentFontsRowsRef=(0,src.li)([]),[currentFontsFocusIndex,setCurrentFontsFocusIndex]=(0,src.J0)(0),[currentFontsActiveId,setCurrentFontsActiveId]=(0,src.J0)(),{showSnackbar}=(0,useSnackbar.d)(),handleUpdateFontUrl=(0,src.hb)((event=>{const{value}=event.target;setFontUrl(value),0===value.length||(0,url.AY)((0,url.x6)(value))?setInputError(""):setInputError(TEXT.INPUT_ERROR)}),[]),handleDelete=(0,src.hb)((async()=>{try{await deleteCustomFont(toDelete),speak((0,i18n.__)("Font deleted","web-stories"))}catch(err){(0,tracking_src.Oz)("remove_custom_font",err?.message),showSnackbar({"aria-label":src_constants.Sr.REMOVE_FONT.MESSAGE,message:src_constants.Sr.REMOVE_FONT.MESSAGE,dismissible:!0})}finally{setToDelete(null),setShowDialog(!1),setInputError("")}}),[deleteCustomFont,toDelete,showSnackbar,speak]),handleOnSave=(0,src.hb)((async()=>{if(canSave){const urlWithProtocol=(0,url.x6)(fontUrl);try{await fetch(urlWithProtocol,{method:"HEAD"})}catch(err_0){return(0,tracking_src.Oz)("add_custom_font",err_0?.message),void setInputError((0,i18n.__)("Please ensure correct CORS settings for allowing font usage on this site.","web-stories"))}let fontData;try{if((0,tracking_src.sx)("add_custom_font",{url:urlWithProtocol}),fontData=await utils_getFontDataFromUrl(urlWithProtocol),!fontData.family)return void setInputError((0,i18n.__)("Something went wrong, please try again.","web-stories"))}catch(err_1){return(0,tracking_src.Oz)("add_custom_font",err_1?.message),void setInputError((0,sprintf.A)((0,i18n.__)("Getting font data failed, please ensure the URL points directly to a %s file.","web-stories"),(0,translateToExclusiveList.A)(ALLOWED_FONT_TYPES)))}try{await addCustomFont({...fontData,url:urlWithProtocol}),setFontUrl("")}catch(err_2){(0,tracking_src.Oz)("add_custom_font",err_2?.message),setInputError((0,sprintf.A)((0,i18n.__)("A font with the name %s already exists.","web-stories"),fontData.family))}}}),[addCustomFont,canSave,fontUrl]),handleOnKeyDown=(0,src.hb)((e=>{"Enter"===e.key&&(e.preventDefault(),handleOnSave())}),[handleOnSave]);(0,src.vJ)((()=>{const el=currentFontsRowsRef.current[`row-${currentFontsFocusIndex}`];el&&(el.focus(),setCurrentFontsActiveId(el.id))}),[currentFontsFocusIndex]);const handleListBoxNav=(0,src.hb)((evt=>{const{key}=evt;"ArrowUp"===key?(evt.preventDefault(),setCurrentFontsFocusIndex((index_0=>Math.max(0,index_0-1)))):"ArrowDown"===key&&(evt.preventDefault(),setCurrentFontsFocusIndex((index_1=>Math.min(customFonts.length-1,index_1+1))))}),[customFonts]);return react.createElement(components.BO,{onSubmit:e_0=>e_0.preventDefault()},react.createElement("div",null,react.createElement(components.nq,{as:"h3"},TEXT.SECTION_HEADING),react.createElement(components.rW,{size:types.$.Small},TEXT.ADD_CONTEXT),react.createElement(components.rW,{size:types.$.Small},TEXT.REMOVAL)),react.createElement(InputsWrapper,null,react.createElement(components.kQ,null,react.createElement(components.hi,{value:fontUrl,onChange:handleUpdateFontUrl,onKeyDown:handleOnKeyDown,hasError:Boolean(inputError),hint:inputError,label:TEXT.LABEL}),react.createElement(AddButton,{type:constants.VQ.Primary,size:constants.Mp.Small,disabled:!canSave,onClick:handleOnSave},TEXT.SUBMIT_BUTTON)),react.createElement(components.Rw,{size:types.$.Small},TEXT.INPUT_CONTEXT),customFonts?.length>0&&react.createElement(FontsWrapper,null,react.createElement(ListHeading,null,TEXT.FONTS_HEADING),react.createElement(FontsList,{ref:currentFontsContainerRef,role:"listbox",tabIndex:0,onKeyDown:handleListBoxNav,"aria-activedescendant":currentFontsActiveId||customFonts[0]?.id},customFonts.map((({id,family,url},index_2)=>{return react.createElement(FontRow,{id:`font-${id}`,ref:el_0=>currentFontsRowsRef.current[`row-${index_2}`]=el_0,key:family,role:"option",onClick:()=>{setCurrentFontsFocusIndex(index_2)},"aria-selected":(index=index_2,currentFontsFocusIndex===index)},react.createElement(FontData,null,react.createElement(StyledText,null,family),react.createElement(Divider,null),react.createElement(FontUrl,null,url)),react.createElement(dashboard_src.m_,{hasTail:!0,title:(0,i18n.__)("Delete font","web-stories")},react.createElement(DeleteButton,{"aria-label":(0,sprintf.A)((0,i18n.__)("Delete %s","web-stories"),family),type:constants.VQ.Tertiary,size:constants.Mp.Small,variant:constants.Ak.Square,onClick:()=>{setToDelete(id),setShowDialog(!0)}},react.createElement(trash.A,null))));var index}))),react.createElement(components.Rw,{size:types.$.Small},TEXT.FONTS_CONTEXT))),showDialog&&react.createElement(confirmationDialog,{onClose:()=>setShowDialog(!1),onPrimary:handleDelete}))},stories={title:"Dashboard/Views/EditorSettings/CustomFonts",component:customFonts,argTypes:{onSubmit:{action:"onSubmitFired"},onDelete:{action:"onDelete fired"}}},_default={render:function Render(args){const[addedFonts,setAddedFonts]=(0,src.J0)(rawCustomFonts),demoId=(0,src.li)(4),handleAddFont=(0,src.hb)((({url})=>{args.onSubmit(url);const fontData={id:demoId,family:`Demo font ${demoId.current}`,url};setAddedFonts([fontData,...addedFonts]),demoId.current=demoId.current+1}),[addedFonts,args]),deleteFont=(0,src.hb)((toDelete=>{args.onDelete(toDelete),setAddedFonts((currentFonts=>currentFonts.filter((({id})=>id!==toDelete))))}),[args]);return react.createElement(customFonts,{addCustomFont:handleAddFont,customFonts:addedFonts,deleteCustomFont:deleteFont})}}},"./packages/wp-dashboard/src/constants/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{M_:()=>settings.M_,qp:()=>settings.qp,Sr:()=>ERRORS,eq:()=>settings.eq});var i18n=__webpack_require__("./packages/i18n/src/i18n.ts");(0,i18n.__)("Setting saved.","web-stories");const ERRORS={UPLOAD_PUBLISHER_LOGO:{MESSAGE:(0,i18n.__)("Unable to add publisher logo","web-stories"),MESSAGE_PLURAL:(0,i18n.__)("Unable to add publisher logos","web-stories")},REMOVE_PUBLISHER_LOGO:{MESSAGE:(0,i18n.__)("Unable to remove publisher logo","web-stories")},REMOVE_FONT:{MESSAGE:(0,i18n.__)("Unable to remove font","web-stories")},UPDATE_PUBLISHER_LOGO:{MESSAGE:(0,i18n.__)("Unable to update publisher logo","web-stories")},LOAD_PUBLISHER_LOGOS:{MESSAGE:(0,i18n.__)("Unable to load publisher logos","web-stories")},LOAD_SETTINGS:{MESSAGE:(0,i18n.__)("Unable to load settings","web-stories")},UPDATE_EDITOR_SETTINGS:{MESSAGE:(0,i18n.__)("Unable to update settings data","web-stories")}};var settings=__webpack_require__("./packages/wp-dashboard/src/constants/settings.js")},"./packages/wp-dashboard/src/constants/settings.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{M_:()=>AD_NETWORK_TYPE,Vr:()=>GOOGLE_ANALYTICS_HANDLER_TYPE,eq:()=>SHOPPING_PROVIDER_TYPE,qp:()=>ARCHIVE_TYPE});var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/i18n/src/i18n.ts");(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Settings","web-stories"),(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("https://wordpress.org/support/plugin/web-stories/","web-stories"),(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Support","web-stories");const AD_NETWORK_TYPE={NONE:"none",ADSENSE:"adsense",ADMANAGER:"admanager",MGID:"mgid"},ARCHIVE_TYPE={DEFAULT:"default",DISABLED:"disabled",CUSTOM:"custom"},SHOPPING_PROVIDER_TYPE={NONE:"none",WOOCOMMERCE:"woocommerce",SHOPIFY:"shopify"},GOOGLE_ANALYTICS_HANDLER_TYPE={SITE_KIT:"site-kit",WEB_STORIES:"web-stories",BOTH:"both"}}}]);