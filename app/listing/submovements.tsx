import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, SubMovement } from '@/models/Models';

const Pages = () => {
  const { movement } = useLocalSearchParams<{ movement: string }>();
  const [subMovements, setSubMovements] = useState<SubMovement[]>([]);

  useEffect(() => {
    const fetchSubMovements = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData: Level[] = JSON.parse(userData);
          // Trova l'oggetto Level con il movimento corrispondente
          const targetLevel = parsedUserData.find((item) => item.movements?.some((m) => m.label === movement));
          if (targetLevel && targetLevel.movements) {
            // Trova il movimento all'interno dell'oggetto Level
            const targetMovement = targetLevel.movements.find((m) => m.label === movement);
            if (targetMovement && targetMovement.subMovements) {
              // Se ci sono sottomovimenti, imposta i sottomovimenti nello stato
              setSubMovements(targetMovement.subMovements);
            } else {
              console.log('Nessun sottomovimento trovato per il movimento specificato.');
            }
          } else {
            console.log('Nessun livello trovato con il movimento specificato.');
          }
        } else {
          console.log('Nessun dato utente trovato nello storage.');
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente dallo storage:', error);
      }
    };

    fetchSubMovements();
  }, [movement]);

  return (
    <View>
      <Text>Sottomovimenti per il movimento {movement}</Text>
      {subMovements.length > 0 ? (
        subMovements.map((subMovement, index) => (
          <View key={index}>
              <Link href={{ pathname: "/listing/subsubmovements", params: { movement: movement, subMovement: subMovement.label }}} >
                <Text>{subMovement.label}{subMovement.subSubMovements ? ' >' : ''}</Text>
              </Link>
          </View>
        ))
      ) : (
        <Text>Nessun sottomovimento trovato per questo movimento.</Text>
      )}
    </View>
  );
}

export default Pages;
