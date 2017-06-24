import analyze from '../../util/analyze';
import readFile from '../../util/readFile';

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
    open() {
      readFile(this.targetFile).then((data) => {
        analyze(data);
      }).catch(() => {
        // @TODO: Handle error
      });
    },
  },
};
