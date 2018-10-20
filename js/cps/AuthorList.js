import React, { PureComponent } from 'react';
import { ScrollView, View, Text, Dimensions, FlatList, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'antd-mobile-rn';

import AuthorItem from './AuthorItem'
import config from '../config'
import requests from '../requests'

export default class AuthorList extends PureComponent {

  constructor(props: any) {
    super(props);

    var _height = Dimensions.get('window').height - 70
    if (this.props.tab != 'subscribed') {
      _height -= 50
    }

    this.state = {
      tab: this.props.tab || 'recommend',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      loadingHeight: _height,
      authors: [],
      firstLoading: true,
      loading: false,
      hasMore: true,
      refreshing: false,
      alertMsg: '~ 暂无数据 ~'
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
      authors: [],
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

    var authors = this.state.authors
    if (refresh === true) {
      authors = []
    }

    var _ls = ''
    if (authors.length > 0) {
      _ls = authors[authors.length - 1]['_id']['$oid']
      if (this.state.tab === 'subscribed') {
        _ls = authors[authors.length - 1]['subscribed_id']['$oid']
      }
    }

    var _uri = `${config.wxURL}/w/api/authors?_tab=${this.state.tab}&_ls=${_ls}`

    if (this.state.tab == 'subscribed') {
      _uri = `${config.wxURL}/w/api/authors/subscribed?_ls=${_ls}`
    }

    requests.get(_uri).then((data) => {
      if (data.code == 200 && data.result.authors.length >= 0) {
        var _authors = authors.concat(data.result.authors)
        that.setState({
          authors: _authors,
          loading: false,
          firstLoading: false,
          hasMore: data.result.authors.length == 0 ? false : true,
          refreshing: false,
        }, () => {

        })
      } else {
        var val = {
          authors: [],
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

  render() {
    const that = this
    const _renderItem = (item) => {
      return (
        <AuthorItem
          {...this.props}
          author={item}
        />
      )
    }

    return (
      <View style={{backgroundColor: '#fff'}}>
        <FlatList
          data={this.state.authors}
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
            } else if (!that.state.hasMore && that.state.authors.length >= 20) {
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
