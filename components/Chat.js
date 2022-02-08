import React from 'react';
import { StyleSheet, View, Text} from 'react-native';


export default class Chat extends React.Component {
  render() {
    // receive the navigation props
    //let uname = this.props.route.params.uname;
    let {uname, bgcolor} = this.props.route.params;
    this.props.navigation.setOptions( { title: uname });
    return (
      <View style={[styles.container, { backgroundColor: bgcolor }]}>
        <Text style={styles.normalText}>Hello Screen2!</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  normalText: {
    fontSize:16,
    fontWeight:'300',
    color:'#fff',
    opacity:100
  },
  boldText: {
    fontWeight:'600',
    color: '#fff'
  }

});