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
                    console.log("--- Comparing template and types...");
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
                    console.log("--- Comparing project...");
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
                    var types = this.types({}, this.obj, 0);
                    return this.compare(template, types);
                };
                Compatable.prototype.takeout = function () {
                    console.log("--- Comparing takeout...");
                    var template = {
                        "conversation_state": {
                            "0": {
                                "conversation_id": {
                                    "id": "string"
                                },
                                "conversation_state": {
                                    "conversation": {
                                        "participant_data": {
                                            "0": {
                                                "fallback_name": "string",
                                                "id": {
                                                    "gaia_id": "string"
                                                }
                                            }
                                        },
                                        "self_cconversation_state": {
                                            "self_read_state": {
                                                "participant_id": {
                                                    "gaia_id": "string"
                                                }
                                            }
                                        }
                                    }
                                },
                                "event": {
                                    "0": {
                                        "chat_message": {
                                            "message_content": {
                                                "segment": {
                                                    "0": {
                                                        "text": "string",
                                                        "type": "string"
                                                    }
                                                }
                                            }
                                        },
                                        "event_type": "string",
                                        "sender_id": {
                                            "gaia_id": "string"
                                        },
                                        "timestamp": "string"
                                    }
                                }
                            }
                        }
                    };
                    var types = this.types({}, this.obj, 0);
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
                    return true;
                };
                return Compatable;
            }());
            exports_1("Compatable", Compatable);
        }
    }
});
