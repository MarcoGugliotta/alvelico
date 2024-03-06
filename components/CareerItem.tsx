import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { formatTimestampToString } from '@/hooks/utils';
import { AntDesign } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import completeItem from '@/hooks/completeItem';
import activeItem from '@/hooks/activeItem';

interface Props {
  prop: {
    type: string,
    hrefPath: string | undefined,
    itemRefPath: string,
    onOpenBottomSheet: (item: Movement | null) => void
  };
}

const CareerItem = ({ prop }: Props) => {
  const [isCheckedComplete, setIsCheckedComplete] = useState(false);
  const [isCheckedInProg, setIsCheckedInProg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Level | Movement | SubMovement | SubSubMovement | null>(null);
  const [board, setBoard] = useState<string | null>(null);
  const [sail, setSail] = useState<string | null>(null);

  let subItemsLabel = "Sequenze";
  if (prop.type === 'movements') {
    subItemsLabel = "Movimenti";
  } else if (prop.type === "submovements") {
    subItemsLabel = "Sequenze";
  } else if (prop.type === "subsubmovements") {
    subItemsLabel = "Sotto Sequenze";
  }

  useEffect(() => {
    if (FIREBASE_AUTH.currentUser  && prop.itemRefPath) {
      const unsubscribe = onSnapshot(doc(FIREBASE_DB, prop.itemRefPath), async snapshot => {
        const itemData = snapshot.data() as Level | Movement | SubMovement | SubSubMovement;
        itemData!.id = snapshot.id;
        setItem(itemData);
        if(prop.type === "submovements"){
          const movement = itemData as Movement;
          setBoard(movement.board!);
          setSail(movement.sail!);
        }

      });

      return () => unsubscribe();
    }
  }, []);

  const toggleCheckComplete = async () => {
    await completeItem({ ref: prop.itemRefPath})
    setIsCheckedComplete(!isCheckedComplete);
  };

  const toggleCheckInProg = async (item: Level | Movement | SubMovement | SubSubMovement) => {
    //await activeItem({ ref: prop.itemRefPath})
    //setIsCheckedInProg(!isCheckedInProg);
    prop.onOpenBottomSheet(item as Movement);
  };

  return (
    <>
      {item && (
        <View key={item.id}>
            <View style={defaultStyles.constainerRow}>
                {item.hasSubItems ? (
                <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24}]}>
                    <View style={{backgroundColor: 'yellow'}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item!.label}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item!.activationDate ? formatTimestampToString(item!.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item!.completionDate ? formatTimestampToString(item!.completionDate) : '--/--/----'}</Text>
                        <Text>{subItemsLabel} completate: {item.numSubItemsCompleted}/{item.numSubItems}</Text>
                        <Text>Punti: {item!.points}</Text>
                        <Text style={{color: 'red'}}>{item!.status}</Text>
                        {prop.type === "submovements" && (
                          <>
                          <Text>Tavola: {board}</Text>
                          <Text>Vela: {sail}</Text>
                          </>
                        )}
                        {/*<Text>- {subItemsLabel} in progress: {countInProgressItems(itemsCloned)}/{itemsCloned.length}</Text>*/}
                    </View>
                    <View style={{backgroundColor: 'yellow'}}>
                        <Text style={{ fontSize: 30 }}>{item!.completionPercentage}%</Text>
                        <Link style={{ fontSize: 38 }} href={{ ...( { pathname: `/listing/${prop['hrefPath']}/${item.id}`, params: { item: JSON.stringify(item.ref)} } as any) }}>{`>`}</Link>
                    </View>
                </View>
                ) : 
                <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24 }]}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{item!.label}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item!.activationDate ? formatTimestampToString(item!.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item!.completionDate ? formatTimestampToString(item!.completionDate) : '--/--/----'}</Text>
                        <Text>Punti: {item!.points}</Text>
                        <Text style={{color: 'red'}}>{item!.status}</Text>
                        {prop.type === "submovements" && (
                          <>
                          <Text>Tavola: {board}</Text>
                          <Text>Vela: {sail}</Text>
                          </>
                        )}
                    </View>
                    <View style={{backgroundColor: 'yellow', gap:20}}>
                        <Text>Completa</Text>
                        <TouchableOpacity disabled={item!.status === Constants.Completed || item!.status === Constants.NotActive} onPress={toggleCheckComplete}>
                            {isCheckedComplete || item!.status === Constants.Completed || item!.status === Constants.NotActive ? (
                                <AntDesign name="checkcircle" size={24} color="grey" />
                            ) : (
                                <AntDesign name="checkcircleo" size={24} color="black" />
                            )}
                        </TouchableOpacity>
                        <Text>Attiva</Text>
                        <TouchableOpacity disabled={item!.status === Constants.InProgress || item!.status === Constants.Completed} onPress={() => toggleCheckInProg(item!)}>
                            {isCheckedInProg || item!.status === Constants.InProgress || item!.status === Constants.Completed ? (
                                <AntDesign name="checkcircle" size={24} color="grey" />
                            ) : (
                                <AntDesign name="checkcircleo" size={24} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                }
            </View>
        </View>
      )}
    </>
  );
};

export default CareerItem;
