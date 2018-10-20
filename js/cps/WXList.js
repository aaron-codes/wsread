import React, { PureComponent } from 'react';
import { ScrollView, View, Text, Dimensions, FlatList, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'antd-mobile-rn';

import WXItem from './WXItem'
import config from '../config'
import requests from '../requests'

export default class WXList extends PureComponent {

  constructor(props: any) {
    super(props);
    var _height = Dimensions.get('window').height - 70
    if (this.props.tab != 'collect') {
      _height -= 50
    }
    this.state = {
      tab: this.props.tab || '',
      subTab: this.props.subTab || '',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      loadingHeight: _height,
      wxs: [],
      firstLoading: true,
      loading: false,
      hasMore: true,
      refreshing: false,
      alertMsg: '~ 暂无数据 ~',
    };
  }

  componentDidMount() {
    this.fetchMore()
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.fetchMore(true)
    })
  }

  onTry = () => {
    const that = this
    this.setState({
      wxs: [],
      firstLoading: true,
      loading: false,
      hasMore: true,
      refreshing: false,
      alertMsg: '~ 暂无数据 ~',
    }, () => {
      that.fetchMore()
    })
  }

  onEndReached = () => {
    this.fetchMore()
  }

  fetchMore = (refresh) => {
    if (!this.state.hasMore) {
      this.setState({
        refreshing: false,
      })
      return
    }

    const that = this
    that.setState({
      loading: true,
    })

    var wxs = this.state.wxs
    if (refresh === true) {
      wxs = []
    }

    var _ls = ''
    if (wxs.length > 0) {
      _ls = wxs[wxs.length - 1]['_id']['$oid']
    }

    if (['newest', 'author', 'recommend'].indexOf(this.state.tab) > -1) {
      requests.get(`${config.wxURL}/w/api/articles?_ls=${_ls}&_fmt=simple&_page=wx&_tab=${this.state.tab}&_sub_tab=${this.state.subTab}`).then((data) => {
        if (data.code == 200 && data.result.articles.length >= 0) {
          var _wxs = wxs.concat(data.result.articles)
          that.setState({
            wxs: _wxs,
            loading: false,
            firstLoading: false,
            refreshing: false,
            hasMore: data.result.articles.length == 0 ? false : true,
          }, () => {

          })
        }
      })
    } else if (this.state.tab == 'subscribed') {
      requests.get(`${config.wxURL}/w/api/users/articles/subscribed?_ls=${_ls}&_fmt=simple&_page=wx`).then((data) => {
        if (data.code == 200 && data.result.articles.length >= 0) {
          var _wxs = wxs.concat(data.result.articles)
          that.setState({
            wxs: _wxs,
            loading: false,
            firstLoading: false,
            refreshing: false,
            hasMore: data.result.articles.length == 0 ? false : true,
          }, () => {

          })
        } else {
          var val = {
            wxs: [],
            firstLoading: false,
            loading: false,
            hasMore: true,
            refreshing: false,
            alertMsg: '~ 暂无数据 ~',
          }

          if (data.code == 500) {
            val['alertMsg'] = '~ 服务器吃翔了 ~'
          } else if (data.code == 401) {
            val['alertMsg'] = '~ 速速登录查看 ~'
          }
          that.setState(val)
        }
      })
    } else if (this.state.tab == 'collect') {
      requests.get(`${config.wxURL}/w/api/users/articles/collected?_ls=${_ls}&_fmt=simple&_page=wx`).then((data) => {
        if (data.code == 200 && data.result.articles.length >= 0) {
          var _wxs = wxs.concat(data.result.articles)
          that.setState({
            wxs: _wxs,
            loading: false,
            firstLoading: false,
            refreshing: false,
            hasMore: data.result.articles.length == 0 ? false : true,
          }, () => {

          })
        } else {
          var val = {
            wxs: [],
            firstLoading: false,
            loading: false,
            hasMore: true,
            refreshing: false,
            alertMsg: '~ 暂无数据 ~',
          }

          if (data.code == 500) {
            val['alertMsg'] = '~ 服务器吃翔了 ~'
          } else if (data.code == 401) {
            val['alertMsg'] = '~ 速速登录查看 ~'
          }
          that.setState(val)
        }
      })
    }
  }

  render() {
    const that = this

    const _renderItem = (item) => {
      return (
        <WXItem
          {...this.props}
          wx={item}
        />
      )
    }

    return (
      <View style={{backgroundColor: '#fff'}}>
        <FlatList
          data={this.state.wxs}
          renderItem={_renderItem}
          keyExtractor={(item, idx) => `${idx} - ${item._id['$oid']}`}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          ListEmptyComponent={() => {
            if (that.state.firstLoading) {
              return (
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: this.state.loadingHeight}}>
                  <ActivityIndicator style={{backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5}} />
                </View>
              )
            }

            return (
              <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: this.state.loadingHeight}}>
                <Text>{this.state.alertMsg}</Text>
                <TouchableWithoutFeedback onPress={this.onTry}>
                  <View style={{width: 100, backgroundColor: '#000', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style={{fontSize: 14, fontWeight: '900', color: '#fff', padding: 10}}>刷新试试</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )

          }}
          ListFooterComponent={() => {
            if (that.state.loading && !that.state.firstLoading) {
              return (
                <ActivityIndicator style={{backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5}} />
              )
            } else if (!that.state.hasMore && that.state.wxs.length >= 20) {
              return (
                <View style={{ display: 'flex', alignItems: 'center'}}>
                  <Text style={{color: 'grey', padding: 5, fontSize: 10, fontWeight: '900'}}> - 没啦 - </Text>
                </View>
              )
            }
            return null
          }}
          ItemSeparatorComponent={() => {
            return (
              <View style={{height: 1, backgroundColor: '#f2f4f5'}}>
              </View>
            )
          }}
        />

      </View>
    )
  };
}
