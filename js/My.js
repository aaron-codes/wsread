import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { List, Button } from 'antd-mobile-rn';

import config from './config'
import requests from './requests'


export default class My extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      nickname: null,
    };
  }

  componentDidMount() {
    this.fetchProfile()
  }

  fetchProfile = () => {
    const that = this
    global.storage.load({
      key: 'userInfo',
    }).then(data => {
      if (data.nickname) {
        that.setState({
          nickname: data.nickname,
        })
      }
    })
  }

  onLogout = () => {
    global.storage.remove({
      key: 'userInfo',
    })
    global.storage.remove({
      key: 'jwtToken',
    })
    this.setState({
      nickname: null,
    })
    requests.get(`${config.baseURL}/auth/logout`).then((data) => {
      if (data && data.code == 200) {

      }
    })
  }

  onLoginPress = () => {
    const that = this
    this.props.navigation.navigate('Login', {refresh: () => {
      that.fetchProfile()
    }})
  }

  onCollectClick = () => {
    this.props.navigation.navigate('Collect')
  }

  onSubscribedClick = () => {
    this.props.navigation.navigate('Subscribed')
  }

  onFeedbackClick = () => {
    this.props.navigation.navigate('Feedback')
  }

  onSettingClick = () => {
    this.props.navigation.navigate('Setting')
  }

  render() {
    const profile = () => {
      if (this.state.nickname) {
        return (
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 50, paddingBottom: 50, backgroundColor: '#fff'}}>
            <Image source={require('../assets/robot.png')} style={{width: 83, height: 118, borderRadius: 0}}></Image>
            <Text style={{fontSize: 18, marginTop: 25, fontWeight: '700', color: '#000', fontStyle: 'italic'}}>{this.state.nickname}</Text>
          </View>
        )
      }

      return (
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 50, paddingBottom: 50, backgroundColor: '#fff'}}>
          <Image source={require('../assets/robot.png')} style={{width: 83, height: 118, borderRadius: 0}}></Image>
          <TouchableWithoutFeedback onPress={this.onLoginPress}>
            <View style={{width: 100, backgroundColor: '#000', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
              <Text style={{fontSize: 14, fontWeight: '900', color: '#fff', padding: 10}}>点击登录</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    }

    const logout = () => {
      if (this.state.nickname) {
        return (
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableWithoutFeedback onPress={this.onLogout}>
              <View style={{marginTop: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100, backgroundColor: '#000', borderRadius: 20, }}>
                <Text style={{fontSize: 14, fontWeight: '900', color: '#fff', padding: 10}}>退出登录</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )
      }
      return null
    }

    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        {/*<View style={{position: 'absolute', top: 0, left: 0, width: this.state.width, height: 70, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9e9e9', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ marginTop: 20, fontWeight: '900', fontSize: 16}}> 我的 </Text>
        </View>*/}
        {/*thumb={
                <Image source={require('../assets/my/collect.png')} style={{width: 15, height: 15, marginRight: 10}}></Image>
              }*/}
        {/*thumb={
                <Image source={require('../assets/my/subscribed.png')} style={{height: 15, width: 14, marginRight: 10}}></Image>
              }*/}
        <View>
          {profile()}
          <List style={{ marginTop: 0 }}>
            <List.Item
              data-seed="collected"
              arrow="horizontal"
              onClick={this.onCollectClick}
            >
              收藏
            </List.Item>
            <List.Item
              data-seed="subscribed"
              arrow="horizontal"
              onClick={this.onSubscribedClick}
            >
              订阅
            </List.Item>
          </List>

          {/*<List style={{ marginTop: 20 }}>
            <List.Item
              data-seed="feedback"
              arrow="horizontal"
              thumb={
                <Image source={require('../assets/my/feedback.png')} style={{height: 15, width: 15, marginRight: 10}}></Image>
              }
              onClick={this.onFeedbackClick}
            >
              反馈
            </List.Item>
            <List.Item
              data-seed="setting"
              arrow="horizontal"
              thumb={
                <Image source={require('../assets/my/setting.png')} style={{height: 15, width: 15, marginRight: 10}}></Image>
              }
              onClick={this.onSettingClick}
            >
              设置
            </List.Item>
          </List>*/}

          {logout()}

        </View>

      </ScrollView>
    )
  };
}
