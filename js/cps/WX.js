import React, { Component } from 'react';
import { View, WebView } from 'react-native';
import { Progress } from 'antd-mobile-rn';


export default class WX extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  })

  constructor(props: any) {
    super(props);
    const { navigation } = this.props
    const wx = navigation.getParam('wx')
    this.state = {
      wx: wx,
      scrollEnabled: true,
    };
    this.props.navigation.setParams({title: wx.author.nickname || ''})
  }

  componentWillMount() {
    this._gestureHandlers = {
      onStartShouldSetResponder: () => true,
      onResponderGrant: () => {
            this.setState({ scrollEnabled: true });
      },
      onResponderTerminate: () => {
            this.setState({ scrollEnabled: false });
      }
    }
  }

  render() {
    const that = this
    var obj = this.state.wx
    return (
      <View style={{flex: 1}}>
        <WebView
          originWhitelist={['*']}
          bounces={false}
          source={{uri: obj.article.content_url}}
          scrollEnabled={this.state.scrollEnabled}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => {
            that.setState({ scrollEnabled: true })
          }}
          onResponderTerminate={() => {
            that.setState({ scrollEnabled: false })
          }}
        />
      </View>
    )
  };
}
