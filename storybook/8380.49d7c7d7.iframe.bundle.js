"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[8380],{"./packages/design-system/src/components/typography/list/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{a:()=>List});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/design-system/src/theme/types.ts"),_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/design-system/src/components/typography/styles.ts");const List=styled_components__WEBPACK_IMPORTED_MODULE_0__.ZP.ul.withConfig({displayName:"list__List",componentId:"sc-blyefz-0"})((({size=_theme__WEBPACK_IMPORTED_MODULE_1__.TextSize.Small,theme})=>(0,styled_components__WEBPACK_IMPORTED_MODULE_0__.iv)(["list-style-type:disc;list-style-position:outside;margin:0;padding:0;li{",";",";padding:0;margin:0;}"],_styles__WEBPACK_IMPORTED_MODULE_2__.y,_theme__WEBPACK_IMPORTED_MODULE_3__._({preset:theme.typography.presets.paragraph[size],theme}))))},"./packages/story-editor/src/app/taxonomy/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>taxonomyProvider,M:()=>taxonomy_useTaxonomy});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.find.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.for-each.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var src=__webpack_require__("./packages/react/src/index.ts"),cleanForSlug=__webpack_require__("./packages/story-editor/src/utils/cleanForSlug.ts"),api=__webpack_require__("./packages/story-editor/src/app/api/index.ts"),story=__webpack_require__("./packages/story-editor/src/app/story/index.ts");__webpack_require__("./node_modules/core-js/modules/esnext.iterator.reduce.js");const utils_removeDupsFromArray=(arr,key)=>arr.reduce(((acc,current)=>acc.find((term=>term[key]===current[key]))?acc:acc.concat([current])),[]),context=(0,src.kr)({state:{taxonomies:[],termCache:[],terms:[]},actions:{createTerm:()=>Promise.resolve(void 0),addSearchResultsToCache:()=>Promise.resolve(void 0),addTerms:()=>{},removeTerms:()=>{}}});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function TaxonomyProvider(props){const[shouldRefetchCategories,setShouldRefetchCategories]=(0,src.eJ)(!0),{updateStory,terms}=(0,story.rB)((({state:{pages,story},actions:{updateStory}})=>({updateStory,isStoryLoaded:pages.length>0,terms:story.terms||[]}))),[hasTaxonomies,setHasTaxonomies]=(0,src.eJ)(!1),[taxonomies,setTaxonomies]=(0,src.eJ)([]),[termCache,setTermCache]=(0,src.eJ)([]),{actions:{getTaxonomyTerm,createTaxonomyTerm,getTaxonomies}}=(0,api.Ek)();(0,src.d4)((()=>{!hasTaxonomies&&getTaxonomies&&(async()=>{try{const result=await getTaxonomies();setTaxonomies(result)}catch(e){e instanceof Error&&console.error(e.message)}finally{setHasTaxonomies(!0)}})()}),[hasTaxonomies,getTaxonomies]);const addTerms=(0,src.I4)((newTerms=>{if(updateStory){const properties=story=>{const currentTerms=story?.terms||[];return{...story,terms:utils_removeDupsFromArray([...currentTerms,...newTerms],"id")}};updateStory({properties}),setTermCache((cache=>utils_removeDupsFromArray([...cache,...newTerms],"id")))}}),[updateStory]),removeTerms=(0,src.I4)((deleteTerms=>{if(updateStory){const removeTermsID=deleteTerms.map((({id})=>id)),properties=story=>{const newAssignedTerms=(story?.terms||[]).filter((({id})=>!removeTermsID.includes(id)));return{...story,terms:newAssignedTerms}};updateStory({properties})}}),[updateStory]),addSearchResultsToCache=(0,src.I4)((async({taxonomy,args,addNameToSelection=!1})=>{let termResults=[];const termsEndpoint=taxonomy?.restPath;if(!termsEndpoint||!getTaxonomyTerm)return[];try{termResults=await getTaxonomyTerm(termsEndpoint,args)}catch(e){e instanceof Error&&console.error(e.message)}if(termResults.length<1)return termResults;if(setTermCache((cache=>cache?utils_removeDupsFromArray([...cache,...termResults],"id"):termResults)),addNameToSelection&&args.search){const selectedTermSlug=(0,cleanForSlug.Z)(args.search),selectedTerm=termResults.find((term=>term.slug===selectedTermSlug));selectedTerm&&addTerms([selectedTerm])}return termResults}),[getTaxonomyTerm,addTerms]),createTerm=(0,src.I4)((async({taxonomy,termName,parent,addToSelection=!1})=>{const data={name:termName};parent?.id&&(data.parent=parent.id,data.slug=`${parent.slug}-${(0,cleanForSlug.Z)(data.name)}`);const preEmptiveSlug=data?.slug||(0,cleanForSlug.Z)(termName)||"",cachedTerm=termCache.find((term=>term.slug===preEmptiveSlug&&term.taxonomy===taxonomy.slug));if(cachedTerm)return void(addToSelection&&addTerms([cachedTerm]));const termsEndpoint=taxonomy?.restPath;if(termsEndpoint&&createTaxonomyTerm)try{const newTerm=await createTaxonomyTerm(termsEndpoint,data);addToSelection&&addTerms([newTerm])}catch(e){"term_exists"===e.code&&addSearchResultsToCache({taxonomy,args:{search:termName},addNameToSelection:addToSelection})}}),[createTaxonomyTerm,termCache,addSearchResultsToCache,addTerms]);(0,src.d4)((()=>{if(shouldRefetchCategories&&taxonomies?.length){taxonomies.filter((taxonomy=>taxonomy.hierarchical)).forEach((taxonomy=>{addSearchResultsToCache({taxonomy,args:{per_page:-1}})})),setShouldRefetchCategories(!1)}}),[addSearchResultsToCache,shouldRefetchCategories,taxonomies]);const value=(0,src.Ye)((()=>({state:{taxonomies,termCache,terms},actions:{createTerm,addSearchResultsToCache,addTerms,removeTerms}})),[termCache,terms,taxonomies,createTerm,addSearchResultsToCache,addTerms,removeTerms]);return(0,jsx_runtime.jsx)(context.Provider,{...props,value})}TaxonomyProvider.displayName="TaxonomyProvider";const taxonomyProvider=TaxonomyProvider;const taxonomy_useTaxonomy=function useTaxonomy(selector=src.yR){return(0,src.Sz)(context,selector)}},"./packages/story-editor/src/components/panels/document/taxonomies/taxonomies.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>taxonomies});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.filter.js"),__webpack_require__("./node_modules/core-js/modules/esnext.iterator.map.js");var i18n=__webpack_require__("./packages/i18n/src/i18n.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),app_taxonomy=__webpack_require__("./packages/story-editor/src/app/taxonomy/index.ts"),panel=__webpack_require__("./packages/story-editor/src/components/panels/panel/index.js"),app=__webpack_require__("./packages/story-editor/src/app/index.js"),sprintf=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.find.js"),__webpack_require__("./packages/i18n/src/sprintf.ts")),expandPresetStyles=__webpack_require__("./packages/design-system/src/theme/helpers/expandPresetStyles.ts"),types=__webpack_require__("./packages/design-system/src/theme/types.ts"),typography_text=__webpack_require__("./packages/design-system/src/components/typography/text/index.ts"),button_button=__webpack_require__("./packages/design-system/src/components/button/button.tsx"),constants=__webpack_require__("./packages/design-system/src/components/button/constants.ts"),useLiveRegion=__webpack_require__("./packages/design-system/src/utils/useLiveRegion.ts"),input=__webpack_require__("./packages/design-system/src/components/input/input.tsx"),dropdown=__webpack_require__("./packages/design-system/src/components/dropDown/dropdown.tsx"),src=__webpack_require__("./packages/react/src/index.ts"),v4=__webpack_require__("./packages/story-editor/node_modules/uuid/dist/esm-browser/v4.js"),components_form=__webpack_require__("./packages/story-editor/src/components/form/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),headline=__webpack_require__("./packages/design-system/src/components/typography/headline/index.ts");prop_types_default().shape({capabilities:prop_types_default().object,description:prop_types_default().string,hierarchical:prop_types_default().bool,labels:prop_types_default().object,name:prop_types_default().string.isRequired,restBase:prop_types_default().string.isRequired,showCloud:prop_types_default().bool,slug:prop_types_default().string.isRequired,types:prop_types_default().arrayOf(prop_types_default().string),visibility:prop_types_default().object});const ContentHeading=(0,styled_components_browser_esm.ZP)(headline.s).attrs({as:"h3",size:types.TextSize.XXXSmall}).withConfig({displayName:"shared__ContentHeading",componentId:"sc-1pfee07-0"})(["margin:4px 0 16px;font-weight:",";"],(({theme})=>theme.typography.weight.regular)),LinkButton=(0,styled_components_browser_esm.ZP)(button_button.z).attrs({variant:constants.Wu.Link}).withConfig({displayName:"shared__LinkButton",componentId:"sc-1pfee07-1"})([""," margin-bottom:16px;font-weight:500;"],expandPresetStyles.K((({link},{XSmall})=>link[XSmall]))),SiblingBorder=styled_components_browser_esm.ZP.div.withConfig({displayName:"shared__SiblingBorder",componentId:"sc-1pfee07-2"})(["padding-left:16px;padding-right:16px;& + &{border-top:1px solid ",";padding-top:16px;padding-bottom:8px;}"],(({theme})=>theme.colors.divider.tertiary)),WordCloud={Heading:(0,styled_components_browser_esm.ZP)(ContentHeading).attrs({as:"h4"}).withConfig({displayName:"shared__Heading",componentId:"sc-1pfee07-3"})(["margin-bottom:4px;"]),Wrapper:styled_components_browser_esm.ZP.div.withConfig({displayName:"shared__Wrapper",componentId:"sc-1pfee07-4"})(["padding:18px 0px;"]),List:styled_components_browser_esm.ZP.ul.withConfig({displayName:"shared__List",componentId:"sc-1pfee07-5"})(["all:unset;cursor:pointer;"]),ListItem:styled_components_browser_esm.ZP.li.withConfig({displayName:"shared__ListItem",componentId:"sc-1pfee07-6"})(["all:unset;"]),Word:(0,styled_components_browser_esm.ZP)(LinkButton).withConfig({displayName:"shared__Word",componentId:"sc-1pfee07-7"})(["margin:0;display:revert;"])};var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const NO_PARENT_VALUE="NO_PARENT_VALUE",ContentArea=styled_components_browser_esm.ZP.div.withConfig({displayName:"HierarchicalTermSelector__ContentArea",componentId:"sc-17x36f5-0"})(["label,* > label{",";color:",";}"],(({theme})=>expandPresetStyles._({preset:theme.typography.presets.label[types.TextSize.Small],theme})),(({theme})=>theme.colors.fg.secondary)),AddNewCategoryForm=styled_components_browser_esm.ZP.form.withConfig({displayName:"HierarchicalTermSelector__AddNewCategoryForm",componentId:"sc-17x36f5-1"})(["margin:24px 0 16px;"]),ButtonContainer=styled_components_browser_esm.ZP.div.withConfig({displayName:"HierarchicalTermSelector__ButtonContainer",componentId:"sc-17x36f5-2"})(["display:flex;gap:8px;"]),Label=(0,styled_components_browser_esm.ZP)(typography_text.x.Label).attrs({size:types.TextSize.Small}).withConfig({displayName:"HierarchicalTermSelector__Label",componentId:"sc-17x36f5-3"})(["display:inline-block;margin:12px 0;"]),AddNewCategoryButton=(0,styled_components_browser_esm.ZP)(button_button.z).attrs({variant:constants.Wu.Rectangle,size:constants.qE.Small,type:constants.L$.Secondary}).withConfig({displayName:"HierarchicalTermSelector__AddNewCategoryButton",componentId:"sc-17x36f5-4"})(["margin-top:20px;"]);function HierarchicalTermSelector({noParentId=NO_PARENT_VALUE,taxonomy,canCreateTerms}){const{createTerm,termCache,terms,addTerms,removeTerms}=(0,app_taxonomy.M)((({state:{termCache,terms},actions:{createTerm,addTerms,removeTerms}})=>({createTerm,addTerms,removeTerms,termCache,terms}))),categories=(0,src.Ye)((()=>termCache?termCache.filter((term=>term.taxonomy===taxonomy.slug)).map((category=>({id:category.id,parent:category.parent,value:category.id,label:category.name,checked:!!terms&&terms.map((({id})=>id)).includes(category.id),slug:category.slug}))):[]),[taxonomy,termCache,terms]),[showAddNewCategory,setShowAddNewCategory]=(0,src.eJ)(!1),[newCategoryName,setNewCategoryName]=(0,src.eJ)(""),[selectedParent,setSelectedParent]=(0,src.eJ)(noParentId),dropdownId=(0,src.Ye)(v4.Z,[]),[hasFocus,setHasFocus]=(0,src.eJ)(!1),formRef=(0,src.sO)(),toggleRef=(0,src.sO)(),[toggleFocus,setToggleFocus]=(0,src.eJ)(!1),[searchText,setSearchText]=(0,src.eJ)(""),handleInputChange=(0,src.I4)((value=>setSearchText(value)),[]),speak=(0,useLiveRegion.Z)("assertive"),resetInputs=(0,src.I4)((()=>{setNewCategoryName(""),setSelectedParent(noParentId)}),[noParentId]),handleClickCategory=(0,src.I4)(((_evt,{id,checked})=>{const term=termCache.find((category=>category.id===id&&category.taxonomy===taxonomy.slug));checked?addTerms([term]):removeTerms([term])}),[termCache,taxonomy.slug,addTerms,removeTerms]),handleToggleNewCategory=(0,src.I4)((()=>{setShowAddNewCategory(!showAddNewCategory),resetInputs(),setHasFocus(!showAddNewCategory),setToggleFocus(showAddNewCategory)}),[resetInputs,showAddNewCategory]),handleChangeNewCategoryName=(0,src.I4)((evt=>{setNewCategoryName(evt.target.value)}),[]),selectedParentSlug=(0,src.Ye)((()=>categories.find((category=>category.id===selectedParent))?.slug),[selectedParent,categories]),handleSubmit=(0,src.I4)((evt=>{evt.preventDefault();createTerm({taxonomy,termName:newCategoryName,parent:{id:selectedParent===noParentId?0:selectedParent,slug:selectedParentSlug},addToSelection:!0}),speak((0,sprintf.Z)((0,i18n.__)("%s added.","web-stories"),taxonomy.labels.singular_name)),setShowAddNewCategory(!1),resetInputs(),setToggleFocus(showAddNewCategory)}),[createTerm,speak,newCategoryName,noParentId,resetInputs,selectedParent,showAddNewCategory,taxonomy,selectedParentSlug]),handleParentSelect=(0,src.I4)(((_evt,menuItem)=>setSelectedParent(menuItem)),[]);(0,src.d4)((()=>{const node=formRef.current;if(node){const handleEnter=evt=>{"Enter"===evt.key&&handleSubmit(evt)};return node.addEventListener("keypress",handleEnter),()=>{node.removeEventListener("keypress",handleEnter)}}return null}),[handleSubmit,formRef]),(0,src.d4)((()=>{toggleFocus&&toggleRef.current.focus()}),[toggleFocus]);const orderedCategories=(0,src.Ye)((()=>(0,components_form.yR)(categories,searchText)),[categories,searchText]),dropdownCategories=(0,src.Ye)((()=>[{value:NO_PARENT_VALUE,label:(0,i18n._x)("None","parent taxonomy","web-stories")}].concat(orderedCategories).map((({$level,label,...opt})=>({...opt,label:`${Array.from({length:$level},(()=>"— ")).join("")} ${label}`})))),[orderedCategories]);return(0,jsx_runtime.jsxs)(ContentArea,{children:[(0,jsx_runtime.jsx)(ContentHeading,{children:taxonomy.labels.name}),(0,jsx_runtime.jsx)(components_form.$0,{inputValue:searchText,onInputChange:handleInputChange,label:taxonomy.labels.searchItems,options:orderedCategories,onChange:handleClickCategory,noOptionsText:taxonomy.labels?.notFound}),canCreateTerms?(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[!showAddNewCategory&&(0,jsx_runtime.jsx)(LinkButton,{ref:toggleRef,"aria-expanded":!1,onClick:handleToggleNewCategory,children:taxonomy.labels.addNewItem}),showAddNewCategory?(0,jsx_runtime.jsxs)(AddNewCategoryForm,{ref:formRef,onSubmit:handleSubmit,children:[(0,jsx_runtime.jsx)(input.Z,{name:taxonomy.labels.newItemName,label:taxonomy.labels.newItemName,value:newCategoryName,onChange:handleChangeNewCategoryName,hasFocus}),(0,jsx_runtime.jsx)(Label,{htmlFor:dropdownId,children:taxonomy.labels.parentItem}),(0,jsx_runtime.jsx)(dropdown.Z,{id:dropdownId,ariaLabel:taxonomy.labels.parentItem,options:dropdownCategories,selectedValue:selectedParent,onMenuItemClick:handleParentSelect}),(0,jsx_runtime.jsxs)(ButtonContainer,{children:[(0,jsx_runtime.jsx)(AddNewCategoryButton,{disabled:!newCategoryName.length,type:"submit",children:taxonomy.labels.addNewItem}),(0,jsx_runtime.jsx)(AddNewCategoryButton,{"aria-expanded":!0,onClick:handleToggleNewCategory,children:(0,i18n.__)("Cancel","web-stories")})]})]}):null]}):null]})}HierarchicalTermSelector.displayName="HierarchicalTermSelector";const taxonomies_HierarchicalTermSelector=HierarchicalTermSelector;__webpack_require__("./node_modules/core-js/modules/esnext.iterator.for-each.js");var outline=__webpack_require__("./packages/design-system/src/theme/helpers/outline.ts"),styled=__webpack_require__("./packages/design-system/src/components/input/styled.ts"),list=__webpack_require__("./packages/design-system/src/components/typography/list/index.ts"),noop=__webpack_require__("./packages/design-system/src/utils/noop.ts"),range=(__webpack_require__("./node_modules/core-js/modules/esnext.iterator.every.js"),__webpack_require__("./packages/units/src/range.ts")),cleanForSlug=__webpack_require__("./packages/story-editor/src/utils/cleanForSlug.ts");function formatTag(tag){return tag.replace(/( +)/g," ").trim()}function uniquesOnly(arr){const slugMap=new Map;return arr.forEach((item=>{slugMap.set((0,cleanForSlug.Z)(item),item)})),[...slugMap.values()]}const ACTIONS_UPDATE_VALUE="updateValue",ACTIONS_SUBMIT_VALUE="submitValue",ACTIONS_REMOVE_TAG="removeTag",ACTIONS_RESET_OFFSET="resetOffset",ACTIONS_RESET_VALUE="resetValue",ACTIONS_INCREMENT_OFFSET="incrementOffset",ACTIONS_DECREMENT_OFFSET="decrementOffset",ACTIONS_UPDATE_TAGS="updateTags";const tags_reducer=function reducer(state,action){switch(action.type){case ACTIONS_UPDATE_VALUE:{const values=action.payload.split(",");if(values.length<=1)return{...state,value:action.payload};const newTags=values.slice(0,-1).map(formatTag).filter((tag=>tag.length)),value=values[values.length-1];return function subsetAOfB(a=[],b=[]){return a.forEach((v=>b.includes(v)))}(newTags,state.tags)?{...state,value}:{...state,value,tagBuffer:uniquesOnly([...state.tags.slice(0,state.tags.length-state.offset),...newTags,...state.tags.slice(state.tags.length-state.offset)])}}case ACTIONS_SUBMIT_VALUE:{const newTag=formatTag(action?.payload||state.value);return""===newTag||state.tags.includes(newTag)?{...state,value:""}:{...state,value:"",tagBuffer:uniquesOnly([...state.tags.slice(0,state.tags.length-state.offset),newTag,...state.tags.slice(state.tags.length-state.offset)])}}case ACTIONS_REMOVE_TAG:{const removedTagIndex="string"==typeof action.payload?state.tags.findIndex((tag=>tag===action.payload)):state.tags.length-1-state.offset;return removedTagIndex<0?state:{...state,tagBuffer:[...state.tags.slice(0,removedTagIndex),...state.tags.slice(removedTagIndex+1,state.tags.length)]}}case ACTIONS_INCREMENT_OFFSET:return{...state,offset:(0,range.uZ)(state.offset+1,{MIN:0,MAX:state.tags.length})};case ACTIONS_DECREMENT_OFFSET:return{...state,offset:(0,range.uZ)(state.offset-1,{MIN:0,MAX:state.tags.length})};case ACTIONS_RESET_OFFSET:return{...state,offset:0};case ACTIONS_RESET_VALUE:return{...state,value:""};case ACTIONS_UPDATE_TAGS:{const stateTagsWithSlugs=state.tags.map((name=>[(0,cleanForSlug.Z)(name),name])),payloadTagsWithSlugs=action.payload.map((name=>[(0,cleanForSlug.Z)(name),name]));if(function deepEquals(a=[],b=[]){return a.length===b.length&&a.every((item=>b.includes(item)))}(stateTagsWithSlugs.map((([slug])=>slug)),payloadTagsWithSlugs.map((([slug])=>slug))))return state;const tagsToPersist=stateTagsWithSlugs.filter((([tagSlug])=>payloadTagsWithSlugs.map((([slug])=>slug)).includes(tagSlug))).map((([,name])=>name)),tagsToAdd=payloadTagsWithSlugs.filter((([tagSlug])=>!stateTagsWithSlugs.map((([slug])=>slug)).includes(tagSlug))).map((([,name])=>name));return{...state,tags:[...tagsToPersist,...tagsToAdd],tagBuffer:null}}default:return state}};var popup_constants=__webpack_require__("./packages/design-system/src/components/popup/constants.ts"),cross=__webpack_require__("./packages/design-system/src/icons/cross.svg"),zIndex=__webpack_require__("./packages/story-editor/src/constants/zIndex.ts"),tooltip=__webpack_require__("./packages/story-editor/src/components/tooltip/index.js");const Dismiss=styled_components_browser_esm.ZP.button.withConfig({displayName:"tag__Dismiss",componentId:"sc-14unxs6-0"})(["all:unset;cursor:pointer;border-radius:",";",";width:22px;min-width:22px;height:22px;display:flex;justify-content:center;align-items:center;svg{height:20px;width:20px;margin:auto;}"],(({theme})=>theme.borders.radius.small),outline.L),Token=styled_components_browser_esm.ZP.span.withConfig({displayName:"tag__Token",componentId:"sc-14unxs6-1"})([""," position:relative;display:flex;align-items:center;padding:2px;margin:2px;max-width:calc(100% - 4px);height:32px;"],(({theme})=>(0,styled_components_browser_esm.iv)(["color:",";border:1px solid ",";border-radius:",";"],theme.colors.fg.primary,theme.colors.border.defaultNormal,theme.borders.radius.small))),TokenText=(0,styled_components_browser_esm.ZP)(typography_text.x.Span).attrs({size:types.TextSize.Small}).withConfig({displayName:"tag__TokenText",componentId:"sc-14unxs6-2"})(["padding-left:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"]);function Tag({children,onDismiss}){const id=(0,src.Ye)((()=>(0,v4.Z)()),[]);return(0,jsx_runtime.jsxs)(Token,{"data-testid":"flat-term-token",children:[(0,jsx_runtime.jsx)(TokenText,{id,children}),(0,jsx_runtime.jsx)(tooltip.Z,{title:(0,i18n.__)("Remove Tag","web-stories"),placement:popup_constants.ug.Bottom,hasTail:!0,popupZIndexOverride:zIndex.ZT,children:(0,jsx_runtime.jsx)(Dismiss,{onClick:onDismiss,"aria-label":(0,i18n.__)("Remove Tag","web-stories"),"aria-describedby":id,children:(0,jsx_runtime.jsx)(cross.Z,{})})})]})}Tag.displayName="Tag";const tags_tag=Tag,INPUT_KEY=(0,v4.Z)(),Border=styled_components_browser_esm.ZP.div.withConfig({displayName:"input__Border",componentId:"sc-1nuo5lh-0"})([""," display:flex;flex-direction:column;margin-bottom:6px;"],(({theme,isInputFocused})=>(0,styled_components_browser_esm.iv)(["color:",";border:1px solid ",";border-radius:",";",";"],theme.colors.fg.primary,theme.colors.border.defaultNormal,theme.borders.radius.small,isInputFocused&&outline.R))),InputWrapper=styled_components_browser_esm.ZP.div.withConfig({displayName:"input__InputWrapper",componentId:"sc-1nuo5lh-1"})(["display:flex;flex-wrap:wrap;padding:0;"]),TextInput=(0,styled_components_browser_esm.ZP)(styled.Qc).attrs({type:"text"}).withConfig({displayName:"input__TextInput",componentId:"sc-1nuo5lh-2"})(["width:auto;flex-grow:1;height:32px;margin:2px 0;padding-left:4px;"]),SuggestionList=(0,styled_components_browser_esm.ZP)(list.a).withConfig({displayName:"input__SuggestionList",componentId:"sc-1nuo5lh-3"})(["max-height:120px;overflow-y:scroll;border-top:",";display:block;list-style-type:none;width:100%;padding:6px 4px 4px;margin-top:6px;li{cursor:pointer;padding:4px;width:100%;"," border-radius:",";&:hover{background-color:",";}}"],(({theme})=>`1px solid ${theme.colors.border.defaultNormal}`),outline.L(),(({theme})=>theme.borders.radius.small),(({theme})=>theme.colors.bg.tertiary));function Input({suggestedTerms=[],onTagsChange,onInputChange,suggestedTermsLabel,tagDisplayTransformer,tokens=[],onUndo=noop.Z,...props}){const[{value,tags,offset,tagBuffer},dispatch]=(0,src._Y)(tags_reducer,{value:"",tags:[...tokens],tagBuffer:null,offset:0}),[isInputFocused,setIsInputFocused]=(0,src.eJ)(!1),[isSuggestionsOpen,setIsSuggestionsOpen]=(0,src.eJ)(!1),inputRef=(0,src.sO)(),menuRef=(0,src.sO)(),containerRef=(0,src.sO)();(0,src.d4)((()=>{dispatch({type:ACTIONS_UPDATE_TAGS,payload:tokens})}),[tokens]);const suggestionListId=(0,v4.Z)(),totalSuggestions=suggestedTerms.length;(0,src.d4)((()=>{setIsSuggestionsOpen(totalSuggestions>0)}),[totalSuggestions]);const onTagChangeRef=(0,src.sO)(onTagsChange);onTagChangeRef.current=onTagsChange,(0,src.d4)((()=>{tagBuffer&&onTagChangeRef.current?.(tagBuffer)}),[tagBuffer]);const onInputChangeRef=(0,src.sO)(onInputChange);onInputChangeRef.current=onInputChange,(0,src.d4)((()=>{onInputChangeRef.current?.(value)}),[value]);const{handleFocus,handleBlur,handleKeyDown,handleChange,removeTag}=(0,src.Ye)((()=>({handleKeyDown:e=>{""===e.target.value&&("ArrowLeft"===e.key&&dispatch({type:ACTIONS_INCREMENT_OFFSET}),"ArrowRight"===e.key&&dispatch({type:ACTIONS_DECREMENT_OFFSET}),"Backspace"===e.key&&dispatch({type:ACTIONS_REMOVE_TAG}),"z"===e.key&&e.metaKey&&onUndo(e)),"ArrowDown"===e.key&&suggestedTerms.length>0&&menuRef?.current?.firstChild?.focus(),["Comma",",","Enter"].includes(e.key)&&dispatch({type:ACTIONS_SUBMIT_VALUE})},handleChange:e=>{dispatch({type:ACTIONS_UPDATE_VALUE,payload:e.target.value})},removeTag:tag=>()=>{dispatch({type:ACTIONS_REMOVE_TAG,payload:tag}),inputRef?.current.focus()},handleFocus:()=>{setIsInputFocused(!0)},handleBlur:()=>{dispatch({type:ACTIONS_RESET_OFFSET}),setIsInputFocused(!1)}})),[onUndo,suggestedTerms]),renderedTags=tagBuffer||tags,handleTagSelectedFromSuggestions=(0,src.I4)(((e,selectedValue)=>{e.preventDefault(),setIsSuggestionsOpen(!1),dispatch({type:ACTIONS_SUBMIT_VALUE,payload:selectedValue}),inputRef?.current.focus()}),[]),handleSuggestionKeyDown=(0,src.I4)(((e,index,name)=>{const nextChild=index+1,previousChild=index-1;"ArrowDown"===e.key&&nextChild<totalSuggestions&&menuRef?.current?.children?.[nextChild]?.focus(),"ArrowUp"===e.key&&(previousChild<0?inputRef?.current.focus():menuRef?.current?.children?.[previousChild]?.focus()),"Enter"===e.key&&handleTagSelectedFromSuggestions(e,name)}),[handleTagSelectedFromSuggestions,totalSuggestions]);return(0,jsx_runtime.jsxs)(Border,{ref:containerRef,isInputFocused,children:[(0,jsx_runtime.jsx)(InputWrapper,{children:[...renderedTags.slice(0,renderedTags.length-offset),INPUT_KEY,...renderedTags.slice(renderedTags.length-offset)].map((tag=>tag===INPUT_KEY?(0,jsx_runtime.jsx)(TextInput,{...props,value,onKeyDown:handleKeyDown,onChange:handleChange,onFocus:handleFocus,onBlur:handleBlur,size:"4",ref:inputRef,autoComplete:isSuggestionsOpen?"off":"on","aria-expanded":isSuggestionsOpen,"aria-autocomplete":"list","aria-owns":isSuggestionsOpen?suggestionListId:null,role:"combobox"},INPUT_KEY):(0,jsx_runtime.jsx)(tags_tag,{onDismiss:removeTag(tag),children:tagDisplayTransformer(tag)||tag},tag)))}),isSuggestionsOpen&&(0,jsx_runtime.jsx)(SuggestionList,{"aria-label":suggestedTermsLabel,role:"listbox",ref:menuRef,id:suggestionListId,"data-testid":"suggested_terms_list",children:suggestedTerms.map((({name,id},index)=>(0,jsx_runtime.jsx)("li",{"aria-selected":value===name,role:"option",tabIndex:0,onClick:e=>handleTagSelectedFromSuggestions(e,name),onKeyDown:e=>handleSuggestionKeyDown(e,index,name),children:name},id)))})]})}Input.displayName="Input";const tags={Input,Description:(0,styled_components_browser_esm.ZP)(typography_text.x.Paragraph).attrs({size:types.TextSize.Small}).withConfig({displayName:"description",componentId:"sc-1gy988t-0"})(["color:",";"],(({theme})=>theme.colors.fg.secondary)),Label:(0,styled_components_browser_esm.ZP)(typography_text.x.Label).attrs({size:types.TextSize.Small}).withConfig({displayName:"label",componentId:"sc-1y7bq6c-0"})(["display:inline-block;color:",";margin-bottom:8px;"],(({theme})=>theme.colors.fg.secondary))};const taxonomies_FlatTermSelector=function FlatTermSelector({taxonomy,canCreateTerms}){const[mostUsed,setMostUsed]=(0,src.eJ)([]),{createTerm,termCache,addSearchResultsToCache,terms=[],addTerms,removeTerms}=(0,app_taxonomy.M)((({state:{termCache,terms},actions:{createTerm,addSearchResultsToCache,addTerms,removeTerms}})=>({termCache,createTerm,addSearchResultsToCache,terms,addTerms,removeTerms}))),{undo}=(0,app.k6)((({actions:{undo}})=>({undo}))),[searchResults,setSearchResults]=(0,src.eJ)([]),speak=(0,useLiveRegion.Z)("assertive"),handleFreeformTermsChange=(0,src.I4)((termNames=>{const currentTerms=termCache.filter((term=>term.taxonomy===taxonomy.slug&&termNames.includes(term.name))),removeToTerms=terms.filter((term=>term.taxonomy===taxonomy.slug&&!termNames.includes(term.name)));if(removeTerms(removeToTerms),addTerms(currentTerms),!canCreateTerms)return;termNames.map((name=>[(0,cleanForSlug.Z)(name),name])).filter((([slug])=>!termCache.filter((term=>term.taxonomy===taxonomy.slug)).map((({slug:thisSlug})=>thisSlug.toLowerCase())).includes(slug))).map((([,name])=>name)).forEach((name=>createTerm({taxonomy,termName:name,parent:null,addToSelection:!0})))}),[termCache,removeTerms,terms,addTerms,canCreateTerms,createTerm,taxonomy]),handleFreeformInputChange=(0,src.y1)((async value=>{if(0===value.length)return void setSearchResults([]);if(value.length<3)return;const results=await addSearchResultsToCache({taxonomy,args:{search:value,per_page:20}});setSearchResults(results);const count=results.length,message=(0,sprintf.Z)((0,i18n._n)("%d result found.","%d results found.",count,"web-stories"),count);speak(message)}),300),tokens=(0,src.Ye)((()=>terms.filter((term=>term.taxonomy===taxonomy.slug)).filter((term=>void 0!==term)).map((term=>term.name))),[terms,taxonomy]),termDisplayTransformer=(0,src.I4)((tagName=>termCache.filter((term=>term.name===tagName))?.[0]?.name),[termCache]);return(0,src.d4)((()=>{!async function(){const results=await addSearchResultsToCache({taxonomy,args:{orderby:"count",order:"desc",hide_empty:!0}});setMostUsed(results)}()}),[taxonomy,addSearchResultsToCache]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(ContentHeading,{children:taxonomy.labels.name}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(tags.Label,{htmlFor:`${taxonomy.slug}-input`,children:taxonomy.labels.addNewItem}),(0,jsx_runtime.jsx)(tags.Input,{id:`${taxonomy.slug}-input`,"aria-describedby":`${taxonomy.slug}-description`,name:taxonomy.slug,onTagsChange:handleFreeformTermsChange,onInputChange:handleFreeformInputChange,tagDisplayTransformer:termDisplayTransformer,tokens,onUndo:undo,suggestedTerms:searchResults,suggestedTermsLabel:taxonomy?.labels?.itemsList}),(0,jsx_runtime.jsx)(tags.Description,{id:`${taxonomy.slug}-description`,children:taxonomy.labels.separateItemsWithCommas}),mostUsed?.length>0&&(0,jsx_runtime.jsxs)(WordCloud.Wrapper,{"data-testid":`${taxonomy.slug}-most-used`,children:[(0,jsx_runtime.jsx)(WordCloud.Heading,{children:taxonomy.labels.mostUsed}),(0,jsx_runtime.jsx)(WordCloud.List,{children:mostUsed.map(((term,i)=>(0,jsx_runtime.jsxs)(WordCloud.ListItem,{children:[(0,jsx_runtime.jsxs)(WordCloud.Word,{onClick:()=>{terms.map((({id})=>id)).includes(term.id)||addTerms([term])},children:[term.name,i<mostUsed.length-1&&(0,i18n.__)(",","web-stories")]}),i<mostUsed.length-1&&" "]},term.id)))})]})]},taxonomy.slug)]})},StyledSimplePanel=(0,styled_components_browser_esm.ZP)(panel.me).withConfig({displayName:"taxonomies__StyledSimplePanel",componentId:"sc-171mnp-0"})(["padding-left:0;padding-right:0;"]);function TaxonomiesPanel({nameOverride,...props}){const{capabilities}=(0,app.rB)((({state:{capabilities}})=>({capabilities}))),{taxonomies}=(0,app_taxonomy.M)((({state:{taxonomies}})=>({taxonomies})));if(!taxonomies?.length)return null;const availableTaxonomies=taxonomies.filter((taxonomy=>Boolean(capabilities[`assign-${taxonomy?.restBase}`]||capabilities[`assign-${taxonomy?.slug}`])));return 0===availableTaxonomies.length?null:(0,jsx_runtime.jsx)(StyledSimplePanel,{name:nameOverride||"taxonomies",title:(0,i18n.__)("Taxonomies","web-stories"),...props,children:availableTaxonomies.map((taxonomy=>{const canCreateTerms=Boolean(capabilities[`create-${taxonomy?.restBase}`]||capabilities[`create-${taxonomy?.slug}`]);return(0,jsx_runtime.jsx)(SiblingBorder,{children:taxonomy.hierarchical?(0,jsx_runtime.jsx)(taxonomies_HierarchicalTermSelector,{taxonomy,canCreateTerms}):(0,jsx_runtime.jsx)(taxonomies_FlatTermSelector,{taxonomy,canCreateTerms})},taxonomy.slug)}))})}TaxonomiesPanel.displayName="TaxonomiesPanel";const taxonomies=TaxonomiesPanel}}]);