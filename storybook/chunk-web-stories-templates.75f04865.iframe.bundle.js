"use strict";(globalThis.webpackChunkweb_stories_wp=globalThis.webpackChunkweb_stories_wp||[]).push([[4991],{"./node_modules/core-js/internals/delete-property-or-throw.js":(module,__unused_webpack_exports,__webpack_require__)=>{var tryToString=__webpack_require__("./node_modules/core-js/internals/try-to-string.js"),$TypeError=TypeError;module.exports=function(O,P){if(!delete O[P])throw $TypeError("Cannot delete property "+tryToString(P)+" of "+tryToString(O))}},"./node_modules/core-js/modules/es.array.unshift.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),setArrayLength=__webpack_require__("./node_modules/core-js/internals/array-set-length.js"),deletePropertyOrThrow=__webpack_require__("./node_modules/core-js/internals/delete-property-or-throw.js"),doesNotExceedSafeInteger=__webpack_require__("./node_modules/core-js/internals/does-not-exceed-safe-integer.js");$({target:"Array",proto:!0,arity:1,forced:1!==[].unshift(0)||!function(){try{Object.defineProperty([],"length",{writable:!1}).unshift()}catch(error){return error instanceof TypeError}}()},{unshift:function unshift(item){var O=toObject(this),len=lengthOfArrayLike(O),argCount=arguments.length;if(argCount){doesNotExceedSafeInteger(len+argCount);for(var k=len;k--;){var to=k+argCount;k in O?O[to]=O[k]:deletePropertyOrThrow(O,to)}for(var j=0;j<argCount;j++)O[j]=arguments[j]}return setArrayLength(O,len+argCount)}})},"./node_modules/core-js/modules/esnext.iterator.some.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),iterate=__webpack_require__("./node_modules/core-js/internals/iterate.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js");$({target:"Iterator",proto:!0,real:!0},{some:function some(predicate){anObject(this),aCallable(predicate);var record=getIteratorDirect(this),counter=0;return iterate(record,(function(value,stop){if(predicate(value,counter++))return stop()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},"./packages/migration/node_modules/uuid/dist/esm-browser/v4.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>esm_browser_v4});const esm_browser_native={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let getRandomValues;const rnds8=new Uint8Array(16);function rng(){if(!getRandomValues&&(getRandomValues="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!getRandomValues))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return getRandomValues(rnds8)}const byteToHex=[];for(let i=0;i<256;++i)byteToHex.push((i+256).toString(16).slice(1));function unsafeStringify(arr,offset=0){return byteToHex[arr[offset+0]]+byteToHex[arr[offset+1]]+byteToHex[arr[offset+2]]+byteToHex[arr[offset+3]]+"-"+byteToHex[arr[offset+4]]+byteToHex[arr[offset+5]]+"-"+byteToHex[arr[offset+6]]+byteToHex[arr[offset+7]]+"-"+byteToHex[arr[offset+8]]+byteToHex[arr[offset+9]]+"-"+byteToHex[arr[offset+10]]+byteToHex[arr[offset+11]]+byteToHex[arr[offset+12]]+byteToHex[arr[offset+13]]+byteToHex[arr[offset+14]]+byteToHex[arr[offset+15]]}const esm_browser_v4=function v4(options,buf,offset){if(esm_browser_native.randomUUID&&!buf&&!options)return esm_browser_native.randomUUID();const rnds=(options=options||{}).random||(options.rng||rng)();if(rnds[6]=15&rnds[6]|64,rnds[8]=63&rnds[8]|128,buf){offset=offset||0;for(let i=0;i<16;++i)buf[offset+i]=rnds[i];return buf}return unsafeStringify(rnds)}}}]);