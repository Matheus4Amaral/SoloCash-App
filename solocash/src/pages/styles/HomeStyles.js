import { Info } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
    backgroundColor: '#2C3E50',
    borderEndStartRadius: 40,
    borderEndEndRadius: 40,
    position: 'relative',
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

  areaIcones: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeBotao: {
    marginLeft: 14,
  },

  dropdownContainer: {
    position: 'absolute',
    top: 80,
    right: 10,
    zIndex: 999,
  },

  areaTexto: {
    marginTop: 130,
    marginBottom: 20,
    paddingHorizontal: 15,
    gap: 10,
  },

  texto: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  areaSaldo: {
    width: 350,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },

  saldo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 30,
    alignItems: 'center',
  },

  textoSaldo: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: 'bold',
  },

  valor: {
    color: '#2C3E50',
    fontSize: 24,
    fontWeight: 'bold',
  },

  tipo: {
    width: '50%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 45,
  },
  valores: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  botao: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  areaSaldoAnterior: {
    width: 330,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 30,
    marginTop: 60,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  grafico: {
    width: 340,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 25,
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
  UltimasTrans: {
    display: 'flex',
    flexDirection: 'column',
  },
  barra: {
    height: 1,
    backgroundColor: '#d0d0d0',
    width: '100%',
    marginTop: 15
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 10
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  categoria: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  areaCategoria: {
    width: 100,
    height: 20,
    backgroundColor: '#ECF0F1',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    // Android
    elevation: 10,
  },
  espaco: {
    paddingHorizontal: 85
  },
  itemValor: {
    width: 110,
    alignItems: 'flex-end', 
    justifyContent: 'center',
    marginRight: 10
  },
  textoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});