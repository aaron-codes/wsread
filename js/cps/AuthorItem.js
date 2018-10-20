import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Toast } from 'antd-mobile-rn';

import config from '../config'
import requests from '../requests'


export default class AuthorItem extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      textWidth: Dimensions.get('window').width - 20 - 10 - 40 - 60,
      author: this.props.author.item,
    };
  }

  onPress = () => {
    this.props.navigation.navigate('Author', {authorId: this.state.author._id['$oid']})
  }

  onSubscribed = () => {
    if (this.state.author) {
      if (this.state.author.isSubscribed) {
        requests.del(`${config.wxURL}/w/api/authors/${this.state.author['_id']['$oid']}/subscribe`).then((data) => {
          if (data && data.code == 200) {
            this.setState({
              author: data.result.author,
            })
          } else {
            var _alertMsg = '~ 出了点差错 ~'
            if (data.code == 401) {
              _alertMsg = '~ 速速去登录 ~'
            }
            Toast.info(_alertMsg, 1)
          }
        })
      } else {
        requests.post(`${config.wxURL}/w/api/authors/${this.state.author['_id']['$oid']}/subscribe`).then((data) => {
          if (data && data.code == 200) {
            this.setState({
              author: data.result.author,
            })
          } else {
            var _alertMsg = '~ 出了点差错 ~'
            if (data.code == 401) {
              _alertMsg = '~ 速速去登录 ~'
            }
            Toast.info(_alertMsg, 1)
          }
        })
      }
    }
  }

  render() {
    const obj = this.state.author

    const subscribed = () => {
      var _text = '订阅'
      if (obj.isSubscribed) {
        _text = '取订'
      }

      return (
        <TouchableWithoutFeedback onPress={this.onSubscribed}>
          <View style={{ marginLeft: 10, width: 50, height: 24, borderRadius: 20, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#fff', fontSize: 12, fontWeight: '900'}}>{_text}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10, backgroundColor: '#fff'}}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View>
            <Image source={{uri: obj.headimg, cache: 'force-cache'}} style={{width: 40, height: 40, borderRadius: 4}} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: '900', color: '#B8B7B7', letterSpacing: 0.2, paddingBottom: 5, fontSize: 14}}>
              {obj.nickname}
            </Text>
            <Text style={{color: '#000000a6', fontSize: 14, letterSpacing: 0.2, paddingTop: 1, marginBottom: 0, fontWeight: '900', width: this.state.textWidth}} numberOfLines={1} ellipsizeMode='tail'>
              {obj.profile_desc}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {subscribed()}
      </View>
    )
  };
}
