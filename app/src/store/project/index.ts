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
  myID: '',
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
  state.users[payload.sender.id].timeline.increment(payload.timestamp.getFullYear(), payload.timestamp.getMonth(), payload.timestamp.getDate());
  state.timeline.increment(payload.timestamp.getFullYear(), payload.timestamp.getMonth(), payload.timestamp.getDate());
}

function setMyID(state: ProjectState, id: string) {
  state.myID = id;
}

/**
 * Fills in missing names and other info
 */
function fillData(state: ProjectState) {
  for (const key in state.users) {
    const user = state.users[key];
    if (typeof user.name !== 'string') {
      user.name = 'Unknown Person';
    }
  }
  for (const key in state.channels) {
    const channel = state.channels[key];
    for (const key2 in channel.users) {
      channel.users[key2].name = state.users[key2].name;
      channel.users[key2].color = state.users[key2].color;
    }
    if (typeof channel.name !== 'string') {
      if (channel.userCount === 2) {
        const users = Object.keys(channel.users);
        let otherUser: User;
        if (users[0] === state.myID) {
          otherUser = channel.users[users[1]];
        } else {
          otherUser = channel.users[users[0]];
        }
        channel.name = `Hangout With ${otherUser.name}`;
      } else {
        channel.name = 'Unnamed Hangout';
      }
    }
  }
}

export default {
  get state() {
    return store.state()();
  },
  addChannel: store.commit(addChannel),
  addUser: store.commit(addUser),
  addMessage: store.commit(addMessage),
  setMyID: store.commit(setMyID),
  fillData: store.commit(fillData),
}
