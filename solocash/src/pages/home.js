import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';
import { LogOut, Wallet, Eye, User, Bell, EyeClosed, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { styles } from './styles/HomeStyles';
import UserDropdown from '../components/UserDropDown';
import Grafico from '../components/Grafico';
import Navigation from '../components/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Contexts/AuthContext';
import { useVisu } from '../Contexts/VisuContext';
import { GetUltimasMovimentacoes } from '../Service/HomeService';
import { getValorTotalGanhos, getValorTotalGanhosMesAnterior } from '../Service/GanhosService';
import { getValorTotalGastos, getValorTotalGastosMesAnterior } from '../Service/GastosService';
function Home({ navigation }) {

  const { usuario, nome, signOut } = useAuth()
  const { showInfos, setShowInfos } = useVisu()
  const [abrirDropdown, setAbrirDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [valorTotalGanhosMes, setValorTotalGanhosMes] = useState(0)
  const [valorTotalGanhosMesAnterior, setValorTotalGanhosMesAnterior] = useState(0)
  const [valorTotalGastosMes, setValorTotalGastosMes] = useState(0)
  const [valorTotalGastosMesAnterior, setValorTotalGastosMesAnterior] = useState(0)
  const [UltimasMov, setUltimasMov] = useState([])



  const fetchUltimasMovimentacoes = async () => {
    try {
      const data = await GetUltimasMovimentacoes(usuario?.id)
      setUltimasMov(data)
    } catch (error) {
      console.error('Erro ao buscar ultimas movimentacoes:', error);
    }
  }

  const fetchTotalGanhos = async () => {
    try {
      const soma = await getValorTotalGanhos(usuario?.id)
      setValorTotalGanhosMes(soma ?? 0)
    } catch (error) {
      console.error('Erro ao buscar soma:', error);
    }
  }

  const fetchTotalGanhosMesAnterior = async () => {
    try {
      const soma = await getValorTotalGanhosMesAnterior(usuario?.id)
      setValorTotalGanhosMesAnterior(soma ?? 0)
    } catch (error) {
      console.error('Erro ao buscar soma:', error);
    }
  }

  const fetchTotalGastos = async () => {
    try {
      const soma = await getValorTotalGastos(usuario?.id)
      setValorTotalGastosMes(soma ?? 0)
    } catch (error) {
      console.error('Erro ao buscar soma:', error);
    }
  }

  const fetchTotalGastosMesAnterior = async () => {
    try {
      const soma = await getValorTotalGastosMesAnterior(usuario?.id)
      setValorTotalGastosMesAnterior(soma ?? 0)
    } catch (error) {
      console.error('Erro ao buscar soma:', error);
    }
  }

  const pegarDoisNomes = (nomeCompleto) => {
    return nomeCompleto.split(' ').slice(0, 2).join(' ');
  }

  const logout = async () => {
    setIsLoading(true)
    await signOut()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTotalGanhos()
    fetchTotalGanhosMesAnterior()
    fetchTotalGastos()
    fetchTotalGastosMesAnterior()
    fetchUltimasMovimentacoes()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text>Deslogando...</Text>
      </View>
    )
  }

  const calDiferenca = (valorEntrada, valorSaida) => {
    const diferenca = valorEntrada - valorSaida;
    return diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            if (abrirDropdown) setAbrirDropdown(false);
          }}
        >
          <View style={styles.container}>

            <View style={styles.header}>
              <TouchableOpacity
                style={styles.voltar}
                onPress={logout}
              >
                <View pointerEvents="none">
                  <LogOut color="white" size={24} />
                </View>
                <Text style={styles.textoVoltar}> Deslogar</Text>
              </TouchableOpacity>

              <View style={styles.areaIcones}>
                <TouchableOpacity style={styles.iconeBotao} onPress={() => navigation.navigate('Alertas')}>
                  <Bell color="white" size={28} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconeBotao}
                  onPress={(e) => {
                    e.stopPropagation();
                    setAbrirDropdown(!abrirDropdown);
                  }}
                >
                  <User color="white" size={28} />
                </TouchableOpacity>
              </View>
            </View>

            {abrirDropdown && (
              <Pressable
                style={styles.dropdownContainer}
                onPress={(e) => e.stopPropagation()}
              >
                <UserDropdown
                  nome={pegarDoisNomes(nome)}
                  email={usuario?.email}
                />
              </Pressable>
            )}

            <View style={styles.areaTexto}>
              <Text style={styles.texto}> Bem Vindo de volta,</Text>
              <Text style={styles.texto}> {pegarDoisNomes(nome)}</Text>
            </View>

            <View style={styles.areaSaldo}>
              <View style={styles.saldo}>
                <Wallet size={30} color="#00C853" />
                <View>
                  <Text style={styles.textoSaldo}>Saldo Atual Mensal</Text>
                </View>

                <TouchableOpacity onPress={() => setShowInfos(!showInfos)}>
                  {showInfos ? (
                    <EyeClosed size={30} color="#2c3e50c0" />
                  ) : (
                    <Eye size={30} color="#2c3e50c0" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.valor}> {showInfos ? calDiferenca(valorTotalGanhosMes, valorTotalGastosMes) : '---------'} </Text>
              <View style={styles.tipo}>
                <View style={styles.valores}>
                  <Text style={styles.textoSaldo}>Entrada</Text>

                  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                    <View style={[styles.icone, { backgroundColor: '#2ecc7080', }]}>
                      <TrendingUp color="#1E8449" size={20} />
                    </View>

                    <Text style={[{ fontSize: 16, color: '#2ECC71' }]}> {showInfos ? Number(valorTotalGanhosMes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                  </View>

                </View>

                <View style={styles.valores}>
                  <Text style={styles.textoSaldo}>Saídas</Text>

                  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                    <View style={[styles.icone, { backgroundColor: '#e74d3c77' }]}>
                      <TrendingDown color="#E74C3C" size={20} />
                    </View>

                    <Text style={[{ fontSize: 16, color: '#E74C3C' }]}> {showInfos ? Number(valorTotalGastosMes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                  </View>

                </View>

              </View>

            </View>

            <View style={styles.botoes}>
              <TouchableOpacity style={[styles.botao, { backgroundColor: '#2ECC71' }]}
                onPress={() => navigation.navigate('Ganhos')}
              >
                <TrendingUp color="white" size={20} />
                <Text style={{ color: 'white' }}>Novo Ganho</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao, { backgroundColor: '#E74C3C' }]}
                onPress={() => navigation.navigate('Gastos')}
              >
                <TrendingDown color='white' size={20} />
                <Text style={{ color: 'white' }}>Novo Gasto</Text>
              </TouchableOpacity>
            </View>

          </View>

          {valorTotalGanhosMesAnterior > 0 && valorTotalGanhosMes > 0 ? (
            <View style={styles.areaSaldoAnterior}>

              <View style={[styles.saldo, { paddingVertical: 15 }]}>
                <View>
                  <Text style={styles.textoSaldo}>Saldo do mês anterior</Text>
                </View>

                <TouchableOpacity onPress={() => setShowInfos(!showInfos)}>
                  {showInfos ? (
                    <EyeClosed size={30} color="#2c3e50c0" />
                  ) : (
                    <Eye size={30} color="#2c3e50c0" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={[styles.tipo, { marginTop: 10 }]}>
                <View style={styles.valores}>
                  <Text style={styles.textoSaldo}>Entrada</Text>

                  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                    <View style={[styles.icone, { backgroundColor: '#2ecc7080', }]}>
                      <TrendingUp color="#1E8449" size={20} />
                    </View>

                    <Text style={[{ fontSize: 16, color: '#2ECC71' }]}> {showInfos ? Number(valorTotalGanhosMesAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                  </View>

                </View>

                <View style={styles.valores}>
                  <Text style={styles.textoSaldo}>Saídas</Text>

                  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                    <View style={[styles.icone, { backgroundColor: '#e74d3c77' }]}>
                      <TrendingDown color="#E74C3C" size={20} />
                    </View>

                    <Text style={[{ fontSize: 16, color: '#E74C3C' }]}> {showInfos ? Number(valorTotalGastosMesAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                  </View>

                </View>

              </View>
            </View>
          ) : (
            <View style={[styles.areaSaldoAnterior, { justifyContent: 'center' , alignItems: 'center'}]}>
              <Text style={styles.textoSaldo}>Sem dados do mês anterior</Text>
            </View>
          )}


          { valorTotalGastosMes > 0 &&
            <View style={[styles.grafico, { marginTop: 40 }]}>
              <Text style={[styles.textoSaldo, { paddingVertical: 20, paddingHorizontal: 12, fontSize: 16 }]}>Gastos por categoria:</Text>
              <View>
                <Grafico />
              </View>
            </View>
          }

          {UltimasMov.length > 0 && (
            <View style={styles.UltimasTrans}>
              <Text style={[styles.textoSaldo, { marginTop: 30, paddingHorizontal: 12, fontSize: 16 }]}>Ultimas movimentações do mês</Text>
              <View style={styles.barra} />
              {UltimasMov.map((item) => (
                <View key={item.id}>
                  <View style={styles.item}>
                    <View
                      style={[
                        styles.icone,
                        {
                          width: 50,
                          height: 50,
                          borderRadius: 30,
                          backgroundColor:
                            item.tipo === 'entrada' ? '#2ecc7080' : '#e74d3c77',
                        },
                      ]}
                    >
                      {item.tipo === 'entrada' ? (
                        <ArrowUpRight color="#1E8449" size={30} />
                      ) : (
                        <ArrowDownRight color="#E74C3C" size={30} />
                      )}
                    </View>

                    <View style={styles.info}>
                      {item.categoria ? (
                        <Text style={styles.itemTitulo}>{item.nome}</Text>
                      ) : (
                        <Text style={[styles.itemTitulo, { marginTop: 13 }]}>
                          {item.descricao}
                        </Text>
                      )}

                      {item.categoria_id || item.categoria_pessoal_id ? (
                        <View style={styles.categoria}>
                          <Text style={{ color: '#2C3E50', fontSize: 14, fontWeight: '500' }}>
                            Categoria:
                          </Text>

                          <View style={styles.areaCategoria}>
                            <Text style={{ color: '#2C3E50' }}>
                              { item.categoria_id ? item.categorias?.nome : item.categoria_pessoal?.nome}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.espaco} />
                      )}
                    </View>

                    <View style={styles.itemValor}>
                      <Text style={styles.textoValor}>
                        {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.barra} />
                </View>
              ))}
            </View>
          )}

        </Pressable>

      </ScrollView>

      <Navigation pagina={0} />

    </View>

  );
}
export default Home;

