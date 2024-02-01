import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement } from '@/models/Models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countCompletedItems, countInProgressItems, formatTimestampToString } from '@/hooks/utils';

const Pages = () => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData: Level[] = JSON.parse(userData);
          // Trova l'oggetto Level con la label corrispondente
          const targetLevel = parsedUserData.find((item) => item.label === level);
          if (targetLevel) {
            // Se l'oggetto Level è stato trovato, imposta i suoi movimenti nello stato
            setMovements(targetLevel.movements);
          } else {
            console.log('Nessun livello trovato con la label specificata.');
          }
        } else {
          console.log('Nessun dato utente trovato nello storage.');
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente dallo storage:', error);
      }
    };

    fetchMovements();
  }, [level]);

  return (
    <ScrollView>
      <Text>Movimenti per il livello {level}</Text>
      {movements.length > 0 ? (
        movements.map((movement, index) => (
          <View key={index}>
            <Link href={{ pathname: "/listing/submovements", params: { movement: movement.label }}} >
                <Text>{movement.label}{movement.subMovements ? ' >' : ''}</Text>
            </Link>
            <Text>Dettagli del movimento:</Text>
            <View style={{ marginLeft: 20 }}>
              <Text>- Data Attivazione: {movement.activationDate ? formatTimestampToString(movement.activationDate) : '--/--/----'}</Text>
              <Text>- Data Completamento: {movement.completionDate ? formatTimestampToString(movement.completionDate) : '--/--/----'}</Text>
            </View>
            {movement.subMovements && (
              <View style={{ marginLeft: 20 }}>
                <Text>- Percentuale Progresso: {movement.completionPercentage}</Text>
                <Text>- Sequenze completate: {countCompletedItems(movement.subMovements)}/{movement.subMovements.length}</Text>
                <Text>- Sequenze in progress: {countInProgressItems(movement.subMovements)}/{movement.subMovements.length}</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>Nessun movimento trovato per questo livello.</Text>
      )}
    </ScrollView>
  );
}

export default Pages;
