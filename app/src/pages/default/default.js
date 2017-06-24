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
        analyze(data).then((analysis) => {
          console.log(analysis);
        }).catch((e) => {
          // @TODO: Handle error
        });
      }).catch(() => {
        // @TODO: Handle error
      });
    },
  },
};
