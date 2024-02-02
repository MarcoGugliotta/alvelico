import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Level, SubSubMovement } from '@/models/Models';
import { formatTimestampToString } from '@/hooks/utils';

const Pages = () => {
  const { movement, subMovement } = useLocalSearchParams<{ movement: string, subMovement: string }>();
  const [subSubMovements, setSubSubMovements] = useState<SubSubMovement[]>([]);

  useEffect(() => {
    const fetchSubSubMovements = async () => {
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
              // Trova il sottomovimento all'interno del movimento
              const targetSubMovement = targetMovement.subMovements.find((sm) => sm.label === subMovement
              );
              if (targetSubMovement && targetSubMovement.subSubMovements) {
                // Se ci sono sottosottomovimenti, imposta i sottosottomovimenti nello stato
                setSubSubMovements(targetSubMovement.subSubMovements);
              } else {
                console.log('Nessun sottosottomovimento trovato per il sottomovimento specificato.');
              }
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

    fetchSubSubMovements();
  }, [movement]);

  return (
    <View>
      <Text>Sotto sequenze per la sequenza {subMovement}</Text>
      {subSubMovements.length > 0 ? (
        subSubMovements.map((subSubMovement, index) => (
          <View key={index}>
            <Text>{subSubMovement.label}</Text>
            <Text>Dettaglio della sotto sequenza:</Text>
              <View style={{ marginLeft: 20 }}>
                <Text>- Data Attivazione: {subSubMovement.activationDate ? formatTimestampToString(subSubMovement.activationDate) : '--/--/----'}</Text>
                <Text>- Data Completamento: {subSubMovement.completionDate ? formatTimestampToString(subSubMovement.completionDate) : '--/--/----'}</Text>
              </View>
          </View>
        ))
      ) : (
        <Text>Nessun sottosottomovimento trovato per questo movimento.</Text>
      )}
    </View>
  );
}

export default Pages;
