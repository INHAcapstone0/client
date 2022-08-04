import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

export default class CustomButton extends Component {
  static defaultProps = {
    title: '',
    onPress: () => null,
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.title == 'NaverIcon') {
      return (
        <TouchableOpacity>
          <Image
            style={styles.socialIconButton}
            source={require('../resources/icons/NaverIcon.png')}
          />
        </TouchableOpacity>
      );
    } else if (this.props.title == 'KakaoIcon') {
      return (
        <TouchableOpacity>
          <Image
            style={styles.socialIconButton}
            source={require('../resources/icons/KakaoIcon.png')}
          />
        </TouchableOpacity>
      );
    } else if (this.props.title == 'AppleIcon') {
      return (
        <TouchableOpacity>
          <Image
            style={styles.socialIconButton}
            source={require('../resources/icons/AppleIcon.png')}
          />
        </TouchableOpacity>
      );
    } else if (this.props.title == '로그인') {
      return (
        <TouchableOpacity
          style={styles.textButton}
          onPress={this.props.onPress}>
          <Text style={styles.buttonTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    } else if (this.props.title == '회원가입') {
      console.log('회원가입');
      return (
        <TouchableOpacity
          style={styles.textButton}
          onPress={this.props.onPress}>
          <Text style={styles.buttonTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.buttonTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    }
  }
}
const styles = StyleSheet.create({
  textButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4D483D',
    width: 207,
    height: 56,
    borderRadius: 100,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
  },
  socialIconButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 10,
    marginRight: 10,
  },
});
