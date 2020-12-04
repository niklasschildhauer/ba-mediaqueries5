import * as Coordinator from './coordinator/ScriptCoordinator'


let manager: Coordinator.ScriptCoordinator = new Coordinator.ScriptCoordinator();


let styleText = ""
let stylesSheets = document.querySelectorAll('link');
for (var i = stylesSheets.length; i--;) {
     if(stylesSheets[i].getAttribute('rel') === 'stylesheet') {
         let link = stylesSheets[i].getAttribute('href')
         loadCSSContent(link)
             .then(function(text) {
                 manager.addCSSCode(text);
             })
     }
 }

 //var coordinator = new Manager(text)

 async function loadCSSContent(link: any) {
     return await fetch(link, {
         method: 'get'
     }).then( function (response) {
             return response.text()
         })
 }



