interface ParticipantData {
  fallback_name: string;
  id: {
    gaia_id: string;
  }
}

export class Participant {
  name: string;
  posts: number;
  id: string;
  constructor(participant: ParticipantData) {
    this.name = participant.fallback_name || "Unknown User";
    this.posts = 0;
    this.id = participant.id.gaia_id;
  }
}
