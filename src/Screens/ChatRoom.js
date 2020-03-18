import React from 'react';
import {connect} from 'react-redux';
import firebase from '../Config/Firebase';
import 'firebase/firestore';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';

// import AsyncStorage from '@react-native-community/async-storage';
// import {useDispatch, useSelector} from 'react-redux';
class RenderRow extends React.Component {
  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };
  render() {
    // console.log('this.props.item ', this.props.item);
    // console.log('this.props.uid ', this.props.uid);
    return (
      <View
        style={
          this.props.item.from === this.props.uid ? styles.chatr : styles.chatl
        }>
        <Text style={styles.txtChat}>{this.props.item.message}</Text>
        <Text style={styles.time}>
          {this.convertTime(this.props.item.time)}
        </Text>
      </View>
    );
  }
}
class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: [],
      newChat: '',
      fuid: this.props.route.params.data.uid,
      uid: this.props.user.token,
    };
  }
  componentDidMount() {
    this.getmsg();
  }
  sendMessage = () => {
    if (this.state.newChat.trim()) {
      let msgId = firebase
        .database()
        .ref('message')
        .child(this.state.uid)
        .child(this.state.fuid)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.newChat,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: this.state.uid,
      };
      updates[
        'messages/' + this.state.uid + '/' + this.state.fuid + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.fuid + '/' + this.state.uid + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({
        newChat: '',
      });
    }
  };
  getmsg = async () => {
    const data = [];
    await firebase
      .database()
      .ref('messages')
      .child(this.state.uid)
      .child(this.state.fuid)
      .on('child_added', val => {
        data.push(val.val());
        this.setState({
          chat: data,
        });
      });
  };

  render() {
    const scrollViewRef = React.createRef();
    const {data} = this.props.route.params;
    return (
      <>
        <View style={styles.containerHeader}>
          <TouchableOpacity
            style={styles.iconProfile}
            onPress={() => this.props.navigation.navigate('Maps', {data})}>
            <Icon name="person" type="material" color="white" size={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <ScrollView
            style={styles.chatItem}
            ref={scrollViewRef}
            onContentSizeChange={(contentWidth, contentHeight) => {
              scrollViewRef.current.scrollToEnd({animated: true});
            }}>
            {this.state.chat.map((c, i) => {
              return <RenderRow key={i} item={c} uid={this.state.uid} />;
            })}
          </ScrollView>
          <View style={styles.sendMessage}>
            <TextInput
              placeholder="Type a messa..."
              style={styles.textInput}
              multiline
              onChangeText={e => this.setState({newChat: e})}
              value={this.state.newChat}
            />
            <TouchableOpacity onPress={this.sendMessage} style={styles.btn}>
              <Icon
                name="send"
                type="material"
                color="#4682b4"
                size={20}
                style={styles.iconSend}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  textInput: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#4682b4',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 0,
    flex: 1,
    marginRight: 5,
    fontFamily: 'roboto',

    shadowOffset: {width: 2, height: 2},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingBottom: 20,
    top: 5,
  },
  sendMessage: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  btn: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: 45,
    height: 45,
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
  chatItem: {
    flex: 1,
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  chatl: {
    backgroundColor: '#696969',
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderBottomLeftRadius: 1,
    borderRadius: 8,
    color: '#fff',
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 2,
  },
  chatr: {
    backgroundColor: '#4682b4',
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderBottomRightRadius: 1,
    borderRadius: 8,
    color: '#fff',
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',

    shadowOffset: {width: 2, height: 2},
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,

    elevation: 2,
  },
  time: {color: '#eee', padding: 3, fontSize: 12, alignSelf: 'flex-end'},
  txtChat: {
    color: '#fff',
    padding: 7,
    fontSize: 16,
    maxWidth: '90%',
  },
});

const mapStateToProps = ({user}) => {
  return {
    user,
  };
};
export default connect(mapStateToProps)(ChatRoom);
