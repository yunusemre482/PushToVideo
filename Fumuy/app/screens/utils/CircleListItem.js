import React from 'react'
import { StyleSheet, Text, View,Image } from 'react-native'

export const CircleListItem = ({ label, value }) => (
    <View style={styles.container}>
        <View style={styles.icon}>
        <Image
          style={styles.avatar}
          source={{
            uri:
              'https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          }}
        />
        </View>
        <Text style={styles.label}>{label}</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
    },
    label: {
        textAlign: 'center',
    },
    text: {
        margin: 12,
        color: 'white',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        justifyContent: 'center',
        marginLeft: 50,
        position: 'absolute',
        marginTop: 110,
      },
})