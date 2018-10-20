import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';

import WXList from './WXList'


export default class Collect extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <WXList
          {...this.props}
          tab='collect'
        />
      </View>
    )
  };
}
