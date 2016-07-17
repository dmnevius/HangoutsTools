System.register(['./participant'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var participant_1;
    var Hangout;
    return {
        setters:[
            function (participant_1_1) {
                participant_1 = participant_1_1;
            }],
        execute: function() {
            Hangout = (function () {
                function Hangout(hangout) {
                    this.name = hangout.conversation_state.conversation.name || "Untitled Hangout";
                    this.participant_list = [];
                    this.participants = {};
                    this.posts = 0;
                    this.timeline = {};
                    for (var _i = 0, _a = hangout.conversation_state.conversation.participant_data; _i < _a.length; _i++) {
                        var participant = _a[_i];
                        this.participants[participant.id.gaia_id] = new participant_1.Participant(participant);
                    }
                    for (var _b = 0, _c = hangout.conversation_state.event; _b < _c.length; _b++) {
                        var event_1 = _c[_b];
                        if (event_1.event_type === "REGULAR_CHAT_MESSAGE") {
                            var id = event_1.sender_id.gaia_id;
                            var date = new Date(0);
                            date.setUTCSeconds(event_1.timestamp / 1000000);
                            var year = date.getFullYear();
                            var month = date.getMonth();
                            var day = date.getDate();
                            if (!this.timeline[year]) {
                                this.timeline[year] = {};
                            }
                            if (!this.timeline[year][month]) {
                                this.timeline[year][month] = {};
                            }
                            if (!this.timeline[year][month][day]) {
                                this.timeline[year][month][day] = 0;
                            }
                            this.timeline[year][month][day] += 1;
                            if (!this.participants[id]) {
                                this.participants[id] = new participant_1.Participant({
                                    fallback_name: 'Unknown User',
                                    id: {
                                        gaia_id: id
                                    }
                                });
                            }
                            this.participants[id].posts += 1;
                            this.posts += 1;
                        }
                    }
                    for (var participant in this.participants) {
                        this.participant_list.push(this.participants[participant]);
                    }
                }
                return Hangout;
            }());
            exports_1("Hangout", Hangout);
        }
    }
});
