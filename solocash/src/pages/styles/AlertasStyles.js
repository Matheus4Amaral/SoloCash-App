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
  textoVoltar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  areaBotao: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
    marginTop: 69,
    gap: 10,
  },
  botaoAlerta: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 7
  },
  botaoVisualizar: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 7
  },
  containerBusca: {
    width: 360,
    backgroundColor: '#ECF0F1',
    borderRadius: 20,
    marginLeft: 15,
    marginTop: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  inputBuscaArea: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    backgroundColor: '#D5DBDB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  inputBusca: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  textoPeriodo: {
    marginTop: 16,
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  areaPeriodo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputPeriodo: {
    backgroundColor: '#D5DBDB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  textoInputPeriodo: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '700',
  },
  containerAlertas: {
    width: 360,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 15,
    marginTop: 24,
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
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 2,
  },
  cabecalhoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoItemTitulo: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textoItemData: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  textoItemMensagem: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '400',
    textAlign: 'left',
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})