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

function addUser(state: ProjectState, payload: {
  channel: Channel;
  user: User;
}) {
  state.channels[payload.channel.id].users[payload.user.id] = payload.user;
  state.users[payload.user.id] = payload.user;
}

function addMessage(state: ProjectState, payload: {
  channel: Channel;
  user: User;
}) {
  state.messages += 1;
  state.channels[payload.channel.id].messages += 1;
  state.channels[payload.channel.id].users[payload.user.id].messages += 1;
  state.users[payload.user.id].messages += 1;
}

export default {
  get state() {
    return store.state()();
  },
  addChannel: store.commit(addChannel),
  addUser: store.commit(addUser),
  addMessage: store.commit(addMessage),
}
