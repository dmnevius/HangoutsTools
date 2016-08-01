Polymer({
  is: "hangouts-settings",
  properties: {
    settings: {
      type: Object,
      value: {
        "developerMode": false,
        "checkForUpdates": true,
        "os": 0
      }
    }
  },
  listeners: {
    'button-save.tap': 'save'
  },
  save() {
    let fs = require('fs');
    fs.writeFile("HangoutsTools.json", JSON.stringify(this.settings), (err, data) => {
      if (err) {
        app.error = `Could not save settings: ${err}`;
        app.$.error.open();
      } else {
        this.$['toast-saved'].open();
        let {ipcRenderer} = require('electron');
        ipcRenderer.send(`toggle-dev-mode-${this.settings.developerMode}`);
      }
    });
    window.settings = this.settings;
  },
  ready() {
    let {ipcRenderer} = require('electron');
    let fs = require('fs');
    fs.readFile('HangoutsTools.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(`Could not read HangoutsTools.json: ${err}`);
        console.log("Creating a new one.");
        fs.writeFile("HangoutsTools.json", JSON.stringify(def), (err, data) => {
          if (err) {
            app.error = "Could not read or create a config file.";
            app.$.error.open();
          }
        });
      } else {
        this.settings = JSON.parse(data);
        window.settings = this.settings;
        ipcRenderer.send(`toggle-dev-mode-${this.settings.developerMode}`);
      }
    });
  }
});
