import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { formatTimestampToString, countCompletedItems } from '@/hooks/utils';
import { AntDesign } from '@expo/vector-icons';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import completeItem from '@/hooks/completeItem';
import { Constants } from '@/constants/Strings';

interface Props {
    prop: {
        type: string,
        hrefPath: string | undefined,
        item: Level | Movement | SubMovement | SubSubMovement,
        subItems: Level[] | Movement[] | SubMovement[] | SubSubMovement[] | undefined,
        collectionRef: CollectionReference<DocumentData, DocumentData> | undefined
    }
} 

const CareerItem = ({ prop }: Props) => {
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    let subItemsLabel = "Sequenze";
    if (prop.type === 'movements') {
        subItemsLabel = "Movimenti";
    } else if (prop.type === "submovements"){
        subItemsLabel = "Sequenze";
    } else if (prop.type === "subsubmovements") {
        subItemsLabel = "Sotto Sequenze";
    }

    const itemsCloned = prop['subItems'];
    const item = prop['item'];

    // Inverti lo stato di isChecked
    const toggleCheck = async () => {
        // Inverti lo stato di isChecked
        await completeItem({collectionRef: prop['collectionRef']!, item: item})
        setIsChecked(!isChecked);
    };

    return (
        <View key={item.id}>
            <View style={defaultStyles.constainerRow}>
                {itemsCloned ? (
                <View style={[defaultStyles.constainerRow, { flex: 1, padding: 24}]}>
                    <View style={{backgroundColor: 'yellow'}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.label}</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
                    <Text>Attivazione: {item.activationDate ? formatTimestampToString(item.activationDate) : '--/--/----'}</Text>
                    <Text>Completamento: {item.completionDate ? formatTimestampToString(item.completionDate) : '--/--/----'}</Text>
                    <Text>{subItemsLabel} completate: {countCompletedItems(itemsCloned)}/{itemsCloned.length}</Text>
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
                    </View>
                    <View style={{backgroundColor: 'yellow'}}>
                        <TouchableOpacity disabled={item['status'] === Constants.Completed} onPress={toggleCheck}>
                            {isChecked || item['status'] === Constants.Completed ? (
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
