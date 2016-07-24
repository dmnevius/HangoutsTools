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
          "participants": {},
          "timeline": {}
        }
      };
      res = JSON.parse(res);
      for (let hangout of res.conversation_state) {
        let analysis = new Hangout(hangout);
        output.hangouts.push(analysis);
      }
      for (let hangout of output.hangouts) {
        output.global.posts += hangout.posts;
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
        for (let year in hangout.timeline) {
          if (!output.global.timeline[year]) {
            output.global.timeline[year] = {};
          }
          for (let month in hangout.timeline[year]) {
            if (!output.global.timeline[year][month]) {
              output.global.timeline[year][month] = {};
            }
            for (let day in hangout.timeline[year][month]) {
              if (!output.global.timeline[year][month][day]) {
                output.global.timeline[year][month][day] = 0;
              }
              output.global.timeline[year][month][day] += hangout.timeline[year][month][day];
            }
          }
        }
      }
      for (let hangout of output.hangouts) {
        output.global.posts += hangout.posts;
        for (let participant of hangout.participant_list) {
          participant.name = output.global.participants[participant.id].name;
          hangout.participants[participant.id].name = participant.name;
        }
      }
      for (let hangout of output.hangouts) {
        if (hangout.participant_list.length === 2) {
          let other = hangout.participant_list[0];
          if (other.id === hangout.me) {
            other = hangout.participant_list[1];
          }
          hangout.name = `Hangout with ${hangout.participants[other.id].name}`;
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
