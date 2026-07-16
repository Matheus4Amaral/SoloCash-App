import { Button, StyleSheet } from "react-native";



export const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: 350,
        height: 200,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2C3E50'
    },
    modalTexto: {
        fontSize: 18,
        textAlign: 'center',
        color: '#2C3E50',
        fontWeight: 500
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '45%',
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    TextInput: {
        width: '100%',
        height: 40,
        backgroundColor: '#2c3e5027',
        border: 'none',
        borderRadius: 8,
        padding: 10,

    },
    inputData: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        justifyContent: "center",
    },
    textoData: {
        fontSize: 16,
    },
    inputSenha: {
    width: 280,
    height: 40,
    backgroundColor: '#ECF0F1',
    marginTop: 10,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  inputComIcone: {
    flex: 1,
    height: '100%',
    color: '#2C3E50',

  },

})