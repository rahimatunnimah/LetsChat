import React from 'react';
import firebase from '../Config/Firebase';
import 'firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
// import {CardStyleInterpolators} from '@react-navigation/stack';

// // import {HeaderContact} from '../Components/Headers';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';

class UserList extends React.Component {
  constructor(props) {
    super(props);
  }
  addFriend = async data => {
    this.save(data);
  };
  save = async data => {
    const {token} = await this.props;
    let updates = {};
    let person = {
      status: 0,
    };
    let person2 = {
      status: 1,
    };
    updates['friend/' + token + '/' + data.uid] = person;
    updates['friend/' + data.uid + '/' + token] = person2;
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        ToastAndroid.show('Send request', ToastAndroid.SHORT);
      });
  };
  render() {
    return (
      <View style={styles.itemFriend}>
        <Image source={{uri: this.props.data.avatar}} style={styles.avatar} />
        <Text style={styles.name}>{this.props.data.name}</Text>
        <TouchableOpacity
          onPress={() => this.addFriend(this.props.data)}
          style={styles.addF}>
          <Icon
            name="add"
            color="white"
            type="material"
            reverseColor="#4682b4"
            size={25}
            reverse
            // raised
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class FriendList extends React.Component {
  confirm = data => {
    // console.log('confirm kepanggil');
    firebase
      .database()
      .ref('friend/' + this.props.token)
      .child(data.uid)
      .update({
        status: 2,
      });
    firebase
      .database()
      .ref('friend/' + data.uid)
      .child(this.props.token)
      .update({
        status: 2,
      });
    this._getFriends();
  };
  gotochat = data => {
    // console.log('navigation ', this.props);
    this.props.navigation.navigate('ChatRoom', {data});
  };
  render() {
    return (
      <TouchableOpacity
        activeOpacity={
          this.props.data.status === 0
            ? 1
            : this.props.data.status === 1
            ? 1
            : 0.5
        }
        onPress={
          this.props.data.status === 2
            ? () => this.gotochat(this.props.data)
            : null
        }>
        <View style={styles.itemFriend}>
          <Image source={{uri: this.props.data.avatar}} style={styles.avatar} />
          <Text style={styles.name}>{this.props.data.name}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.add}>
              {this.props.data.status === 0
                ? 'Waiting'
                : this.props.data.status === 1
                ? 'Request'
                : 'Friend'}
            </Text>
            {this.props.data.status === 1 ? (
              <TouchableOpacity onPress={() => this.confirm(this.props.data)}>
                <Text style={styles.status}>Confirm</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      friends: [],
      loading: false,
      key: '',
      modal: false,
    };
  }

  componentDidMount() {
    this._getFriends();
  }
  async getFriends() {
    const data = [];
    const {token} = await this.props.user;
    this.setState({
      loading: true,
    });
    let dbRef = firebase.database().ref('users');
    await dbRef.on('child_added', val => {
      let person = val.val();
      person.uid = val.key;
      if (person.uid !== token) {
        data.push(person);
        this.filter(data);
      } else {
        this.filter([]);
      }
    });
  }

  filter = data => {
    if (this.state.key) {
      let dataAfterFilter = data.filter(a => {
        // console.log('a di filter ', a);
        if (a.name) {
          return (
            a.name.toLowerCase().indexOf(this.state.key.toLowerCase()) !== -1
          );
        }
      });
      this.setState({user: dataAfterFilter});
      this.setState({loading: false});
    } else {
      this.setState({user: []});
      this.setState({loading: false});
    }
  };
  _getFriends = async () => {
    let dataFriends = [];
    await firebase
      .database()
      .ref('friend')
      .child(this.props.user.token)
      .on('child_added', value => {
        // console.log('value ', value);
        let person = value.key;
        firebase
          .database()
          .ref('users')
          .child(person)
          .on('value', val => {
            // console.log('val ', val);
            let friendsme = val.val();
            friendsme.status = value.val().status;
            friendsme.uid = value.key;
            dataFriends.push(friendsme);
            this.setState({friends: dataFriends});
          });
      });
  };

  render() {
    return (
      <>
        <View style={styles.containerHeader}>
          <Text style={styles.title}>Friends</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.friend}>
            {this.state.friends.map((friend, index) => {
              return (
                <FriendList
                  key={index}
                  data={friend}
                  token={this.props.user.token}
                  navigation={this.props.navigation}
                />
              );
            })}
          </View>
        </View>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => this.setState({modal: true})}>
          <Icon name="add" type="material" color="#fff" size={25} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          style={styles.modal}
          onRequestClose={() => {
            this.setState({modal: false});
          }}>
          <>
            <View style={styles.containerHeader}>
              <Text style={styles.title}>Search Friends</Text>
            </View>
            <View style={styles.container}>
              <View style={styles.sendMessage}>
                <TextInput
                  placeholder="search..."
                  style={[styles.textInput, {flex: 1}]}
                  onChangeText={e => {
                    this.setState({key: e});
                  }}
                  onSubmitEditing={() => this.getFriends()}
                  value={this.state.key}
                  keyboardType={'email-address'}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.getFriends()}>
                  <Icon name="search" solid color="#4682b4" size={15} />
                </TouchableOpacity>
              </View>
              <View>
                {!this.state.loading ? (
                  this.state.user ? (
                    <FlatList
                      data={this.state.user}
                      style={styles.data}
                      renderItem={({item}) => (
                        <UserList data={item} token={this.props.user.token} />
                      )}
                      keyExtractor={item => item.toString()}
                      showsVerticalScrollIndicator={false}
                    />
                  ) : (
                    <View style={styles.data}>
                      <Text>No Result</Text>
                    </View>
                  )
                ) : (
                  <ActivityIndicator
                    size="large"
                    color="#4682b4"
                    style={styles.loading}
                  />
                )}
              </View>
            </View>
          </>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = ({user}) => {
  return {
    user,
  };
};
const styles = StyleSheet.create({
  containerHeader: {
    backgroundColor: '#4682b4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: {width: 2, height: 4},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 8,
    minHeight: 60,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    top: 5,
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
  chat: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    backgroundColor: '#4682b4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 5, height: 5},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 4,
  },
  textInput: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#4682b4',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 5,
    marginTop: 5,
    fontFamily: 'roboto',

    shadowOffset: {width: 2, height: 2},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 2,
  },
  sendMessage: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  btn: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: 40,
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 100,
    padding: 10,
    borderWidth: 2,
    borderColor: '#4682b4',

    shadowOffset: {width: 2, height: 2},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 2,
  },
  friend: {
    marginTop: 10,
  },
  itemFriend: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 10,
    borderRadius: 20,
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#acacac',
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  data: {
    marginBottom: 40,
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1b262c',
    alignSelf: 'center',
  },
  add: {
    color: '#4682b4',
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
  },
  status: {
    color: '#4682b4',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  addF: {
    position: 'absolute',
    right: 1,
    alignSelf: 'center',
  },
});
export default connect(mapStateToProps)(Friends);
