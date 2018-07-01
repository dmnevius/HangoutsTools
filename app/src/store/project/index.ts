import { getStoreBuilder } from 'vuex-typex';
import Channel from '../../classes/channel';
import ProjectState from './state';
import RootState from '../state';
import Timeline from '../../classes/timeline';
import User from '../../classes/user';

const initialState: ProjectState = {
  channels: {},
  users: {},
  messages: 0,
  timeline: new Timeline(),
};

const store = getStoreBuilder<RootState>().module('project', initialState);

function addChannel(state: ProjectState, channel: Channel) {
  state.channels[channel.id] = channel;
}

function addUser(state: ProjectState, user: User) {
  if (state.users[user.id] && (typeof state.users[user.id].name !== 'string') && (typeof user.name === 'string')) {
    state.users[user.id].name = user.name;
  } else if (!state.users[user.id]) {
    state.users[user.id] = user;
  }
}

function addMessage(state: ProjectState, payload: {
  sender: User,
  timestamp: Date,
}) {
  addUser(state, payload.sender);
  state.messages += 1;
  state.users[payload.sender.id].messages += 1;
  state.timeline.increment(payload.timestamp.getFullYear(), payload.timestamp.getMonth(), payload.timestamp.getDate());
}

export default {
  get state() {
    return store.state()();
  },
  addChannel: store.commit(addChannel),
  addUser: store.commit(addUser),
  addMessage: store.commit(addMessage),
}
