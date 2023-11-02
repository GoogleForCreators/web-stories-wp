"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9209],{"./packages/dashboard/src/app/views/exploreTemplates/filters/TemplateFiltersProvider/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>TemplateFiltersProvider,u:()=>filterContext});__webpack_require__("./node_modules/react/index.js");var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react/src/index.ts"),_constants_templates__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/constants/templates.ts"),_filters_reducer__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/app/views/filters/reducer.js"),_filters_types__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/app/views/filters/types.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const filterContext=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.kr)({state:{},actions:{}}),{filters:defaultTemplateFilters,sort:defaultTemplateSort}=_constants_templates__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_TEMPLATE_FILTERS;function TemplateFiltersProvider(_ref){let{children}=_ref;const[state,dispatch]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__._Y)(_filters_reducer__WEBPACK_IMPORTED_MODULE_3__.Z,{filters:[],filtersObject:defaultTemplateFilters,sortObject:defaultTemplateSort}),updateFilter=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.I4)(((key,value)=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__._u,payload:{key,value}})}),[]),updateSort=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.I4)((values=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__.uM,payload:{type:"template",values}})}),[]),registerFilters=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.I4)((value=>{dispatch({type:_filters_types__WEBPACK_IMPORTED_MODULE_5__.zf,payload:{value}})}),[]),contextValue=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_1__.Ye)((()=>({state,actions:{updateSort,updateFilter,registerFilters}})),[state,updateSort,updateFilter,registerFilters]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(filterContext.Provider,{value:contextValue,children})}TemplateFiltersProvider.displayName="TemplateFiltersProvider"},"./packages/dashboard/src/app/views/exploreTemplates/filters/useTemplateFilters.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useTemplateFilters});var _googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react/src/index.ts"),_TemplateFiltersProvider__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/filters/TemplateFiltersProvider/index.js");function useTemplateFilters(){let selector=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.yR;return(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_0__.Sz)(_TemplateFiltersProvider__WEBPACK_IMPORTED_MODULE_1__.u,selector)}},"./packages/dashboard/src/app/views/exploreTemplates/header/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.find.js");var _googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./packages/i18n/src/i18n.ts"),_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/react/src/index.ts"),flagged__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/node_modules/flagged/dist/flagged.esm.js"),_constants__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),_filters_useTemplateFilters__WEBPACK_IMPORTED_MODULE_7__=(__webpack_require__("./packages/dashboard/src/utils/useTemplateView.js"),__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/filters/useTemplateFilters.js")),_utils__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/dashboard/src/utils/index.js"),_shared__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./packages/dashboard/src/app/views/shared/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=function Header(_ref){let{isLoading,totalTemplates,view,searchOptions=[]}=_ref;const enableInProgressTemplateActions=(0,flagged__WEBPACK_IMPORTED_MODULE_4__.SS)("enableInProgressTemplateActions"),{filters,sortObject,updateFilter,updateSort,registerFilters}=(0,_filters_useTemplateFilters__WEBPACK_IMPORTED_MODULE_7__.Z)((_ref2=>{let{state:{filters,sortObject},actions:{updateFilter,updateSort,registerFilters}}=_ref2;return{filters,sortObject,updateFilter,updateSort,registerFilters}})),[statusFilterValue,searchFilterValue]=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.Ye)((()=>{const status=filters.find((_ref3=>{let{key}=_ref3;return"status"===key})),search=filters.find((_ref4=>{let{key}=_ref4;return"search"===key}));return[status?.filterId,search?.filterId]}),[filters]),debouncedSearchChange=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.y1)((value=>{updateFilter("search",{filterId:value})}),_constants__WEBPACK_IMPORTED_MODULE_5__.p$);(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.d4)((()=>{registerFilters([{key:"search"}]),registerFilters([{key:"status",filterId:_constants__WEBPACK_IMPORTED_MODULE_5__.z7.filters.status}])}),[registerFilters]);const clearSearch=(0,_googleforcreators_react__WEBPACK_IMPORTED_MODULE_3__.I4)((()=>updateFilter("search",{filterId:null})),[updateFilter]),resultsLabel=(0,_utils__WEBPACK_IMPORTED_MODULE_8__.Uv)({totalResults:totalTemplates,currentFilter:statusFilterValue,view:_constants__WEBPACK_IMPORTED_MODULE_5__.g3.TEMPLATES_GALLERY});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared__WEBPACK_IMPORTED_MODULE_9__.CD,{heading:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_11__.__)("Explore Templates","web-stories"),searchPlaceholder:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_11__.__)("Search Templates","web-stories"),showSearch:!0,searchOptions,searchValue:searchFilterValue,handleSearchChange:debouncedSearchChange,onClear:clearSearch}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_shared__WEBPACK_IMPORTED_MODULE_9__.dA,{resultsLabel,layoutStyle:view.style,handleLayoutSelect:view.toggleStyle,isLoading,pageSortOptions:_constants__WEBPACK_IMPORTED_MODULE_5__.Fd,pageSortDefaultOption:_constants__WEBPACK_IMPORTED_MODULE_5__.Ce.POPULAR,currentSort:sortObject,handleSortChange:updateSort,showSortDropdown:enableInProgressTemplateActions,sortDropdownAriaLabel:(0,_googleforcreators_i18n__WEBPACK_IMPORTED_MODULE_11__.__)("Choose sort option for display","web-stories")})]})}},"./packages/dashboard/src/app/views/exploreTemplates/header/stories/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ActiveSearch:()=>ActiveSearch,_default:()=>_default,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var flagged__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/dashboard/node_modules/flagged/dist/flagged.esm.js"),_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/dashboard/src/components/index.js"),_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/dashboard/src/constants/index.ts"),___WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/dashboard/src/app/views/exploreTemplates/header/index.js"),_dataUtils_formattedTemplatesArray__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/dashboard/src/dataUtils/formattedTemplatesArray.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Dashboard/Views/ExploreTemplates/Header",component:___WEBPACK_IMPORTED_MODULE_4__.Z,args:{style:_constants__WEBPACK_IMPORTED_MODULE_3__.$Y.GRID,sortValue:_constants__WEBPACK_IMPORTED_MODULE_3__.Ce.POPULAR,filterValue:_constants__WEBPACK_IMPORTED_MODULE_3__.d5.ALL,keyword:"",enableInProgressTemplateActions:!0},argTypes:{style:{options:_constants__WEBPACK_IMPORTED_MODULE_3__.$Y,control:"radio"},sortValue:{options:_constants__WEBPACK_IMPORTED_MODULE_3__.Ce,control:"radio"},filterValue:{options:_constants__WEBPACK_IMPORTED_MODULE_3__.d5,control:"radio"},setSort:{action:"set Sort"},setKeyword:{action:"set keyword"},setPage:{action:"set page"},requestNextPage:{action:"request next page clicked"}},parameters:{controls:{include:["setKeyword"],hideNoControlsWarning:!0}}},_default={render:function Render(args){const filter={value:args.filterValue},sort={value:args.sortValue,set:args.setSort},search={keyword:args.keyword,setKeyword:args.setKeyword},view={style:args.style,pageSize:{width:210,height:316}},defaultProps={allPagesFetched:!1,isLoading:!1,page:{value:1,set:args.setPage,requestNextPage:args.requestNextPage},search,templates:_dataUtils_formattedTemplatesArray__WEBPACK_IMPORTED_MODULE_5__.Z,sort,filter,view,totalTemplates:3};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(flagged__WEBPACK_IMPORTED_MODULE_1__.Q_,{features:args.enableInProgressTemplateActions,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components__WEBPACK_IMPORTED_MODULE_2__.Ar.Provider,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.Z,{...args,...defaultProps})})})}},ActiveSearch={render:_default,args:{keyword:"demo search"}}},"./node_modules/core-js/internals/get-iterator-flattenable.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorMethod=__webpack_require__("./node_modules/core-js/internals/get-iterator-method.js");module.exports=function(obj,stringHandling){stringHandling&&"string"==typeof obj||anObject(obj);var method=getIteratorMethod(obj);return getIteratorDirect(anObject(void 0!==method?call(method,obj):obj))}},"./node_modules/core-js/modules/esnext.iterator.find.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{find:function find(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop(value)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},"./node_modules/core-js/modules/esnext.iterator.flat-map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),getIteratorFlattenable=__webpack_require__("./node_modules/core-js/internals/get-iterator-flattenable.js"),createIteratorProxy=__webpack_require__("./node_modules/core-js/internals/iterator-create-proxy.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),IteratorProxy=createIteratorProxy((function(){for(var result,inner,iterator=this.iterator,mapper=this.mapper;;){if(inner=this.inner)try{if(!(result=anObject(call(inner.next,inner.iterator))).done)return result.value;this.inner=null}catch(error){iteratorClose(iterator,"throw",error)}if(result=anObject(call(this.next,iterator)),this.done=!!result.done)return;try{this.inner=getIteratorFlattenable(mapper(result.value,this.counter++),!1)}catch(error){iteratorClose(iterator,"throw",error)}}}));$({target:"Iterator",proto:!0,real:!0,forced:IS_PURE},{flatMap:function flatMap(mapper){return anObject(this),aCallable(mapper),new IteratorProxy(getIteratorDirect(this),{mapper,inner:null})}})},"./packages/dashboard/node_modules/flagged/dist/flagged.esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Q_:()=>FlagsProvider,SS:()=>useFeature});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var FeatureFlagsContext=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function transformFlags(features){return Array.isArray(features)?Object.fromEntries(features.map((function(feature){return[feature,!0]}))):features}function FlagsProvider(_ref){var a,b,_ref$features=_ref.features,features=void 0===_ref$features?{}:_ref$features,children=_ref.children,currentFeatures=useFeatures();return(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FeatureFlagsContext.Provider,{value:(a=transformFlags(currentFeatures),b=transformFlags(features),_extends({},a,b))},children)}function useFeatures(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(FeatureFlagsContext)}function useFeature(name){var features=useFeatures();return Array.isArray(features)?features.includes(name):"boolean"==typeof features[name]?features[name]:name.split("/").reduce((function(featureGroup,featureName){return"boolean"==typeof featureGroup?featureGroup:void 0!==featureGroup[featureName]&&featureGroup[featureName]}),features)}}}]);