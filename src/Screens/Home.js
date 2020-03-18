import React from 'react';
import {
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';

import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

// import Maps from './Maps';
// import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {connect} from 'react-redux';
import {saveToken} from '../Public/Redux/actions/user';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      user: [],
      uid: this.props.user.token,
    };
  }
  logout = () => {
    Alert.alert(
      'Confirm Logout',
      'Do you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.logoutoke()},
      ],
      {cancelable: false},
    );
  };
  logoutoke = () => {
    AsyncStorage.removeItem('Token');
    this.props.dispatch(saveToken(null));
    // dispatch(savetoken(null));
    firebase
      .database()
      .ref('users/' + this.props.user.token)
      .update({
        log: 'Offline',
      });
  };
  getmessage = async () => {
    const data = [];
    await firebase
      .database()
      .ref('messages')
      .child(this.state.uid)
      .orderByChild('time')
      .on('child_added', val => {
        let dbRef = firebase.database().ref('users/' + val.key);
        dbRef.on('value', snap => {
          let person = snap.val();
          person.uid = snap.key;

          if (person.uid !== this.state.uid) {
            data.push(person);
            this.setState({
              chat: data,
            });
          }
        });
      });
  };

  showRoom = data => {
    this.props.navigation.navigate('ChatRoom', {data});
    // console.warn(data);
  };
  render() {
    return (
      <>
        <View style={styles.containerHeader}>
          <TouchableOpacity onPress={this.logout} style={styles.iconProfile}>
            <Icon name="person" type="material" color="white" size={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList
            keyExtractor={item => item.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Friends')}
          style={styles.add}>
          <Icon
            name="add"
            color="#4682b4"
            type="material"
            reverseColor="#fff"
            size={30}
            reverse
            raised
          />
        </TouchableOpacity>
      </>
    );
  }
}
const styles = StyleSheet.create({
  containerHeader: {
    backgroundColor: '#4682b4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    shadowOffset: {width: 2, height: 4},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 8,
    minHeight: 60,
  },
  iconProfile: {
    top: -5,
    left: 10,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: '50%',
    left: 0,
    right: 0,
  },
  add: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = ({user}) => {
  return {
    user,
  };
};

export default connect(mapStateToProps)(Home);
