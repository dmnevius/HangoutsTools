import Hangout from './hangout';

function hasName(name) {
  return typeof name !== 'undefined' && name !== '' && name !== 'Unknown Person';
}

export default class Analysis {
  constructor(data) {
    this.hangouts = {};
    this.participants = {};
    this.me = data.conversation_state[0]
      .conversation_state.conversation
      .self_conversation_state
      .self_read_state
      .participant_id
      .gaia_id;
    data.conversation_state.forEach((hangout) => {
      this.addHangout(new Hangout(hangout));
      hangout.conversation_state.conversation.participant_data.forEach((participant) => {
        this.addParticipant(participant);
      });
    });
  }
  addHangout(hangout) {
    this.hangouts[hangout.id] = hangout;
  }
  hasParticipant(id) {
    return !(typeof this.participants[id] === 'undefined');
  }
  addParticipant(participant) {
    const id = participant.id.gaia_id;
    if (
      this.hasParticipant(id)
      && !hasName(this.participants[id])
      && hasName(participant.fallback_name)
    ) {
      this.participants[id] = participant.fallback_name;
    } else {
      this.participants[id] = participant.fallback_name || 'Unknown Person';
    }
  }
}
