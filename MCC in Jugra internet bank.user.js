// ==UserScript==
// @name         MCC in Jugra internet bank 
// @namespace    https://github.com/alezhu/jugra_ib_mcc
// @version      0.2
// @description  Show operations MCC in Jugra new internet bank 
// @author       alezhu
// @match        https://online.jugra.ru/main
// @grant        none
// @run-at      document-idle
// @source       https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js
// @updateURL    https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js
// @downloadURL  https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js

// ==/UserScript==
/* jshint -W097 */
'use strict';

(function(window,angular){
    var LOG = 1;
    if (LOG) console.log('Jugra MCC');    

    function wait() {
        try{
            angular.element(window.document.body).injector().invoke(function($compile, $templateCache, $rootScope){
                if (LOG) console.log('Catched!');    
                angular.forEach(["app/tool/area/statement/card/list/list.html","app/tool/area/detail/card/card.html"],function(tmpl) {
                    var html = $templateCache.get(tmpl);

                    html = html.replace("{{ item.description }}","MCC:{{ item.sic_code }}&nbsp;{{ item.description }}");
                    $templateCache.put(tmpl,html);
                });
                $compile(window.document.body)($rootScope);
            });
        }
        catch(ex)        {
            setTimeout(wait,1);
        }
    }
    wait();


})(window,window.angular);
