export default {
  data() {
    return {
      targetFile: '',
    };
  },
  methods: {
    onFileUpload(event) {
      this.targetFile = event[0].path;
    },
  },
};
