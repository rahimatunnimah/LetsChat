import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {saveToken} from '../Public/Redux/actions/user';
import AsyncStorage from '@react-native-community/async-storage';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import {Icon} from 'react-native-elements';

const Splash = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      const getToken = async () => {
        await AsyncStorage.getItem('Token', (err, token) => {
          dispatch(saveToken(token));
        });
      };
      getToken();
    }, 1500);
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <Icon
          name="forum"
          solid
          color="#4682b4"
          size={90}
          style={styles.logoChat2}
        />
      </View>
      {show ? <Text style={styles.lets}>LetsChat</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6f7',
  },
  to: {
    color: '#333',
    marginBottom: 10,
  },
  lets: {
    color: '#4682b4',
    fontSize: 40,
    fontWeight: 'bold',
  },
  logoChat2: {
    position: 'absolute',
  },
});

export default Splash;
