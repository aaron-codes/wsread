import React, { Component } from 'react';
import { ScrollView, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Button, InputItem, List, Toast } from 'antd-mobile-rn';

import config from '../config'
import requests from '../requests'

export default class Login extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      currentOption: 'login',
    }
  }

  onLogin = () => {
    var payload = {
      username: this.state.username,
      password: this.state.password,
    }

    requests.post(`${config.baseURL}/auth/login`, null, payload).then((data) => {
      if (data && data.code == 200) {
        Toast.info('~ 登录成功 ~', 1)

        global.storage.save({
          key: 'userInfo',
          data: data.result.user,
          expires: null
        })

        global.storage.save({
          key: 'jwtToken',
          data: data.result.jwt_token,
          expires: null
        })

        this.props.navigation.state.params.refresh()
        this.props.navigation.goBack()
      } else {
        Toast.info('~ 用户名或密码错误 ~', 1)
      }
    })
  }

  onSignup = () => {
    var payload = {
      username: this.state.username,
      password: this.state.password,
    }

    requests.post(`${config.baseURL}/auth/register`, null, payload).then((data) => {
      if (data && data.code == 200) {
        Toast.info('~ 注册成功 ~', 1)

        global.storage.save({
          key: 'userInfo',
          data: data.result.user,
          expires: null
        })

        global.storage.save({
          key: 'jwtToken',
          data: data.result.jwt_token,
          expires: null
        })

        this.props.navigation.state.params.refresh()
        this.props.navigation.goBack()
      } else {
        var alertMsg = '注册失败'
        if (data) {
          alertMsg = data.message || '注册失败'
        }
        Toast.info(alertMsg, 1)
      }
    })
  }

  render() {

    const login = () => {

      const toolbar = () => {
        if (this.state.currentOption == 'login') {
          return (
            <View>
              <Button style={{border: 'none', borderRadius: 25, marginLeft: 40, marginRight: 40, marginTop: 20, backgroundColor: '#fff'}} onClick={this.onLogin}>登录</Button>
              <TouchableWithoutFeedback onPress={() => {
                this.setState({
                  currentOption: 'signup',
                })
              }}>
                <View style={{ marginLeft: 60, marginTop: 10 }}>
                  <Text style={{ fontWeight: '900'}}>注册 👈</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )
        } else {
          return (
            <View>
              <Button style={{border: 'none', borderRadius: 25, marginLeft: 40, marginRight: 40, marginTop: 20, backgroundColor: '#fff'}} onClick={this.onSignup}>注册</Button>
              <TouchableWithoutFeedback onPress={() => {
                this.setState({
                  currentOption: 'login',
                })
              }}>
                <View style={{ marginLeft: 60, marginTop: 10 }}>
                  <Text style={{ fontWeight: '900'}}>登录 👈</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )
        }
      }

      return (
        <View>
          <List style={{marginTop: 40, marginLeft: 40, marginRight: 40}}>
            <InputItem
              clear
              value={this.state.username}
              onChange={(username: any) => {
                this.setState({
                  username,
                });
              }}
              placeholder="用户名"
            >
            </InputItem>
            <InputItem
              clear
              type='password'
              value={this.state.password}
              onChange={(password: any) => {
                this.setState({
                  password,
                });
              }}
              placeholder="密码"
            >
            </InputItem>
          </List>
          {toolbar()}
        </View>
      )
    }

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f2f4f5' }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
      {login()}
      </ScrollView>
    )
  };
}
