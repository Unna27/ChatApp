import React from 'react';
import { ImageBackground, View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import image from '../assets/Background Image.png';

export default class Home extends React.Component {
  constructor(props) {
   super(props);
   this.state = { 
      uname: '',
      bgcolor: 'red' 
    };
  }
 
  render() {

    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.box1}>
            <Text style={[styles.boldText, styles.title]}>Chat App</Text>
          </View>
          <View style={styles.box2}>
            <TextInput
              style={[styles.normalText, styles.uname]}
              onChangeText={(text) => this.setState({uname: text})}
              value={this.state.uname}
              placeholder='Your Name'
            />
            <Text style={styles.normalText}>Choose Background Color</Text>
            <View style={styles.buttonStyleContainer}>
              <Button
                buttonStyle={[styles.round, {backgroundColor:'#090C08'}]}
                title=""
                onPress={() => {this.setState({bgcolor: '#090C08'})}}
              />
              <Button
                buttonStyle={[styles.round, {backgroundColor:'#474056'}]}
                title=""
                onPress={() => {this.setState({bgcolor: '#474056'})}}
              />
              <Button
                buttonStyle={[styles.round, {backgroundColor:'#8A95A5'}]}
                title=""
                onPress={() => {this.setState({bgcolor: '#8A95A5'})}}
              />
              <Button
                buttonStyle={[styles.round, {backgroundColor:'#B9C6AE'}]}
                title=""
                onPress={() => {this.setState({bgcolor: '#B9C6AE'})}}
              />
            </View>
            <Button
              buttonStyle={styles.chatButton}
              title="Start Chatting"
              onPress={() => this.props.navigation.navigate('Chat', { uname: this.state.uname, bgcolor: this.state.bgcolor })}
            />
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image:{
    flex:1,
    justifyContent:'center',
    resizeMode:'cover'
  },
  box1: {
    flex:64,    
  },
  box2: {
    flex:44,
    padding: 10,
    margin:20,
    borderColor:'gray',
    borderWidth:1,
    justifyContent:'space-evenly',
    backgroundColor:'#fff'
  },
  normalText: {
    fontSize:16,
    fontWeight:'300',
    color:'#757083',
    opacity:100
  },
  boldText: {
    fontWeight:'600',
    color: '#fff'
  },
  title: {
    alignSelf: 'center',
    textAlignVertical:'top',
    marginTop: 50,
    letterSpacing: 2,
    fontSize:45,
  },
  uname: {
    opacity:50,
    height: 50,
    borderColor: 'gray',
    borderWidth:1,
    alignSelf: 'stretch',
    padding:5,
    margin:5
  },
  buttonStyleContainer: {
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  round: {
    height:50,
    width: 50,
    borderRadius:25
  },
  chatButton: {
    fontSize:16,
    fontWeight:'600',
    color:'#fff',
    backgroundColor:'#757083',
    height:50,
    alignSelf: 'stretch',
    padding:5,
    margin:5,
  }
});