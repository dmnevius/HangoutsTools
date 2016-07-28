Polymer({
  is: "hangouts-view",
  listeners: {
    'button-save.tap': 'save'
  },
  goDetails(e) {
    let details = document.getElementsByTagName("hangouts-detail")[0]
    app.page = 3;
    details.details = e.model.item;
    details.graph();
  },
  openDialog() {
    const fs = require('fs');
    dialog.showOpenDialog({
      title: 'Open project',
      filters: [
        {
          name: "JSON",
          extensions: ['json']
        }
      ]
    }, (res) => {
      if (res) {
        fs.readFile(res[0], 'utf-8', (err, re) => {
          if (err) {
            // @TODO: Do something
            console.error(err);
          } else {
            re = JSON.parse(re);
            if (re.version !== version) {
              // @TODO: Notify the user
              console.error("Incompatable versions!");
            }
            this.data = re;
            this.name = re.name;
            app.page = 2;
            this.graph();
          }
        });
      }
    });
  },
  save() {
    const fs = require('fs');
    dialog.showSaveDialog({
      title: "Save project",
      defaultPath: `${this.name}.json`,
      filters: [
        {
          name: "JSON",
          extensions: ['json']
        }
      ]
    }, (res) => {
      if (res) {
        this.data.name = this.name
        this.data.version = version;
        fs.writeFile(res, JSON.stringify(this.data), (err) => {
          if (err) {
            // @TODO: Better error handler
            console.error(err);
          } else {
            this.$['toast-success'].open();
          }
        });
      }
    });
  },
  ready() {
    this.customStyle['--height'] = `${window.innerHeight - 64}px`;
    this.updateStyles();
    window.addEventListener("resize", () => {
      this.customStyle['--height'] = `${window.innerHeight - 64}px`;
      this.updateStyles();
    });
  },
  graph() {
    this.$.timeline.innerHTML = "";
    let timeline = document.createElement("canvas");
    this.$.timeline.appendChild(timeline);
    let timelineCtx = timeline.getContext("2d");
    timelineCtx.canvas.style.margin = "auto";
    timelineCtx.canvas.height = 400;
    timelineCtx.canvas.width = window.innerWidth * 0.8;
    let line = new Chart(timelineCtx, {
      type: 'line',
      data: new HangoutsTools.Data(this.data.hangouts).formatMultiTimeline(),
      options: {
        legend: {
          display: false
        },
        responsive: false
      }
    });
    setTimeout(() => {
      line.options.responsive = true;
      line.update();
    }, 10);
  }
});
