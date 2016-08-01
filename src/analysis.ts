import {Compatable} from './compatable';
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
    console.log("Checking compatability...");
    if (new Compatable(data).with("takeout")) {
      let output = {
        "hangouts": [],
        "global": {
          "posts": 0,
          "participants": {},
          "timeline": {}
        }
      };
      console.log("Analyzing hangouts...");
      for (let hangout of data.conversation_state) {
        let analysis = new Hangout(hangout);
        output.hangouts.push(analysis);
      }
      console.log("Assembling global data...");
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
      console.log("Finalzing participant data...");
      for (let hangout of output.hangouts) {
        output.global.posts += hangout.posts;
        for (let participant of hangout.participant_list) {
          participant.name = output.global.participants[participant.id].name;
          hangout.participants[participant.id].name = participant.name;
        }
      }
      console.log("Finalzing hangouts...");
      for (let hangout of output.hangouts) {
        if (hangout.participant_list.length === 2) {
          let other = hangout.participant_list[0];
          if (other.id === hangout.me) {
            other = hangout.participant_list[1];
          }
          hangout.name = `Hangout with ${hangout.participants[other.id].name}`;
        }
      }
      console.log("Calling back...");
      for (let callback of this.doneListeners) {
        callback(output);
      }
      return output;
    } else {
      console.error("Throwing error...");
      this.throw("Invalid takeout file");
    }
  }
  catch(callback: Function) {
    console.log("Registered new error listener");
    this.errorListeners.push(callback);
    return this;
  }
  config(config: Config) {
    console.log("Got config file");
    if (config.depth) {
      console.log(`New config depth: ${config.depth}`);
      config.depth = config.depth.toLowerCase();
      if (["basic", "advanced", "extreme"].indexOf(config.depth) > -1) {
        this.depth = config.depth;
      }
    }
    return this;
  }
  done(callback: Function) {
    console.log("Registered new done listener");
    this.doneListeners.push(callback);
    return this;
  }
  start() {
    let request = require('request');
    let promise = new Promise((resolve, reject) => {
      console.log("Getting file size...");
      let size = fs.statSync(this.file)['size'] / 1000000;

      // Node.js issue with files larger than 268 MB
      if  (size >= 268) {
        console.log("File size >= 268 MB");
        reject(Error(`${this.file} is too large! Please use the compressor tool to reduce it's size.`));
      } else {
        console.log("Reading file...");
        fs.readFile(this.file, 'utf-8', (err, res) => {
          if (err) {
            reject(Error(err));
          } else {
            resolve(res);
          }
        });
      }
    }).catch((err) => {
      console.error(`Error reading file: ${err}`);
      this.throw(`Error reading takeout file: ${err}`);
    }).then((res: any) => {
      try {
        console.log("Parsing JSON...");
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
    console.error(`Error: ${message}`);
    for (let listener of this.errorListeners) {
      listener(message);
    }
    return this;
  }
}
