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
                    if (file === void 0) { file = ""; }
                    this.depth = "basic";
                    this.doneListeners = [];
                    this.errorListeners = [];
                    this.file = file;
                }
                Analysis.prototype.analyze = function (data) {
                    var output = {
                        "hangouts": [],
                        "global": {
                            "posts": 0,
                            "participants": {},
                            "timeline": {}
                        }
                    };
                    for (var _i = 0, _a = data.conversation_state; _i < _a.length; _i++) {
                        var hangout = _a[_i];
                        var analysis = new hangout_1.Hangout(hangout);
                        output.hangouts.push(analysis);
                    }
                    for (var _b = 0, _c = output.hangouts; _b < _c.length; _b++) {
                        var hangout = _c[_b];
                        output.global.posts += hangout.posts;
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
                        for (var year in hangout.timeline) {
                            if (!output.global.timeline[year]) {
                                output.global.timeline[year] = {};
                            }
                            for (var month in hangout.timeline[year]) {
                                if (!output.global.timeline[year][month]) {
                                    output.global.timeline[year][month] = {};
                                }
                                for (var day in hangout.timeline[year][month]) {
                                    if (!output.global.timeline[year][month][day]) {
                                        output.global.timeline[year][month][day] = 0;
                                    }
                                    output.global.timeline[year][month][day] += hangout.timeline[year][month][day];
                                }
                            }
                        }
                    }
                    for (var _f = 0, _g = output.hangouts; _f < _g.length; _f++) {
                        var hangout = _g[_f];
                        output.global.posts += hangout.posts;
                        for (var _h = 0, _j = hangout.participant_list; _h < _j.length; _h++) {
                            var participant = _j[_h];
                            participant.name = output.global.participants[participant.id].name;
                            hangout.participants[participant.id].name = participant.name;
                        }
                    }
                    for (var _k = 0, _l = output.hangouts; _k < _l.length; _k++) {
                        var hangout = _l[_k];
                        if (hangout.participant_list.length === 2) {
                            var other = hangout.participant_list[0];
                            if (other.id === hangout.me) {
                                other = hangout.participant_list[1];
                            }
                            hangout.name = "Hangout with " + hangout.participants[other.id].name;
                        }
                    }
                    for (var _m = 0, _o = this.doneListeners; _m < _o.length; _m++) {
                        var callback = _o[_m];
                        callback(output);
                    }
                    return output;
                };
                Analysis.prototype.catch = function (callback) {
                    this.errorListeners.push(callback);
                    return this;
                };
                Analysis.prototype.config = function (config) {
                    if (config.depth) {
                        config.depth = config.depth.toLowerCase();
                        if (["basic", "advanced", "extreme"].indexOf(config.depth) > -1) {
                            this.depth = config.depth;
                        }
                    }
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
                    }).catch(function (err) {
                        _this.throw("Error reading takeout file: " + err);
                    }).then(function (res) {
                        try {
                            _this.analyze(JSON.parse(res));
                        }
                        catch (e) {
                            _this.throw("Error analyzing takeout file: " + e);
                        }
                    }, function (err) {
                        _this.throw("Error eading takeout file: " + err);
                    });
                    return this;
                };
                Analysis.prototype.throw = function (message) {
                    for (var _i = 0, _a = this.errorListeners; _i < _a.length; _i++) {
                        var listener = _a[_i];
                        listener(message);
                    }
                    return this;
                };
                return Analysis;
            }());
            exports_1("Analysis", Analysis);
        }
    }
});
