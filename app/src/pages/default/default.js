import analyze from '../../util/analyze';
import readFile from '../../util/readFile';

export default {
  data() {
    return {
      targetFile: '',
      loading: false,
    };
  },
  methods: {
    onFileUpload(event) {
      this.targetFile = event[0].path;
    },
    open() {
      this.loading = true;
      readFile(this.targetFile).then((data) => {
        analyze(data).then((analysis) => {
          this.$store.commit('setAnalysis', analysis);
          this.$router.push('view');
        }).catch(() => {
          // @TODO: Handle error
        });
      }).catch(() => {
        // @TODO: Handle error
      });
    },
  },
};
