function createEngineSelectionBox(){"use strict";function a(a,b){return art("LABEL",art("INPUT",{style:{margin:"0 .25em 0 0"},type:"checkbox"},b),a||null)}function b(){var a=document.createEvent("Event");a.initEvent("input",!0,!1),i.dispatchEvent(a)}function c(){var a=h.checked;Array.prototype.forEach.call(k,function(b){b.checked=a})}function d(){setTimeout(function(){h.indeterminate||c()})}function e(){var b=art(a("Select/deselect all"),{style:{display:"inline-block",margin:"0 0 .5em"}},art.on("change",c),art.on(["keyup","mouseup"],d)),e=art("TABLE",{style:{borderSpacing:"0",width:"100%"}}),n=a("Support web workers");i=art("FIELDSET",art("DIV",art("P",{style:{margin:".25em 0 .75em"}},"Select the engines you want your code to support."),b,e,art("HR"),n,art.on("change",g)),{get featureObj(){return j}}),m.forEach(function(b,c){var d,f,g,h,i=b.versions,j=1&c?{className:"engineFieldEven"}:null,k=(i.length+2)/3^0,l=3*k;for(f=0;f<l;++f)g=i[f],f%3||(d=art("TR",j),f||art(d,art("TD",{rowSpan:k,style:{padding:"0 .5em 0 0"}},b.name)),art(e,d)),h=g?a(g.number,{checked:!0,feature:g.feature}):null,art(d,art("TD",{style:{padding:"0 0 0 .5em",width:"6em"}},h))}),h=b.querySelector("INPUT"),k=e.querySelectorAll("INPUT"),l=n.querySelector("INPUT"),f()}function f(){var a=JScrewIt.Feature,b=Array.prototype.filter.call(k,function(a){return a.checked}).map(function(b){return++c,a[b.feature]}),c=b.length;h.checked=c,h.indeterminate=c&&c<k.length,j=a.commonOf.apply(null,b)||a.DEFAULT,l.checked&&(j=j.restrict("web-worker",b))}function g(){f(),b()}var h,i,j,k,l,m=[{name:"Chrome",versions:[{feature:"CHROME52",number:"52+"}]},{name:"Edge",versions:[{feature:"EDGE"}]},{name:"Firefox",versions:[{feature:"FF31",number:"31+"}]},{name:"Internet Explorer",versions:[{feature:"IE9",number:"9"},{feature:"IE10",number:"10"},{feature:"IE11",number:"11"},{feature:"IE11_WIN10",number:"11 (W10)"}]},{name:"Safari",versions:[{feature:"SAFARI70",number:"7.0"},{feature:"SAFARI71",number:"7.1–8.0"},{feature:"SAFARI90",number:"9.0"}]},{name:"Opera",versions:[{feature:"CHROME52",number:"39+"}]},{name:"Android Browser",versions:[{feature:"ANDRO40",number:"4.0"},{feature:"ANDRO41",number:"4.1–4.3"},{feature:"ANDRO44",number:"4.4"}]},{name:"Node.js",versions:[{feature:"NODE010",number:"0.10"},{feature:"NODE012",number:"0.12"},{feature:"NODE40",number:"4+"}]}];return e(),i}function createRoll(){"use strict";function a(){var a=art("DIV");g=a.style,g.display="none",e=art("DIV",a),e.container=a,Object.defineProperty(e,"rollTo",{configurable:!0,value:c,writable:!0}),f=e.style,f.height="0",f.overflowY="hidden"}function b(){m=j+(+new Date-k)*l/250,(m-h)*l>=0&&(m=h,d()),f.height=1===m?"":e.scrollHeight*m+"px",g.display=0===m?"none":""}function c(a){if(a===m)d();else{var c=a>m?1:-1;c!==l&&(j=m,k=+new Date,l=c),h=a,i||(i=setInterval(b,0))}}function d(){clearInterval(i),i=null,l=0}var e,f,g,h,i,j,k,l=0,m=0;return a(),e}!function(){"use strict";function a(b,c){Object.keys(c).forEach(function(d){var e,f=Object.getOwnPropertyDescriptor(c,d);"value"in f?(e=f.value,d in b&&"object"==typeof e?a(b[d],e):b[d]=e):Object.defineProperty(b,d,f)})}window.art=function(b){var c,d,e,f,g;for(c=b instanceof Node?b:"function"==typeof b?b.call(art):document.createElement(b),d=arguments.length,e=0;++e<d;)f=arguments[e],f instanceof Node?c.appendChild(f):null!=f&&(g=typeof f,"object"===g?a(c,f):"function"===g?f.call(art,c):c.appendChild(document.createTextNode(f)));return c}}(),art.on=function(a,b,c){"use strict";function d(d){function e(a){d.addEventListener(a,b,c)}Array.isArray(a)?a.forEach(e):e(a)}return d},function(){"use strict";function a(){if("undefined"!=typeof Worker)try{w=new Worker("html/worker.js")}catch(a){}}function b(){var a,b=d();try{a=JScrewIt.encode(inputArea.value,b)}catch(a){return k(),void m(a+"")}n(a)}function c(){var a=d(),b={input:inputArea.value,options:a};v?t=b:(w.postMessage(b),k(),l(!0)),inputArea.onkeyup=null}function d(){return{features:p.canonicalNames}}function e(){var a=compMenu.selectedIndex,b=compMenu.options[a].value,c=b?x[b]:q.featureObj;!r&&x.areEqual(c,p)||(p=c,this()),a!==compMenu.previousIndex&&(compMenu.previousIndex=a,u.rollTo(+!b))}function f(a){"Tab"!==a.key&&c()}function g(){var a,b;try{a=(0,eval)(outputArea.value)}catch(a){alert(a)}void 0!==a&&(b="string"==typeof a?'"'+a+'"':String(a),alert(b))}function h(a){var b,c;t?(w.postMessage(t),t=null):(b=a.data,c=b.error,c?m(b.error):n(b.output),l(!1))}function i(){var a,d,f,i;document.querySelector("body>*>div").style.display="block",inputArea.value=inputArea.defaultValue,outputArea.oninput=o,art(stats.parentNode,art("BUTTON","Run this",{style:{bottom:"0",fontSize:"10pt",margin:"0",position:"absolute",right:"0"}},art.on("click",g))),function(){var a,b=x.COMPACT;x.AUTO.includes(b)?(p=b,a=1):(p=x.DEFAULT,a=0),compMenu.selectedIndex=compMenu.previousIndex=a}(),w?(a=c,w.onmessage=h,c()):(d=art("BUTTON","Encode",art.on("click",b)),art(controls,d),a=j,outputArea.value=""),inputArea.oninput=a,f=e.bind(a),compMenu.onchange=f,compMenu.onkeydown=setTimeout.bind(null,f),q=art(createEngineSelectionBox(),{className:"engineSelectionBox"},art.on("input",f)),u=createRoll(),art(u.container,art("DIV",{className:"frame"},art("SPAN","Custom Compatibility Selection"),q)),art(controls.parentNode,u),inputArea.createTextRange?(i=inputArea.createTextRange(),i.move("textedit",1),i.select()):inputArea.setSelectionRange(2147483647,2147483647),inputArea.focus()}function j(){s&&o(!0)}function k(){s=!1,outputArea.value="",stats.textContent="…"}function l(a){v=a,outputArea.disabled=a}function m(a){alert(a)}function n(a){outputArea.value=a,o()}function o(a){var b=outputArea.value.length,c=1===b?"1 char":b+" chars";r=!!a,a&&(w&&(inputArea.onkeyup=f),c+=" – <i>out of sync</i>"),s=!0,stats.innerHTML=c}var p,q,r,s,t,u,v,w,x=JScrewIt.Feature;document.addEventListener("DOMContentLoaded",i),a()}();