System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Participant;
    return {
        setters:[],
        execute: function() {
            Participant = (function () {
                function Participant(participant) {
                    this.name = participant.fallback_name || "Unknown User";
                    this.posts = 0;
                    this.id = participant.id.gaia_id;
                }
                return Participant;
            }());
            exports_1("Participant", Participant);
        }
    }
});
