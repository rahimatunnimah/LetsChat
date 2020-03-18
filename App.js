import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNav from './src/Public/Navigators/MainNav';
// import {decode, encode} from 'base-64';

import {Provider} from 'react-redux';
import store from './src/Public/Redux/store';
console.disableYellowBox = true;

const App = () => {
  // if (!global.btoa) {
  //   global.btoa = encode;
  // }

  // if (!global.atob) {
  //   global.atob = decode;
  // }
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* <Header /> */}
        <MainNav />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
