import React, {  } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Level } from '@/models/Models';
import { theme } from '@/theme/theme';
import { Constants } from '@/constants/Strings';

interface Props {
  prop: {
    item: Level,
    hrefPath: string | undefined,
  };
}

const LevelComponent = ({ prop }: Props) => {

  return (
        <>
        <View >
            <Text style={styles.title}>{prop.item!.label}</Text>
            <Text style={{color: 'red'}}>{prop.item!.status}</Text>
            {/*<Text style={{ fontSize: 15, fontWeight: 'bold' }}>Dettagli del Movimento:</Text>
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
            {prop.item!.status !== Constants.NotActive ? 
                (<><Text style={styles.percentageText}>{prop.item!.completionPercentage}%</Text>
                <Link style={styles.percentageLink} href={{ ...( {
                        pathname: `/listing/${prop['hrefPath']}/${prop.item!.id}`,
                        params: { item: JSON.stringify(prop.item!.ref)} } as any) }}>
                        {`>`}
                </Link></>) : null}
        </View>
        </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily:'rale-b', 
    color: theme.colors.primary
  },
  containerActions: {
    flexDirection:'row',
    alignItems:'center', 
    gap:20
  },
  percentageText: {
    fontSize: 30, 
    fontFamily:'rale-sb', 
    color: theme.colors.primary
  },
  percentageLink: {
    fontSize: 38, 
    color: theme.colors.primary
  }
});


export default LevelComponent;
