import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: 350,
    backgroundColor: '#2C3E50',
    borderEndStartRadius: 40,
    borderEndEndRadius: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaIcones: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeBotao: {
    marginLeft: 14,
  },

  dropdownContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 999,
  },
  textoVoltar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  areaSaldo: {
    width: 320,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 140
  },
  icone: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoSaldo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  botao: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  containerGanhos: {
    width: 360,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 15,
    marginTop: 70,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
    position: 'relative',
  },
  itemList: {
    flexDirection: 'column',
    gap: 20,
    paddingBottom: 30,
    zIndex: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 0,
  },
  texto: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: 500,
    textAlign: 'center',
  },
  inputData: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  textoData: {
    fontSize: 16,
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
    height: 300,
  },
  buttonCategoria: {
    width: 120,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 3,
    flexDirection: 'row',
    gap: 10,
  },
  modalCategorias: {
    position: 'absolute',
    top: 542,
    left: 35,
    width: 120,
    backgroundColor: '#ECF0F1',
    padding: 10,
    borderRadius: 10,
    zIndex: 9999,
    elevation: 50,
    flexDirection: 'column',
    gap: 5,
  },
  itemModalCategoria: {
    alignItems: 'center',
    zIndex: 999,
    color: 'black',
  },
  escolhaCategoria: {
    width: 120,
    height: 30,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,

  },
  categoria: {
    width: 110,
    height: 20,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCategoriasForm: {
    width: 200,
    backgroundColor: '#ECF0F1',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    flexDirection: 'column',
    gap: 5,
    zIndex: 1000,
    top: 268,
    left: 20
  }



})