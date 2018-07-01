import { getStoreBuilder } from 'vuex-typex';
import Channel from '../../classes/channel';
import ProjectState from './state';
import RootState from '../state';
import User from '../../classes/user';

const initialState: ProjectState = {
  channels: {},
  users: {},
  messages: 0,
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

function addMessage(state: ProjectState, sender: User) {
  addUser(state, sender);
  state.messages += 1;
  state.users[sender.id].messages += 1;
}

export default {
  get state() {
    return store.state()();
  },
  addChannel: store.commit(addChannel),
  addUser: store.commit(addUser),
  addMessage: store.commit(addMessage),
}
