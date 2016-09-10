import keyMirror from 'key-mirror';
import electron from 'electron';
import fs from 'fs';

const { dialog } = electron.remote;

export default {
  Actions: keyMirror({
    NAVIGATE: null,
  }),
  Sections: [
    'New Project',
    'Open Project',
  ],
  Submenu: [
    'Overview',
    'People',
    'Hangouts',
  ],
  Colors: [
    '#e53935',
    '#d81b60',
    '#8e24aa',
    '#5e35b1',
    '#3949ab',
    '#1e88e5',
    '#039be5',
    '#00acc1',
    '#00897b',
    '#43a047',
    '#7cb342',
    '#c0ca33',
    '#fdd835',
    '#ffb300',
    '#fb8c00',
    '#f4511e',
    '#6d4c41',
    '#757575',
    '#546e7a',
  ],
  fs,
  dialog,
};
