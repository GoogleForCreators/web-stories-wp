"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[5313],{"./packages/wp-dashboard/src/components/editorSettings/adManagement/googleAdManager/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>googleAdManager});__webpack_require__("./node_modules/react/index.js");var src=__webpack_require__("./packages/react/src/index.ts"),sprintf=__webpack_require__("./packages/i18n/src/sprintf.ts"),i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts");const adManagerSlotIdFormatRegex=/^\/\d+(,\d+)?(\/[\w\d_\-.*\\!<:()]{1,99}[^/])*$/;var components=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/components.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const TEXT={SLOT_ID_CONTEXT:(0,sprintf.Z)((0,i18n.__)("Example: %s","web-stories"),"/123456789/a4a/amp_story_dfp_example"),SLOT_ID_PLACEHOLDER:(0,i18n.__)("Enter your Slot ID","web-stories"),SLOT_ID_LABEL:(0,i18n.__)("Google Ad Manager Slot ID","web-stories"),INPUT_ERROR:(0,i18n.__)("Invalid ID format","web-stories"),SUBMIT_BUTTON:(0,i18n.__)("Save","web-stories")};const googleAdManager=function GoogleAdManagerSettings({slotId:adManagerSlotId,handleUpdate}){const[slotId,setSlotId]=(0,src.eJ)(adManagerSlotId),[slotIdInputError,setSlotIdInputError]=(0,src.eJ)(""),canSaveSlotId=slotId!==adManagerSlotId&&!slotIdInputError,disableSlotIdSaveButton=!canSaveSlotId;(0,src.d4)((()=>{setSlotId(adManagerSlotId)}),[adManagerSlotId]);const onUpdateSlotId=(0,src.I4)((event=>{const{value}=event.target;setSlotId(value),0===value.length||function validateAdManagerSlotIdFormat(value=""){return Boolean(value.toLowerCase().match(adManagerSlotIdFormatRegex))}(value)?setSlotIdInputError(""):setSlotIdInputError(TEXT.INPUT_ERROR)}),[]),onSaveSlotId=(0,src.I4)((()=>{canSaveSlotId&&handleUpdate(slotId)}),[canSaveSlotId,slotId,handleUpdate]),onKeyDownSlotId=(0,src.I4)((e=>{"Enter"===e.key&&(e.preventDefault(),onSaveSlotId())}),[onSaveSlotId]);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsxs)(components.yN,{children:[(0,jsx_runtime.jsx)(components.xU,{htmlFor:"adManagerSlotId",children:TEXT.SLOT_ID_LABEL}),(0,jsx_runtime.jsx)(components.CG,{id:"adManagerSlotId","aria-label":TEXT.SLOT_ID_LABEL,value:slotId,onChange:onUpdateSlotId,onKeyDown:onKeyDownSlotId,placeholder:TEXT.SLOT_ID_PLACEHOLDER,hasError:Boolean(slotIdInputError),hint:slotIdInputError}),(0,jsx_runtime.jsx)(components.k$,{type:constants.L$.Secondary,size:constants.qE.Small,disabled:disableSlotIdSaveButton,onClick:onSaveSlotId,children:TEXT.SUBMIT_BUTTON})]}),(0,jsx_runtime.jsx)(components.rJ,{size:types.TextSize.Small,children:TEXT.SLOT_ID_CONTEXT})]})}},"./packages/wp-dashboard/src/components/editorSettings/adManagement/googleAdManager/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var ___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/wp-dashboard/src/components/editorSettings/adManagement/googleAdManager/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/EditorSettings/AdManagement/GoogleAdManager",component:___WEBPACK_IMPORTED_MODULE_1__.Z,args:{slotId:""},argTypes:{handleUpdate:{action:"update google ad manager"}}},_default={render:function Render(args){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(___WEBPACK_IMPORTED_MODULE_1__.Z,{...args})}}},"./packages/wp-dashboard/src/components/editorSettings/components.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B5:()=>SettingHeading,CG:()=>SettingsTextInput,Dl:()=>UploadedContainer,Fe:()=>MenuContainer,GN:()=>GridItemContainer,Me:()=>ConnectionHelperText,O3:()=>SettingForm,Ro:()=>TestConnectionButton,Ry:()=>CenterMutedText,TR:()=>Logo,Un:()=>InlineLink,_T:()=>CheckboxLabelText,jj:()=>Error,k$:()=>SaveButton,ke:()=>CheckboxLabel,oV:()=>GridItemButton,rJ:()=>TextInputHelperText,wE:()=>LogoMenuButton,xU:()=>VisuallyHiddenLabel,xh:()=>MultilineForm,xs:()=>SettingSubheading,yN:()=>InlineForm});var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/design-system/src/components/typography/link/index.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./packages/design-system/src/theme/helpers/visuallyHidden.ts"),_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/dashboard/src/index.js");styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.div.withConfig({displayName:"editorSettings__Wrapper",componentId:"sc-1y9ilpk-0"})([""]),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_dashboard__WEBPACK_IMPORTED_MODULE_0__.wD).withConfig({displayName:"editorSettings__Main",componentId:"sc-1y9ilpk-1"})(["display:flex;flex-direction:column;padding-top:36px;margin-top:20px;margin-bottom:56px;max-width:945px;"]);const SettingForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.form.withConfig({displayName:"editorSettings__SettingForm",componentId:"sc-1y9ilpk-2"})(["display:grid;grid-template-columns:27% minmax(400px,1fr);column-gap:6.56%;padding-bottom:52px;@media ","{grid-template-columns:100%;row-gap:20px;}"],(({theme})=>theme.breakpoint.mobile)),SettingHeading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_2__.s).attrs({as:"h3"}).withConfig({displayName:"editorSettings__SettingHeading",componentId:"sc-1y9ilpk-3"})(["",";margin:8px 0;"],(({theme})=>_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_3__._({preset:{...theme.typography.presets.label[_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_4__.TextSize.Large]},theme}))),InlineLink=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_5__.r).withConfig({displayName:"editorSettings__InlineLink",componentId:"sc-1y9ilpk-4"})(["display:inline-block;"]),HelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.x.Paragraph).withConfig({displayName:"editorSettings__HelperText",componentId:"sc-1y9ilpk-5"})(["color:",";"],(({theme})=>theme.colors.fg.tertiary)),ConnectionHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.x.Paragraph).withConfig({displayName:"editorSettings__ConnectionHelperText",componentId:"sc-1y9ilpk-6"})(["padding-top:12px;color:",";"],(({hasError,theme})=>hasError?theme.colors.fg.negative:theme.colors.fg.tertiary)),CenterMutedText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.x.Paragraph).withConfig({displayName:"editorSettings__CenterMutedText",componentId:"sc-1y9ilpk-7"})(["color:",";text-align:center;"],(({theme})=>theme.colors.fg.tertiary)),SettingSubheading=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(HelperText).withConfig({displayName:"editorSettings__SettingSubheading",componentId:"sc-1y9ilpk-8"})(["padding:8px 0;"]),TextInputHelperText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(HelperText).withConfig({displayName:"editorSettings__TextInputHelperText",componentId:"sc-1y9ilpk-9"})(["padding-top:12px;"]),CheckboxLabel=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_6__.x.Label).withConfig({displayName:"editorSettings__CheckboxLabel",componentId:"sc-1y9ilpk-10"})(["display:flex;justify-content:flex-start;margin-top:8px;cursor:pointer;"]),CheckboxLabelText=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(HelperText).withConfig({displayName:"editorSettings__CheckboxLabelText",componentId:"sc-1y9ilpk-11"})(["margin-left:8px;"]),Error=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(CenterMutedText).withConfig({displayName:"editorSettings__Error",componentId:"sc-1y9ilpk-12"})(["padding-bottom:10px;color:",";"],(({theme})=>theme.colors.fg.negative)),UploadedContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.div.withConfig({displayName:"editorSettings__UploadedContainer",componentId:"sc-1y9ilpk-13"})(["display:grid;grid-template-columns:repeat(auto-fill,102px);grid-auto-rows:102px;grid-column-gap:12px;grid-row-gap:20px;padding-bottom:20px;margin-bottom:4px;border:1px solid transparent;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.L),GridItemContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.div.withConfig({displayName:"editorSettings__GridItemContainer",componentId:"sc-1y9ilpk-14"})(["position:relative;",";&:hover,&:focus-within{button{opacity:1 !important;}}"],(({active,theme})=>active&&(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.iv)(["border:1px solid ",";border-radius:",";"],theme.colors.border.defaultActive,theme.borders.radius.small))),GridItemButton=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.button.withConfig({displayName:"editorSettings__GridItemButton",componentId:"sc-1y9ilpk-15"})(["display:block;background-color:transparent;border:2px solid transparent;width:100%;height:100%;border-radius:4px;padding:0;",";"],_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_7__.L),Logo=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.img.withConfig({displayName:"editorSettings__Logo",componentId:"sc-1y9ilpk-16"})(["object-fit:cover;width:100%;height:100%;border-radius:4px;"]),MenuContainer=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.div.withConfig({displayName:"editorSettings__MenuContainer",componentId:"sc-1y9ilpk-17"})(["position:absolute;top:0;width:100%;height:100%;"]),LogoMenuButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.z).attrs({size:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.qE.Small,type:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.L$.Secondary,variant:_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_9__.Wu.Circle}).withConfig({displayName:"editorSettings__LogoMenuButton",componentId:"sc-1y9ilpk-18"})(["opacity:",";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"],(({isActive,menuOpen})=>menuOpen||isActive?1:0)),SaveButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.z).withConfig({displayName:"editorSettings__SaveButton",componentId:"sc-1y9ilpk-19"})(["height:36px;"]),TestConnectionButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_8__.z).withConfig({displayName:"editorSettings__TestConnectionButton",componentId:"sc-1y9ilpk-20"})(["height:36px;margin-top:12px;"]),InlineForm=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.div.withConfig({displayName:"editorSettings__InlineForm",componentId:"sc-1y9ilpk-21"})(["display:flex;align-items:flex-start;"]),VisuallyHiddenLabel=styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.label.withConfig({displayName:"editorSettings__VisuallyHiddenLabel",componentId:"sc-1y9ilpk-22"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.j),SettingsTextInput=(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_11__.Z).withConfig({displayName:"editorSettings__SettingsTextInput",componentId:"sc-1y9ilpk-23"})(["margin-right:8px;"]),MultilineForm=(styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.span.withConfig({displayName:"editorSettings__VisuallyHiddenDescription",componentId:"sc-1y9ilpk-24"})(_googleforcreators_design_system__WEBPACK_IMPORTED_MODULE_10__.j),(0,styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP)(SettingForm).withConfig({displayName:"editorSettings__MultilineForm",componentId:"sc-1y9ilpk-25"})(["margin-bottom:28px;","{margin-top:20px;}"],InlineForm))},"./node_modules/react-transition-group/esm/TransitionGroup.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_TransitionGroup});var objectWithoutPropertiesLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),assertThisInitialized=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js"),inheritsLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js"),react=__webpack_require__("./node_modules/react/index.js"),TransitionGroupContext=__webpack_require__("./node_modules/react-transition-group/esm/TransitionGroupContext.js");function getChildMapping(children,mapFn){var result=Object.create(null);return children&&react.Children.map(children,(function(c){return c})).forEach((function(child){result[child.key]=function mapper(child){return mapFn&&(0,react.isValidElement)(child)?mapFn(child):child}(child)})),result}function getProp(child,prop,props){return null!=props[prop]?props[prop]:child.props[prop]}function getNextChildMapping(nextProps,prevChildMapping,onExited){var nextChildMapping=getChildMapping(nextProps.children),children=function mergeChildMappings(prev,next){function getValueForKey(key){return key in next?next[key]:prev[key]}prev=prev||{},next=next||{};var i,nextKeysPending=Object.create(null),pendingKeys=[];for(var prevKey in prev)prevKey in next?pendingKeys.length&&(nextKeysPending[prevKey]=pendingKeys,pendingKeys=[]):pendingKeys.push(prevKey);var childMapping={};for(var nextKey in next){if(nextKeysPending[nextKey])for(i=0;i<nextKeysPending[nextKey].length;i++){var pendingNextKey=nextKeysPending[nextKey][i];childMapping[nextKeysPending[nextKey][i]]=getValueForKey(pendingNextKey)}childMapping[nextKey]=getValueForKey(nextKey)}for(i=0;i<pendingKeys.length;i++)childMapping[pendingKeys[i]]=getValueForKey(pendingKeys[i]);return childMapping}(prevChildMapping,nextChildMapping);return Object.keys(children).forEach((function(key){var child=children[key];if((0,react.isValidElement)(child)){var hasPrev=key in prevChildMapping,hasNext=key in nextChildMapping,prevChild=prevChildMapping[key],isLeaving=(0,react.isValidElement)(prevChild)&&!prevChild.props.in;!hasNext||hasPrev&&!isLeaving?hasNext||!hasPrev||isLeaving?hasNext&&hasPrev&&(0,react.isValidElement)(prevChild)&&(children[key]=(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:prevChild.props.in,exit:getProp(child,"exit",nextProps),enter:getProp(child,"enter",nextProps)})):children[key]=(0,react.cloneElement)(child,{in:!1}):children[key]=(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:!0,exit:getProp(child,"exit",nextProps),enter:getProp(child,"enter",nextProps)})}})),children}var values=Object.values||function(obj){return Object.keys(obj).map((function(k){return obj[k]}))},TransitionGroup=function(_React$Component){function TransitionGroup(props,context){var _this,handleExited=(_this=_React$Component.call(this,props,context)||this).handleExited.bind((0,assertThisInitialized.Z)(_this));return _this.state={contextValue:{isMounting:!0},handleExited,firstRender:!0},_this}(0,inheritsLoose.Z)(TransitionGroup,_React$Component);var _proto=TransitionGroup.prototype;return _proto.componentDidMount=function componentDidMount(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},_proto.componentWillUnmount=function componentWillUnmount(){this.mounted=!1},TransitionGroup.getDerivedStateFromProps=function getDerivedStateFromProps(nextProps,_ref){var props,onExited,prevChildMapping=_ref.children,handleExited=_ref.handleExited;return{children:_ref.firstRender?(props=nextProps,onExited=handleExited,getChildMapping(props.children,(function(child){return(0,react.cloneElement)(child,{onExited:onExited.bind(null,child),in:!0,appear:getProp(child,"appear",props),enter:getProp(child,"enter",props),exit:getProp(child,"exit",props)})}))):getNextChildMapping(nextProps,prevChildMapping,handleExited),firstRender:!1}},_proto.handleExited=function handleExited(child,node){var currentChildMapping=getChildMapping(this.props.children);child.key in currentChildMapping||(child.props.onExited&&child.props.onExited(node),this.mounted&&this.setState((function(state){var children=(0,esm_extends.Z)({},state.children);return delete children[child.key],{children}})))},_proto.render=function render(){var _this$props=this.props,Component=_this$props.component,childFactory=_this$props.childFactory,props=(0,objectWithoutPropertiesLoose.Z)(_this$props,["component","childFactory"]),contextValue=this.state.contextValue,children=values(this.state.children).map(childFactory);return delete props.appear,delete props.enter,delete props.exit,null===Component?react.createElement(TransitionGroupContext.Z.Provider,{value:contextValue},children):react.createElement(TransitionGroupContext.Z.Provider,{value:contextValue},react.createElement(Component,props,children))},TransitionGroup}(react.Component);TransitionGroup.propTypes={},TransitionGroup.defaultProps={component:"div",childFactory:function childFactory(child){return child}};const esm_TransitionGroup=TransitionGroup},"./packages/dashboard/node_modules/flagged/dist/flagged.esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q_:()=>FlagsProvider,SS:()=>useFeature});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var FeatureFlagsContext=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function transformFlags(features){return Array.isArray(features)?Object.fromEntries(features.map((function(feature){return[feature,!0]}))):features}function FlagsProvider(_ref){var a,b,_ref$features=_ref.features,features=void 0===_ref$features?{}:_ref$features,children=_ref.children,currentFeatures=useFeatures();return(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FeatureFlagsContext.Provider,{value:(a=transformFlags(currentFeatures),b=transformFlags(features),_extends({},a,b))},children)}function useFeatures(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(FeatureFlagsContext)}function useFeature(name){var features=useFeatures();return Array.isArray(features)?features.includes(name):"boolean"==typeof features[name]?features[name]:name.split("/").reduce((function(featureGroup,featureName){return"boolean"==typeof featureGroup?featureGroup:void 0!==featureGroup[featureName]&&featureGroup[featureName]}),features)}},"./packages/design-system/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);