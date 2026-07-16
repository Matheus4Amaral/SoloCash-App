import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: 290,
    alignSelf: 'center',
    marginTop: 20,
  },

  botaoUsuario: {
    backgroundColor: '#ECF0F1',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTexto: {
    color: '#ECF0F1',
    fontSize: 16,
    fontWeight: '700',
  },

  infoUsuario: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '700',
  },

  email: {
    color: '#2C3E50',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },

  seta: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 8,
  },

  dropdown: {
    overflow: 'hidden',
    backgroundColor: '#ECF0F1',
    borderRadius: 18,
    marginTop: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginHorizontal: 8,
  },

  itemTexto: {
    color: '#2C3E50',
    fontSize: 15,
    fontWeight: '600'
  },

  itemTextoSair: {
    color: '#B03A2E',
    fontSize: 15,
    fontWeight: '700',
  },

  divisor: {
    height: 1,
    backgroundColor: '#2C3E50',
    opacity: 0.12,
    marginVertical: 6,
    marginHorizontal: 14,
  },
  aviso: {
    width: 250,
    borderRadius: 7,
    backgroundColor: '#FFCDD2',
    padding: 10,
    alignItems: 'center',
    marginTop: 10
  },
  textoAviso: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center'
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'justify-content',
    alignItems: 'center',
    gap: 10
  },
});