!function(t,e){for(var n in e)t[n]=e[n]}(window,function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=n(1).integrations,i=function(){function t(){var e=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.captionRequestsInFlight={},this.pendingMessagesForTabId={},this.onTabUpdated=this.onTabUpdated.bind(this),this.sendMessageToTabId=this.sendMessageToTabId.bind(this),this.onMessage=this.onMessage.bind(this),this.sendPendingMessages=this.sendPendingMessages.bind(this),o.forEach((function(t){if(t.captionRequestPattern){window.chrome.webRequest.onBeforeRequest.addListener((function(t){var n=t.tabId;t.url in e.captionRequestsInFlight||(e.captionRequestsInFlight[t.url]=!0,e.sendMessageToTabId(n,{type:"process-caption-request",payload:t.url}))}),{urls:[t.captionRequestPattern]})}})),window.chrome.tabs.onUpdated.addListener(this.onTabUpdated),window.chrome.runtime.onMessage.addListener(this.onMessage)}var e,n,i;return e=t,(n=[{key:"sendPendingMessages",value:function(t){t in this.pendingMessagesForTabId&&(this.pendingMessagesForTabId[t].forEach((function(e){window.chrome.tabs.sendMessage(t,e,(function(){}))})),delete this.pendingMessagesForTabId[t])}},{key:"sendMessageToTabId",value:function(t,e){if(!t)return null;t in this.pendingMessagesForTabId?this.pendingMessagesForTabId[t].push(e):this.pendingMessagesForTabId[t]=[e]}},{key:"onMessage",value:function(t,e,n){switch(t.type){case"get-pending-messages":e.tab&&e.tab.id&&(this.sendPendingMessages(e.tab.id),n({ok:!0}))}}},{key:"onTabUpdated",value:function(t,e,n){t&&e.url&&window.chrome.tabs.sendMessage(t,{type:"tab-updated-url"},(function(){}))}}])&&r(e.prototype,n),i&&r(e,i),t}();window.background=new i},function(t,e,n){(function(t){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(t,e){for(var n in e)t[n]=e[n]}(e,function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==n(t)&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(o,i,function(e){return t[e]}.bind(null,i));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=13)}([function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}t.exports=function(t){var e=r(t);return null!=t&&("object"==e||"function"==e)}},function(t,e,r){function o(t){return(o="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var i=r(10),u=r(36);t.exports=function(t){return"symbol"==o(t)||u(t)&&"[object Symbol]"==i(t)}},function(t,e,n){var r=n(12)(Object,"create");t.exports=r},function(t,e,n){var r=n(8);t.exports=function(t,e){for(var n=t.length;n--;)if(r(t[n][0],e))return n;return-1}},function(t,e,n){var r=n(68);t.exports=function(t,e){var n=t.__data__;return r(e)?n["string"==typeof e?"string":"hash"]:n.map}},function(t,e,n){var r=n(6).Symbol;t.exports=r},function(t,e,r){function o(t){return(o="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var i=r(28),u="object"==("undefined"==typeof self?"undefined":o(self))&&self&&self.Object===Object&&self,c=i||u||Function("return this")();t.exports=c},function(t,e){var n=Array.isArray;t.exports=n},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,n){var r=n(10),o=n(0);t.exports=function(t){if(!o(t))return!1;var e=r(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e}},function(t,e,n){var r=n(5),o=n(29),i=n(30),u=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":u&&u in Object(t)?o(t):i(t)}},function(t,e){t.exports={timeStringToSeconds:function(t){var e=/(\d+):(\d+):(\d+).(\d+)/g;if(e.test(t)){e.lastIndex=0;var n=e.exec(t);return(36e5*Number(n[1])+6e4*Number(n[2])+1e3*Number(n[3])+Number(n[4]))/1e3}return null}}},function(t,e,n){var r=n(51),o=n(55);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0}},function(t,e,n){var r=n(14),o=n(17),i=n(20),u=n(21),c=n(37),a=n(77),s=n(78);t.exports={integrations:[r,o,i,u,c],encoders:{SrtEncoder:s},parsers:{SrtParser:a}}},function(t,e,n){var r=n(15),o={siteId:"netflix",captionRequestPattern:"https://*.nflxvideo.net/?o=*&v=*&e=*&t=*",injectPattern:"https://www.netflix.com/*",detectSite:function(t){return t.includes("netflix")},detectVideoId:function(){var t=/watch\/(\d+)/,e=window.location.pathname;return t.test(e)?t.exec(e)[1]:null},parser:n(16),adapter:r};t.exports=o},function(t,e){var n={color:"white",fontFamily:'"Netflix Sans", "Helvetica Nueue", Helvetica, Arial, sans-serif',fontSize:"33px",fontWeight:"bolder",textShadow:"rgb(0, 0, 0) 0px 0px 7px"},r=function(t){var e=document.querySelector(".image-based-timed-text image");if(e){var n=Number(e.getAttribute("width")),r=Number(e.getAttribute("height")),o=document.createElement("canvas");n&&r&&(o.width=n,o.height=r),o.getContext("2d").drawImage(e,0,0),o.toBlob((function(e){var n=URL.createObjectURL(e);t(n)}))}};t.exports=function(){var t=!1,e=null,o=null,i=null,u=document.querySelector("video")||null,c=document.querySelector(".nfp.AkiraPlayer"),a=n,s="",l=document.querySelector(".PlayerControlsNeo__bottom-controls"),f=null,p=null,d=!!document.querySelector(".image-based-timed-text image");if(d)t=!1,i=(o=document.querySelector(".image-based-timed-text image")||null)?JSON.stringify({x:o.getAttribute("x"),y:o.getAttribute("y")}):null,p=r;else if(o=document.querySelector(".player-timedtext-text-container")||null){i=o.style.cssText;var y=o.querySelector("span");y&&(e={background:y.style.background,backgroundColor:y.style.backgroundColor,color:y.style.color,fontFamily:y.style.fontFamily,fontSize:y.style.fontSize,fontWeight:y.style.fontWeight,textShadow:y.style.textShadow}),s=o.innerText}return u&&(f=u.currentTime),{actionPanelFixedPosition:{bottom:"160px",left:"16px"},canRenderInCaptionWindow:t,captionText:s,captionWindow:o,captionWindowPosition:i,captionWindowStyle:{textAlign:"center",width:"700px"},captionStyle:e,defaultCaptionStyle:a,fullscreenRoot:c,getCaptionBlob:p,moveCaptionWindowRelative:!d,moveCaptionWindowSelectors:[".image-based-timed-text image",".player-timedtext-text-container"],playerControls:l,playerCurrentTime:f,smallTextSize:"22px",video:u}}},function(t,e){t.exports=function(t){return new Promise((function(e,n){var r,o=[],i=(new DOMParser).parseFromString(t,"text/xml"),u=i.querySelector("tt");u&&(r=u.getAttribute("ttp:tickRate"));var c=i.querySelector("body"),a=c.firstElementChild;if(c&&a&&r){for(var s=0;s<a.children.length;s++){var l=a.children[s];if("p"===l.tagName){var f=l.getAttribute("begin"),p=l.getAttribute("end");if(!f||!p)return void n("Unable to use captions, missing begin or end attributes.");var d=/(\d+)t/;if(!d.test(f)||!d.test(p))return void n("Unable to use captions, begin or end attribute is unable to be converted.");var y=d.exec(f)[1],m=d.exec(p)[1];y/=r,m/=r;var v=l.textContent;if(l.childNodes.length>=1){v="";for(var b=0;b<l.childNodes.length;b++){var h=l.childNodes[b];if("br"===h.tagName)v+="\n";else if("span"===h.tagName&&h.childNodes.length>1)for(var x=0;x<h.childNodes.length;x++){var g=h.childNodes[x];"br"===g.tagName?v+="\n":v+=g.textContent}else v+=h.textContent}}if(o.length&&o[o.length-1]&&o[o.length-1].startTime===y&&o[o.length-1].endTime===m){var S=o[o.length-1];S.text="".concat(S.text,"\n").concat(v)}else o.push({startTime:y,endTime:m,text:v})}}o.length?e(o):n("Couldn't parse captions from file")}else n("Can't parse invalid Netfix caption file")}))}},function(t,e,n){var r=n(18),o={siteId:"youtube",captionRequestPattern:"https://www.youtube.com/api/timedtext*",injectPattern:"https://www.youtube.com/*",detectSite:function(t){return t.includes("youtube")},detectVideoId:function(){return new URL(window.location.href).searchParams.get("v")||null},parser:n(19),adapter:r};t.exports=o},function(t,e){t.exports=function(){var t,e,n,r=null;n=document.querySelector("video"),e=document.querySelector(".ytp-caption-window-bottom")||document.querySelector(".caption-window"),t=document.querySelector(".ytp-caption-segment");var o=e?e.innerText:"",i=document.querySelector(".ytp-chrome-bottom"),u=null;return document.querySelector(".ytp-caption-window-rollup")&&(r="automatic-subtitles"),n&&(u=n.currentTime),{canRenderInCaptionWindow:!1,captionWindow:e||null,captionWindowPosition:e?e.style.cssText:null,captionWindowStyle:{textAlign:"center"},captionStyle:t?{background:t.style.background,color:"white",fontFamily:t.style.fontFamily,fontSize:t.style.fontSize,padding:"4px"}:null,captionClassName:"captions-text",video:n||null,error:r,smallTextSize:"14px",captionText:o,playerControls:i,playerCurrentTime:u,moveCaptionWindowRelative:!0,moveCaptionWindowSelectors:[".caption-window",".ytp-caption-window-bottom"]}}},function(t,e){t.exports=function(t){return new Promise((function(e,n){var r=[];try{var o=JSON.parse(t),i=!1;if(o.wsWinStyles&&(i=o.wsWinStyles.some((function(t){return 3===t.sdScrollDir}))),i)return void n("Autogenerated captions not supported.");o.events?o.events.forEach((function(t){if(t.segs&&t.tStartMs&&t.dDurationMs){var e="",n=t.segs.find((function(t){return t&&t.utf8}));n?e=n.utf8:console.error("YouTubeJSONParser - No UTF-8 seg, event: ".concat(JSON.stringify(t)));var o=t.tStartMs/1e3,i=o+t.dDurationMs/1e3;e&&Number(o)&&Number(i)&&r.push({text:e,startTime:o,endTime:i})}else console.error("YouTubeJSONParser - Event had no segs, start or duration, event: ".concat(JSON.stringify(t)))})):(console.error('YouTubeJSONParser - Expected "events".'),n())}catch(t){console.error("YouTubeJSONParser - Invalid JSON file"),n()}e(r)}))}},function(t,e){var n={siteId:"development",detectSite:function(t){return t.includes("localhost")},detectVideoId:function(){return"development"},adapter:function(){return{playerControls:document.querySelector("#player-controls")}}};t.exports=n},function(t,e,n){var r=n(22),o={siteId:"kanopy",captionRequestPattern:"https://*.kanopy.com/captioncache/webvtt/*.vtt",injectPattern:"https://*.kanopy.com/*",detectSite:function(t){return t.includes("kanopy")},detectVideoId:function(){var t=/video\/(.+)/,e=window.location.pathname;return t.test(e)?t.exec(e)[1]:null},parser:n(23),adapter:r};t.exports=o},function(t,e){t.exports=function(){var t=document.querySelector(".vjs-control-bar"),e=document.getElementById("player"),n=document.querySelector(".vjs-text-track-display > div > div > div"),r=document.querySelector("video"),o=n?n.textContent:"",i=document.fullscreenElement&&e&&document.fullscreenElement===e?"18px":"12px",u=null;r&&(u=r.currentTime);var c=null,a=document.querySelector(".vjs-text-track-display > div > div");return a&&n&&(c={font:a.style.font,backgroundColor:n.style.backgroundColor,color:n.style.color}),{captionText:o,captionStyle:c,captionWindow:n,fullscreenRoot:e,moveCaptionWindowAdditionalRules:["display: inline-block !important;"],moveCaptionWindowRelative:!0,moveCaptionWindowSelectors:[".vjs-text-track-display > div > div > div"],playerControls:t,playerCurrentTime:u,smallTextSize:i,video:r}}},function(t,e,n){var r=n(24),o=n(11).timeStringToSeconds;t.exports=function(t){return new Promise((function(e,n){var i="".concat(t.trim(),"\n").split("\n");i[0].includes("WEBVTT")||n("VttParser - Expected first line to include WEBVTT"),i[1].includes("X-TIMESTAMP-MAP")||n("VttParser - Expected second line to include X-TIMESTAMP-MAP"),""!==i[2]&&n("VttParser - Expected third line to be empty");var u=i.slice(3,i.length);u.length%4!=0&&n("VttParser - Expected body to be divisible by 4"),e(r(u,4).map((function(t){var e=t[1];if(e.includes("--\x3e")){var r=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(e.split("--\x3e"),2),i=r[0],u=r[1],c=o(i),a=o(u);if(c&&a)return{startTime:c,endTime:a,text:t[2]};n("VttParser - Couldn't parse times")}else n('VttParser - Expected times to include "--\x3e"')})))}))}},function(t,e,n){var r=n(25),o=n(26),i=n(33),u=Math.ceil,c=Math.max;t.exports=function(t,e,n){e=(n?o(t,e,n):void 0===e)?1:c(i(e),0);var a=null==t?0:t.length;if(!a||e<1)return[];for(var s=0,l=0,f=Array(u(a/e));s<a;)f[l++]=r(t,s,s+=e);return f}},function(t,e){t.exports=function(t,e,n){var r=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(n=n>o?o:n)<0&&(n+=o),o=e>n?0:n-e>>>0,e>>>=0;for(var i=Array(o);++r<o;)i[r]=t[r+e];return i}},function(t,e,r){function o(t){return(o="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var i=r(8),u=r(27),c=r(32),a=r(0);t.exports=function(t,e,n){if(!a(n))return!1;var r=o(e);return!!("number"==r?u(n)&&c(e,n.length):"string"==r&&e in n)&&i(n[e],t)}},function(t,e,n){var r=n(9),o=n(31);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)}},function(e,r){function o(t){return(o="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var i="object"==(void 0===t?"undefined":o(t))&&t&&t.Object===Object&&t;e.exports=i},function(t,e,n){var r=n(5),o=Object.prototype,i=o.hasOwnProperty,u=o.toString,c=r?r.toStringTag:void 0;t.exports=function(t){var e=i.call(t,c),n=t[c];try{t[c]=void 0;var r=!0}catch(t){}var o=u.call(t);return r&&(e?t[c]=n:delete t[c]),o}},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)}},function(t,e){t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var o=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var n=r(t);return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&o.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e,n){var r=n(34);t.exports=function(t){var e=r(t),n=e%1;return e==e?n?e-n:e:0}},function(t,e,n){var r=n(35);t.exports=function(t){return t?(t=r(t))===1/0||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}},function(t,e,n){var r=n(0),o=n(1),i=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,a=/^0o[0-7]+$/i,s=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(o(t))return NaN;if(r(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=r(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(i,"");var n=c.test(t);return n||a.test(t)?s(t.slice(2),n?2:8):u.test(t)?NaN:+t}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}t.exports=function(t){return null!=t&&"object"==r(t)}},function(t,e,n){var r={siteId:"disneyplus",detectSite:function(t){return t.includes("disneyplus.com")},detectVideoId:function(){var t=window.location.pathname.split("/");return"video"===t[2]?t[3]:null},injectPattern:"https://www.disneyplus.com/*",captionRequestPattern:"https://*.dssott.com/*/disney/*/seg_*.vtt",parser:n(38),adapter:n(39),captionProcessor:n(76)};t.exports=r},function(t,e,n){function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var o=n(11).timeStringToSeconds;t.exports=function(t){return new Promise((function(e,n){var i="".concat(t.trim(),"\n").split("\n");i[0].includes("WEBVTT")||n("DisneyPlusParser - Expected first line to include WEBVTT");for(var u=1;!i[u].includes("--\x3e")&&u<i.length-1;)u++;for(var c,a,s=[],l=null,f=null,p=[];u<=i.length-1;){var d=i[u];if(d.includes("--\x3e")){var y=r(d.split("--\x3e"),2),m=y[0],v=y[1],b=o(m),h=o(v);b&&h?(l=b,f=h):n("DisneyPlusParser - Couldn't parse times")}else""!==d.trim()?p.push((c=d,a=void 0,(a=document.createElement("div")).innerHTML=c,a.textContent)):""===d.trim()&&p.length>0&&null!==f&&null!==l&&(s.push({startTime:l,endTime:f,text:p.join("\n")}),l=null,f=null,p=[]);u++}e(s)}))}},function(t,e,n){var r=n(40);t.exports=function(){var t=document.querySelector("video"),e=null,n="";return t&&(e=t.currentTime,n=r(t,"textTracks[0].activeCues[0].text")||""),{actionPanelFixedPosition:{bottom:"160px",left:"16px"},captionText:n,captionWindow:null,captionWindowFixedPosition:{bottom:20,left:0,position:"fixed",width:"100%",background:"black"},captionWindowStyle:{width:"100%",fontSize:"24px",textAlign:"center",color:"white"},fullscreenRoot:document.getElementById("app_body_content"),playerCurrentTime:e,video:t}}},function(t,e,n){var r=n(41);t.exports=function(t,e,n){var o=null==t?void 0:r(t,e);return void 0===o?n:o}},function(t,e,n){var r=n(42),o=n(75);t.exports=function(t,e){for(var n=0,i=(e=r(e,t)).length;null!=t&&n<i;)t=t[o(e[n++])];return n&&n==i?t:void 0}},function(t,e,n){var r=n(7),o=n(43),i=n(44),u=n(72);t.exports=function(t,e){return r(t)?t:o(t,e)?[t]:i(u(t))}},function(t,e,r){function o(t){return(o="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}var i=r(7),u=r(1),c=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;t.exports=function(t,e){if(i(t))return!1;var n=o(t);return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!u(t))||a.test(t)||!c.test(t)||null!=e&&t in Object(e)}},function(t,e,n){var r=n(45),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,u=r((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(o,(function(t,n,r,o){e.push(r?o.replace(i,"$1"):n||t)})),e}));t.exports=u},function(t,e,n){var r=n(46);t.exports=function(t){var e=r(t,(function(t){return 500===n.size&&n.clear(),t})),n=e.cache;return e}},function(t,e,n){var r=n(47),o="Expected a function";function i(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(o);var n=function n(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var u=t.apply(this,r);return n.cache=i.set(o,u)||i,u};return n.cache=new(i.Cache||r),n}i.Cache=r,t.exports=i},function(t,e,n){var r=n(48),o=n(67),i=n(69),u=n(70),c=n(71);function a(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}a.prototype.clear=r,a.prototype.delete=o,a.prototype.get=i,a.prototype.has=u,a.prototype.set=c,t.exports=a},function(t,e,n){var r=n(49),o=n(60),i=n(66);t.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(t,e,n){var r=n(50),o=n(56),i=n(57),u=n(58),c=n(59);function a(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}a.prototype.clear=r,a.prototype.delete=o,a.prototype.get=i,a.prototype.has=u,a.prototype.set=c,t.exports=a},function(t,e,n){var r=n(2);t.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(t,e,n){var r=n(9),o=n(52),i=n(0),u=n(54),c=/^\[object .+?Constructor\]$/,a=Function.prototype,s=Object.prototype,l=a.toString,f=s.hasOwnProperty,p=RegExp("^"+l.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!i(t)||o(t))&&(r(t)?p:c).test(u(t))}},function(t,e,n){var r,o=n(53),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return!!i&&i in t}},function(t,e,n){var r=n(6)["__core-js_shared__"];t.exports=r},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},function(t,e,n){var r=n(2),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(r){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return o.call(e,t)?e[t]:void 0}},function(t,e,n){var r=n(2),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return r?void 0!==e[t]:o.call(e,t)}},function(t,e,n){var r=n(2);t.exports=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=r&&void 0===e?"__lodash_hash_undefined__":e,this}},function(t,e,n){var r=n(61),o=n(62),i=n(63),u=n(64),c=n(65);function a(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}a.prototype.clear=r,a.prototype.delete=o,a.prototype.get=i,a.prototype.has=u,a.prototype.set=c,t.exports=a},function(t,e){t.exports=function(){this.__data__=[],this.size=0}},function(t,e,n){var r=n(3),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,n=r(e,t);return!(n<0||(n==e.length-1?e.pop():o.call(e,n,1),--this.size,0))}},function(t,e,n){var r=n(3);t.exports=function(t){var e=this.__data__,n=r(e,t);return n<0?void 0:e[n][1]}},function(t,e,n){var r=n(3);t.exports=function(t){return r(this.__data__,t)>-1}},function(t,e,n){var r=n(3);t.exports=function(t,e){var n=this.__data__,o=r(n,t);return o<0?(++this.size,n.push([t,e])):n[o][1]=e,this}},function(t,e,n){var r=n(12)(n(6),"Map");t.exports=r},function(t,e,n){var r=n(4);t.exports=function(t){var e=r(this,t).delete(t);return this.size-=e?1:0,e}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(t)}t.exports=function(t){var e=r(t);return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},function(t,e,n){var r=n(4);t.exports=function(t){return r(this,t).get(t)}},function(t,e,n){var r=n(4);t.exports=function(t){return r(this,t).has(t)}},function(t,e,n){var r=n(4);t.exports=function(t,e){var n=r(this,t),o=n.size;return n.set(t,e),this.size+=n.size==o?0:1,this}},function(t,e,n){var r=n(73);t.exports=function(t){return null==t?"":r(t)}},function(t,e,n){var r=n(5),o=n(74),i=n(7),u=n(1),c=r?r.prototype:void 0,a=c?c.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(u(e))return a?a.call(e):"";var n=e+"";return"0"==n&&1/e==-1/0?"-0":n}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}},function(t,e,n){var r=n(1);t.exports=function(t){if("string"==typeof t||r(t))return t;var e=t+"";return"0"==e&&1/t==-1/0?"-0":e}},function(t,e){function n(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}t.exports=function(t,e){return[].concat(n(t),n(e))}},function(t,e){var n=function(t){var e=/(\d+):(\d+):(\d+),(\d+)/g;if(e.test(t)){e.lastIndex=0;var n=e.exec(t);return(36e5*Number(n[1])+6e4*Number(n[2])+1e3*Number(n[3])+Number(n[4]))/1e3}return null};t.exports=function(t){return new Promise((function(e,r){var o=function(t){var e=t.split("\n").map((function(t){return t.trim()})).join("\n").trim();return"".concat(e,"\n\n")}(t).split("\n\n"),i=[];o.forEach((function(t){var e=t.split("\n");if(e.length>1){var o=e[1],u=e.slice(2).join("\n");if(o.includes("--\x3e")){var c=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(o.split("--\x3e"),2),a=c[0],s=c[1],l=n(a),f=n(s);l&&f?i.push({startTime:l,endTime:f,text:u}):r("SrtParser - Couldn't parse times")}else r('SrtParser - Expected times to include "--\x3e"')}})),e(i)}))}},function(t,e){var n=function(t,e){if(2===e)return t>10?"".concat(t):"0".concat(t);if(3===e)return t>100?"".concat(t):t>10?"0".concat(t):"00".concat(t);throw new Error("SrtEncoder - formatNum only can handle spaces of 2 or 3")},r=function(t){var e,r=0,o=0,i=0;return(t*=1e3)>=36e5&&(t-=36e5*(r=Math.floor(t/36e5))),t>=6e4&&(t-=6e4*(o=Math.floor(t/6e4))),t>=1e3&&(t-=1e3*(i=Math.floor(t/1e3))),e=Math.floor(t),"".concat(n(r,2),":").concat(n(o,2),":").concat(n(i,2),",").concat(n(e,3))};t.exports=function(t){return new Promise((function(e,n){var o="\n";t.forEach((function(t,e){o+="".concat(e+1,"\n"),o+="".concat(r(t.startTime)," --\x3e ").concat(r(t.endTime),"\n"),o+="".concat(t.text,"\n\n")})),e(o)}))}}]))}).call(this,n(2))},function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"===("undefined"==typeof window?"undefined":n(window))&&(r=window)}t.exports=r}]));