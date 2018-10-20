import React, { PureComponent } from 'react';
import { ScrollView, View, Text, Dimensions, FlatList, ActivityIndicator, TouchableWithoutFeedback, Button } from 'react-native';
import {Toast } from 'antd-mobile-rn';

import AuthorWXItem from './AuthorWXItem'
import config from '../config'
import requests from '../requests'

export default class Author extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    const _author = navigation.state.params.author
    const real = navigation.state.params.real

    var headerRight = null
    var nickname = ''

    if (_author) {
      nickname = _author.nickname

      var _text = '订阅'
      if (_author.isSubscribed) {
        _text = '取消订阅'
      }

      if (real) {
        headerRight = (
          <TouchableWithoutFeedback onPress={real.onSubscribed}>
            <View style={{ width: 80, height: 28, marginRight: 10, borderRadius: 14, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#fff', fontSize: 12, fontWeight: '900'}}>{_text}</Text>
            </View>
          </TouchableWithoutFeedback>
        )
      }
    }

    if (headerRight) {
      return {
        title: nickname,
        headerRight: headerRight,
        headerBackTitle: ' ',
        headerTruncatedBackTitle: ' ',
      }
    }

    return {
      title: nickname,
      headerBackTitle: ' ',
      headerTruncatedBackTitle: ' ',
    }
  }

  constructor(props: any) {
    super(props);
    var _height = Dimensions.get('window').height

    const { navigation } = this.props
    const authorId = navigation.getParam('authorId')

    this.state = {
      tab: this.props.tab || '',
      subTab: this.props.subTab || '',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      loadingHeight: _height,
      authorId: authorId,
      author: null,
      wxs: [],
      firstLoading: true,
      loading: false,
      hasMore: true,
      refreshing: false,
      alertMsg: '~ 暂无数据 ~',
    };
  }

  componentDidMount() {
    this.fetchAuthor()
    this.fetchMore()
  }

  fetchAuthor = () => {
    const that = this
    requests.get(`${config.wxURL}/w/api/authors/${this.state.authorId}`).then((data) => {
      if (data && data.result.author) {
        this.setState({
          author: data.result.author,
        }, () => {
          that.props.navigation.setParams({
            author: that.state.author,
            real: that,
          })
        })
      }
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

  fetchMore = () => {
    if (!this.state.hasMore) {
      return
    }

    const that = this
    that.setState({
      loading: true,
    })

    var wxs = this.state.wxs
    var _ls = ''
    if (wxs.length > 0) {
      _ls = wxs[wxs.length - 1]['_id']['$oid']
    }

    requests.get(`${config.wxURL}/w/api/articles?_ls=${_ls}&_fmt=authorSimple&_page=author&_tab=author&_author_id=${this.state.authorId}`).then((data) => {
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

  }

  onSubscribed = () => {
    const that = this
    if (this.state.author) {
      if (this.state.author.isSubscribed) {
        requests.del(`${config.wxURL}/w/api/authors/${this.state.author['_id']['$oid']}/subscribe`).then((data) => {
          if (data && data.code == 200) {
            this.setState({
              author: data.result.author,
            })
            this.props.navigation.setParams({
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
            this.props.navigation.setParams({
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
    const that = this

    const _renderItem = (item) => {
      return (
        <AuthorWXItem
          {...this.props}
          wx={item}
        />
      )
    }

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <FlatList
          data={this.state.wxs}
          renderItem={_renderItem}
          keyExtractor={(item, idx) => `${idx} - ${item._id['$oid']}`}
          onEndReached={this.onEndReached}
          ListHeaderComponent={() => {
            const _author = this.state.author

            if (_author) {
              let profileDesc = () => {
                if (_author.profile_desc && _author.profile_desc.length > 0) {
                  return (
                    <Text style={{fontSize: 15, fontWeight: '900', color: '#B8B7B7'}}>{_author.profile_desc}</Text>
                  )
                }
                return null
              }

              let subscribed = () => {
                let _text = '订阅'
                if (_author.isSubscribed) {
                  _text = '取消订阅'
                }

                return (
                  <TouchableWithoutFeedback onPress={this.onSubscribed}>
                    <View style={{ width: 80, height: 24, borderRadius: 20, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: '#fff', fontSize: 12, fontWeight: '900'}}>{_text}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              }

              return (
                <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff', marginBottom: 1}}>
                  {profileDesc()}
                </View>
              )
            }
            return null
          }}
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
                <Button size="large" style={{marginTop: 20}} onClick={this.onTry}>刷新试试</Button>
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
