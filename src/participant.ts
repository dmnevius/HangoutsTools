interface ParticipantData {
  fallback_name: string;
}

export class Participant {
  name: string;
  posts: number;
  constructor(participant: ParticipantData) {
    this.name = participant.fallback_name;
    this.posts = 0;
  }
}
