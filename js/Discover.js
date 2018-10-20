import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, Platform } from 'react-native';
import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview';

import WXList from './cps/WXList'

const tabs = [{
  'title': '最新',
  'code': 'all',
}, {
  title: '科技',
  code: 'tech',
}, {
  title: '时尚',
  code: 'fashion',
}, {
  title: '财经',
  code: 'finance',
}, {
  title: '读书',
  code: 'read',
}, {
  title: '美食',
  code: 'food',
}, {
  title: '电影',
  code: 'movie',
}, {
  title: '旅游',
  code: 'travel',
}, {
  title: '汽车',
  code: 'car',
}, {
  title: '体育',
  code: 'sport',
}, {
  title: '创业',
  code: 'startup',
}, {
  title: '程序',
  code: 'program',
}, {
  title: '杂志',
  code: 'magazine',
}, {
  title: '情感',
  code: 'emotion',
}, {
  title: '搞笑',
  code: 'fun',
}, {
  title: '时事',
  code: 'news',
}, ]

export default class Discover extends Component {

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
          renderTabBar={() => <ScrollableTabBar />}
          tabBarUnderlineStyle={{height: 3, backgroundColor: '#000'}}
        >
        {tabs.map((item) => {
          return (
            <View tabLabel={item.title} key={item.code}>
              <WXList
                {...this.props}
                tab='newest'
                subTab={item.code}
              />
            </View>
          )
        })}
        </ScrollableTabView>
      </View>
    )
  };
}
