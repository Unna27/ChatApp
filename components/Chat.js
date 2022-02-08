import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat' // UI for chat  features


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  // set the state variable (message - each msg should have id, creation date and user object)
  componentDidMount() {
   this.setState({
     messages: [
       {
         _id: 1,
         text: 'Hello developer',
         createdAt: new Date(),
         user: {
           _id: 2,
           name: 'React Native',
           avatar: 'https://placeimg.com/140/140/any',
         },
       },
       // system message displayed top of all messages
       {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
     ],
   })
 }

// triggered while sending msges
 onSend(messages = []) {
   this.setState(previousState => ({
     messages: GiftedChat.append(previousState.messages, messages),
   }))
 }

// to change the backgorund color around msgs
renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000'
        }
      }}
    />
  )
}
  render() {
    // receive the navigation props
    //let uname = this.props.route.params.uname;
    let {uname, bgcolor} = this.props.route.params;
    this.props.navigation.setOptions( { title: uname });
    return (
      <View style={[styles.container, { backgroundColor: bgcolor}]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)} 
          messages={this.state.messages} // msg to be displayed 
          onSend={messages => this.onSend(messages)}
          user={{ 
            _id: 1,
            name: 'User1',
          }} // user who sends msgs
        />
      { console.log(this.state.messages)}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
 }
      </View>
      // <View style={[styles.container, { backgroundColor: bgcolor }]}>
      //   <Text style={styles.normalText}>Hello Screen2!</Text>
      //</View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }

});