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
  to: string;
  user: User;
}) {
  console.log(state.channels[payload.to]);
  state.channels[payload.to].users[payload.user.id] = payload.user;
  state.users[payload.user.id] = payload.user;
}

export default {
  get state() {
    return store.state()();
  },
  addChannel: store.commit(addChannel),
  addUser: store.commit(addUser),
}
