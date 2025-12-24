import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
export default function About(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>About screen</Text>
            <Link href="/">Home Page</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"#fff",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"space-around"
    },
    text:{

    }
})