import React, { Component } from 'react';
import { Platform, ScrollView, View, Text, Dimensions } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import WXList from './cps/WXList'

export default class Home extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
    };
  }

  render() {
    var tabViewStyle = {backgroundColor: '#fff', paddingTop: 20, marginBottom: 50}
    if (Platform.OS === 'android') {
      tabViewStyle = {backgroundColor: '#fff'}
    }

    return (
      <View style={{flex: 1}}>
        <ScrollableTabView
          style={tabViewStyle}
          scrollWithoutAnimation={true}
          initialPage={0}
          locked={false}
          tabBarTextStyle={{fontWeight: '900'}}
          tabBarInactiveTextColor='#b8b7b7'
          tabBarActiveTextColor='#000'
          tabBarUnderlineStyle={{width: 8, marginLeft: (this.state.width / 2 - 8) / 2, height: 8, borderRadius: 4, backgroundColor: '#000'}}
        >
          <View tabLabel='订阅'>
            <WXList
              {...this.props}
              tab='subscribed'
            />
          </View>
          <View tabLabel='推荐'>
            <WXList
              {...this.props}
              tab='recommend'
            />
          </View>
        </ScrollableTabView>
      </View>
    )
  };
}
