"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[9966],{"./node_modules/@storybook/csf/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{KK:()=>N});var r,e,B=Object.create,R=Object.defineProperty,b=Object.getOwnPropertyDescriptor,C=Object.getOwnPropertyNames,h=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty,x=(r=T=>{var r,e,n;Object.defineProperty(T,"__esModule",{value:!0}),T.isEqual=(r=Object.prototype.toString,e=Object.getPrototypeOf,n=Object.getOwnPropertySymbols?function(t){return Object.keys(t).concat(Object.getOwnPropertySymbols(t))}:Object.keys,function(t,a){return function i(o,s,p){var y,g,d,A=r.call(o),F=r.call(s);if(o===s)return!0;if(null==o||null==s)return!1;if(p.indexOf(o)>-1&&p.indexOf(s)>-1)return!0;if(p.push(o,s),A!=F||(y=n(o),g=n(s),y.length!=g.length||y.some((function(l){return!i(o[l],s[l],p)}))))return!1;switch(A.slice(8,-1)){case"Symbol":return o.valueOf()==s.valueOf();case"Date":case"Number":return+o==+s||+o!=+o&&+s!=+s;case"RegExp":case"Function":case"String":case"Boolean":return""+o==""+s;case"Set":case"Map":y=o.entries(),g=s.entries();do{if(!i((d=y.next()).value,g.next().value,p))return!1}while(!d.done);return!0;case"ArrayBuffer":o=new Uint8Array(o),s=new Uint8Array(s);case"DataView":o=new Uint8Array(o.buffer),s=new Uint8Array(s.buffer);case"Float32Array":case"Float64Array":case"Int8Array":case"Int16Array":case"Int32Array":case"Uint8Array":case"Uint16Array":case"Uint32Array":case"Uint8ClampedArray":case"Arguments":case"Array":if(o.length!=s.length)return!1;for(d=0;d<o.length;d++)if((d in o||d in s)&&(d in o!=d in s||!i(o[d],s[d],p)))return!1;return!0;case"Object":return i(e(o),e(s),p);default:return!1}}(t,a,[])})},()=>(e||r((e={exports:{}}).exports,e),e.exports));((r,e,n)=>{n=null!=r?B(h(r)):{},((r,e,n,t)=>{if(e&&"object"==typeof e||"function"==typeof e)for(let a of C(e))!w.call(r,a)&&a!==n&&R(r,a,{get:()=>e[a],enumerable:!(t=b(e,a))||t.enumerable})})(!e&&r&&r.__esModule?n:R(n,"default",{value:r,enumerable:!0}),r)})(x());var f=(r,e)=>{let n=(r=>r.toLowerCase().replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,"-").replace(/-+/g,"-").replace(/^-+/,"").replace(/-+$/,""))(r);if(""===n)throw new Error(`Invalid ${e} '${r}', must include alphanumeric characters`);return n},N=(r,e)=>`${f(r,"kind")}${e?`--${f(e,"name")}`:""}`},"./.storybook/stories/playground/dashboard/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{_default:()=>_default,default:()=>dashboard});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@storybook/csf/dist/index.mjs"),src=__webpack_require__("./packages/dashboard/src/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),scrollbar=__webpack_require__("./packages/design-system/src/theme/helpers/scrollbar.ts");const GlobalStyle=(0,styled_components_browser_esm.vJ)(["body.web-story_page_stories-dashboard #wpbody{",";}"],scrollbar.d);var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const dashboard={title:"Playground/Dashboard"},linkHrefTo=(title,name)=>{const url=new URL(window.parent.location);return url.searchParams.set("path","/story/"+(0,dist.KK)(title,name)),decodeURIComponent(url.href)},fetchStories=()=>Promise.resolve({stories:{1:{id:1,status:"publish",title:"Example story",created:"2021-11-04T10:12:47",createdGmt:"2021-11-04T10:12:47Z",author:{name:"Author",id:1},featuredMediaUrl:"https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg"},2:{id:2,status:"publish",title:"Example story 2",created:"2021-12-04T10:12:47",createdGmt:"2021-12-04T10:12:47Z",author:{name:"Author",id:1},featuredMediaUrl:"https://wp.stories.google/static/main/images/templates/fresh-and-bright/page8_figure.jpg"}},fetchedStoryIds:[1,2],totalPages:1,totalStoriesByStatus:{all:2,publish:2}}),getTaxonomies=()=>Promise.resolve([{restBase:"",restPath:"",labels:{allItems:"All Categories",notFound:"No categories found",searchItems:"Search Categories"}}]),getTaxonomyTerms=()=>Promise.resolve([{name:"Food",id:1}]),getAuthors=()=>Promise.resolve([{name:"Author",id:1}]),_default={render:function Render(){(()=>{const isHashCleaned=(0,react.useRef)(!1);isHashCleaned.current||(window.location.hash="/",isHashCleaned.current=!0)})();const config={newStoryURL:linkHrefTo("Playground/Stories Editor","default"),apiCallbacks:{fetchStories,getTaxonomies,getTaxonomyTerms,getAuthors}};return(0,jsx_runtime.jsxs)(src.A,{config,children:[(0,jsx_runtime.jsx)(GlobalStyle,{}),(0,jsx_runtime.jsx)(src.v4,{})]})}}}}]);