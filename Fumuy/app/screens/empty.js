import React,  { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';

const {width, height} = Dimensions.get('window');

class Explore extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      })
      .then(stream => {
        console.log(stream);
      })
      .catch(error => {
        // Log error
      });
    });
  }

  render(){
    
    return (

      <View style={styles.container}>
         <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: height * 0.5,
            borderColor: 'yellow',
            borderWidth: 4,
          }}>

          </View>
          <RTCView
            streamURL={""}
            style={styles.streamView}
          />
         

      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:30,
  },
  streamView:{
    flex: 1,
    width: 180, 
    height: height * 0.4,
    alignItems: 'center',
    borderWidth:1,
    borderColor:'black',

  }
})
