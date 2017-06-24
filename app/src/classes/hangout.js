export default class Hangout {
  constructor(data) {
    const conversation = data.conversation_state.conversation;
    this.id = conversation.id.id;
    this.name = conversation.name;
    this.participants = [];
    conversation.participant_data.forEach((participant) => {
      this.addParticipant(participant);
    });
  }
  addParticipant(participant) {
    this.participants.push(participant.id.gaia_id);
  }
}
