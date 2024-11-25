/*! @ryanmorr/fx v1.0.1 | https://github.com/ryanmorr/fx */
let e=0;const t=[],n={},a=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/,r=/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([.\d]+))?\)$/,o=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,s=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,c={duration:1e3,easing:"ease-in-out"},l={all:"px",scale:"",rotate:"deg",translate:"px",opacity:"",offsetDistance:"%"},i={linear:e=>e,"ease-in":e=>Math.pow(e,1.675),"ease-out":e=>1-Math.pow(1-e,1.675),"ease-in-out":e=>.5*(Math.sin((e-.5)*Math.PI)+1)};function u(e){return Array.isArray(e)?e:[null,e]}function f(e){const t=a.exec(e);return t&&t[1]?t[1]:null}function d(e,t){return null==t?e in l?l[e]:l.all:t}function p(e){return e.toLowerCase().includes("color")}function h(e,t,n){const a=e.exec(t);return[parseInt(a[1],n),parseInt(a[2],n),parseInt(a[3],n),null==a[4]?1:parseFloat(a[4])]}function m(e){return e.startsWith("rgb")?h(r,e,10):h(o,e.replace(s,((e,t,n,a)=>t+t+n+n+a+a)),16)}function y(e,t,a,r){const o=parseFloat(a);if("none"===a||""===a||0===o)return 0;if(null==r)return o;if("scale"===t&&"%"===r)return 100*o;const s=f(a);return r===s||"deg"===s||"rad"===s||"turn"===s?o:function(e,t,a){const r=t+a;r in n&&n[r];const o=document.createElement(e.tagName),s=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;s.appendChild(o),o.style.position="absolute",o.style.width=100+a;const c=100/o.offsetWidth*parseFloat(t);return s.removeChild(o),n[r]=c}(e,a,r)}function g(e,t){const n=getComputedStyle(e);return t.includes("-")?n.getPropertyValue(t):n[t]}function b(e,t,n){t.includes("-")?e.style.setProperty(t,n):e.style[t]=n}function F(e,t){const n={},a={},r={};return Object.keys(t).forEach((o=>{let[s,c]=u(t[o]);switch(o){case"scrollTop":case"scrollLeft":n[o]=null==s?e[o]:s,a[o]=c;break;case"scaleX":case"scaleY":case"translateX":case"translateY":{const l=o.slice(0,-1);if(!n[l]){const o="scale"===l?1:0;s=function(e,t,n){const a=[n,n],r=g(e,t);if("none"!==r){const e=r.split(" ");"scale"===t&&1===e.length?a[0]=a[1]=r:e.forEach(((e,t)=>a[t]=e))}return a}(e,l,o),c=[o,o],r[l]=[],["X","Y"].forEach(((n,a)=>{const o=l+n;if(o in t){const[n,i]=u(t[o]),d=f(i);s[a]=null==n?y(e,l,s[a],d):parseFloat(n),c[a]=parseFloat(i),r[l][a]=d}else s[a]=c[a]=parseFloat(s[a])})),n[l]=s,a[l]=c}break}default:if(p(o))n[o]=m(null==s?g(e,o):s),a[o]=m(c);else{const t=f(c);n[o]=null==s?y(e,o,g(e,o),t):parseFloat(s),a[o]=parseFloat(c),r[o]=t}}})),[n,a,r]}function x(n){return 0===e&&(e=requestAnimationFrame(w)),new Promise((e=>{const a=()=>(e(),function(e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}(r)),r=e=>n(e,a);t.push(r)}))}function w(n){for(let e=t.length;e--;)t[e](n);e=t.length>0?requestAnimationFrame(w):0}function A(e,t,n,a){return Array.isArray(t)?t.map(((t,r)=>A(e,t,n[r],a))):t+(n-t)*e(a)}function M(e,t,n,a){let r;const[o,s,c]=F(e,t);return x(((t,l)=>{r||(r=t);const i=Math.min(t-r,n)/n;Object.keys(o).forEach((t=>function(e,t,n,a){switch(t){case"scrollTop":case"scrollLeft":e[t]=n;break;case"scale":case"translate":b(e,t,n[0]+d(t,a[0])+" "+n[1]+d(t,a[1]));break;default:b(e,t,p(t)?`rgb(${Math.floor(n[0])}, ${Math.floor(n[1])}, ${Math.floor(n[2])}, ${n[3]})`:n+d(t,a))}}(e,t,A(a,o[t],s[t],i),c[t]))),i>=1&&l()}))}function $(e,t){const n="string"==typeof e?document.querySelectorAll(e):e,{duration:a,easing:r,...o}=Object.assign(c,t),s="string"==typeof r?i[r]:r;return n.nodeName?M(n,o,a,s):1===n.length?M(n[0],o,a,s):Promise.all(Array.from(n).map((e=>M(e,o,a,s))))}export{$ as default};
