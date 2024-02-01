import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const pages = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
    <View>
      <Text>pages</Text>
    </View>
  )
}

export default pages