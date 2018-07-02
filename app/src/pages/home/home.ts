import Component from 'vue-class-component';
import Vue from 'vue';
import read from 'read-big-file';
import Channel from '../../classes/channel';
import Takeout from '../../classes/takeout';
import User from '../../classes/user';
import bus from '../../bus';
import colorList from '../../util/colorList';
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
      const myID = takeout.conversation_state[0].conversation_state.conversation.self_conversation_state.self_read_state.participant_id.gaia_id;
      let nextColor = 0;
      takeout.conversation_state.forEach((conversation) => {
        const id = conversation.conversation_id.id;
        const channel = new Channel(id, conversation.conversation_state.conversation.name);
        conversation.conversation_state.conversation.participant_data.forEach((participant) => {
          // Users must be separate instances
          channel.addUser(new User(participant.id.gaia_id, participant.fallback_name, colorList[nextColor]));
          project.addUser(new User(participant.id.gaia_id, participant.fallback_name, colorList[nextColor]));
          nextColor += 1;
          if (nextColor >= colorList.length) {
            nextColor = 0;
          }
        });
        conversation.conversation_state.event.forEach((event) => {
          switch (event.event_type) {
            case 'REGULAR_CHAT_MESSAGE':
              const date = new Date(Number(event.timestamp) / 1000);
              // Senders need to be separate instances
              channel.addMessage(new User(event.sender_id.gaia_id, null, colorList[nextColor]), date);
              project.addMessage({
                sender: new User(event.sender_id.gaia_id, null, colorList[nextColor]),
                timestamp: date,
              });
              nextColor += 1;
              if (nextColor >= colorList.length) {
                nextColor = 0;
              }
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
      project.setMyID(myID);
      project.fillData();
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
