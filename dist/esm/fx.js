/*! @ryanmorr/fx v0.1.0 | https://github.com/ryanmorr/fx */
const e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/,t=/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([.\d]+))?\)$/,n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,r=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,a={duration:1e3,easing:"ease-in-out"},o={linear:e=>e,"ease-in":e=>Math.pow(e,1.675),"ease-out":e=>1-Math.pow(1-e,1.675),"ease-in-out":e=>.5*(Math.sin((e-.5)*Math.PI)+1)};function s(e,t,n,r){return Array.isArray(t)?t.map(((t,a)=>s(e,t,n[a],r))):t+(n-t)*e(r)}function l(t){return"number"==typeof t?[t,"px"]:e.exec(t)}function i(e){return e.toLowerCase().includes("color")}function c(e,t,n){const r=e.exec(t);return[parseInt(r[1],n),parseInt(r[2],n),parseInt(r[3],n),null==r[4]?1:parseFloat(r[4])]}function u(e){return e.startsWith("rgb")?c(t,e,10):c(n,e.replace(r,((e,t,n,r)=>t+t+n+n+r+r)),16)}function f(e,t,n,r){switch(t){case"opacity":e.style[t]=n;break;case"scrollTop":case"scrollLeft":e[t]=n;break;default:t in e.style&&(i(t)?e.style[t]=`rgb(${Math.floor(n[0])}, ${Math.floor(n[1])}, ${Math.floor(n[2])}, ${n[3]})`:e.style[t]=n+r)}}function d(e,t){const n="string"==typeof e?document.querySelector(e):e,{duration:r,easing:c}=Object.assign(a,t);return new Promise((e=>{let a;const d=o[c],[p,m,y]=function(e,t){const n={},r={},a={};for(const o in t){const s=t[o];let[c,f]=Array.isArray(s)?s:[null,s];if(i(o))c=null==c?getComputedStyle(e)[o]:c,n[o]=u(c),r[o]=u(f);else if("scrollTop"===o||"scrollLeft"===o)c=null==c?e[o]:c,n[o]=c,r[o]=f;else{const[t,s]=l(f);c=null==c?getComputedStyle(e)[o]||0:l(c)[0],n[o]=parseFloat(c),r[o]=parseFloat(t),a[o]=s}}return[n,r,a]}(n,t),h=t=>{a||(a=t);const o=Math.min(t-a,r)/r;for(const e in p)f(n,e,s(d,p[e],m[e],o),y[e]);o<1?requestAnimationFrame(h):e()};requestAnimationFrame(h)}))}export{d as default};
