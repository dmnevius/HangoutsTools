export default {
  computed: {
    hangouts() {
      const hangouts = [];
      const ids = Object.getOwnPropertyNames(this.$store.state.analysis.hangouts);
      for (let i = 0; i < ids.length; i += 1) {
        hangouts.push(this.$store.state.analysis.hangouts[ids[i]]);
      }
      return hangouts;
    },
    participants() {
      const participants = [];
      const ids = Object.getOwnPropertyNames(this.$store.state.analysis.participants);
      for (let i = 0; i < ids.length; i += 1) {
        participants.push(this.$store.state.analysis.participants[ids[i]]);
      }
      return participants;
    },
  },
};
