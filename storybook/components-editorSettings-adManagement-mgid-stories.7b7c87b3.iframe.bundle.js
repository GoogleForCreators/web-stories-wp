"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[1711],{"./packages/wp-dashboard/src/components/editorSettings/adManagement/mgid/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>mgid});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),src=__webpack_require__("./packages/react/src/index.ts"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts");const mgidWidgetIdFormatRegex=/^\d{7,20}$/;var components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js");const TEXT={WIDGET_ID_CONTEXT:(0,sprintf.A)((0,i18n.__)("Example: %s","web-stories"),"1234567"),WIDGET_ID_PLACEHOLDER:(0,i18n.__)("Enter your MGID Widget ID","web-stories"),WIDGET_ID_LABEL:(0,i18n.__)("Widget ID","web-stories"),INPUT_ERROR:(0,i18n.__)("Invalid ID format","web-stories"),SUBMIT_BUTTON:(0,i18n.__)("Save","web-stories")};function MgidSettings(t0){const $=(0,dist.c)(33),{widgetId:mgidWidgetId,handleUpdate}=t0,[widgetId,setWidgetId]=(0,src.J0)(mgidWidgetId),[widgetIdInputError,setWidgetIdInputError]=(0,src.J0)(""),canSaveWidgetId=widgetId!==mgidWidgetId&&!widgetIdInputError,disableWidgetIdSaveButton=!canSaveWidgetId;let t1,t2,t3,t4;$[0]!==mgidWidgetId||$[1]!==setWidgetId?(t1=()=>{setWidgetId(mgidWidgetId)},$[0]=mgidWidgetId,$[1]=setWidgetId,$[2]=t1):t1=$[2],$[3]!==mgidWidgetId?(t2=[mgidWidgetId],$[3]=mgidWidgetId,$[4]=t2):t2=$[4],(0,src.vJ)(t1,t2),$[5]!==setWidgetId||$[6]!==setWidgetIdInputError?(t3=event=>{const{value}=event.target;setWidgetId(value),0===value.length||function validateMgidWidgetIdFormat(value=""){return Boolean(value.toLowerCase().match(mgidWidgetIdFormatRegex))}(value)?setWidgetIdInputError(""):setWidgetIdInputError(TEXT.INPUT_ERROR)},$[5]=setWidgetId,$[6]=setWidgetIdInputError,$[7]=t3):t3=$[7],$[8]===Symbol.for("react.memo_cache_sentinel")?(t4=[],$[8]=t4):t4=$[8];const onUpdateWidgetId=(0,src.hb)(t3,t4);let t5,t6;$[9]!==canSaveWidgetId||$[10]!==handleUpdate||$[11]!==widgetId?(t5=()=>{canSaveWidgetId&&handleUpdate(widgetId)},t6=[canSaveWidgetId,widgetId,handleUpdate],$[9]=canSaveWidgetId,$[10]=handleUpdate,$[11]=widgetId,$[12]=t5,$[13]=t6):(t5=$[12],t6=$[13]);const onSaveWidgetId=(0,src.hb)(t5,t6);let t7,t8;$[14]!==onSaveWidgetId?(t7=e=>{"Enter"===e.key&&(e.preventDefault(),onSaveWidgetId())},t8=[onSaveWidgetId],$[14]=onSaveWidgetId,$[15]=t7,$[16]=t8):(t7=$[15],t8=$[16]);const onKeyDownWidgetId=(0,src.hb)(t7,t8);let t9;$[17]===Symbol.for("react.memo_cache_sentinel")?(t9=react.createElement(components.IT,{htmlFor:"mgidWidgetId"},TEXT.WIDGET_ID_LABEL),$[17]=t9):t9=$[17];const t10=Boolean(widgetIdInputError);let t11,t12,t13,t14,t15;return $[18]!==onKeyDownWidgetId||$[19]!==onUpdateWidgetId||$[20]!==t10||$[21]!==widgetId||$[22]!==widgetIdInputError?(t11=react.createElement(components.hi,{id:"mgidWidgetId","aria-label":TEXT.WIDGET_ID_LABEL,value:widgetId,onChange:onUpdateWidgetId,onKeyDown:onKeyDownWidgetId,placeholder:TEXT.WIDGET_ID_PLACEHOLDER,hasError:t10,hint:widgetIdInputError}),$[18]=onKeyDownWidgetId,$[19]=onUpdateWidgetId,$[20]=t10,$[21]=widgetId,$[22]=widgetIdInputError,$[23]=t11):t11=$[23],$[24]!==disableWidgetIdSaveButton||$[25]!==onSaveWidgetId?(t12=react.createElement(components.yY,{type:constants.VQ.Secondary,size:constants.Mp.Small,disabled:disableWidgetIdSaveButton,onClick:onSaveWidgetId},TEXT.SUBMIT_BUTTON),$[24]=disableWidgetIdSaveButton,$[25]=onSaveWidgetId,$[26]=t12):t12=$[26],$[27]!==t11||$[28]!==t12?(t13=react.createElement(components.kQ,null,t9,t11,t12),$[27]=t11,$[28]=t12,$[29]=t13):t13=$[29],$[30]===Symbol.for("react.memo_cache_sentinel")?(t14=react.createElement(components.Rw,{size:types.$.Small},TEXT.WIDGET_ID_CONTEXT),$[30]=t14):t14=$[30],$[31]!==t13?(t15=react.createElement(react.Fragment,null,t13,t14),$[31]=t13,$[32]=t15):t15=$[32],t15}MgidSettings.propTypes={handleUpdate:prop_types_default().func,widgetId:prop_types_default().string};const mgid=MgidSettings},"./packages/wp-dashboard/src/components/editorSettings/adManagement/mgid/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/adManagement/mgid/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/EditorSettings/AdManagement/Mgid",component:___WEBPACK_IMPORTED_MODULE_1__.A,args:{widgetId:""},argTypes:{handleUpdate:{action:"update mgid"}}},_default={render:function Render(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_1__.A,args)}}},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$D:()=>Error,$j:()=>MenuContainer,BO:()=>SettingForm,Cw:()=>UploadedContainer,IT:()=>VisuallyHiddenLabel,J2:()=>TestConnectionButton,Q2:()=>ConnectionHelperText,Qe:()=>MultilineForm,Rw:()=>TextInputHelperText,Sb:()=>CheckboxLabel,Zs:()=>CheckboxLabelText,gH:()=>InlineLink,gq:()=>GridItemButton,gu:()=>Logo,hi:()=>SettingsTextInput,kQ:()=>InlineForm,nq:()=>SettingHeading,o5:()=>CenterMutedText,rF:()=>LogoMenuButton,rW:()=>SettingSubheading,xE:()=>GridItemContainer,yY:()=>SaveButton});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.Zo).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.$).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.s({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.N).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Mp.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.VQ.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Ak.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))}}]);