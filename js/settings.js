Polymer({
  is: "hangouts-settings",
  properties: {
    developerMode: {
      notify: true,
      observer: 'toggleDevMode',
      type: Boolean,
      value: false
    }
  },
  listeners: {
    'button-save.tap': 'save'
  },
  save() {
    let fs = require('fs');
    fs.writeFile("HangoutsTools.json", JSON.stringify({
      "developerMode": this.developerMode
    }), (err, data) => {
      if (err) {
        app.error = `Could not save settings: ${err}`;
        app.$.error.open();
      } else {
        this.$['toast-saved'].open();
      }
    });
  },
  toggleDevMode() {
    let {ipcRenderer} = require('electron');
    ipcRenderer.send(`toggle-dev-mode-${this.developerMode}`);
  },
  ready() {
    let fs = require('fs');
    let def = {
      "developerMode": false
    };
    fs.readFile('HangoutsTools.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(`Could not read HangoutsTools.json: ${err}`);
        console.log("Creating a new one.");
        fs.writeFile("HangoutsTools.json", JSON.stringify(def), (err, data) => {
          if (err) {
            app.error = "Could not read or create a config file.";
            app.$.error.open();
          } else {
            this.developerMode = def.developerMode;
          }
        });
      } else {
        let res = JSON.parse(data);
        this.developerMode = res.developerMode;
      }
    });
  }
});