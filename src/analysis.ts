import {Hangout} from './hangout';

const fs = require('fs');

interface Config {
  depth: string
}

export class Analysis {
  depth: string;
  doneListeners: Array<Function>;
  errorListeners: Array<Function>;
  file: string;
  constructor(file: string) {
    this.depth = "basic";
    this.doneListeners = [];
    this.errorListeners = [];
    this.file = file;
  }
  catch(callback: Function) {
    this.errorListeners.push(callback);
    return this;
  }
  config(config: Config) {
    this.depth = config.depth;
    return this;
  }
  done(callback: Function) {
    this.doneListeners.push(callback);
    return this;
  }
  start() {
    let promise = new Promise((resolve, reject) => {
      fs.readFile(this.file, 'utf-8', (err, res) => {
        if (err) {
          reject(Error(err));
        } else {
          resolve(res);
        }
      });
    }).then((res: any) => {
      let output = {
        "hangouts": [],
        "global": {
          "posts": 0,
          "participants": {}
        }
      };
      res = JSON.parse(res);
      for (let hangout of res.conversation_state) {
        let analysis = new Hangout(hangout);
        output.hangouts.push(analysis);
      }
      for (let hangout of output.hangouts) {
        for (let participant of hangout.participant_list) {
          if (!output.global.participants[participant.id]) {
            output.global.participants[participant.id] = {
              name: participant.name,
              id: participant.id,
              posts: 0
            }
          }
          output.global.participants[participant.id].posts += participant.posts;
          if (output.global.participants[participant.id].name === "Unknown User" && participant.name !== "Unknown User") {
            output.global.participants[participant.id].name = participant.name;
          }
        }
      }
      for (let hangout of output.hangouts) {
        for (let participant of hangout.participant_list) {
          participant.name = output.global.participants[participant.id].name;
          hangout.participants[participant.id].name = participant.name;
        }
      }
      for (let callback of this.doneListeners) {
        callback(output);
      }
    }, (err) => {
      for (let listener of this.errorListeners) {
        listener(err);
      }
    });
    return this;
  }
}
