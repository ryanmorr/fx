/*! @ryanmorr/fx v0.1.0 | https://github.com/ryanmorr/fx */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).fx=t()}(this,(function(){"use strict";const e={},t=/([+-]?[0-9|auto.]+)(%|\w+)?/,n=/^#?(\w{2})(\w{2})(\w{2})$/,o=/^#?(\w{1})(\w{1})(\w{1})$/,r=/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,s={linear:e=>e,"ease-in":e=>Math.pow(e,1.675),"ease-out":e=>1-Math.pow(1-e,1.675),"ease-in-out":e=>.5*(Math.sin((e-.5)*Math.PI)+1)};function l(t){if(t in e)return e[t];let s,l=t.match(n);return l&&4===l.length?(s=[parseInt(l[1],16),parseInt(l[2],16),parseInt(l[3],16)],e[t]=s,s):(l=t.match(r),l&&4===l.length?(s=[parseInt(l[1],10),parseInt(l[2],10),parseInt(l[3],10)],e[t]=s,s):(l=t.match(o),l&&4===l.length?(s=[parseInt(l[1]+l[1],16),parseInt(l[2]+l[2],16),parseInt(l[3]+l[3],16)],e[t]=s,s):void 0))}function a(e,n){const o=t.exec(n);let r=o[2]||"";return r||-1!==e.indexOf("scale")||(r=e.indexOf("rotate")>-1||e.indexOf("skew")>-1?"deg":"px"),[parseFloat(o[1])||0,r]}function i(e,t,n,o){let r=parseFloat(u(e,t))||0;return"px"!==o&&(c(e,t,(n||1)+o),r=(n||1)/parseFloat(u(e,t))*r,c(e,t,r+o)),r}function c(e,t,n){e.style[t]=n}function u(e,t){const n=e.ownerDocument.defaultView.getComputedStyle(e,null);return t in n?n[t]:null}return function(e,t,n=1e3,o="linear"){return e="string"==typeof e?document.querySelector(e):e,new Promise((r=>{const f={},p=s[o],[d,h,w]=function(e,t){const n={},o={},r={};let s,c,f,p;for(s in t)if(c=t[s],[p,f]=Array.isArray(c)?c:[null,c],s.toLowerCase().includes("color"))p=null==p?u(e,s):p,n[s]=l(p),o[s]=l(f);else if("scrollTop"===s||"scrollLeft"===s)p=null==p?e[s]:p,n[s]=p,o[s]=f;else if(s in e.style){const[t,l]=a(s,f);p=null==p?i(e,s,t,l):a(p)[0],n[s]=p,o[s]=t,r[s]=l}else n[s]=0,o[s]=f;return[n,o,r]}(e,t);let m;const y=t=>{m||(m=t);const o=Math.min(t-m,n)/n;for(const e in d){const t=d[e],n=h[e];if(Array.isArray(t)){f[e]=[];for(let r=0,s=t.length;r<s;r++)f[e][r]=t[r]+(n[r]-t[r])*p(o)}else f[e]=t+(n-t)*p(o)}!function(e,t,n){let o,r;for(o in t)switch(r=t[o],o){case"opacity":c(e,o,r);break;case"scrollTop":case"scrollLeft":e[o]=r;break;default:o in e.style&&(o.toLowerCase().includes("color")?c(e,o,`rgb(${Math.floor(r[0])}, ${Math.floor(r[1])}, ${Math.floor(r[2])})`):c(e,o,r+n[o]))}}(e,f,w),o<1?requestAnimationFrame(y):r()};requestAnimationFrame(y)}))}}));
