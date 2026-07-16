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
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
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
  esqSenha: {
    marginLeft: 130,
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: 'bold',
    padding: 5,
  },
  confirmar: {
    paddingHorizontal: 100,
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
    marginTop: 20,
  },
  cancelar: {
    paddingHorizontal: 75,
    paddingVertical: 13,
    backgroundColor: 'white',
    borderColor: '#2C3E50',
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 15
  },
  textoBotao1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  textoFinal: {
    color: 'white',
    textAlign: 'center',
    padding: 20
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
    marginTop: 50
  },
  textoInicio: {
    color: 'white',
    marginBottom: 20
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
    textAlign: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});