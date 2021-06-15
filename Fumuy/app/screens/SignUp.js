import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  LogBox,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import api from './api/api';

LogBox.ignoreLogs(['RCTBridge']);

import * as Animatable from 'react-native-animatable';

export default function SignUp({navigation}) {
  const [data, setData] = useState({
    name: '',
    username:'',
    email: '',
    password: '',
    confirmPassword: '',
    isAuthorized: false,
    check_textInputChange: false,
    confirmSecureTextEntry: true,
    secureTextEntry: true,
  });

  const handleSubmit = async () => {
    if(!data.isAuthorized){
      alert("Enter valid email");
    }
    else{
      fetch("http://localhost:4000/api/user/signup",{
        method:"POST",
        headers: {
         'Content-Type': 'application/json'
       },
       body:JSON.stringify({
         "name":data.name,
         "username":data.username,
         "email":data.email,
         "password":data.password
       })
      })
      .then(res=>res.json())
      .then(async (info)=>{
             try {
                 alert(info.message);
                 navigation.replace('SignIn');
             } catch (e) {
               console.log(e);
             }
      })
    }
    
  };
  
  const validateEmail=(val)=>{
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (reg.test(val) === false){

        setData({
          ...data,
          isAuthorized:false,
          email: val,
          check_textInputChange: false,
        });
       
      }else {
        setData({
          ...data,
          email: val,
          isAuthorized:true,
          check_textInputChange: true,
        });
      
      }
  };
  const handleNameChange = val => {
    setData({
      ...data,
      name: val,
    });
  };
  const handleUsernameChange = val => {
    setData({
      ...data,
      username: val,
    });
  };
  const handlePasswordChange = val => {
    setData({
      ...data,
      password: val,
    });
  };
  const handleConfirmPasswordChange = val => {
    setData({
      ...data,
      password: val,
    });
  };
  const updateSecureTextEntry = val => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const updateConfirmSecureTextEntry = val => {
    setData({
      ...data,
      confirmSecureTextEntry: !data.confirmSecureTextEntry,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00377b" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.bigTitle}>Let's Connect with Fumuy</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
        <Text style={styles.title}>Name </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholderTextColor="black"
            placeholder="First Name"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={handleNameChange}
          />
          {data.name.length ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={15} />
            </Animatable.View>
          ) : null}
        </View>
        <Text style={styles.title}>User Name </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholderTextColor="black"
            placeholder="Username"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={handleUsernameChange}
          />
          {data.username.length ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={15} />
            </Animatable.View>
          ) : null}
        </View>
        <Text style={styles.title}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholderTextColor="black"
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(text) => validateEmail(text)}
          />

          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={15} />
            </Animatable.View>
          ) : null}
        </View>
        <Text style={styles.title}>Password</Text>
        <View style={styles.action}>
          <FontAwesome name="lock" size={20} />
          <TextInput
            placeholderTextColor="black"
            placeholder="Password"
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="black" size={15} />
            ) : (
              <Feather name="eye" color="black" size={15} />
            )}
          </TouchableOpacity>
        </View>
      
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={{color: 'white',fontWeight:'500'}}> Sign up </Text>
        </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00377b',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 3,
  },
  button: {
    height: 33,
    borderRadius: 20,
    backgroundColor: '#00377b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    padding: 5,
  },
  title: {
    padding: 6,
    marginTop: 4,
  },
  bigTitle: {
    color: 'white',
    fontFamily: 'DancingScript-SemiBold',
    fontSize: 32,
    fontWeight: '800',
  },
});
