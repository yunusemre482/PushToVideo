import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'; 

import {ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM} from './types';
import {mediaDevices} from 'react-native-webrtc';

export const API_URI = `http://192.168.2.4:5000`;

export const joinRoom = () => async dispatch => {};

const peerServer = new Peer(undefined, {
  secure: false,
  config: {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
  },
});

function connectToNewUser() {}
