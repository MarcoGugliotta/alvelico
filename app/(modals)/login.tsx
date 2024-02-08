import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { collection, doc } from 'firebase/firestore';
import createCareerForUser from '@/hooks/createCareerForUser';
import generateCareer from '@/hooks/generateCareer';


const Page = () => {
    const [name, setName] = useState({ value: '', error: '' });
    const [lastname, setLastname] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
        } catch (error: any) {
            alert('Sign In fallita: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email.value, password.value);
            alert('Controlla la tua email!');

            await generateCareer(response.user, name.value, lastname.value)
        } catch (error: any) {
            alert('Registrazione fallita: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signInWithGoogle = async () => {

    }

    const logout = async () => {
        setLoading(true);
        try {
            await auth.signOut();
            alert('Sign out successo: ' + auth.currentUser)
        } catch (error: any) {
            alert('Sign out fallita: ' + error.message)
        } finally {
            setLoading(false);
        }
    }
    
    return (
    <View style={styles.container}>
        <TextInput
            placeholder='Nome'
            returnKeyType="next"
            value={name.value}
            onChangeText={(text: string) => setName({ value: text, error: '' })}
            autoCapitalize="words"
            keyboardType="default"
            style={[defaultStyles.inputField, { marginVertical: 10 }]}
        />
        <TextInput
            placeholder='Cognome'
            returnKeyType="next"
            value={lastname.value}
            onChangeText={(text: string) => setLastname({ value: text, error: '' })}
            autoCapitalize="words"
            keyboardType="default"
            style={[defaultStyles.inputField, { marginVertical: 10 }]}
        />
        <TextInput
            placeholder='Email'
            returnKeyType="next"
            value={email.value}
            onChangeText={(text: string) => setEmail({ value: text, error: '' })}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={[defaultStyles.inputField, { marginVertical: 10 }]}
        />
        <TextInput
            placeholder='Password'
            returnKeyType="done"
            value={password.value}
            onChangeText={(text: string) => setPassword({ value: text, error: '' })}
            secureTextEntry
            autoCapitalize={'none'}
            style={[defaultStyles.inputField, { marginVertical: 10 }]}
        />

        <TouchableOpacity style={[defaultStyles.btn, {marginVertical:10}]} onPress={signUp}>
            <Text style={defaultStyles.btnText}>Continua</Text>
        </TouchableOpacity>

        <View style={styles.separatorView}>
            <View style={{
                flex:1,
                borderBottomColor:'#000',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}/>
            <Text style={styles.separator}>oppure</Text>
            <View style={{
                flex:1,
                borderBottomColor:'#000',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}/>
        </View>

        <View style={{gap:20}}>
            <TouchableOpacity style={styles.btnOutline} onPress={signIn}>
                <FontAwesome name="google" size={24} style={defaultStyles.btnIcon} color="black" />
                <Text style={styles.btnOutlineText}>Continua con Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline}>
                <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} color="black" />
                <Text style={styles.btnOutlineText}>Continua con Apple</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={{marginVertical:10}} onPress={logout}>
            <Text >logout</Text>
        </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        padding: 26
    },
    separatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical:30
    },
    separator: {
        fontFamily: 'rale-sb',
        color: Colors.grey
    },
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth:1,
        borderColor: 'grey',
        height: 50,
        borderRadius: 8,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    btnOutlineText: {
        color:'#000',
        fontSize: 16,
        fontFamily: 'rale-sb'
    }
})

export default Page
