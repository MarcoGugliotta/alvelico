
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import WheelPicker from 'react-native-wheely';
import { defaultStyles } from '@/constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board, Movement, Sail } from '@/models/Models';

interface Props {
  movement: Movement,
  onItemsSelected: (movementToUodate: Movement) => void
}

type Ref = BottomSheet;

const BottomSheetCustom = forwardRef<Ref, Props>((props, ref) =>{
    const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
    const [selectedIndexBoard, setSelectedIndexBoard] = useState(0);
    const [selectedIndexSail, setSelectedIndexSail] = useState(0);
    const [boardPickerOption, setBoardPickerOption] = useState<string[] | null>(null);
    const [sailPickerOption, setSailPickerOption] = useState<string[] | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<string | null>('');
    const [selectedSail, setSelectedSail] = useState<string | null>('');
    
    useEffect(()=>{
      const fetchBoardAndSailsFromStorage = async () => {
        const boardsData = await AsyncStorage.getItem('boardsData');
        const sailsData = await AsyncStorage.getItem('sailsData');
        if(boardsData && sailsData){
          const boardsFromStorage = JSON.parse(boardsData!) as Board[];
          const boardsToRender: string[] = []; 
          boardsFromStorage.forEach((board) => {
            boardsToRender.push(board.literage!.toString())
          });
          const sailsFromStorage = JSON.parse(sailsData!) as Sail[];
          const sailsToRender: string[] = []; 
          sailsFromStorage.forEach((sail) =>{
            sailsToRender.push(sail.label)
          });
          setSailPickerOption(sailsToRender);
          setBoardPickerOption(boardsToRender);
        }
      }
      fetchBoardAndSailsFromStorage();
    }, [])

    useEffect(() => {
      const updatePicker = async () => {
        const boardsData = await AsyncStorage.getItem('boardsData');
        const sailsData = await AsyncStorage.getItem('sailsData');
        const boards = JSON.parse(boardsData!) as Board[];
        const sails = JSON.parse(sailsData!) as Sail[];
        let indexBoard = 0;
        let indexSail = 0;
        if(props.movement.board != '' && props.movement.sail != ''){
          boards.forEach(b => {
            if(b.literage.toString() === props.movement.board){
              indexBoard = b.id! - 1;
            }
          })
          sails.forEach(s => {
            if(s.label === props.movement.sail){
              indexSail = s.id! - 1;
            }
          })
          setSelectedIndexBoard(indexBoard);
          setSelectedIndexSail(indexSail);
          setSelectedBoard(props.movement.board!);
          setSelectedSail(props.movement.sail!);
        }else{
          setSelectedIndexBoard(indexBoard);
          setSelectedIndexSail(indexSail);
          setSelectedBoard(boards[0].literage.toString());
          setSelectedSail(sails[0].label);
        }
      }
      updatePicker();
    }, [props.movement])

    useEffect(() => {
      const updateSelectedItems = async () => {
        const boardsData = await AsyncStorage.getItem('boardsData');
        const sailsData = await AsyncStorage.getItem('sailsData');
        const boards = JSON.parse(boardsData!) as Board[];
        const sails = JSON.parse(sailsData!) as Sail[];
        boards.forEach(b => {
          if((b.id! - 1) === selectedIndexBoard){
            setSelectedBoard(b.literage.toString())
          }
        })
        sails.forEach(s => {
          if((s.id! - 1) === selectedIndexSail){
            setSelectedSail(s.label);
          }
        })
      }
      updateSelectedItems();
    }, [selectedIndexBoard, selectedIndexSail])

    // Handler per la selezione di tavola
    const handleChangingBoardPicker = (index: number) => {
      setSelectedBoard(boardPickerOption![index]); // Imposta il valore selezionato di tavola
      setSelectedIndexBoard(index); // Imposta l'indice selezionato
    }

    // Handler per la selezione di vela
    const handleChangingSailPicker = (index: number) => {
      setSelectedSail(sailPickerOption![index]); // Imposta il valore selezionato di vela
      setSelectedIndexSail(index); // Imposta l'indice selezionato
    }

    // Handler per il pulsante "Fatto!"
    const onSubmitItems = () => {
      // Passa la nuova mappa contenente solo i valori selezionati al genitore
      const movement = props.movement;
      movement.board = selectedBoard!;
      movement.sail = selectedSail!;
      props.onItemsSelected(movement);
    }
  
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={2}
        />
      ),
      []
    );

    return (
      <>
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          index={2}
          enablePanDownToClose
          handleIndicatorStyle={{backgroundColor: '#3c3c3c'}}
          backdropComponent={renderBackdrop}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={styles.container}>
            <View style={styles.titleContainer}>
              <Text>Seleziona Tavola e Vela per il moviemento </Text>
            </View>
            {boardPickerOption && sailPickerOption ? (            
              <View style={styles.contentContainer}>
                <View style={[styles.constainerRow, styles.firstRow]}>
                  <Text>Tavola</Text>
                  <WheelPicker
                    selectedIndex={selectedIndexBoard}
                    options={boardPickerOption!}
                    onChange={handleChangingBoardPicker}
                    visibleRest={1}
                  />
                </View>
                <View style={styles.constainerRow}>
                  <Text>Vela</Text>
                  <WheelPicker
                    selectedIndex={selectedIndexSail}
                    options={sailPickerOption!}
                    onChange={handleChangingSailPicker}
                    visibleRest={1}
                  />
                </View>
              </View>) : (<Text>Attendere...</Text>)}
              <TouchableOpacity style={[defaultStyles.btn, {marginHorizontal:24}]} onPress={() => onSubmitItems()}>
                <Text style={styles.footerText}>Fatto!</Text>
              </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 60
  },
  contentContainer: {
    flex: 1,
    justifyContent:'center',
  },
  constainerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical: 52,
  },
  titleContainer: {
    alignItems:'center',

  },
  firstRow: {
    marginBottom: 5, // Aggiungi un margine inferiore alla prima riga
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#1b3b6d',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
});

export default BottomSheetCustom;
