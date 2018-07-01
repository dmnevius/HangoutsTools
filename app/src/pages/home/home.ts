import Component from 'vue-class-component';
import Vue from 'vue';
import read from 'read-big-file';
import Channel from '../../classes/channel';
import Takeout from '../../classes/takeout';
import User from '../../classes/user';
import bus from '../../bus';
import project from '../../store/project';

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
      const takeout = <Takeout>await read(this.takeoutPath, true);
      takeout.conversation_state.forEach((conversation) => {
        const id = conversation.conversation_id.id;
        const channel = new Channel(id, conversation.conversation_state.conversation.name);
        conversation.conversation_state.conversation.participant_data.forEach((participant) => {
          const user = new User(participant.id.gaia_id, participant.fallback_name);
          channel.addUser(user);
          project.addUser(user);
        });
        conversation.conversation_state.event.forEach((event) => {
          switch (event.event_type) {
            case 'REGULAR_CHAT_MESSAGE':
              const sender = new User(event.sender_id.gaia_id, null);
              channel.addMessage(sender);
              project.addMessage(sender);
              break;
            case 'ADD_USER':
              break;
            case 'REMOVE_USER':
              break;
            case 'RENAME_CONVERSATION':
              break;
            case 'HANGOUT_EVENT':
              break;
            default:
              console.error(`Unknown event type: ${event.event_type}`);
          }
        });
        project.addChannel(channel);
      });
      console.log(project.state);
      this.$router.push('/view');
    } catch (e) {
      console.error(e);
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
