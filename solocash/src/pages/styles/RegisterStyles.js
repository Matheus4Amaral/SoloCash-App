import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#2C3E50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: 330,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    titulo: {
        padding: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    texto: {
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: 280,
        height: 40,
        backgroundColor: '#ECF0F1',
        marginTop: 10,
        borderRadius: 7,
        color: '#2C3E50',
        paddingHorizontal: 20,
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
    confirmar: {
        paddingHorizontal: 80,
        paddingVertical: 13,
        backgroundColor: '#00C853',
        marginTop: 20,
        borderRadius: 10,
    },
    textoBotao: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    texto1: {
        color: '#2C3E50',
        fontWeight: 'bold',
        marginTop: 20,
    },
    entrar: {
        fontSize: 16,
        color: '#00C853',
        fontWeight: 'bold',
        marginTop: 20,
    },
    nome: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    header: {
        position: 'absolute',
        top: 70,
        left: 20,
    },

    voltar: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    seta: {
        fontSize: 22,
        color: 'white',
        marginRight: 5,
    },

    textoVoltar: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    aviso: {
        width: 250,
        borderRadius: 7,
        backgroundColor: '#FFCDD2',
        padding: 10,
        alignItems: 'center',
    },
    textoAviso: {
        color: '#E74C3C',
        fontSize: 14,
    },
});
