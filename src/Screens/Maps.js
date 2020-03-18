import React, {useState, useEffect} from 'react';
import firebase from '../Config/Firebase';
import 'firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';

const Maps = props => {
  const inittialState = {
    latitude: props.route.params.data.latitude,
    longitude: props.route.params.data.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const {token} = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(token);
  const [currenPosition, setCurrentPosition] = useState(inittialState);
  const [friendPosition, setFriendPosition] = useState(inittialState);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  // console.warn(props.route.params.data);
  useEffect(() => {
    const usnSubcribe = Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentPosition({
          ...currenPosition,
          latitude,
          longitude,
        });
      },
      error => ToastAndroid.show(error.message, ToastAndroid.SHORT),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000},
    );
    console.warn(props.route.params.data);
    return () => {
      Geolocation.clearWatch();
      Geolocation.stopObserving();
    };
  }, [currenPosition, props.route, props.route.params.data]);

  return currenPosition.latitude ? (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton
        showsTraffic
        showsCompass
        region={friendPosition}>
        <Marker
          pinColor="#333366"
          coordinate={currenPosition}
          title={'Your Location'}
        />
        <Marker
          pinColor="#ff971d"
          coordinate={friendPosition}
          title={props.route.params.data.name}
        />
      </MapView>
      <View
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          width: '100%',
          height: 230,
          shadowOffset: {width: 2, height: 4},
          shadowColor: '#000',
          shadowRadius: 10,
          shadowOpacity: 1,

          elevation: 8,
          bottom: 0,
          paddingHorizontal: 30,
          paddingVertical: 50,
        }}>
        <Text style={styles.name}>{props.route.params.data.name}</Text>
        <Text style={styles.name}>{props.route.params.data.key}</Text>
        <Text style={{position: 'absolute', right: 190, marginTop: 10}}>
          {props.route.params.data.log}
        </Text>
        <Image
          source={{uri: props.route.params.data.avatar}}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => props.navigation.navigate('ChatRoom')}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <ActivityIndicator pinColor="#333366" size="large" style={styles.loading} />
  );
};
const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: '100%',
  },
  loading: {
    flex: 1,
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  textInput: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontFamily: 'roboto',
  },
  contain: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: -50,
    right: 30,
    borderRadius: 100,
    borderWidth: 2,
  },
  name: {
    marginTop: 10,
    color: '#fff',
    backgroundColor: '#434e52',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#ff971d',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Maps;
