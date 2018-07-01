import Component from 'vue-class-component';
import Vue from 'vue';
import AnalysisComponent from '../../../components/analysis/analysis.vue';
import Channel from '../../../classes/channel';
import project from '../../../store/project';

@Component({
  components: {
    analysis: AnalysisComponent,
  }
})

export default class ChannelPage extends Vue {
  /**
   * Used to prevent the page from rendering if there's no data to render
   */
  get hasChannel() {
    return typeof this.channel !== 'undefined';
  }

  /**
   * Channel currently being viewed
   */
  channel: Channel;

  created() {
    this.channel = project.state.channels[this.$route.params.id];
  }

  /**
   * Go back to the main analysis
   */
  back() {
    this.$router.push('/view');
  }
}
