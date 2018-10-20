import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';

import AuthorList from './AuthorList'


export default class Subscribed extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <AuthorList
          {...this.props}
          tab='subscribed'
        />
      </View>
    )
  };
}
