System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Participant;
    return {
        setters:[],
        execute: function() {
            Participant = (function () {
                function Participant(participant) {
                    this.name = participant.fallback_name;
                    this.posts = 0;
                }
                return Participant;
            }());
            exports_1("Participant", Participant);
        }
    }
});
