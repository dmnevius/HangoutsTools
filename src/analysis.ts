import {Hangout} from './hangout';

const fs = require('fs');

interface Config {
  depth?: string
}

export class Analysis {
  depth: string;
  doneListeners: Array<Function>;
  errorListeners: Array<Function>;
  file: string;
  constructor(file = "") {
    this.depth = "basic";
    this.doneListeners = [];
    this.errorListeners = [];
    this.file = file;
  }
  analyze(data: any) {
    let output = {
      "hangouts": [],
      "global": {
        "posts": 0,
        "participants": {},
        "timeline": {}
      }
    };
    for (let hangout of data.conversation_state) {
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
    return output;
  }
  catch(callback: Function) {
    this.errorListeners.push(callback);
    return this;
  }
  config(config: Config) {
    if (config.depth) {
      config.depth = config.depth.toLowerCase();
      if (["basic", "advanced", "extreme"].indexOf(config.depth) > -1) {
        this.depth = config.depth;
      }
    }
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
    }).catch((err) => {
      this.throw(`Error reading takeout file: ${err}`);
    }).then((res: any) => {
      try {
        this.analyze(JSON.parse(res));
      } catch (e) {
        this.throw(`Error analyzing takeout file: ${e}`);
      }
    }, (err) => {
      this.throw(`Error eading takeout file: ${err}`);
    });
    return this;
  }
  throw(message: string) {
    for (let listener of this.errorListeners) {
      listener(message);
    }
    return this;
  }
}
