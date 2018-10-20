/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import { TabBar, Button } from 'antd-mobile-rn';
import { createStackNavigator } from 'react-navigation';
import Storage from 'react-native-storage';

import Home from './js/Home'
import Discover from './js/Discover'
import Find from './js/Find'
import My from './js/My'
import WX from './js/cps/WX'
import Login from './js/cps/Login'
import Collect from './js/cps/Collect'
import Subscribed from './js/cps/Subscribed'
import Setting from './js/cps/Setting'
import Feedback from './js/cps/Feedback'
import Author from './js/cps/Author'


var storage = new Storage({
  size: 5000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
})
global.storage = storage

type Props = {};

// Text.defaultProps.style = { fontFamily: '-apple-system, Helvetica, "San Francisco", "Helvetica Neue", "Droid Sans", Arial, "PingFang SC", "Droid Sans Fallback", sans-serif;' }

class Navvv extends Component<Props> {

  constructor(props: any) {
    super(props);
    this.state = {
      currentTab: 'home',
    };
  }

  onChangeTab(tabName: any) {
    this.setState({
      currentTab: tabName,
    });
  }

  render() {
    console.log('navigation', this.props.navigation)

    return (
      <TabBar
        unselectedTintColor="grey"
        tintColor="#000"
        barTintColor="#fff"
      >
        <TabBar.Item
          title="首页"
          icon={require('./assets/tabbar/home_sel.png')}
          selectedIcon={require('./assets/tabbar/home.png')}
          selected={this.state.currentTab === 'home'}
          onPress={() => this.onChangeTab('home')}
          iconStyle={{width: 20, height: 19}}
        >
          <Home
            {...this.props}
          />
        </TabBar.Item>
        <TabBar.Item
          title="最新"
          icon={require('./assets/tabbar/discover_sel.png')}
          selectedIcon={require('./assets/tabbar/discover.png')}
          selected={this.state.currentTab === 'discover'}
          onPress={() => this.onChangeTab('discover')}
          iconStyle={{width: 20, height: 20}}
        >
          <Discover
            {...this.props}
          />
        </TabBar.Item>
        <TabBar.Item
          title="订阅"
          icon={require('./assets/tabbar/find_sel.png')}
          selectedIcon={require('./assets/tabbar/find.png')}
          selected={this.state.currentTab === 'find'}
          onPress={() => this.onChangeTab('find')}
          iconStyle={{width: 20, height: 20}}
        >
          <Find
            {...this.props}
          />
        </TabBar.Item>
        <TabBar.Item
          title="我的"
          icon={require('./assets/tabbar/my_sel.png')}
          selectedIcon={require('./assets/tabbar/my.png')}
          selected={this.state.currentTab === 'my'}
          onPress={() => this.onChangeTab('my')}
          iconStyle={{width: 17, height: 21}}
        >
          <My
            {...this.props}
          />
        </TabBar.Item>
      </TabBar>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#FFF',
  }
});

const RootStack = createStackNavigator({
  Home: {
    screen: Navvv,
    navigationOptions: {
      header: null,
    },
  },
  WX: {
    screen: WX,
    navigationOptions: {
      headerTintColor: '#000',
    },
  },
  Author: {
    screen: Author,
    navigationOptions: {
      headerTintColor: '#000',
    },
  },
  Collect: {
    screen: Collect,
    navigationOptions: {
      headerTintColor: '#000',
      title: '收藏',
    },
  },
  Subscribed: {
    screen: Subscribed,
    navigationOptions: {
      headerTintColor: '#000',
      title: '订阅',
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      headerTintColor: '#000',
      title: '反馈',
    },
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      headerTintColor: '#000',
      title: '设置',
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerTintColor: '#000',
      title: '登录 x 注册',
    },
  },
  My: {
    screen: My,
  },
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
};
