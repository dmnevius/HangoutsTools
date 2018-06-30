import Component from 'vue-class-component';
import Vue from 'vue';
import read from 'read-big-file';
import bus from '../../bus';

@Component({})

export default class HomePage extends Vue {
  /**
   * Path to the takeout file
   */
  takeoutPath: string = '';

  /**
   * If the file is loading
   */
  loading: boolean = false;

  /**
   * Start the analysis
   */
  async start() {
    this.loading = true;
    try {
      const takeout = await read(this.takeoutPath, true);
      this.loading = false;
      console.log(takeout);
    } catch (e) {
      bus.$emit('error', `Could not open file: ${e}`);
    }
  }

  /**
   * Update takeout path
   */
  updatePath(paths: FileList) {
    this.takeoutPath = (<any>paths[0]).path;
  }
}
