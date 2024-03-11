import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { formatTimestampToString, getBgStatusColor, getItemBorderColor, getLabelStatus } from '@/hooks/utils';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import completeItem from '@/hooks/completeItem';
import activeItem from '@/hooks/activeItem';
import { theme } from '@/theme/theme';
import { Button } from 'react-native-paper';

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

  const toggleCheckInProg = async () => {
    await activeItem({ ref: prop.itemRefPath})
    setIsCheckedInProg(!isCheckedInProg);
  };

  const toggleOpenBottomSheet = async (item: Level | Movement | SubMovement | SubSubMovement) => {
    prop.onOpenBottomSheet(item as Movement);
  };

  return (
    <>
        
      {item && (
            <View style={{flex: 1, alignItems: 'center'}}>
                {item.hasSubItems ? (
                <View style={[styles.container, {borderColor: getItemBorderColor(item.status)}]}>
                    <View style={styles.containerLabels}>
                    <View style={{flexDirection:'row'}}>
                          <Text style={styles.title}>{item!.label}</Text>
                          {item.status !== 'not_active' && prop.type === 'submovements' ? (
                            <TouchableOpacity onPress={() => toggleOpenBottomSheet(item)}>
                                <Entypo style={styles.btnBottomSheet} name="pencil" />
                            </TouchableOpacity>
                          ) : null}
                      </View>
                      {item.status !== Constants.NotActive ? ( 
                      <View style={{flex: 1, alignItems: 'flex-start'}}>
                        <View style={[styles.status, {backgroundColor: getBgStatusColor(item.status)}]}>
                          <Text style={styles.statusText}>{getLabelStatus(item.status)}</Text>
                          {item.status !== Constants.NotActive ? (
                          <Text style={styles.percentageText}>{item!.completionPercentage}%</Text>
                          ) 
                          : null}
                        </View>
                        {board !== '' && sail !=='' && prop.type === 'submovements' ? (
                          <View style={styles.boardSailContainer}>
                            <Text style={styles.boardSailText}>Tavola: {board} L - </Text>
                            <Text style={styles.boardSailText}>Vela: {sail}</Text>
                          </View>
                        ) : null}
                      </View>) : null}
                        {/*<Text>{item.numSubItems}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item!.activationDate ? formatTimestampToString(item!.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item!.completionDate ? formatTimestampToString(item!.completionDate) : '--/--/----'}</Text>
                        <Text>{subItemsLabel} completate: {item.numSubItemsCompleted}/{item.numSubItems}</Text>
                        <Text>Punti: {item!.points}</Text>
                        
                        {prop.type === "submovements" && (
                          <>
                          <Text>Tavola: {board}</Text>
                          <Text>Vela: {sail}</Text>
                          </>
                        )}
                        <Text>- {subItemsLabel} in progress: {countInProgressItems(itemsCloned)}/{itemsCloned.length}</Text>*/}
                    </View>
                    <View style={styles.containerActions}>
                        <Link asChild href={{ ...( { 
                          pathname: `/listing/${prop['hrefPath']}/${item.id}`, 
                          params: { item: JSON.stringify(item.ref), itemLabel: item.label} } as any) }}>
                            <Pressable>
                              <Ionicons name="chevron-forward" style={styles.btnForwardStyle} />
                            </Pressable>
                        </Link>
                    </View>
                </View>
                ) : 
                <View style={[styles.container, {borderColor: getItemBorderColor(item.status)}]}>
                    <View style={styles.containerLabels}>
                      <View style={{flexDirection:'row'}}>
                          <Text style={styles.title}>{item!.label}</Text>
                          {item.status !== 'not_active' && prop.type === 'submovements' ? (
                            <TouchableOpacity onPress={() => toggleOpenBottomSheet(item)}>
                                <Entypo style={styles.btnBottomSheet} name="pencil" />
                            </TouchableOpacity>
                          ) : null}
                      </View>
                      {item.status !== Constants.NotActive ? ( 
                      <View style={{flex: 1, alignItems: 'flex-start'}}>
                          <View style={[styles.status, {backgroundColor: getBgStatusColor(item.status)}]}>
                            <Text style={styles.statusText}>{getLabelStatus(item.status)}</Text>
                          </View>
                        {board !== '' && sail !=='' && prop.type === 'submovements' ? (
                          <View style={styles.boardSailContainer}>
                            <Text style={styles.boardSailText}>Tavola: {board} L - </Text>
                            <Text style={styles.boardSailText}>Vela: {sail}</Text>
                          </View>
                        ) : null}
                      </View>) : null}
                        {/*<Text>{item.numSubItems}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item!.activationDate ? formatTimestampToString(item!.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item!.completionDate ? formatTimestampToString(item!.completionDate) : '--/--/----'}</Text>
                        <Text>{subItemsLabel} completate: {item.numSubItemsCompleted}/{item.numSubItems}</Text>
                        <Text>Punti: {item!.points}</Text>
                        
                        {prop.type === "submovements" && (
                          <>
                          <Text>Tavola: {board}</Text>
                          <Text>Vela: {sail}</Text>
                          </>
                        )}
                        <Text>- {subItemsLabel} in progress: {countInProgressItems(itemsCloned)}/{itemsCloned.length}</Text>*/}
                    </View>
                    <View>
                        {item.status === Constants.NotActive ? (
                            <Button style={styles.btnActive} mode="elevated" onPress={() => toggleCheckInProg()}>
                              <Text style={styles.btnActiveText}>ATTIVA!</Text>
                            </Button>
                        ) : item.status !== Constants.Completed ? (
                        <TouchableOpacity disabled={item!.status === Constants.Completed || item!.status === Constants.NotActive} onPress={toggleCheckComplete}>
                            <Entypo style={styles.btnComplete} name="circle" />
                        </TouchableOpacity>
                        ) : null}
                        
                    </View>
                </View>
                }
            </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: '#FDFFFF',
    marginVertical:10,
    marginHorizontal:15,
    borderRadius:16, 
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth:2,
    paddingVertical:24,
    paddingHorizontal:20
  },
  containerStatus:{
    flex:1,
    flexDirection: 'row',
    justifyContent:'center'
  },
  containerLabels:{
    flex:1,
    alignItems:'flex-start',
    gap:8
  },
  title: {
    fontSize: 20,
    fontFamily:'rale-b', 
    color: theme.colors.primary,
    marginRight: 8
  },
  containerActions: {
    flexDirection:'row',
    alignItems:'center', 
    justifyContent:'center',
    alignContent:'center',
    gap:20,
  },
  percentageText: {
    fontSize: 16, 
    fontFamily:'rale-b', 
    color: theme.colors.primary,
    paddingHorizontal: 8,
  },
  percentageLink: {
    fontSize: 38, 
    fontFamily:'rale-sb', 
    color: theme.colors.primary
  },
  boardSailText:{
    fontSize: 14, 
    fontFamily:'rale-b', 
    color: theme.colors.primary,
    marginVertical: 6
  },
  status: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
    paddingVertical:4,
  },
  statusText:{
    fontSize:16,
    fontFamily:'rale-b', 
    paddingHorizontal:8,
    color: theme.colors.primary
  },
  boardSailContainer:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'flex-start',
  },
  btnActive:{
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
  },
  btnActiveText: {
    fontSize:18,
    fontFamily:'rale-b',
    color: theme.colors.primary,
  },
  btnForwardStyle: {
    fontFamily:'rale-b',
    fontSize:30,
    color: theme.colors.primary
  },
  btnComplete:{
    fontSize: 28,
    color: theme.colors.primary
  },
  btnBottomSheet:{
    fontSize: 24,
    color:theme.colors.primary
  }
});


export default CareerItem;
