import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFFFF'
    },
    constainerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor: '#FDFFFF',
    },
    inputField: {
        height:44,
        borderWidth:1,
        borderColor: '#ABABAB',
        borderRadius:8,
        padding: 10,
        backgroundColor: '#fff',
    },
    btn:{
        backgroundColor: theme.colors.primary,
        height: 50,
        borderRadius:8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'rale-b'
    },
    btnIcon: {
        position:'absolute',
        left:16
    },
    footer: {
        position:'absolute',
        height: 100,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:'#fff',
        paddingVertical: 10,
        paddingHorizontal:20,
        borderTopColor: Colors.grey,
        borderTopWidth: StyleSheet.hairlineWidth
    }
})