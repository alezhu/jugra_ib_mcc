// ==UserScript==
// @name         MCC in Jugra internet bank 
// @namespace    https://github.com/alezhu/jugra_ib_mcc
// @version      0.3
// @description  Show operations MCC in Jugra new internet bank 
// @author       alezhu
// @match        https://online.jugra.ru/*
// @grant        none
// @source       https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js
// @updateURL    https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js
// @downloadURL  https://raw.githubusercontent.com/alezhu/jugra_ib_mcc/master/MCC%20in%20Jugra%20internet%20bank.user.js

// ==/UserScript==
/* jshint -W097 */
'use strict';

(function(window, angular) {
    var LOG = 0;
    if (LOG) console.log('Jugra MCC');
    var templates = [{
        template: "app/tool/area/detail/card/card.html",
        processed: false,
    }, {
        template: "app/tool/area/statement/card/list/list.html",
        processed: false,
    }];
    var points = [{
        id: ".tools__detail-table",
        template: "app/tool/area/detail/card/card.html",
        processed: false,
        handler: function(elem, $templateCache, $compile) {
            var point = this;
            var html = $templateCache.get(point.template);
            elem = elem.parent();
            var scope = elem.scope();
            elem.html(html);
            $compile(elem)(scope);
            point.processed = true;
        }
    }, {
        id: ".card-statement-controls",
        template: "app/tool/area/detail/card/cardControls/cardControls.html",
        processed: false,
        handler: function(elem, $templateCache, $compile) {
            var point = this;
            var scope = elem.scope();
            scope.replaced = false;
            point.processed = true;
            //debugger;

            var replacer = function() {
                var list = angular.element('.statement-card-list');
                if (list.length > 0) {
                    var html = $templateCache.get("app/tool/area/statement/card/list/list.html");
                    list = list.parent();
                    var list_scope = list.scope();
                    list.html(html);
                    $compile(list)(list_scope);
                    //scope.replaced = true;
                } else {
                    setTimeout(replacer, 1);
                }
            };

            scope.$watch(function() {
                var dateFrom = "";
                var dateTo = "";
                try {
                    dateFrom = scope.ranges.dateFrom.toDateString();
                    dateTo = scope.ranges.dateTo.toDateString();
                } catch (ex) {}
                return scope.selectedStatementType + scope.activeRangeType + dateFrom + dateTo;
            }, function(newValue, oldValue, scope) {
                if (LOG) console.log('Changes:', oldValue, '->', newValue);
                if (!scope.replaced && newValue !== oldValue && scope.selectedStatementType === scope.CARD_TYPE) {
                    replacer();
                }
            });

            var cal = elem.find('div[ib-daterangepicker]');
            if (cal.length > 0) {
                var cal_scope = cal.scope();
                cal_scope.$watch('isCalendarOpen', function(newValue, oldValue, scope) {
                    if (LOG) console.log('CalendarOpen:', oldValue, '->', newValue);
                    if (!newValue) {
                        //debugger;
                        replacer();
                    }
                });
            }
        }
    }];

    function wait() {
        var exit = false;
        try {
            angular.element(window.document.body).injector().invoke(function($compile, $templateCache, $rootScope) {
                if (LOG) console.log('Catched!');
                exit = true;
                angular.forEach(templates, function(template) {
                    if (!template.processed) {
                        var html = $templateCache.get(template.template);
                        if (angular.isDefined(html)) {
                            html = html.replace("{{ item.description }}", "MCC:{{ item.sic_code }}&nbsp;{{ item.description }}");
                            $templateCache.put(template.template, html);
                            template.processed = true;
                        } else {
                            exit = false;
                        }
                    }
                });
                if (exit) {
                    var count = 0;
                    angular.forEach(points, function(point) {
                        if (!point.processed) {
                            var elem = angular.element(point.id);
                            if (elem.length > 0) {
                                point.handler(elem, $templateCache, $compile);
                            }
                        }
                        if (point.processed) count++;
                    });
                    if (count != points.length) {
                        exit = false;
                    }
                }
            });
        } catch (ex) {

        }
        if (!exit) setTimeout(wait, 1);
    }


    function waitMain() {
        if (window.location.href.indexOf('/main') < 0) {
            setTimeout(waitMain, 1000);
        } else {
            if (LOG) console.log('Main');
            wait();
        }
    }
    waitMain();

})(window, window.angular);
