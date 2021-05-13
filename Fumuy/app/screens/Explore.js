import React,  { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity,TouchableHighlight, Button} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';

import CircleList from 'react-native-circle-list'
import {CircleListItem} from './utils/CircleListItem';

const {width, height} = Dimensions.get('window');
const RADIUS = (1.5 * width) / 2;

export default function Explore(){ 



    const _keyExtractor = item => item.value


    const _renderItem = ({item}) => (
      <CircleListItem label={`User ${item.value}`} value={item.value} />
    );
    const [stream, setStream] = useState({toURL:()=>"null"});
    
    const mockData = elementCount => {

      const _calc = (data, count) => {
          const newCount = count + 1
          const newData = data.concat({
              id: count,
              value: count,
          })
    
          if (count < elementCount) {
              return _calc(newData, newCount)
          }else{
              return newData
          }
        }
  
        return _calc([], 0)
    }
   
  
    useEffect(() => {
      
        let isFront = true;
        mediaDevices.enumerateDevices().then((sourceInfos) => {

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
            .then((stream) => {})
            .catch((error) => {
              console.log(error);
            });
        });
    });
 
    return (
    <View style={styles.container}>
     <CircleList
                data={mockData(10)}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
            />
        
      <RTCView style={styles.streamView} streamURL={stream.toURL()} />
      <TouchableHighlight onPress={() => console.log("button pressed")} activeOpacity={0.9} underlayColor="#4C0062" style={styles.button}>
         <Text style={{color:"#fffddd" ,fontWeight:"600"}}> Push </Text> 
      </TouchableHighlight>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40,
    paddingLeft:25,
    paddingRight:25,
    backgroundColor:'#fff',
    alignItems: 'center',
  },
  streamView:{
    width:width*0.8,
    height:height*0.5,
    borderWidth:1,
    borderColor:'black',

  },
  button: {
    marginTop:40,
    borderRadius:10,
    backgroundColor:'#900f3c',
    borderColor:'coral',
    width:width*0.5,
    height:height*0.036,
    alignItems:'center',
    justifyContent:'center',
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
})
