"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5358],{"./packages/design-system/src/components/checkbox/checkbox.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/icons/checkmark.svg"),_theme_helpers__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const Border=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"checkbox__Border",componentId:"sc-5lv9m4-0"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["position:absolute;height:","px;width:","px;border-radius:",";border:","px solid ",";pointer-events:none;"],24,24,theme.borders.radius.small,1,theme.colors.border.defaultNormal))),StyledCheckmark=(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay)(_icons__WEBPACK_IMPORTED_MODULE_3__.A).attrs({role:"img"}).withConfig({displayName:"checkbox__StyledCheckmark",componentId:"sc-5lv9m4-1"})(["height:auto;width:32px;color:",";"],(({theme})=>theme.colors.fg.primary)),CheckboxContainer=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div.withConfig({displayName:"checkbox__CheckboxContainer",componentId:"sc-5lv9m4-2"})((({theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_2__.AH)(["position:relative;display:flex;justify-content:center;align-items:center;height:","px;width:","px;min-height:","px;min-width:","px;input[type='checkbox']{position:absolute;width:","px;height:","px;margin:0;padding:0;opacity:0;cursor:pointer;:disabled{~ ","{border-color:",";}~ ","{color:",";}}&:focus-visible:not(:active) ~ ","{",";}:active ~ ","{border-color:",";box-shadow:0 0 0 8px ",";}}"],24,24,24,24,25,25,Border,theme.colors.border.disable,StyledCheckmark,theme.colors.fg.disable,Border,(0,_theme_helpers__WEBPACK_IMPORTED_MODULE_4__.g)(theme.colors.border.focus),Border,theme.colors.border.defaultNormal,theme.colors.shadow.active))),__WEBPACK_DEFAULT_EXPORT__=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Rf)((({checked,disabled,className="",...props},ref)=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(CheckboxContainer,{className},react__WEBPACK_IMPORTED_MODULE_0__.createElement("input",_extends({type:"checkbox",ref,checked:Boolean(checked),disabled,"aria-checked":checked},props)),checked&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledCheckmark,{"aria-label":(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Checked","web-stories")}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Border,null))))},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$D:()=>Error,$j:()=>MenuContainer,BO:()=>SettingForm,Cw:()=>UploadedContainer,IT:()=>VisuallyHiddenLabel,J2:()=>TestConnectionButton,Q2:()=>ConnectionHelperText,Qe:()=>MultilineForm,Rw:()=>TextInputHelperText,Sb:()=>CheckboxLabel,Zs:()=>CheckboxLabelText,gH:()=>InlineLink,gq:()=>GridItemButton,gu:()=>Logo,hi:()=>SettingsTextInput,kQ:()=>InlineForm,nq:()=>SettingHeading,o5:()=>CenterMutedText,rF:()=>LogoMenuButton,rW:()=>SettingSubheading,xE:()=>GridItemContainer,yY:()=>SaveButton});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.Zo).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.$).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__.s({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.$.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.N).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.E.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.AH)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.Q),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Mp.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.VQ.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Ak.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.$).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.A).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.Q),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))},"./packages/wp-dashboard/src/components/editorSettings/telemetry/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>stories});var react=__webpack_require__("./node_modules/react/index.js"),src=__webpack_require__("./packages/react/src/index.ts"),v4=__webpack_require__("./packages/wp-dashboard/node_modules/uuid/dist/esm-browser/v4.js"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),translateWithMarkup=__webpack_require__("./packages/i18n/src/translateWithMarkup.tsx"),checkbox_checkbox=__webpack_require__("./packages/design-system/src/components/checkbox/checkbox.tsx"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js");function TelemetrySettings({selected,onCheckboxSelected,disabled}){const telemetryOptInId=(0,src.Kr)((()=>`telemetry-opt-in-${(0,v4.A)()}`),[]);return react.createElement(components.BO,null,react.createElement("div",null,react.createElement(components.nq,null,(0,i18n.__)("Data Sharing Opt-in","web-stories"))),react.createElement("div",null,react.createElement(components.Sb,{htmlFor:telemetryOptInId},react.createElement(checkbox_checkbox.A,{id:telemetryOptInId,"data-testid":"telemetry-settings-checkbox",disabled,onChange:onCheckboxSelected,checked:Boolean(selected)}),react.createElement(components.Zs,{size:types.$.Small,"aria-checked":Boolean(selected)},react.createElement(translateWithMarkup.A,{mapping:{a:react.createElement("a",{href:(0,i18n.__)("https://policies.google.com/privacy","web-stories"),rel:"noreferrer",target:"_blank","aria-label":(0,i18n.__)("Learn more by visiting Google Privacy Policy","web-stories")})}},(0,i18n.__)("Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with <a>Google Privacy Policy</a>.","web-stories"))))))}const stories={title:"Dashboard/Views/EditorSettings/Telemetry",component:TelemetrySettings,args:{disabled:!1,selected:!0},argTypes:{onCheckboxSelected:{action:"onCheckboxSelected fired"}}},_default={render:function Render(args){return react.createElement(TelemetrySettings,args)}}},"./packages/wp-dashboard/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);