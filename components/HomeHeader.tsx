import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Avatar } from 'react-native-paper'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'
import { Constants } from '@/constants/Strings'
import { Level, Movement, User } from '@/models/Models'
import { collection, onSnapshot, getDocs, doc } from 'firebase/firestore'
import { theme } from '@/theme/theme'

const HomeHeader = () => {
  const [nameUser, setNameUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pointsUser, setPointsUser] = useState<number | null>(null);
  const auth = FIREBASE_AUTH;
  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        setLoading(true);
        if (auth.currentUser) { // Verifica se auth.currentUser è diverso da null
          const q = doc(FIREBASE_DB, Constants.Users, auth.currentUser.uid); // Accedi direttamente a uid senza '!'
          const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const user = querySnapshot.data() as User;
            setNameUser(user.userName);
            setPointsUser(user.points);
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati dell\'utente:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCareerData();
  }, [auth.currentUser]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <View style={{gap: 10}}>
            <Text style={styles.titleHeader}>Ciao {nameUser}!</Text>
            <Text style={styles.subHeader}>Punti {pointsUser}!</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
              <Avatar.Image size={80} source={require('@/assets/avatar.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 130,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24
    },
    avatarBtn: {
        padding: 2,
    },
    titleHeader: {
        fontFamily:'rale-b',
        fontSize: 24,
        color: '#3d3d3d'
    },
    subHeader: {
      fontFamily:'rale-sb',
      fontSize: 20,
      color: '#3d3d3d'
    }
})

export default HomeHeader