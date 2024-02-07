import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, Movement } from '@/models/Models';
import { formatTimestampToString } from '@/hooks/utils';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import getItemById from '@/hooks/repositories/getter';

const Pages = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItemById(id, FIREBASE_AUTH.currentUser!.uid, 'level');
        if (data && 'movements' in data) {
          const level = data as Level;
          console.log(level.movements)
          setMovements(level.movements || []);
        } else {
          console.error('Nessun movimento trovato per l\'ID specificato.');
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati della carriera dell\'utente:', error);
      }
    };
  
    fetchData();
  }, [id]);

  return (
    <ScrollView>
      <Text>Movimenti per il livello {id}</Text>
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
