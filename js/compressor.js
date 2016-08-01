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
    let fs = require('fs');
    let size = fs.statSync(this.file).size;
    let stream = fs.createReadStream(this.file);
    let output = "";
    stream.setEncoding("utf-8");
    stream.on("data", (chunk) => {
      chunk = chunk.replace(/[\n\t\r]/g, "").replace(/\s*(\"[^\"]*\")\s?\:\s*/g, "$1:").replace(/(\S)\s*([\}\]])/g, "$1$2");
      output += chunk;
    });
    stream.on("end", () => {
      console.log("Compression done");
      console.log(`Total saved: ${output.length} bytes (${(output.length / size) * 100}%)`);
      fs.writeFile(this.output, output, (err) => {
        this.$.working.close();
        if (err) {
          app.error = err;
          app.$.error.open();
        } else {
          this.amount = Math.round((output.length / size) * 100);
          this.original = Math.round(size / 1000000);
          this.new = Math.round(output.length / 1000000);
          this.$.done.open();
        }
      });
    });
  },
  ok() {
    app.page = 0;
  }
});
