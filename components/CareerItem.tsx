import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { formatTimestampToString, countCompletedItems } from '@/hooks/utils';
import { AntDesign } from '@expo/vector-icons';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import completeItem from '@/hooks/completeItem';
import { Constants } from '@/constants/Strings';
import activeItem from '@/hooks/activeItem';

interface Props {
    prop: {
        type: string,
        hrefPath: string | undefined,
        item: Level | Movement | SubMovement | SubSubMovement,
        subItems: Level[] | Movement[] | SubMovement[] | SubSubMovement[] | undefined,
        collectionRef: CollectionReference<DocumentData, DocumentData> | undefined
    },
} 

const CareerItem = ({ prop }: Props) => {
    const [isCheckedComplete, setIsCheckedComplete] = useState(false);
    const [isCheckedInProg, setIsCheckedInProg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<Level | Movement | SubMovement | SubSubMovement>(prop['item']);
    const [subItems, setSubItems] = useState<Level[] | Movement[] | SubMovement[] | SubSubMovement[] | undefined>(prop['subItems'])
    let subItemsLabel = "Sequenze";
    if (prop.type === 'movements') {
        subItemsLabel = "Movimenti";
    } else if (prop.type === "submovements"){
        subItemsLabel = "Sequenze";
    } else if (prop.type === "subsubmovements") {
        subItemsLabel = "Sotto Sequenze";
    }

    useEffect(() => {
        setItem(prop.item);
        setSubItems(prop.subItems);
    }, [prop.item, prop.subItems]);

    const toggleCheckComplete = async () => {
        item.id = prop.item.id
        const itemRes = await completeItem({ collectionRef: prop.collectionRef!, item: item });
        setItem(itemRes!);
        setIsCheckedComplete(!isCheckedComplete);
    };

    const toggleCheckInProg = async () => {
        const itemRes = await activeItem({ collectionRef: prop.collectionRef!, item: item });
        setItem(itemRes!);
        setIsCheckedInProg(!isCheckedInProg);
    };

    return (
        <View key={item.id}>
            <View style={defaultStyles.constainerRow}>
                {subItems ? (
                <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24}]}>
                    <View style={{backgroundColor: 'yellow'}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.label}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item.activationDate ? formatTimestampToString(item.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item.completionDate ? formatTimestampToString(item.completionDate) : '--/--/----'}</Text>
                        <Text>{subItemsLabel} completate: {countCompletedItems(subItems)}/{subItems.length}</Text>
                        <Text>Punti: {item.points}</Text>
                        <Text style={{color: 'red'}}>{item.status}</Text>
                        {/*<Text>- {subItemsLabel} in progress: {countInProgressItems(itemsCloned)}/{itemsCloned.length}</Text>*/}
                    </View>
                    <View style={{backgroundColor: 'yellow'}}>
                        <Text style={{ fontSize: 30 }}>{item.completionPercentage}%</Text>
                        <Link style={{ fontSize: 38 }} href={{ ...( { pathname: `/listing/${prop['hrefPath']}/${item['id']}` } as any) }}>{`>`}</Link>
                    </View>
                </View>
                ) : 
                <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24 }]}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{item.label}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                        <Text>Attivazione: {item.activationDate ? formatTimestampToString(item.activationDate) : '--/--/----'}</Text>
                        <Text>Completamento: {item.completionDate ? formatTimestampToString(item.completionDate) : '--/--/----'}</Text>
                        <Text>Punti: {item.points}</Text>
                        <Text style={{color: 'red'}}>{item.status}</Text>
                    </View>
                    <View style={{backgroundColor: 'yellow', gap:20}}>
                        <Text>Completa</Text>
                        <TouchableOpacity disabled={item['status'] === Constants.Completed || item['status'] === Constants.NotActive} onPress={toggleCheckComplete}>
                            {isCheckedComplete || item['status'] === Constants.Completed || item['status'] === Constants.NotActive ? (
                                <AntDesign name="checkcircle" size={24} color="grey" />
                            ) : (
                                <AntDesign name="checkcircleo" size={24} color="black" />
                            )}
                        </TouchableOpacity>
                        <Text>Attiva</Text>
                        <TouchableOpacity disabled={item['status'] === Constants.InProgres || item['status'] === Constants.Completed} onPress={toggleCheckInProg}>
                            {isCheckedInProg || item['status'] === Constants.InProgres || item['status'] === Constants.Completed ? (
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
    );
};

export default CareerItem;
