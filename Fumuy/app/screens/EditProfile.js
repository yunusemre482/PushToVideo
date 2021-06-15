import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';

import {useTheme} from 'react-native-paper';
import {Formik, Field} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { RNCamera } from 'react-native-camera';
import React, {useState, useRef, useEffect} from 'react';

import BottomSheet from 'reanimated-bottom-sheet';
import api from './api/api';
import {AuthContext} from '../components/context';
import {useForm, Controller} from 'react-hook-form';

import Animated from 'react-native-reanimated';
import CustomInput from './CustomInput';
import ImagePicker from 'react-native-image-crop-picker';

const EditProfileScreen = () => {
  const {currentUser} = React.useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const bottomSheet = useRef();
  const [data, setData] = useState([]);

  const updateClub = async values => {
    try {
      setCurrentUser(values);
      const response = await api.put(`/users/${currentUser.id}`, values);
      handleSubmit();
    } catch (e) {
      alert('cannot update user!');
    }
  };

  const signUpValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, ({min}) => `First name must be at least ${min} characters`)
      .required('Full name is required'),
    username: yup
      .string()
      .min(3, ({min}) => `Second name must be at least ${min} characters`)
      .required('Full name is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email is required'),
    password: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
      .matches(/\d/, 'Password must have a number')
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        'Password must have a special character',
      )
      .min(6, ({min}) => `Passowrd must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  );
  const {colors} = useTheme();

  const takePhotoFromCamera = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then(image => {
        console.log('received image', image);
        setImage(image.path);
        this.bs.current.snapTo(1);
      })
      .catch(e => alert(e));
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  };

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => takePhotoFromCamera(false)}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();
  fall = new Animated.Value(1);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          marginLeft: 0,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
        <View style={{alignItems: 'center', height: 180}}>
          <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
            <View
              style={{
                height: 120,
                width: 120,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: image,
                }}
                style={{height: 120, width: 120}}
                imageStyle={{borderRadius: 60}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={30}
                    color="#fff"
                    style={{
                      position: 'relative',
                      opacity: 0.5,

                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
            John Doe
          </Text>
        </View>
        <Formik
          validationSchema={signUpValidationSchema}
          initialValues={{
            firstname: '',
            username: '',
            email: '',
            password: '',
          }}
          onSubmit={updateClub}>
          {({handleSubmit, isValid, values, resetForm}) => (
            <>
              <Field
                component={CustomInput}
                name="firstname"
                placeholder="First name"
                autoCorrect={false}
              />
              <Field
                component={CustomInput}
                name="username"
                placeholder="Username"
                autoCorrect={false}
              />
              <Field
                component={CustomInput}
                name="email"
                placeholder="Email Address"
                keyboardType="email-address"
              />

              <Field
                component={CustomInput}
                name="password"
                placeholder="Password"
                secureTextEntry
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.commandButton,
                    {backgroundColor: 'red', marginRight: 10},
                  ]}
                  onPress={() => resetForm()}>
                  <Text style={styles.panelButtonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.commandButton, {backgroundColor: 'green'}]}
                  onPress={() => {
                    handleSubmit;
                  }}>
                  <Text style={styles.panelButtonTitle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginLeft: 10,
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  commandButton: {
    flex: 1,
    padding: 6,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 24,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#6C3483',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});
