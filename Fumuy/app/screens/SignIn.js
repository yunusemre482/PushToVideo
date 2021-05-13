import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import api from '../api/api';
import {AuthContext} from '../components/context';
import bcrypt from 'react-native-bcrypt';

import * as Animatable from 'react-native-animatable';

export default function SignIn({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const {signIn} = React.useContext(AuthContext);

  const handleSubmit = async () => {
    try{
      fetch("http://localhost:3000/api/user/signin",{
        method:"POST",
        headers: {
         'Content-Type': 'application/json'
       },
       body:JSON.stringify({
         "email":data.email,
         "password":data.password
       })
      })
      .then(res=>res.json())
    .then(async (info)=>{
           try {
             console.log(info);
             if(info.message==true){
              signIn(info.message);
             }else{
               alert(info.message);
             }
           } catch (e) {
             console.log("error hai",e)
              Alert(e)
           }
    })
    }catch(err){
      console.log(error);
    }
  };
  const textInputChange = val => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };
  const handlePasswordChange = val => {
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
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="coral" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.bigTitle}>Let's Connect with Fumuy</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.title}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholderTextColor="black"
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={textInputChange}
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
        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}> Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={{color: 'white',fontWeight:'500'}}> Sign in </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: 'black',fontWeight:'500'}}> Sign Up </Text>
        </TouchableOpacity>
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
    fontWeight: '700',
  },
  forgot: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  forgotText: {
    fontWeight: '500',
    color: '#00377b',
    fontFamily: 'Roboto-Regular',
  },
  signUpButton: {
    height: 33,
    borderRadius: 20,
    backgroundColor: '#dddec3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
