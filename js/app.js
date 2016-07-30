const {dialog} = require('electron').remote;
const version = 3;
const app = document.getElementsByTagName("hangouts-tools")[0];
Polymer({
  is: "hangouts-tools",
  properties: {
    page: {
      type: Number,
      value: 0
    },
    view: {
      type: String,
      value: ""
    }
  },
  listeners: {
    'button-add.tap': 'newProject',
    'button-open.tap': 'openProject',
    'button-settings.tap': 'settings',
    'button-update.tap': 'update',
    'button-home.tap': 'home'
  },
  home() {
    this.page = 0;
  },
  newProject() {
    this.page = 1;
  },
  openProject() {
    this.$['page-view'].openDialog();
  },
  ready() {
    let {ipcRenderer} = require('electron');
    let request = require('request');
    let fs = require('fs');
    fs.readFile("HangoutsTools.json", "utf-8", (err, res) => {
      if (err) {
        console.log(`Could not read HangoutsTools.json: ${err}`);
      } else {
        if (JSON.parse(res).checkForUpdates === true) {
          fs.readFile("package.json", "utf-8", (err, res) => {
            if (err) {
              console.log(`Could not read package.json: ${err}`);
            } else {
              res = JSON.parse(res);
              this.local = res.version;
              let local = res.version.split(".").map((x) => {
                return Number.parseInt(x);
              });
              request('http://dmnevius.net/hangouts-tools/version.txt', (err, res, body) => {
                if (err) {
                  console.log(`Could not get update information: ${err}`);
                } else {
                  this.version = body;
                  let version = body.split(".").map((x) => {
                    return Number.parseInt(x);
                  });
                  if (version[0] > local[0] || version[1] > local[1] || version[2] > local[2]) {
                    this.$.update.open();
                  }
                }
              });
            }
          });
        }
      }
    });
  },
  settings() {
    this.page = 4;
  },
  update() {
    let {shell} = require('electron');
    shell.openExternal("https://github.com/dmnevius/HangoutsTools/releases");
    this.$.update.close();
  }
});
