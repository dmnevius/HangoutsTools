Polymer({
  is: "hangouts-compressor",
  properties: {
    os: {
      type: Number,
      value: 0
    }
  },
  listeners: {
    'button-browse.tap': 'openFile',
    'button-browse-2.tap': 'openOutputFile',
    'button-go.tap': 'compress',
    'button-ok.tap': 'ok'
  },
  openFile() {
    dialog.showOpenDialog({
      title: 'Open a Google Takeout',
      filters: [
        {
          name: "JSON",
          extensions: ['json']
        }
      ]
    }, (res) => {
      if (res) {
        this.file = res[0];
        if (!this.output) {
          this.output = res[0];
        }
      }
    });
  },
  openOutputFile() {
    dialog.showSaveDialog({
      title: 'Save Compressed Takeout',
      filters: [
        {
          name: "JSON",
          extensions: ['json']
        }
      ],
      defaultPath: this.file
    }, (res) => {
      if (res) {
        this.output = res;
      }
    });
  },
  compress() {
    this.$.working.open();
    let shell = require('shelljs');
    let fs = require('fs');
    let file;
    this.original = Math.round(fs.statSync(this.file).size / 1000000, 2);
    if (window.settings.os === 0) {
      file = "linux";
    }
    shell.exec(`scripts/trim/${file} ${this.file} ${this.output}`, (code, out, err) => {
      this.$.working.close();
      if (err) {
        app.error = `Could not compress file: ${err}`;
        app.$.error.open();
      } else {
        this.new = Math.round(fs.statSync(this.output).size / 1000000, 2);
        this.$.done.open();
      }
    });
  },
  ok() {
    app.page = 0;
  }
});
