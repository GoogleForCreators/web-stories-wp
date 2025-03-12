"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[2646],{"./packages/dashboard/node_modules/flagged/dist/flagged.esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{iT:()=>useFeature,nT:()=>FlagsProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var FeatureFlagsContext=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function transformFlags(features){return Array.isArray(features)?Object.fromEntries(features.map((function(feature){return[feature,!0]}))):features}function FlagsProvider(_ref){var a,b,_ref$features=_ref.features,features=void 0===_ref$features?{}:_ref$features,children=_ref.children,currentFeatures=useFeatures();return(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FeatureFlagsContext.Provider,{value:(a=transformFlags(currentFeatures),b=transformFlags(features),_extends({},a,b))},children)}function useFeatures(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(FeatureFlagsContext)}function useFeature(name){var features=useFeatures();return Array.isArray(features)?features.includes(name):"boolean"==typeof features[name]?features[name]:name.split("/").reduce((function(featureGroup,featureName){return"boolean"==typeof featureGroup?featureGroup:void 0!==featureGroup[featureName]&&featureGroup[featureName]}),features)}},"./packages/dashboard/src/app/views/exploreTemplates/filters/TemplateFiltersProvider/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>TemplateFiltersProvider,C:()=>filterContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),_constants_templates__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/constants/templates.ts"),_filters_reducer__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/src/app/views/filters/reducer.js"),_filters_types__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/app/views/filters/types.js");const filterContext=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.q6)({state:{},actions:{}}),{filters:defaultTemplateFilters,sort:defaultTemplateSort}=_constants_templates__WEBPACK_IMPORTED_MODULE_3__.dc;function TemplateFiltersProvider(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(19),{children}=t0;let t1;$[0]===Symbol.for("react.memo_cache_sentinel")?(t1={filters:[],filtersObject:defaultTemplateFilters,sortObject:defaultTemplateSort},$[0]=t1):t1=$[0];const[state,dispatch]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.WO)(_filters_reducer__WEBPACK_IMPORTED_MODULE_4__.A,t1);let t2,t3;$[1]!==dispatch?(t2=(key,value)=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__.bS,payload:{key,value}})},$[1]=dispatch,$[2]=t2):t2=$[2],$[3]===Symbol.for("react.memo_cache_sentinel")?(t3=[],$[3]=t3):t3=$[3];const updateFilter=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.hb)(t2,t3);let t4,t5;$[4]!==dispatch?(t4=values=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__.HX,payload:{type:"template",values}})},$[4]=dispatch,$[5]=t4):t4=$[5],$[6]===Symbol.for("react.memo_cache_sentinel")?(t5=[],$[6]=t5):t5=$[6];const updateSort=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.hb)(t4,t5);let t6,t7;$[7]!==dispatch?(t6=value_0=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__.ak,payload:{value:value_0}})},$[7]=dispatch,$[8]=t6):t6=$[8],$[9]===Symbol.for("react.memo_cache_sentinel")?(t7=[],$[9]=t7):t7=$[9];const registerFilters=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.hb)(t6,t7);let t8,t9;$[10]!==registerFilters||$[11]!==state||$[12]!==updateFilter||$[13]!==updateSort?(t8=()=>({state,actions:{updateSort,updateFilter,registerFilters}}),t9=[state,updateSort,updateFilter,registerFilters],$[10]=registerFilters,$[11]=state,$[12]=updateFilter,$[13]=updateSort,$[14]=t8,$[15]=t9):(t8=$[14],t9=$[15]);const contextValue=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Kr)(t8,t9);let t10;return $[16]!==children||$[17]!==contextValue?(t10=react__WEBPACK_IMPORTED_MODULE_0__.createElement(filterContext.Provider,{value:contextValue},children),$[16]=children,$[17]=contextValue,$[18]=t10):t10=$[18],t10}TemplateFiltersProvider.propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_6___default().node}},"./packages/dashboard/src/app/views/exploreTemplates/filters/useTemplateFilters.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>useTemplateFilters});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts"),_TemplateFiltersProvider__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/filters/TemplateFiltersProvider/index.js");function useTemplateFilters(t0){const selector=void 0===t0?_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.D_:t0;return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.i7)(_TemplateFiltersProvider__WEBPACK_IMPORTED_MODULE_1__.C,selector)}},"./packages/dashboard/src/app/views/exploreTemplates/header/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-compiler-runtime/dist/index.js"),_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react/src/index.ts"),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),flagged__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/node_modules/flagged/dist/flagged.esm.js"),_constants__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),_utils_useTemplateView__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/utils/useTemplateView.js"),_filters_useTemplateFilters__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/filters/useTemplateFilters.js"),_utils__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/dashboard/src/utils/index.js"),_shared__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/dashboard/src/app/views/shared/index.js");function Header(t0){const $=(0,react_compiler_runtime__WEBPACK_IMPORTED_MODULE_1__.c)(35),{isLoading,totalTemplates,view,searchOptions:t1}=t0;let t2;$[0]!==t1?(t2=void 0===t1?[]:t1,$[0]=t1,$[1]=t2):t2=$[1];const searchOptions=t2,enableInProgressTemplateActions=(0,flagged__WEBPACK_IMPORTED_MODULE_3__.iT)("enableInProgressTemplateActions"),{filters:filters_0,sortObject:sortObject_0,updateFilter:updateFilter_0,updateSort:updateSort_0,registerFilters:registerFilters_0}=(0,_filters_useTemplateFilters__WEBPACK_IMPORTED_MODULE_6__.A)(_temp);let t3,t4;$[2]!==filters_0?(t3=()=>{const status=filters_0.find(_temp2),search=filters_0.find(_temp3);return[status?.filterId,search?.filterId]},t4=[filters_0],$[2]=filters_0,$[3]=t3,$[4]=t4):(t3=$[3],t4=$[4]);const[statusFilterValue,searchFilterValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.Kr)(t3,t4);let t5;$[5]!==updateFilter_0?(t5=value=>{updateFilter_0("search",{filterId:value})},$[5]=updateFilter_0,$[6]=t5):t5=$[6];const debouncedSearchChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.YQ)(t5,_constants__WEBPACK_IMPORTED_MODULE_4__.dQ);let t6,t7,t8,t9;$[7]!==registerFilters_0?(t6=()=>{registerFilters_0([{key:"search"}]),registerFilters_0([{key:"status",filterId:_constants__WEBPACK_IMPORTED_MODULE_4__.dc.filters.status}])},t7=[registerFilters_0],$[7]=registerFilters_0,$[8]=t6,$[9]=t7):(t6=$[8],t7=$[9]),(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.vJ)(t6,t7),$[10]!==updateFilter_0?(t8=()=>updateFilter_0("search",{filterId:null}),t9=[updateFilter_0],$[10]=updateFilter_0,$[11]=t8,$[12]=t9):(t8=$[11],t9=$[12]);const clearSearch=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_2__.hb)(t8,t9);let t10;$[13]!==statusFilterValue||$[14]!==totalTemplates?(t10={totalResults:totalTemplates,currentFilter:statusFilterValue,view:_constants__WEBPACK_IMPORTED_MODULE_4__.eZ.TEMPLATES_GALLERY},$[13]=statusFilterValue,$[14]=totalTemplates,$[15]=t10):t10=$[15];const resultsLabel=(0,_utils__WEBPACK_IMPORTED_MODULE_7__.qM)(t10);let t11,t12,t13;$[16]===Symbol.for("react.memo_cache_sentinel")?(t11=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_9__.__)("Explore Templates","web-stories"),t12=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_9__.__)("Search Templates","web-stories"),$[16]=t11,$[17]=t12):(t11=$[16],t12=$[17]),$[18]!==clearSearch||$[19]!==debouncedSearchChange||$[20]!==searchFilterValue||$[21]!==searchOptions?(t13=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared__WEBPACK_IMPORTED_MODULE_8__.Av,{heading:t11,searchPlaceholder:t12,showSearch:!0,searchOptions,searchValue:searchFilterValue,handleSearchChange:debouncedSearchChange,onClear:clearSearch}),$[18]=clearSearch,$[19]=debouncedSearchChange,$[20]=searchFilterValue,$[21]=searchOptions,$[22]=t13):t13=$[22];const t14=view.style,t15=view.toggleStyle;let t16,t17,t18;return $[23]===Symbol.for("react.memo_cache_sentinel")?(t16=(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_9__.__)("Choose sort option for display","web-stories"),$[23]=t16):t16=$[23],$[24]!==enableInProgressTemplateActions||$[25]!==isLoading||$[26]!==resultsLabel||$[27]!==sortObject_0||$[28]!==updateSort_0||$[29]!==view.style||$[30]!==view.toggleStyle?(t17=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared__WEBPACK_IMPORTED_MODULE_8__.WJ,{resultsLabel,layoutStyle:t14,handleLayoutSelect:t15,isLoading,pageSortOptions:_constants__WEBPACK_IMPORTED_MODULE_4__.XS,pageSortDefaultOption:_constants__WEBPACK_IMPORTED_MODULE_4__.D4.POPULAR,currentSort:sortObject_0,handleSortChange:updateSort_0,showSortDropdown:enableInProgressTemplateActions,sortDropdownAriaLabel:t16}),$[24]=enableInProgressTemplateActions,$[25]=isLoading,$[26]=resultsLabel,$[27]=sortObject_0,$[28]=updateSort_0,$[29]=view.style,$[30]=view.toggleStyle,$[31]=t17):t17=$[31],$[32]!==t13||$[33]!==t17?(t18=react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,t13,t17),$[32]=t13,$[33]=t17,$[34]=t18):t18=$[34],t18}function _temp3(t0){const{key:key_0}=t0;return"search"===key_0}function _temp2(t0){const{key}=t0;return"status"===key}function _temp(t0){const{state:t1,actions:t2}=t0,{filters,sortObject}=t1,{updateFilter,updateSort,registerFilters}=t2;return{filters,sortObject,updateFilter,updateSort,registerFilters}}Header.propTypes={isLoading:prop_types__WEBPACK_IMPORTED_MODULE_10___default().bool,totalTemplates:prop_types__WEBPACK_IMPORTED_MODULE_10___default().number,view:_utils_useTemplateView__WEBPACK_IMPORTED_MODULE_5__.Q8.isRequired,searchOptions:prop_types__WEBPACK_IMPORTED_MODULE_10___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_10___default().object)};const __WEBPACK_DEFAULT_EXPORT__=Header},"./packages/dashboard/src/app/views/exploreTemplates/header/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ActiveSearch:()=>ActiveSearch,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),flagged__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/node_modules/flagged/dist/flagged.esm.js"),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/index.js"),_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/header/index.js"),_dataUtils_formattedTemplatesArray__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/dataUtils/formattedTemplatesArray.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/ExploreTemplates/Header",component:___WEBPACK_IMPORTED_MODULE_4__.A,args:{style:_constants__WEBPACK_IMPORTED_MODULE_3__._D.GRID,sortValue:_constants__WEBPACK_IMPORTED_MODULE_3__.D4.POPULAR,filterValue:_constants__WEBPACK_IMPORTED_MODULE_3__.Yz.ALL,keyword:"",enableInProgressTemplateActions:!0},argTypes:{style:{options:_constants__WEBPACK_IMPORTED_MODULE_3__._D,control:"radio"},sortValue:{options:_constants__WEBPACK_IMPORTED_MODULE_3__.D4,control:"radio"},filterValue:{options:_constants__WEBPACK_IMPORTED_MODULE_3__.Yz,control:"radio"},setSort:{action:"set Sort"},setKeyword:{action:"set keyword"},setPage:{action:"set page"},requestNextPage:{action:"request next page clicked"}},parameters:{controls:{include:["setKeyword"],hideNoControlsWarning:!0}}},_default={render:function Render(args){const filter={value:args.filterValue},sort={value:args.sortValue,set:args.setSort},search={keyword:args.keyword,setKeyword:args.setKeyword},view={style:args.style,pageSize:{width:210,height:316}},defaultProps={allPagesFetched:!1,isLoading:!1,page:{value:1,set:args.setPage,requestNextPage:args.requestNextPage},search,templates:_dataUtils_formattedTemplatesArray__WEBPACK_IMPORTED_MODULE_5__.A,sort,filter,view,totalTemplates:3};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(flagged__WEBPACK_IMPORTED_MODULE_1__.nT,{features:args.enableInProgressTemplateActions},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components__WEBPACK_IMPORTED_MODULE_2__.PE.Provider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_4__.A,_extends({},args,defaultProps))))}},ActiveSearch={render:_default,args:{keyword:"demo search"}}}}]);