import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,TextInput, Button, Alert } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




const AppStack = createNativeStackNavigator();
const loggedInStates={
  NOT_LOGGED_IN:'NOT_LOGGED_IN',
  LOGGED_IN:'LOGGED_IN',
  LOGGING_IN:'LOGGING_IN'
}

const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [loggedInState,setLoggedInState] = React.useState(loggedInStates.NOT_LOGGED_IN);
  const [phoneNumber,setPhoneNumber] = React.useState("");
  const [oneTimePassword, setOneTimePassword] = React.useState("");
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);

   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if(loggedInState==loggedInStates.LOGGED_IN){
    return <Navigation/>
  } else if(loggedInState==loggedInStates.NOT_LOGGED_IN){
    return (
      <View>
        <TextInput 
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}  
          placeholderTextColor='#4251f5' 
          placeholder='Cell Phone'>          
        </TextInput>
        <Button
          title='Send'
          style={styles.button}
          onPress={async ()=>{
            console.log(phoneNumber+' Button was pressed')

            await fetch(
              'https://dev.stedi.me/twofactorlogin/'+phoneNumber,
              {
                method:'POST',
                headers:{
                 'content-type':'application/text'
               }
              }
            )
            setLoggedInState(loggedInStates.LOGGING_IN);
          }}
        />        
      </View>
    )
  } else if(loggedInState==loggedInStates.LOGGING_IN){
    return (
      <View>
      <TextInput 
        value={oneTimePassword}
        onChangeText={setOneTimePassword}
        style={styles.input}  
        placeholderTextColor='#4251f5' 
        placeholder='One Time Password'   
        keyboardType='numeric'>
      </TextInput>
      <Button
          title='Login'
          style={styles.button}
          onPress={async ()=>{
            console.log(phoneNumber+' Button was pressed')

            const loginResponse=await fetch(
              'https://dev.stedi.me/twofactorlogin',
              {
                method:'POST',
                headers:{
                 'content-type':'application/text'
                },
                body:JSON.stringify({
                  phoneNumber,
                  oneTimePassword
                }
                )
              }
            )
            if(loginResponse.status==200){//200 means the password was valid
              setLoggedInState(loggedInStates.LOGGED_IN);
              const sessionToken = await loginResponse.text();
              await AsyncStorage.setItem('sessionToken',sessionToken);
            } else{
              console.log('response status',loginReponse.status);
              Alert.alert('Invalid','Invalid Login information')
              setLoggedInState(NOT_LOGGED_IN);
            }
          }}
        />        

      </View>
    )
  }
}
 export default App;

 
 const styles = StyleSheet.create({
     container:{
         flex:1, 
         alignItems:'center',
         justifyContent: 'center'
     },
     input: {
       height: 40,
       marginTop: 50,
       borderWidth: 1,
       padding: 10,
     },
     margin:{
       marginTop:100
     },
     button: {
       alignItems: "center",
       backgroundColor: "#DDDDDD",
       padding: 10
     }    
 })
