import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: 140,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#2C3E50',
    borderEndStartRadius: 40,
    borderBottomLeftRadius: 40,
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
  botao: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 77
  },
  containerCategorias: {
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

    // Android
    elevation: 10,
  },
  itemList: {
    flexDirection: 'column',
    gap: 20,
    paddingBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textoNome: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textoValor: {
    fontSize: 15,
    color: 'rgba(44, 62, 80, 0.7)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  }
  ,
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
})