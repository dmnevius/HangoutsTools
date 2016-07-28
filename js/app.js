const version = 3;
const {dialog} = require('electron').remote;
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
    'button-open.tap': 'openProject'
  },
  newProject() {
    this.page = 1;
  },
  openProject() {
    this.$['page-view'].openDialog();
  }
});
