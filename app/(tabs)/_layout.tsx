import { MaterialIcons } from '@expo/vector-icons';import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarLabelStyle: {
          fontFamily: "rale-sb"
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="carriera"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="trophy" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
              name="profilo"
              options={{
                title: 'Profilo',
                tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-alt" size={size} color={color} />,
              }}
            />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
});
