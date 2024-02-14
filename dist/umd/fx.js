/*! @ryanmorr/fx v1.0.0 | https://github.com/ryanmorr/fx */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).fx=t()}(this,(function(){"use strict";let e=0;const t=[],n={},o=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/,r=/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([.\d]+))?\)$/,a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,s=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,c={duration:1e3,easing:"ease-in-out"},l={all:"px",scale:"",rotate:"deg",translate:"px",opacity:"",offsetDistance:"%"},i={linear:e=>e,"ease-in":e=>Math.pow(e,1.675),"ease-out":e=>1-Math.pow(1-e,1.675),"ease-in-out":e=>.5*(Math.sin((e-.5)*Math.PI)+1)};function u(e){return Array.isArray(e)?e:[null,e]}function f(e){const t=o.exec(e);return t&&t[1]?t[1]:null}function d(e,t){return null==t?e in l?l[e]:l.all:t}function p(e){return e.toLowerCase().includes("color")}function h(e,t,n){const o=e.exec(t);return[parseInt(o[1],n),parseInt(o[2],n),parseInt(o[3],n),null==o[4]?1:parseFloat(o[4])]}function m(e){return e.startsWith("rgb")?h(r,e,10):h(a,e.replace(s,((e,t,n,o)=>t+t+n+n+o+o)),16)}function y(e,t,o,r){const a=parseFloat(o);if("none"===o||""===o||0===a)return 0;if(null==r)return a;if("scale"===t&&"%"===r)return 100*a;const s=f(o);return r===s||"deg"===s||"rad"===s||"turn"===s?a:function(e,t,o){const r=t+o;r in n&&n[r];const a=document.createElement(e.tagName),s=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;s.appendChild(a),a.style.position="absolute",a.style.width=100+o;const c=100/a.offsetWidth*parseFloat(t);return s.removeChild(a),n[r]=c}(e,o,r)}function g(e,t){const n=getComputedStyle(e);return t.includes("-")?n.getPropertyValue(t):n[t]}function b(e,t,n){t.includes("-")?e.style.setProperty(t,n):e.style[t]=n}function x(e,t){const n={},o={},r={};return Object.keys(t).forEach((a=>{let[s,c]=u(t[a]);switch(a){case"scrollTop":case"scrollLeft":n[a]=null==s?e[a]:s,o[a]=c;break;case"scaleX":case"scaleY":case"translateX":case"translateY":{const l=a.slice(0,-1);if(!n[l]){const a="scale"===l?1:0;s=function(e,t,n){const o=[n,n],r=g(e,t);if("none"!==r){const e=r.split(" ");"scale"===t&&1===e.length?o[0]=o[1]=r:e.forEach(((e,t)=>o[t]=e))}return o}(e,l,a),c=[a,a],r[l]=[],["X","Y"].forEach(((n,o)=>{const a=l+n;if(a in t){const[n,i]=u(t[a]),d=f(i);s[o]=null==n?y(e,l,s[o],d):parseFloat(n),c[o]=parseFloat(i),r[l][o]=d}else s[o]=c[o]=parseFloat(s[o])})),n[l]=s,o[l]=c}break}default:if(p(a))n[a]=m(null==s?g(e,a):s),o[a]=m(c);else{const t=f(c);n[a]=null==s?y(e,a,g(e,a),t):parseFloat(s),o[a]=parseFloat(c),r[a]=t}}})),[n,o,r]}function F(n){return 0===e&&(e=requestAnimationFrame(w)),new Promise((e=>{const o=()=>(e(),function(e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}(r)),r=e=>n(e,o);t.push(r)}))}function w(n){for(let e=t.length;e--;)t[e](n);e=t.length>0?requestAnimationFrame(w):0}function A(e,t,n,o){return Array.isArray(t)?t.map(((t,r)=>A(e,t,n[r],o))):t+(n-t)*e(o)}function M(e,t,n,o){let r;const[a,s,c]=x(e,t);return F(((t,l)=>{r||(r=t);const i=Math.min(t-r,n)/n;Object.keys(a).forEach((t=>function(e,t,n,o){switch(t){case"scrollTop":case"scrollLeft":e[t]=n;break;case"scale":case"translate":b(e,t,n[0]+d(t,o[0])+" "+n[1]+d(t,o[1]));break;default:b(e,t,p(t)?`rgb(${Math.floor(n[0])}, ${Math.floor(n[1])}, ${Math.floor(n[2])}, ${n[3]})`:n+d(t,o))}}(e,t,A(o,a[t],s[t],i),c[t]))),i>=1&&l()}))}return function(e,t){const n="string"==typeof e?document.querySelectorAll(e):e,{duration:o,easing:r}=Object.assign(c,t),a="string"==typeof r?i[r]:r;return n.nodeName?M(n,t,o,a):1===n.length?M(n[0],t,o,a):Promise.all(Array.from(n).map((e=>M(e,t,o,a))))}}));
