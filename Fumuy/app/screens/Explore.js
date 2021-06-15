import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  BackAndroid,
  ToastAndroid,
} from 'react-native';

import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';

import Socket from 'socket.io-client';

import Display from 'react-native-display';
const config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
};

const WSS_CLIENT_SERVER = 'https://192.168.2.2:3000/';

import ReceiveScreen from './ReceiveScreen';

import {
  startCommunication,
  receiveVideo,
  addIceCandidate,
  ProcessAnswer,
  ReleaseMeidaSource,
} from './utils/webrtc-utils';

import CircleList from 'react-native-circle-list';
import {CircleListItem} from './utils/CircleListItem';

const {width, height} = Dimensions.get('window');
const RADIUS = (1.5 * width) / 2;

export default function Explore({route}) {
  const [participants,setParticipants] = useState({});
  const peerConnections = useRef(new Map());
  const [stream, setStream] = useState(null);
  const [remoteURL, setRemoteURL] = useState(null);
  const [socket] = useState(
    Socket.connect(WSS_CLIENT_SERVER, {
      transports: ['websocket'],
    }),
  );

  useEffect(() => {
    socket.on('connect', () => {
      var message = {
        id: 'joinRoom',
        name: route.params.userName,
        roomName: route.params.roomName,
      };
      sendMessage(message);
    });

    socket.on('connect_error', err => {
      console.log(err);
    });

    socket.on('message', message => {
      messageProcessHandler(message);
    });

    return () => {
      if (socket.connected) socket.close(); // close the socket if the view is unmounted
    };
  }, [socket, stream]);

  useEffect(() => {
    if (!stream) {
      (async () => {
        const availableDevices = await mediaDevices.enumerateDevices();
        const {deviceId: sourceId} = availableDevices.find(
          // once we get the stream we can just call .switchCamera() on the track to switch without re-negotiating
          // ref: https://github.com/react-native-webrtc/react-native-webrtc#mediastreamtrackprototype_switchcamera
          device => device.kind === 'videoinput' && device.facing === 'front',
        );

        const streamBuffer = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              // Provide your own width, height and frame rate here
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: 'user',
            optional: [{sourceId}],
          },
        });

        setStream(streamBuffer);
      })();
    }
  }, [stream]);
  const _keyExtractor = item => item.value;

  const _renderItem = ({item}) => (
    <CircleListItem label={`User ${item.value}`} value={item.value} />
  );

  const mockData = elementCount => {
    const _calc = (data, count) => {
      const newCount = count + 1;
      const newData = data.concat({
        id: count,
        value: count,
      });

      if (count < elementCount) {
        return _calc(newData, newCount);
      } else {
        return newData;
      }
    };

    return _calc([], 0);
  };

  const sendMessage = message => {
    if (socket) {
      console.log('send message :' + message.id);
      socket.emit('message', message);
    }
  };

  useEffect(() => {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              minWidth: 360, // Provide your own width, height and frame rate here
              minHeight: 240,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          setStream(stream);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }, [stream]);

  messageProcessHandler = msg => {
    switch (msg.id) {
      case 'existingParticipants':
        startCommunication(sendMessage, route.params.userName, stream => {
          setStream(stream);

          msg.data.forEach(name => {
            participants[name] = name;
            receiveVideo(sendMessage, name, pc => {
              pc.onaddstream = event => {
                setRemoteURL(event.stream);
              };
            });
          });
        });
        break;
      case 'newParticipantArrived':
        participants[msg.name] = msg.name;
        if (remoteURL == null || remoteURL === '') {
          receiveVideo(sendMessage, msg.name, pc => {
            pc.onaddstream = event => {
              setRemoteURL(event.stream);
            };
          });
        }
        break;
      case 'participantLeft':
        participantLeft(msg.name);
        break;
      case 'receiveVideoAnswer':
        ProcessAnswer(msg.name, msg.sdpAnswer, err => {
          if (err) {
            console.error('the error: ' + err);
          }
        });
        break;
      case 'iceCandidate':
        addIceCandidate(msg.name, new RTCIceCandidate(msg.candidate));
        break;
      default:
        console.error('Unrecognized message', msg.message);
    }
  };

  /**
   *  partipant leave
   *
   * @param {*} name
   */
  participantLeft = name => {
    if (participants[name]) {
      delete participants[name];
    }

    if (Object.keys(participants).length == 0) {
      setRemoteURL(null);
    }
  };
  return (
    <View style={styles.container}>
      <CircleList
        data={mockData(10)}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
      />

      <RTCView style={styles.streamView} streamURL={stream?.toURL()} />
      <TouchableHighlight
        onPressOut={() => {
          sendMessage({
            id: 'leaveRoom',
          });
          setParticipants({});
          ReleaseMeidaSource();
        }}
        onPress={() => console.log('button pressed')}
        activeOpacity={0.9}
        underlayColor="#4C0062"
        style={styles.button}>
        <Text style={{color: '#fffddd', fontWeight: '600'}}> Push </Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  streamView: {
    width: width * 0.8,
    height: height * 0.5,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: '#900f3c',
    borderColor: 'coral',
    width: width * 0.5,
    height: height * 0.036,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  slider: {
    width: 200,
    height: 40,
  },
  sliderTouch: {
    width: 50,
    height: 40,
  },
  text: {
    textAlign: 'center',
  },
  textInput: {
    width: 50,
    margin: 12,
    padding: 12,
    textAlign: 'center',
    borderWidth: 1,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
