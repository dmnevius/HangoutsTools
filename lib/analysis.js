System.register(['./hangout'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var hangout_1;
    var fs, Analysis;
    return {
        setters:[
            function (hangout_1_1) {
                hangout_1 = hangout_1_1;
            }],
        execute: function() {
            fs = require('fs');
            Analysis = (function () {
                function Analysis(file) {
                    this.depth = "basic";
                    this.doneListeners = [];
                    this.errorListeners = [];
                    this.file = file;
                }
                Analysis.prototype.catch = function (callback) {
                    this.errorListeners.push(callback);
                    return this;
                };
                Analysis.prototype.config = function (config) {
                    this.depth = config.depth;
                    return this;
                };
                Analysis.prototype.done = function (callback) {
                    this.doneListeners.push(callback);
                    return this;
                };
                Analysis.prototype.start = function () {
                    var _this = this;
                    var promise = new Promise(function (resolve, reject) {
                        fs.readFile(_this.file, 'utf-8', function (err, res) {
                            if (err) {
                                reject(Error(err));
                            }
                            else {
                                resolve(res);
                            }
                        });
                    }).then(function (res) {
                        var output = {
                            "hangouts": [],
                            "global": {
                                "posts": 0,
                                "participants": {}
                            }
                        };
                        res = JSON.parse(res);
                        for (var _i = 0, _a = res.conversation_state; _i < _a.length; _i++) {
                            var hangout = _a[_i];
                            var analysis = new hangout_1.Hangout(hangout);
                            output.hangouts.push(analysis);
                        }
                        for (var _b = 0, _c = output.hangouts; _b < _c.length; _b++) {
                            var hangout = _c[_b];
                            for (var _d = 0, _e = hangout.participant_list; _d < _e.length; _d++) {
                                var participant = _e[_d];
                                if (!output.global.participants[participant.id]) {
                                    output.global.participants[participant.id] = {
                                        name: participant.name,
                                        id: participant.id,
                                        posts: 0
                                    };
                                }
                                output.global.participants[participant.id].posts += participant.posts;
                                if (output.global.participants[participant.id].name === "Unknown User" && participant.name !== "Unknown User") {
                                    output.global.participants[participant.id].name = participant.name;
                                }
                            }
                        }
                        for (var _f = 0, _g = output.hangouts; _f < _g.length; _f++) {
                            var hangout = _g[_f];
                            for (var _h = 0, _j = hangout.participant_list; _h < _j.length; _h++) {
                                var participant = _j[_h];
                                participant.name = output.global.participants[participant.id].name;
                                hangout.participants[participant.id].name = participant.name;
                            }
                        }
                        for (var _k = 0, _l = _this.doneListeners; _k < _l.length; _k++) {
                            var callback = _l[_k];
                            callback(output);
                        }
                    }, function (err) {
                        for (var _i = 0, _a = _this.errorListeners; _i < _a.length; _i++) {
                            var listener = _a[_i];
                            listener(err);
                        }
                    });
                    return this;
                };
                return Analysis;
            }());
            exports_1("Analysis", Analysis);
        }
    }
});
