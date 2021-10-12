/**
 * @format
 * @flow
 */

 import React from 'react';

 import { View, Alert } from 'react-native';

 type Action = {
    text: string,
    onPress: () => void
 }

 type Props = {
   title: string,
   message: string,
   actions: Action[]
 };

 const BasicAlert = (props: Props) => {
   const { title, message, actions } = props;
   return (
    <View>
      {
        Alert.alert(title,message,actions,{ cancelable: true })
      }
    </View>
   )
 };

 export default BasicAlert;
