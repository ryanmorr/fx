/*! @ryanmorr/fx v0.1.0 | https://github.com/ryanmorr/fx */
"use strict";const e={duration:1e3,easing:"ease-in-out"},t={linear:e=>e,"ease-in":e=>Math.pow(e,1.675),"ease-out":e=>1-Math.pow(1-e,1.675),"ease-in-out":e=>.5*(Math.sin((e-.5)*Math.PI)+1)};function n(e,t,r,s){return Array.isArray(t)?t.map(((t,o)=>n(e,t,r[o],s))):t+(r-t)*e(s)}function r(e){return"number"==typeof e?[e,"px"]:/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e)}function s(e){return e.toLowerCase().includes("color")}function o(e){if(e.startsWith("rgb")){const t=/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d{1,3}))?\)$/.exec(e);return[parseInt(t[1],10),parseInt(t[2],10),parseInt(t[3],10),null==t[4]?1:t[4]]}const t=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((e,t,n,r)=>t+t+n+n+r+r)),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return[parseInt(n[1],16),parseInt(n[2],16),parseInt(n[3],16),1]}function a(e,t,n,r){switch(t){case"opacity":e.style[t]=n;break;case"scrollTop":case"scrollLeft":e[t]=n;break;default:t in e.style&&(s(t)?e.style[t]=`rgba(${Math.floor(n[0])}, ${Math.floor(n[1])}, ${Math.floor(n[2])}, ${n[3]})`:e.style[t]=n+r)}}module.exports=function(i,c){const l="string"==typeof i?document.querySelector(i):i,{duration:u,easing:f}=Object.assign(e,c);return new Promise((e=>{let i;const d=t[f],[p,m,y]=function(e,t){const n={},a={},i={};for(const c in t){const l=t[c];let[u,f]=Array.isArray(l)?l:[null,l];if(s(c))u=null==u?getComputedStyle(e)[c]:u,n[c]=o(u),a[c]=o(f);else if("scrollTop"===c||"scrollLeft"===c)u=null==u?e[c]:u,n[c]=u,a[c]=f;else{const[t,s]=r(f);u=null==u?parseFloat(getComputedStyle(e)[c])||0:r(u)[0],n[c]=u,a[c]=t,i[c]=s}}return[n,a,i]}(l,c),h=t=>{i||(i=t);const r=Math.min(t-i,u)/u;for(const e in p)a(l,e,n(d,p[e],m[e],r),y[e]);r<1?requestAnimationFrame(h):e()};requestAnimationFrame(h)}))};
