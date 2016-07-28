System.register(['./analysis', './compatable', './data'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var analysis_1, compatable_1, data_1;
    var HangoutsTools;
    return {
        setters:[
            function (analysis_1_1) {
                analysis_1 = analysis_1_1;
            },
            function (compatable_1_1) {
                compatable_1 = compatable_1_1;
            },
            function (data_1_1) {
                data_1 = data_1_1;
            }],
        execute: function() {
            exports_1("HangoutsTools", HangoutsTools = {
                Analysis: analysis_1.Analysis,
                Compatable: compatable_1.Compatable,
                Data: data_1.Data
            });
        }
    }
});
