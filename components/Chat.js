import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text} from 'react-native';
import { GiftedChat, Bubble, SystemMessage, InputToolbar } from 'react-native-gifted-chat' // UI for chat  features
import firebase from 'firebase';
import firestore from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage'; // local asyncstorage for android, ios
import NetInfo from '@react-native-community/netinfo';

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
      },
      isConnected:'' // user online or offline status
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

  // gets the message from local aynscstorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // to save the message to local asyncstorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages in localasyncstorage, useful while dev or testing
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
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
  //this.deleteMessages();
    // check if user is online or offline usinf NetInfo
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
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
      } else {
          console.log('offline');
          // to fetch from local asyncstorage
          this.getMessages();
        }
      this.setState({isConnected:connection.isConnected});
    });
  }

  componentWillUnmount() {
    if(this.state.isConnected){
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribe();
    }
  }

  // triggered while sending msges
  onSend(messages = []) {
   this.setState(previousState => ({
     messages: GiftedChat.append(previousState.messages, messages),
   }),
   () => {
     //add messages collection to firebase, if online
     this.state.isConnected && this.addMessages();
     this.saveMessages(); // save messages to localasyncstorage
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

  // disable input message text field when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages} // msg to be displayed 
          onSend={messages => this.onSend(messages)}
          user={{ 
            _id: this.state.uid,
            name: uname,
            avatar:this.state.avatar
          }} // user who sends msgs
        />
      {/* console.log(this.state.messages) */}
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