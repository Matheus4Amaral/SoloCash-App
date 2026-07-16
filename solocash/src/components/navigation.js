import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  House,
  TrendingUp,
  TrendingDown,
  History,
  Grid3X3,
} from 'lucide-react-native';
import { styles } from './styles/NavigationStyles';
import { useNavigation } from '@react-navigation/native';

export default function Navigation({ pagina }) {
  const corAtiva = '#2f3f52';
  const corInativa = '#9aa0a6';

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate("Home")}
      >
        <House size={30} color={pagina === 0 ? corAtiva : corInativa} />
        {pagina === 0 && <Text style={styles.textoAtivo}>Início</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate("Ganhos")}
      >
        <TrendingUp size={30} color={pagina === 1 ? corAtiva : corInativa} />
        {pagina === 1 && <Text style={styles.textoAtivo}>Ganhos</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate("Gastos")}
      >
        <TrendingDown size={30} color={pagina === 2 ? corAtiva : corInativa} />
        {pagina === 2 && <Text style={styles.textoAtivo}>Gastos</Text>}
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Historico")}
      >
        <History size={30} color={pagina === 3 ? corAtiva : corInativa} />
        {pagina === 3 && <Text style={styles.textoAtivo}>Histórico</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate("Categorias")}
      >
        <Grid3X3 size={30} color={pagina === 4 ? corAtiva : corInativa} />
        {pagina === 4 && <Text style={styles.textoAtivo}>Categoria</Text>}
      </TouchableOpacity>
    </View>
  );
}