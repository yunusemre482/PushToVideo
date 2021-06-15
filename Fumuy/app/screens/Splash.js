import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {splash} from '../constants/images';


class Splash extends Component {
  state = {
    LogoAnime: new Animated.Value(0),
    LogoText: new Animated.Value(0),
    loadingSpinner: false,
  };
  
  componentDidMount() {
    const {LogoAnime, LogoText} = this.state;
    Animated.parallel([
      Animated.spring(LogoAnime, {
        toValue: 1,
        tension: 10,
        friction: 2,
        duration: 1000,
        useNativeDriver: true
      }).start(),

      Animated.timing(LogoText, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
    ]).start(() => {
      this.setState({
        loadingSpinner: true,
      });

      setTimeout(()=>{this.props.navigation.replace('SignIn')}, 3000);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: this.state.LogoAnime,
          }}>
          <Image source={splash} style={{width:360,height:300}}/>

          {this.state.loadingSpinner ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
              color="#5557ee"
            />
          ) : null}
        </Animated.View>
        <Animated.View style={{opacity: this.state.LogoText}}>
          <Text style={styles.logoText}> Let's have fun </Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#00377b',
    fontFamily:'DancingScript-Regular',
    fontSize: 36,
    marginTop: 29.1,
    fontWeight: '400',
  },
});


export default Splash;