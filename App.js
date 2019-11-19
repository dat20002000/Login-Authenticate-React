import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import PropTypes from 'prop-types'
import {Ionicons, FontAwesome, Entypo} from '@expo/vector-icons';
import Header from './components/Header';
import Card from './components/Card';
import Score from './components/Score';


export default class App extends React.Component {

  static propTypes = {
    value: PropTypes.string,
  };

  render() {
    const {
      value,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text>Enter: </Text>
        <TextInput value={value} style={styles.textInput}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 50,
  },
  textInput: {
    backgroundColor: '#48484D',
    height: 50,
    color: '#fff',
  }
})
