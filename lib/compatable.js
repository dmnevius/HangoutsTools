System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Compatable;
    return {
        setters:[],
        execute: function() {
            Compatable = (function () {
                function Compatable(obj) {
                    this.obj = obj;
                }
                Compatable.prototype.compare = function (template, types) {
                    for (var key in template) {
                        if (typeof template[key] === "object") {
                            if (types[key]) {
                                return this.compare(template[key], types[key]);
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            if (!types[key] || types[key] !== template[key]) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                Compatable.prototype.project = function (version) {
                    var re = true;
                    var map = {};
                    var template = {
                        "global": {
                            "participants": {
                                "0": {
                                    "id": "string",
                                    "name": "string",
                                    "posts": "number"
                                }
                            },
                            "posts": "number",
                            "timeline": {
                                "0": {
                                    "0": {
                                        "0": "number"
                                    }
                                }
                            }
                        },
                        "hangouts": {
                            "0": {
                                "me": "string",
                                "name": "string",
                                "participant_list": {
                                    "0": {
                                        "id": "string",
                                        "name": "string",
                                        "posts": "number"
                                    }
                                },
                                "participants": {
                                    "0": {
                                        "id": "string",
                                        "name": "string",
                                        "posts": "number"
                                    }
                                },
                                "posts": "number",
                                "timeline": {
                                    "0": {
                                        "0": {
                                            "0": "number"
                                        }
                                    }
                                }
                            }
                        },
                        "name": "string",
                        "version": "number"
                    };
                    var types = this.types(map, this.obj, 0);
                    return this.compare(template, types);
                };
                Compatable.prototype.types = function (parent, object, depth) {
                    for (var key in object) {
                        if (typeof object[key] === "object") {
                            parent[key] = this.types({}, object[key], depth + 1);
                        }
                        else {
                            parent[key] = typeof object[key];
                        }
                        if (depth > 1) {
                            parent["0"] = parent[key];
                        }
                    }
                    return parent;
                };
                Compatable.prototype.with = function (target, version) {
                    if (target === "project" && typeof version === "number") {
                        return this.project(version);
                    }
                    throw "Argument \"target\" for Compatable.with must be equal to \"project\"!";
                };
                return Compatable;
            }());
            exports_1("Compatable", Compatable);
        }
    }
});
