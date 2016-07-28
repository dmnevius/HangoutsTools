Polymer({
  is: "hangouts-detail",
  listeners: {
    'back.tap': 'back'
  },
  back() {
    app.page = 2;
  },
  graph() {
    this.$.graph.innerHTML = "";
    this.$.timeline.innerHTML = "";
    let graph = document.createElement("canvas");
    this.$.graph.appendChild(graph);
    let graphCtx = graph.getContext("2d");
    graphCtx.canvas.style.margin = "auto";
    let pie = new Chart(graphCtx, {
      type: 'doughnut',
      data: new HangoutsTools.Data(this.details.participant_list).formatPieChart()
    });
    let timeline = document.createElement("canvas");
    this.$.timeline.appendChild(timeline);
    let timelineCtx = timeline.getContext("2d");
    timelineCtx.canvas.style.margin = "auto";
    let line = new Chart(timelineCtx, {
      type: 'line',
      data: new HangoutsTools.Data(this.details.timeline).formatTimeline()
    });
  }
});
