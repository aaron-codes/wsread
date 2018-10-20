import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';


export default class Feedback extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>

      </View>
    )
  };
}
