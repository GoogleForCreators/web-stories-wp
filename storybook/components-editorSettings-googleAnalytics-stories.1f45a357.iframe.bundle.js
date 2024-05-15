"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[3032],{"./packages/design-system/src/components/notificationBubble/notificationBubble.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/fullSize.ts"),_theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/centerContent.ts"),_theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/notificationBubble/types.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function getBubbleWidth(numDigits){return 9*(numDigits-1)}const Bubble=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"notificationBubble__Bubble",componentId:"sc-1o8hryh-0"})([""," position:relative;height:","px;width:","px;",";"],(({theme,variant})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["color:",";background-color:",";border-radius:",";"],theme.colors.fg.primary,theme.colors.bg[variant],theme.borders.radius.round)),24,(({digitLen})=>24+getBubbleWidth(digitLen)),(({digitLen,$isSmall})=>$isSmall&&(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["height:","px;width:","px;"],20,20+getBubbleWidth(digitLen)))),Inner=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.span.withConfig({displayName:"notificationBubble__Inner",componentId:"sc-1o8hryh-1"})([""," "," ",";font-weight:",";color:",";user-select:none;"],_theme__WEBPACK_IMPORTED_MODULE_3__.O,_theme__WEBPACK_IMPORTED_MODULE_4__.F,(({$isSmall,theme})=>_theme__WEBPACK_IMPORTED_MODULE_5__.x((({paragraph},sizes)=>paragraph[$isSmall?sizes.XSmall:sizes.Small]))({theme})),(({theme})=>theme.typography.weight.bold),(({$invertColor,theme})=>$invertColor?theme.colors.inverted.fg.primary:theme.colors.fg.primary));function NotificationBubble({notificationCount,isSmall,variant=_types__WEBPACK_IMPORTED_MODULE_6__.I.Accent,invertTextColor,...props}){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Bubble,{variant,$isSmall:isSmall,digitLen:notificationCount?.toString().length||1,...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Inner,{$invertColor:invertTextColor,$isSmall:isSmall,children:notificationCount})})}NotificationBubble.displayName="NotificationBubble";const __WEBPACK_DEFAULT_EXPORT__=NotificationBubble},"./packages/design-system/src/components/notificationBubble/types.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{I:()=>BubbleVariant});let BubbleVariant=function(BubbleVariant){return BubbleVariant.Primary="primary",BubbleVariant.Secondary="secondary",BubbleVariant.Tertiary="tertiary",BubbleVariant.Quaternary="quaternary",BubbleVariant.Positive="positive",BubbleVariant.Negative="negative",BubbleVariant.Accent="accent",BubbleVariant}({})},"./packages/design-system/src/theme/helpers/centerContent.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>centerContent});const centerContent=(0,__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js").AH)(["display:flex;align-items:center;justify-content:center;"])},"./packages/design-system/src/theme/helpers/fullSize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{N:()=>fullSizeRelative,O:()=>fullSizeAbsolute});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const fullSizeAbsolute=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["position:absolute;top:0;right:0;bottom:0;left:0;"]),fullSizeRelative=(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.AH)(["position:relative;top:0;left:0;height:100%;width:100%;"])},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$D:()=>Error,$j:()=>MenuContainer,BO:()=>SettingForm,Cw:()=>UploadedContainer,IT:()=>VisuallyHiddenLabel,J2:()=>TestConnectionButton,Q2:()=>ConnectionHelperText,Qe:()=>MultilineForm,Rw:()=>TextInputHelperText,Sb:()=>CheckboxLabel,Zs:()=>CheckboxLabelText,gH:()=>InlineLink,gq:()=>GridItemButton,gu:()=>Logo,hi:()=>SettingsTextInput,kQ:()=>InlineForm,nq:()=>SettingHeading,o5:()=>CenterMutedText,rF:()=>LogoMenuButton,rW:()=>SettingSubheading,xE:()=>GridItemContainer,yY:()=>SaveButton});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.Zo).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.$).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.s({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.N).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Mp.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.VQ.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Ak.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))},"./packages/wp-dashboard/src/components/editorSettings/googleAnalytics/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>stories});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),translateWithMarkup=__webpack_require__("./packages/i18n/src/translateWithMarkup.tsx"),tracking_src=__webpack_require__("./packages/tracking/src/index.ts"),notificationBubble=__webpack_require__("./packages/design-system/src/components/notificationBubble/notificationBubble.tsx"),exclamation_outline=__webpack_require__("./packages/design-system/src/icons/exclamation_outline.svg"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),dropdown=__webpack_require__("./packages/design-system/src/components/dropDown/dropdown.tsx"),typography_link=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const idFormatRegex=/^ua-\d+-\d+|g-\w+$/;var components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js"),settings=__webpack_require__("./packages/wp-dashboard/src/constants/settings.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const StyledNotificationBubble=(0,styled_components_browser_esm.Ay)(notificationBubble.A).withConfig({displayName:"googleAnalytics__StyledNotificationBubble",componentId:"sc-svg62t-0"})(["display:inline-block;margin-left:10px;"]),TEXT={CONTEXT:(0,i18n.__)("The story editor will append a default, configurable AMP analytics configuration to your story. If you’re interested in going beyond what the default configuration, read this <a>article</a>.","web-stories"),CONTEXT_LINK:"https://blog.amp.dev/2019/08/28/analytics-for-your-amp-stories/",SECTION_HEADING:(0,i18n.__)("Google Analytics","web-stories"),PLACEHOLDER:(0,i18n.__)("Enter your Google Analytics Measurement ID","web-stories"),ARIA_LABEL:(0,i18n.__)("Enter your Google Analytics Measurement ID","web-stories"),INPUT_ERROR:(0,i18n.__)("Invalid ID format","web-stories"),SUBMIT_BUTTON:(0,i18n.__)("Save","web-stories"),SITE_KIT_NOT_INSTALLED:(0,i18n.__)("Install <a>Site Kit by Google</a> to easily enable Google Analytics for Web Stories.","web-stories"),SITE_KIT_INSTALLED:(0,i18n.__)("Use Site Kit by Google to easily<a>activate Google Analytics</a> for Web Stories.","web-stories"),SITE_KIT_IN_USE:(0,i18n.__)("<b>Note: </b>If Site Kit is active, it will be used to set up Google Analytics by default. However, you can customize the behavior in case you need more flexibility.","web-stories"),ANALYTICS_DROPDOWN_LABEL:(0,i18n.__)("Analytics Type","web-stories"),ANALYTICS_DROPDOWN_PLACEHOLDER:(0,i18n.__)("Select Analytics Type","web-stories")},ANALYTICS_DROPDOWN_OPTIONS=[{value:settings.Vr.SITE_KIT,label:(0,i18n.__)("Use Site Kit for analytics (default)","web-stories")},{value:settings.Vr.WEB_STORIES,label:(0,i18n.__)("Use only Web Stories for analytics","web-stories")},{value:settings.Vr.BOTH,label:(0,i18n.__)("Use both","web-stories")}],DropdownContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"googleAnalytics__DropdownContainer",componentId:"sc-svg62t-1"})(["padding-top:12px;"]),WarningContainer=styled_components_browser_esm.Ay.div.withConfig({displayName:"googleAnalytics__WarningContainer",componentId:"sc-svg62t-2"})(["display:flex;gap:8px;margin:14px auto;border:1px solid ",";border-radius:",";padding:8px;"],(({theme})=>theme.colors.border.defaultNormal),(({theme})=>theme.borders.radius.small)),WarningIcon=(0,styled_components_browser_esm.Ay)(exclamation_outline.A).withConfig({displayName:"googleAnalytics__WarningIcon",componentId:"sc-svg62t-3"})(["width:32px;height:100%;color:",";"],(({theme})=>theme.colors.status.warning)),Message=(0,styled_components_browser_esm.Ay)(typography_text.E.Paragraph).attrs({size:types.$.Small}).withConfig({displayName:"googleAnalytics__Message",componentId:"sc-svg62t-4"})(["max-width:calc(100% - 40px);"]);function GoogleAnalyticsSettings({googleAnalyticsId,handleUpdateAnalyticsId,usingLegacyAnalytics,handleMigrateLegacyAnalytics,siteKitStatus={},googleAnalyticsHandler,handleUpdateGoogleAnalyticsHandler}){const[analyticsId,setAnalyticsId]=(0,src.J0)(googleAnalyticsId),[analyticsHandler,setAnalyticsHandler]=(0,src.J0)(googleAnalyticsHandler),[inputError,setInputError]=(0,src.J0)(""),canSave=analyticsId!==googleAnalyticsId&&!inputError,disableSaveButton=!canSave,{analyticsActive,installed,analyticsLink}=siteKitStatus;(0,src.vJ)((()=>{setAnalyticsId(googleAnalyticsId)}),[googleAnalyticsId]),(0,src.vJ)((()=>{setAnalyticsHandler(googleAnalyticsHandler)}),[googleAnalyticsHandler]);const onUpdateAnalyticsId=(0,src.hb)((event=>{const{value}=event.target;setAnalyticsId(value),0===value.length||function validateGoogleAnalyticsIdFormat(value=""){return Boolean(value.toLowerCase().match(idFormatRegex))}(value)?setInputError(""):setInputError(TEXT.INPUT_ERROR)}),[]),onUpdateAnalyticsHandler=(0,src.hb)((value=>{setAnalyticsHandler(value),handleUpdateGoogleAnalyticsHandler(value)}),[handleUpdateGoogleAnalyticsHandler]),handleOnSave=(0,src.hb)((()=>{canSave&&handleUpdateAnalyticsId(analyticsId)}),[canSave,analyticsId,handleUpdateAnalyticsId]),handleOnKeyDown=(0,src.hb)((e=>{"Enter"===e.key&&(e.preventDefault(),handleOnSave())}),[handleOnSave]),handleAnalyticsMigration=(0,src.hb)((evt=>{evt.preventDefault(),handleMigrateLegacyAnalytics(),(0,tracking_src.sx)("migrate_story_auto_analytics")}),[handleMigrateLegacyAnalytics]),onAutoAnalyticsClick=(0,src.hb)((evt=>(0,tracking_src.MP)(evt,"click_auto_analytics_link")),[]),onSiteKitClick=(0,src.hb)((evt=>(0,tracking_src.MP)(evt,"click_site_kit_link")),[]),onContextClick=(0,src.hb)((evt=>(0,tracking_src.MP)(evt,"click_analytics_docs")),[]),siteKitDisplayText=(0,src.Kr)((()=>analyticsActive?null:(0,jsx_runtime.jsx)(translateWithMarkup.A,{mapping:{a:(0,jsx_runtime.jsx)(components.gH,{href:analyticsLink,rel:"noreferrer",target:"_blank",size:types.$.Small,onClick:onSiteKitClick})},children:installed?TEXT.SITE_KIT_INSTALLED:TEXT.SITE_KIT_NOT_INSTALLED})),[analyticsActive,installed,analyticsLink,onSiteKitClick]);return(0,jsx_runtime.jsxs)(components.BO,{onSubmit:e=>e.preventDefault(),children:[(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsxs)(components.nq,{htmlFor:"gaTrackingID",as:"h3",children:[TEXT.SECTION_HEADING,usingLegacyAnalytics&&(0,jsx_runtime.jsx)(StyledNotificationBubble,{notificationCount:1,isSmall:!0})]}),(0,jsx_runtime.jsx)(components.rW,{size:types.$.Small,children:siteKitDisplayText}),usingLegacyAnalytics&&(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(components.rW,{size:types.$.Small,children:(0,jsx_runtime.jsx)(translateWithMarkup.A,{mapping:{a:(0,jsx_runtime.jsx)(components.gH,{href:"https://wp.stories.google/docs/seo/",rel:"noreferrer",target:"_blank",size:types.$.Small,onClick:onAutoAnalyticsClick})},children:(0,i18n.__)("An improved analytics configuration is now available. <a>Learn more</a>.","web-stories")})}),(0,jsx_runtime.jsx)(components.rW,{size:types.$.Small,children:(0,jsx_runtime.jsx)(components.yY,{type:constants.VQ.Secondary,size:constants.Mp.Small,onClick:handleAnalyticsMigration,children:(0,i18n.__)("Migrate","web-stories")})})]})]}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsxs)(components.kQ,{children:[(0,jsx_runtime.jsx)(components.IT,{htmlFor:"gaTrackingId",children:TEXT.ARIA_LABEL}),(0,jsx_runtime.jsx)(components.hi,{"aria-label":TEXT.ARIA_LABEL,id:"gaTrackingId",value:analyticsId,onChange:onUpdateAnalyticsId,onKeyDown:handleOnKeyDown,placeholder:TEXT.PLACEHOLDER,hasError:Boolean(inputError),hint:inputError}),(0,jsx_runtime.jsx)(components.yY,{type:constants.VQ.Secondary,size:constants.Mp.Small,disabled:disableSaveButton,onClick:handleOnSave,children:TEXT.SUBMIT_BUTTON})]}),(0,jsx_runtime.jsx)(components.Rw,{size:types.$.Small,children:(0,jsx_runtime.jsx)(translateWithMarkup.A,{mapping:{a:(0,jsx_runtime.jsx)(components.gH,{href:TEXT.CONTEXT_LINK,rel:"noreferrer",target:"_blank",size:types.$.Small,onClick:onContextClick})},children:TEXT.CONTEXT})}),analyticsActive&&(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(components.Rw,{size:types.$.Small,children:(0,jsx_runtime.jsx)(translateWithMarkup.A,{children:TEXT.SITE_KIT_IN_USE})}),(0,jsx_runtime.jsx)(DropdownContainer,{children:(0,jsx_runtime.jsx)(dropdown.A,{id:"analyticsType",ariaLabel:TEXT.ANALYTICS_DROPDOWN_LABEL,placeholder:TEXT.ANALYTICS_DROPDOWN_PLACEHOLDER,options:ANALYTICS_DROPDOWN_OPTIONS,onMenuItemClick:(_,newValue)=>{onUpdateAnalyticsHandler(newValue)},selectedValue:analyticsHandler})})]}),!googleAnalyticsId||googleAnalyticsId.startsWith("UA-")?(0,jsx_runtime.jsxs)(WarningContainer,{children:[(0,jsx_runtime.jsx)(WarningIcon,{"aria-hidden":!0}),(0,jsx_runtime.jsx)(Message,{children:(0,jsx_runtime.jsx)(translateWithMarkup.A,{mapping:{a:(0,jsx_runtime.jsx)(typography_link.N,{href:(0,i18n.__)("https://support.google.com/analytics/answer/11583528?hl=en","web-stories"),rel:"noreferrer",target:"_blank",size:types.$.Small,onClick:evt=>(0,tracking_src.MP)(evt,"click_ua_deprecation_docs")}),a2:(0,jsx_runtime.jsx)(typography_link.N,{href:(0,i18n.__)("https://support.google.com/analytics/answer/10089681?hl=en","web-stories"),rel:"noreferrer",target:"_blank",size:types.$.Small,onClick:evt=>(0,tracking_src.MP)(evt,"click_ga4_docs")})},children:(0,i18n.__)("As <a>previously announced</a>, Universal Analytics will stop processing new visits starting <b>July 1, 2023</b>. We recommend switching to <a2>Google Analytics 4</a2> (GA4), our analytics product of record.","web-stories")})})]}):null]})]})}GoogleAnalyticsSettings.displayName="GoogleAnalyticsSettings";const googleAnalytics=GoogleAnalyticsSettings,stories={title:"Dashboard/Views/EditorSettings/GoogleAnalytics",component:GoogleAnalyticsSettings,args:{googleAnalyticsId:"UA-000000-98",installed:!1,active:!1,analyticsActive:!1,analyticsLink:""},argTypes:{onUpdateGoogleAnalyticsId:{action:"update google analytics id submitted"},handleUpdateAnalyticsId:{action:"handleUpdateAnalyticsId"}},parameters:{controls:{exclude:["siteKitStatus","usingLegacyAnalytics","handleMigrateLegacyAnalytics"]}}},_default={render:function Render(args){return(0,jsx_runtime.jsx)(googleAnalytics,{siteKitStatus:{installed:args.installed,active:args.active,analyticsActive:args.analyticsActive,analyticsLink:args.analyticsLink},...args})}}},"./packages/wp-dashboard/src/constants/settings.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{M_:()=>AD_NETWORK_TYPE,Vr:()=>GOOGLE_ANALYTICS_HANDLER_TYPE,eq:()=>SHOPPING_PROVIDER_TYPE,qp:()=>ARCHIVE_TYPE});var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/i18n/src/i18n.ts");(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Settings","web-stories"),(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("https://wordpress.org/support/plugin/web-stories/","web-stories"),(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Support","web-stories");const AD_NETWORK_TYPE={NONE:"none",ADSENSE:"adsense",ADMANAGER:"admanager",MGID:"mgid"},ARCHIVE_TYPE={DEFAULT:"default",DISABLED:"disabled",CUSTOM:"custom"},SHOPPING_PROVIDER_TYPE={NONE:"none",WOOCOMMERCE:"woocommerce",SHOPIFY:"shopify"},GOOGLE_ANALYTICS_HANDLER_TYPE={SITE_KIT:"site-kit",WEB_STORIES:"web-stories",BOTH:"both"}}}]);