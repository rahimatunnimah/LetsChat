import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Button, Text} from 'native-base';
import {Icon} from 'react-native-elements';

import firebase from '../Config/Firebase';
import 'firebase/firestore';
import md5 from 'md5';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      usersRef: firebase.database().ref('users'),
      loading: false,
      key: '',
    };
  }
  onPressCreate = async () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        createdUser.user
          .updateProfile({
            displayName: this.state.name,
            photoURL: `http://gravatar.com/avatar/${md5(
              createdUser.user.email,
            )}?d=identicon`,
          })

          .then(() => {
            this.setState({
              loading: true,
            });
            this.saveUser(createdUser).then(() => {
              ToastAndroid.show('Register Success!', ToastAndroid.SHORT);
            });
          });
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
        this.setState({
          loading: false,
        });
      });
  };
  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      email: createdUser.user.email,
      latitude: 0,
      longitude: 0,
      log: 'offline',
      key: this.state.key,
    });
  };

  onChangeTextEmail = email => {
    this.setState({email});
  };
  onChangeTextPassword = password => {
    this.setState({password});
  };
  onChangeTextName = name => {
    this.setState({name});
  };
  render() {
    return (
      <View style={styles.containerStyle}>
        <View style={styles.logoStyle}>
          <Icon
            name="forum"
            type="material"
            reverseColor="white"
            reverse
            color="#4682b4"
            size={30}
          />
          <Text styles={styles.textLogoStyle}>LetsChat</Text>
        </View>
        <View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Name"
            autoCapitalize="none"
            onChangeText={e => this.onChangeTextName(e)}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={e => this.onChangeTextEmail(e)}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={e => this.onChangeTextPassword(e)}
          />
        </View>
        <Button
          block
          info
          style={styles.footerBottomStyle}
          onPress={() => this.onPressCreate()}>
          <Text>Sign Up</Text>
        </Button>
        <View style={styles.footersignUpStyle}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.signUpStyle}>
              Already have an account? Sign In Here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
  },

  logoStyle: {
    paddingVertical: 0,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogoStyle: {
    fontSize: 18,
    color: 'white',
  },

  inputStyle: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4682b4',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOffset: {width: 5, height: 5},
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 4,
  },
  footerBottomStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: '#4682b4',
    marginTop: 20,
    fontWeight: 'bold',
  },
  footersignUpStyle: {
    marginTop: 25,
    alignItems: 'center',
  },
  signUpStyle: {
    color: 'black',
    fontSize: 14,
  },
});

export default Register;
