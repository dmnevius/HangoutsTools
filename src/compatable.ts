export class Compatable {
  obj: any;
  constructor(obj: any) {
    this.obj = obj;
  }
  compare(template: any, types: any) {
    console.log("--- Comparing template and types...");
    for (let key in template) {
      if (typeof template[key] === "object") {
        if (types[key]) {
          return this.compare(template[key], types[key]);
        } else {
          return false;
        }
      } else {
        if (!types[key] || types[key] !== template[key]) {
          return false;
        }
      }
    }
    return true;
  }
  project(version: number) {
    console.log(`--- Comparing project...`);
    let template = {
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
    }
    let types = this.types({}, this.obj, 0);
    return this.compare(template, types);
  }
  takeout() {
    console.log(`--- Comparing takeout...`);
    let template = {
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
    let types = this.types({}, this.obj, 0);
    return this.compare(template, types);
  }
  types(parent: any, object: any, depth: number) {
    for (let key in object) {
      if (typeof object[key] === "object") {
        parent[key] = this.types({}, object[key], depth + 1);
      } else {
        parent[key] = typeof object[key];
      }
      if (depth > 1) {
        parent["0"] = parent[key];
      }
    }
    return parent;
  }
  with(target: string, version?: number) {
    return true;
    /*console.log(`--- Checking compatability with ${target}`);
    if (target === "project" && typeof version === "number") {
      return this.project(version);
    } else if (target === "takeout") {
      return this.takeout();
    }
    throw "Argument \"target\" for Compatable.with must be equal to \"project\" or \"takeout\"!";
    */
  }
}
