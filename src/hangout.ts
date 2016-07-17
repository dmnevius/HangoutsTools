import {Participant} from './participant';

export class Hangout {
  name: string;
  participant_list: Array<Participant>;
  participants: Object;
  posts: number;
  timeline: Object;
  constructor(hangout: any) {
    this.name = hangout.conversation_state.conversation.name || "Untitled Hangout";
    this.participant_list = [];
    this.participants = {};
    this.posts = 0;
    this.timeline = {};
    for (let participant of hangout.conversation_state.conversation.participant_data) {
      this.participants[participant.id.gaia_id] = new Participant(participant);
    }
    for (let event of hangout.conversation_state.event) {
      if (event.event_type === "REGULAR_CHAT_MESSAGE") {
        let id = event.sender_id.gaia_id;
        let date = new Date(0);
        date.setUTCSeconds(event.timestamp / 1000000);
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if (!this.timeline[year]) {
          this.timeline[year] = {};
        }
        if (!this.timeline[year][month]) {
          this.timeline[year][month] = {};
        }
        if (!this.timeline[year][month][day]) {
          this.timeline[year][month][day] = 0;
        }
        this.timeline[year][month][day] += 1;
        if (!this.participants[id]) {
          this.participants[id] = new Participant({
            fallback_name: 'Unknown User'
          });
        }
        this.participants[id].posts += 1;
        this.posts += 1;
      }
    }
    for (let participant in this.participants) {
      this.participant_list.push(this.participants[participant]);
    }
  }
}
