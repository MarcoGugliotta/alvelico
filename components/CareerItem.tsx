import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { formatTimestampToString, countCompletedItems, countInProgressItems } from '@/hooks/utils';

interface Props {
    prop: {
        type: string,
        hrefPath: string | undefined,
        item: Level | Movement | SubMovement | SubSubMovement,
        subItems: Level[] | Movement[] | SubMovement[] | SubSubMovement[] | undefined,
    }
} 

const CareerItem = ({ prop }: Props) => {
  let subItemsLabel = "Sequenze";
  if (prop.type === 'movements') {
    subItemsLabel = "Movimenti";
  } else if (prop.type === "submovements"){
    subItemsLabel = "Sequenze";
  } else if (prop.type === "subsubmovements") {
    subItemsLabel = "Sotto Sequenze";
  }

  const itemsCloned = prop['subItems'];
  const item = prop['item']

  return (
    <View key={item.id}>
      <View style={defaultStyles.constainerRow}>
        {itemsCloned ? (
          <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24 }]}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.label}</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
              <Text>- Data Attivazione: {item.activationDate ? formatTimestampToString(item.activationDate) : '--/--/----'}</Text>
              <Text>- Data Completamento: {item.completionDate ? formatTimestampToString(item.completionDate) : '--/--/----'}</Text>
              <Text>- Percentuale Progresso: {item.completionPercentage}</Text>
              <Text>- {subItemsLabel} completate: {countCompletedItems(itemsCloned)}/{itemsCloned.length}</Text>
              <Text>- {subItemsLabel} in progress: {countInProgressItems(itemsCloned)}/{itemsCloned.length}</Text>
            </View>
            <View>
            <Link style={{ fontSize: 38 }} href={{ ...( { pathname: `/listing/${prop['hrefPath']}/${item['id']}` } as any) }}>{`>`}</Link>
            </View>
          </View>
        ) : <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 24 }}>{item.label}</Text>}
      </View>
    </View>
  );
};

export default CareerItem;
