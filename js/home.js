Polymer({
  is: "hangouts-home",
  listeners: {
    'button-new.tap': 'newProject',
    'button-open.tap': 'openProject'
  },
  newProject() {
    app.page = 1;
  },
  openProject() {
    document.getElementsByTagName("hangouts-view")[0].openDialog();
  }
});
