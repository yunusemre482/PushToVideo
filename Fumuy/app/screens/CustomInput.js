import React from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'
import {FontAwesome} from 'react-native-vector-icons/FontAwesome';

const CustomInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props

  const hasError = errors[name] && touched[name]

  return (
    <>
  
      <TextInput
        style={[
          styles.textInput,
          props.multiline && { height: props.numberOfLines * 40 },
          hasError && styles.errorInput
        ]}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        {...inputProps}
      />
      {hasError ? <Text style={styles.errorText}>{errors[name]}</Text>:<Text style={styles.errorText}></Text>}
  
    </>

  )
}

const styles = StyleSheet.create({
  textInput: {
    height: '6.1%',
    width: '100%',
    paddingLeft:15,
    margin: 10,
    backgroundColor: '#dddddd',
    borderColor: '#cd5c5c',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    textAlignVertical: 'top',
  },
  errorText: {
    marginLeft: 20,
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
  },
  errorInput: {
    borderColor: '#ff6347',

  }
})

export default CustomInput