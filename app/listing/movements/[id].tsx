import React, { useEffect, useRef, useState } from 'react';
import { Text, FlatList, View, ImageBackground, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import CareerItem from '@/components/CareerItem';
import fetchMovementsFromStorage from '@/hooks/fetchMovementsFromStorage';
import { ActivityIndicator } from 'react-native-paper';
import BottomSheetCustom from '@/components/BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import saveBoardAndSailSelection from '@/hooks/saveBoardAndSailSelection';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme/theme';

const Pages = () => {
  const { item, itemLabel } = useLocalSearchParams<{ item: string , itemLabel: string}>();
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [movementSelected, setMovementSelected] = useState<Movement | null>(null)
  const [loading, setLoading] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null);

  console.log(itemLabel)
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let movementsData = await fetchMovementsFromStorage(item);
          movementsData!.sort((a, b) => a.progressive - b.progressive);
          setMovements(movementsData!);
          setLoading(false);
        } else {
          console.error('Nessun utente autenticato.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati dei movimenti dell\'utente:', error);
        setLoading(false);
      }
    };
  
    fetchLevelData();
  }, []);

  const handleOpenBottomSheet = (item: Movement | null) => {
    setMovementSelected(item);
    bottomSheetRef.current?.expand();
    setMovementSelected(item);
    setIsOpenBottomSheet(true)
  }

  const handleBoardsAndSailsSelection = (movement: Movement) => {
    saveBoardAndSailSelection(movement);
    bottomSheetRef.current?.close();
  }

  return (
    <>
    <ImageBackground source={require('@/assets/bg_default.png')} style={styles.image}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <StatusBar style='dark'></StatusBar>
            <FlatList
              data={movements}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<Text>Nessun movimento trovato.</Text>}
              ListHeaderComponent={
                <View style={styles.headerContainer}>
                  <Text style={styles.headerPt1}>Livello:  </Text>
                  <Text style={styles.headerPt2}>{itemLabel}</Text>
                </View>
              }
              renderItem={({ item }) => (
                <CareerItem
                  prop={{
                    type: 'submovements',
                    hrefPath: 'submovements',
                    itemRefPath: item.ref!,
                    onOpenBottomSheet: handleOpenBottomSheet
                  }}
                />
                )}
                />
          {isOpenBottomSheet ? (<BottomSheetCustom  onItemsSelected={handleBoardsAndSailsSelection} ref={bottomSheetRef} movement={movementSelected!}></BottomSheetCustom>) : undefined}
        </>
      )}
      </ImageBackground>
    </>
  );
  
}

export default Pages;

const styles = StyleSheet.create({
  headerContainer: {
    flex:1,
    alignItems:'center',
    marginTop: 32,
    marginBottom: 10,
    marginHorizontal:20,
    flexDirection:'row',
  },
  headerPt1: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily:'rale-b',
    color: theme.colors.primary,
  },
  headerPt2: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily:'rale-b',
    color: theme.colors.primary,
    textTransform: 'uppercase'
  },
  image: {
    flex: 1,
    justifyContent:'center',
    resizeMode:'contain'
  }
})