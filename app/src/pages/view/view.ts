import Component from 'vue-class-component';
import Vue from 'vue';
import Analysis from '../../classes/analysis';
import AnalysisComponent from '../../components/analysis/analysis.vue';
import ChannelLike from '../../classes/channelLike';
import ProjectState from '../../store/project/state';
import Timeline from '../../classes/timeline';
import project from '../../store/project';

@Component({
  components: {
    analysis: AnalysisComponent,
  },
})

export default class ViewPage extends Vue {
  /**
   * Total number of messages
   */
  get messages() {
    return project.state.messages;
  }

  /**
   * General timeline
   */
  get timeline() {
    return project.state.timeline;
  }

  /**
   * Hangouts
   */
  get channels() {
    return project.state.channels;
  }

  /**
   * Data for analysis component
   */
  get analysisData(): ProjectState {
    return {
      users: project.state.users,
      messages: this.messages,
      timeline: this.timeline,
      channels: this.channels,
    };
  }

  /**
   * View a channel's details
   * @param {string} id The ID of the channel
   */
  open(id: string) {
    this.$router.push(`/view/channel/${id}`);
  }
}
