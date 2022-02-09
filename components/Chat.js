import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text} from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat' // UI for chat  features
import firebase from 'firebase';
import firestore from 'firebase';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKR6XnilctcwIrBEpOYXUjAEVed3wgmno",
  authDomain: "chatapp-ea9c4.firebaseapp.com",
  projectId: "chatapp-ea9c4",
  storageBucket: "chatapp-ea9c4.appspot.com",
  messagingSenderId: "1004075727820",
  appId: "1:1004075727820:web:85590a5c513d73418a3b69"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0, //authenticated anonymous user id
      loggedInText: 'Please wait, while being authenticated... ',
      user:{
        _id:'', //same uid will be set to this field
        name:'', // name from the home screen
        avatar:'' // random pick of avatar placeholder img
      }
    }
    //establish firebase connection
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    
    //reference to chat messages collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  // triggered whenever there is a change in message collection onsnapShot() listens for changes
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
       _id: data._id,
       text: data.text,
       createdAt: data.createdAt.toDate(),
       user: data.user,
      });
    });
    this.setState({ 
      messages: messages
   });
  }

  // called from onSend() when Send button is pressed
  addMessages() { 
    const message = this.state.messages[0];
    // add a new message to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user
    });
  }

  
  componentDidMount() {
    /* dummy message
    // set the state variable (message - each msg should have id, creation date and user object)
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
   */
  // listen for update in message collection
  this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
   // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages:[],
        user: {
          _id: user.uid,
          name: this.props.route.params.uname,
          avatar: 'https://placeimg.com/140/140/any',
        }
      });

    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  // triggered while sending msges
  onSend(messages = []) {
   this.setState(previousState => ({
     messages: GiftedChat.append(previousState.messages, messages),
   }),
   () => {
     //add messages collection to firebase
     this.addMessages();
   })
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

  // customizes system messages
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: "#fff",
        }}
      />
    );
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
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          messages={this.state.messages} // msg to be displayed 
          onSend={messages => this.onSend(messages)}
          user={{ 
            _id: this.state.uid,
            name: uname,
            avatar:this.state.avatar
          }} // user who sends msgs
        />
      { console.log(this.state.messages)}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
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