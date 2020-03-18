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
import {Icon} from 'react-native-elements';

class ListUser extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.itemFriend}>
        <Image source={{uri: this.props.data.avatar}} style={styles.avatar} />
        <Text style={styles.name}>{this.props.data.name}</Text>
        <TouchableOpacity
          //   onPress={() => this.addFriend(this.props.data)}
          style={styles.addF}>
          <Icon
            name="add"
            color="white"
            type="material"
            reverseColor="black"
            size={30}
            reverse
            raised
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  friend: {
    marginTop: 10,
  },
  itemFriend: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 10,
    borderRadius: 1,
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#acacac',
    shadowRadius: 3,
    shadowOpacity: 0.2,

    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
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
    color: '#ed8240',
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
    color: 'orange',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  addF: {
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
  },
});
export default ListUser;
