/**
 * Sample React Native App
 *
 * SettingsScreen: Contains the application settings such as enable/disable push, Enable/disable location, add tags, add named user...
 */
'use strict';

import {
 UrbanAirship,
 UACustomEvent,
} from 'urbanairship-react-native'

import React, {
  Component,
} from 'react';

import {
  Text,
  View,
  Image,
  Switch,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';

import styles from './../Styles';

const notificationsEnabledKey = "com.urbanairship.notificationsEnabled"
const locationEnabledKey = "com.urbanairship.locationEnabled"

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsEnabled: false,
      locationEnabled: false,
      tags: [],
      tagText:"",
      namedUserText:"",
    }

    this.handleNotificationsEnabled = this.handleNotificationsEnabled.bind(this);
    this.handleLocationEnabled = this.handleLocationEnabled.bind(this);

    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagRemove = this.handleTagRemove.bind(this);
    this.handleUpdateTagText= this.handleUpdateTagText.bind(this);

    this.handleNamedUserSet = this.handleNamedUserSet.bind(this);
    this.handleUpdateNamedUserText = this.handleUpdateNamedUserText.bind(this);
    this.handleRenderNamedUser = this.handleRenderNamedUser.bind(this);
    this.handleMessageCenterDisplay = this.handleMessageCenterDisplay.bind(this);

    this.handleUpdateTagsList();
    this.handleUpdateNamedUser();
  }

  handleNotificationsEnabled(enabled) {
    UrbanAirship.setUserNotificationsEnabled(enabled)
    this.setState({notificationsEnabled:enabled});
  }

  handleLocationEnabled(enabled) {
    UrbanAirship.setLocationEnabled(enabled)
    this.setState({locationEnabled:enabled});
  }

  handleUpdateNamedUser () {
    UrbanAirship.getNamedUser().then((data) => {
         this.setState({
           namedUser: data,
         });
    });
  }

  handleNamedUserSet(text) {
    UrbanAirship.setNamedUser(text)
    this.handleUpdateNamedUser();
    this.setState({namedUserText:""})
  }

  handleRenderNamedUser(text) {
    if (text != null) {
      return (
          <Text>
            Named User: {this.state.namedUser}
          </Text>
        );
    } else {
      return null;
    }
  }

  handleUpdateNamedUserText(text) {
    this.setState({namedUserText:text})
  }

  handleUpdateTagsList () {
    UrbanAirship.getTags().then((data) => {
      this.setState({
        tags: data,
      });
    });
  }

  handleTagAdd(text) {
    UrbanAirship.addTag(text)
    this.handleUpdateTagsList();
    this.setState({tagText:""})
  }

  handleTagRemove(text) {
    UrbanAirship.removeTag(text)
    this.handleUpdateTagsList();
  }

  handleUpdateTagText(text) {
    this.setState({tagText:text})
  }

  handleMessageCenterDisplay() {
    UrbanAirship.displayMessageCenter()
  }

  componentDidMount() {
    UrbanAirship.isUserNotificationsEnabled().then ((enabled) => {
      this.setState({notificationsEnabled:enabled})
    })

    UrbanAirship.isLocationEnabled().then ((enabled) => {
      this.setState({locationEnabled:enabled})
    })

    UrbanAirship.addListener("notificationResponse", (response) => {
      console.log('notificationResponse:', JSON.stringify(response));
      alert("notificationResponse: " + response.notification.alert);
    });

    UrbanAirship.addListener("pushReceived", (notification) => {
      console.log('pushReceived:', JSON.stringify(notification));
      alert("pushReceived: " + notification.alert);
    });

    UrbanAirship.addListener("deepLink", (event) => {
      console.log('deepLink:', JSON.stringify(event));
      alert("deepLink: " + event.deepLink);
    });

    UrbanAirship.addListener("registration", (event) => {
      console.log('registration:', JSON.stringify(event));
      this.state.channelId = event.channelId;
      this.setState(this.state);
    });

    UrbanAirship.addListener("notificationOptInStatus", (event) => {
      console.log('notificationOptInStatus:', JSON.stringify(event));
    });
  }

  render() {

    return (
      <View style={styles.backgroundContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image
            style={{width: 300, height: 38, marginTop:50, alignItems:'center'}}
            source={require('./../img/urban-airship-sidebyside.png')}
          />
          <View style={{height:75}}>
            </View>
              <EnablePushCell
                notificationsEnabled={this.state.notificationsEnabled}
                handleNotificationsEnabled={this.handleNotificationsEnabled}
              />
            <View>
          </View>
          <NamedUserManagerCell
            namedUserText={this.state.namedUserText}
            handleNamedUserSet={this.handleNamedUserSet}
            handleUpdateNamedUserText={this.handleUpdateNamedUserText}
            handleRenderNamedUser={this.handleRenderNamedUser}
          />
          <TagsManagerCell
            tagText={this.state.tagText}
            tags={this.state.tags}
            handleTagAdd={this.handleTagAdd}
            handleTagRemove={this.handleTagRemove}
            handleUpdateTagText={this.handleUpdateTagText}
          />
          <EnableLocationCell
            locationEnabled={this.state.locationEnabled}
            handleLocationEnabled={this.handleLocationEnabled}
          />
          <Button
             color='#0d6a83'
             onPress={() => this.handleMessageCenterDisplay()}
             title="Message Center"
          />
        </ScrollView>
    </View>

    );
  }
}

