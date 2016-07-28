Polymer({
  is: "hangouts-project",
  properties: {
    name: {
      type: String,
      value: "New Project"
    },
    file: {
      type: String,
      value: ""
    },
    depth: {
      type: String,
      value: "basic"
    }
  },
  listeners: {
    'button-browse.tap': 'openFile',
    'button-go.tap': 'createProject'
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
      }
    });
  },
  createProject() {
    this.$['dialog-running'].open();
    let analysis = new HangoutsTools.Analysis(this.file).config({
      depth: this.depth
    }).catch((err) => {
      console.log(`Analysis threw an error: ${err}`);
    }).done((output) => {
      let view = document.getElementsByTagName("hangouts-view")[0];
      view.data = output;
      view.name = this.name;
      view.graph();
      console.log(output);
      this.$['dialog-running'].close();
      app.page = 2;
    });
    analysis.start();
  }
});Polymer({
  is: "hangouts-project",
  properties: {
    name: {
      type: String,
      value: "New Project"
    },
    file: {
      type: String,
      value: ""
    },
    depth: {
      type: String,
      value: "basic"
    }
  },
  listeners: {
    'button-browse.tap': 'openFile',
    'button-go.tap': 'createProject'
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
      }
    });
  },
  createProject() {
    this.$['dialog-running'].open();
    let analysis = new HangoutsTools.Analysis(this.file).config({
      depth: this.depth
    }).catch((err) => {
      console.log(`Analysis threw an error: ${err}`);
    }).done((output) => {
      let view = document.getElementsByTagName("hangouts-view")[0];
      view.data = output;
      view.name = this.name;
      view.graph();
      console.log(output);
      this.$['dialog-running'].close();
      app.page = 2;
    });
    analysis.start();
  }
});
