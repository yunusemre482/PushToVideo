import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SectionList, Image } from "react-native";
import {Avatar,useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../components/context';

const DATA = [
  {
    title: "Account",
    data: [
      {
        icon:"user-o",
        iconColor:'#01acb3',
        title:"Profile",
      },
     
    ]
  },
  {
    title: "Settings",
    data: [
      {
        icon:"bell-o",
        iconColor:'#01acb3',
        title:"Notifications",
      },
      {
        icon:"volume-up",
        iconColor:'#01acb3',
        title:"Volume",
      },
      {
        icon:"comments",
        iconColor:'#01acb3',
        title:"Messages",
      }
    ]
    
  },
  {
    title: "Other",
    data: [
      {
        icon:"globe",
        iconColor:'#01acb3',
        title:"Language",
      }
    ]
  },
  {
    title: "About Us",
    data: [
      {
        icon:"info-circle",
        iconColor:'#01acb3',
        title:"About",
      }
    ]
  },

];

const Item = ({item}) => (
  <View style={styles.item}>
    <FontAwesome name={item.icon} size={23} color={item.iconColor} />
    <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity>
        <FontAwesome name="angle-right" size={23} color='black' onClick={()=>{}}/>
      </TouchableOpacity>
    
  </View>
);

export default function SettingsScreen (){
  const paperTheme = useTheme();
  const {currentUser} = React.useContext(AuthContext);
  return(
    <View style={styles.container}>

    <View style={styles.headerSection}>
        <Avatar.Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          }}
          size={80}
        />
      <Text style={{color:'white',fontWeight:'500',marginTop:10}}>{currentUser.name}</Text>
      <Text style={{color:'white',fontWeight:'500',marginTop:10}}>{currentUser.email}</Text>
    </View>
    <View style={styles.footerSection}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#bec0c3',
  },
  headerSection: {
    alignItems:'flex-start',
    justifyContent:'center',
    paddingTop:30,
    paddingLeft: 20,
    borderRadius:20,
    backgroundColor:'#9d7d3c',
    flex: 2,
  },
  footerSection: {
    paddingVertical:10,
    flex: 7,
  },
  item: {
    
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#d0cfcc',
    padding: 10,
    paddingRight:30,
    marginVertical: 2
  },
  header: {
    padding:5,
    fontSize: 16,
    fontWeight:'600',
    color:'#827e7a',
  },
  title: {
    position:'absolute',
    bottom: 10,
    left:30,
    color:'#121212',
    fontFamily:'Roboto-Bold', 
    marginLeft:20,
    fontWeight:"600",
    fontSize: 16
  },
  image:{
    marginTop:30,
    alignSelf:'flex-start',
  }
});