class EnablePushCell extends Component {
  render() {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.rowLabel}>
          Enable Push
        </Text>
        <Switch
          trackColor={{true: "#0d6a83", false: null}}
          onValueChange={(value) => this.props.handleNotificationsEnabled(value)}
          value={this.props.notificationsEnabled}
        />
      </View>
    );
  }
}

class EnableLocationCell extends Component {
  render() {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.rowLabel}>
          Enable Location
        </Text>
        <Switch
          trackColor={{true: "#0d6a83", false: null}}
          onValueChange={(value) => this.props.handleLocationEnabled(value)}
          value={this.props.locationEnabled}
        />
      </View>
    );
  }
}

class NamedUserManagerCell extends Component {
  render() {
    return (
      <View style={styles.managerCell}>
        <View style={styles.stackRight}>
          <NamedUserInputCell
            namedUserText={this.props.namedUserText}
            handleNamedUserSet={this.props.handleNamedUserSet}
            handleUpdateNamedUserText={this.props.handleUpdateNamedUserText}
            handleRenderNamedUser={this.props.handleRenderNamedUser}
            placeholder={'named user'}
          />
          <Text style={{marginLeft:10, color:'#0d6a83'}}>
            {this.props.handleRenderNamedUser(this.props.namedUserText)}
          </Text>
        </View>
      </View>
    );
  }
}

class NamedUserInputCell extends Component {
  render () {
        return (
          <View style={styles.miniCellContainer}>
            <TextInput
              style={styles.textInput}
              autoCorrect={false}
              autoCapitalize={'none'}
              onSubmitEditing={(event) => this.props.handleNamedUserSet(this.props.namedUserText)}
              onChangeText={(text) => this.props.handleUpdateNamedUserText(text)}
              value={this.props.namedUserText}
            />
            <View style={styles.inputButton}>
               <Button
                 color='#0d6a83'
                 onPress={() => this.props.handleNamedUserSet(this.props.namedUserText)}
                 title="Set Named User"
               />
            </View>
          </View>
       );
    }
}

class TagsManagerCell extends Component {
  render() {
    return (
      <View style={styles.managerCell}>
        <View style={styles.stackRight}>
        <TagInputCell
          tagText={this.props.tagText}
          handleTagAdd={this.props.handleTagAdd}
          handleUpdateTagText={this.props.handleUpdateTagText}
          placeholder={'tag'}
        />
        <FlatList
          horizontal={true}
          data={this.props.tags}
          keyExtractor={(item, index) => item}
          renderItem={({item}) =>
            <View style={styles.cellContainer}>
              <Text style={{color:'#0d6a83'}}>
              {item}
              </Text>
              <View style={styles.circle}>
                <TouchableOpacity
                style={styles.circle}
                onPress={() => this.props.handleTagRemove(item)}
                title="-"
                />
                <View style = {styles.dash}/>
                </View>
              </View>
          }
        />
        </View>
      </View>
    );
  }
}

class TagInputCell extends Component {
  render () {
    return (
      <View style={styles.miniCellContainer}>
        <TextInput
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize={'none'}
          onSubmitEditing={(event) => this.props.handleTagAdd(event.nativeEvent.text)}
          onChangeText={(text) => this.props.handleUpdateTagText(text)}
          value={this.props.tagText}
        />
        <View style={styles.inputButton}>
          <Button
             color='#0d6a83'
             onPress={() => this.props.handleTagAdd(this.props.tagText || '')}
             title="Add Tag"
          />
       </View>
      </View>
    );
  }
}
