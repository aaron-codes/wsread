import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';

export default class WXItem extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      textWidth: Dimensions.get('window').width - 20 - 10 - 40,
      wx: this.props.wx.item,
    };
  }

  onWXPress = () => {
    this.props.navigation.navigate('WX', {wx: this.state.wx})
  }

  onAuthor = () => {
    this.props.navigation.navigate('Author', {authorId: this.state.wx.author._id['$oid']})
  }

  render() {
    var obj = this.state.wx
    return (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10, backgroundColor: '#fff'}}>
        <TouchableWithoutFeedback onPress={this.onAuthor}>
          <View>
            <Image source={{uri: obj.author.headimg, cache: 'force-cache'}} style={{width: 40, height: 40, borderRadius: 4}} resizeMethod='resize'/>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onWXPress}>
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: '900', color: '#B8B7B7', letterSpacing: 0.2, paddingBottom: 5, fontSize: 14}}>
              {obj.author.nickname}
            </Text>
            <Text style={{color: '#000000a6', fontSize: 14, letterSpacing: 0.2, paddingTop: 1, marginBottom: 0, fontWeight: '900', width: this.state.textWidth}} numberOfLines={1} ellipsizeMode='tail'>
              {obj.article.title}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  };
}
