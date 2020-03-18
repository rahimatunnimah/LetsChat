import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Item, Input, Form, Label, Button, Text} from 'native-base';

import firebase from '../Config/Firebase';
import 'firebase/firestore';
import {ActivityIndicator} from 'react-native-paper';
import {saveToken} from '../Public/Redux/actions/user';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  saveToken = async token => {
    await this.props.saveToken(token);
  };

  onPressLogin = async () => {
    this.setState({
      loading: true,
    });
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        this.saveToken(res.user.uid);
        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  };

  onChangeTextEmail = email => {
    this.setState({email});
  };
  onChangeTextPassword = password => {
    this.setState({password});
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
            size={35}
          />
          <Text styles={styles.textLogoStyle}>LetsChat</Text>
        </View>
        <View style={styles.formLoginStyle}>
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
        {!this.state.loading ? (
          <Button
            block
            info
            style={styles.footerBottomStyle}
            onPress={() => this.onPressLogin()}>
            <Text style={{color: 'black'}}>Sign In</Text>
          </Button>
        ) : (
          <Button style={styles.footerBottomStyle}>
            <ActivityIndicator size="small" color="#4682b4" />
          </Button>
        )}
        <View style={styles.footersignUpStyle}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.signUpStyle}>
              Don't have an account? Sign Up Now
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
    backgroundColor: '#4682b4',
  },

  logoStyle: {
    paddingVertical: 0,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogoStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  inputStyle: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4169e1',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
  },
  footerBottomStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: '#87ceeb',
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

const mapDispatchToProps = dispatch => {
  return {
    saveToken: token => dispatch(saveToken(token)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Login);
