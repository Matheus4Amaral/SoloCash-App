import Navigation from "../components/navigation";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    ScrollView,
    FlatList,
    Modal,
    Platform,
    ActivityIndicator
} from 'react-native';
import { styles } from './styles/GanhosStyles';
import { ArrowLeft, Import, TrendingUp, Eye, EyeClosed, Plus, Pencil, Trash2, Bell, User, Calendar } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { styles as modalStyles } from "../components/styles/modaisStyles";
import UserDropdown from "../components/UserDropDown";
import { useAuth } from "../Contexts/AuthContext";
import { getGanhosMes, createGanhos, deleteGanhos, updateGanhos, getValorTotalGanhos, getValorTotalGanhosMesAnterior } from "../Service/GanhosService";
import { useVisu, VisuProvider } from "../Contexts/VisuContext";
export default function Ganhos({ navigation }) {
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openRemoveModal, setOpenRemoveModal] = useState(false)
    const [data, setData] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [abrirDropdown, setAbrirDropdown] = useState(false);
    const { usuario, nome: nomeUsuario } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [ganhos, setGanhos] = useState([])
    const [mensagemErro, setMensagemErro] = useState('')
    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [valorTotalGanhosMes, setValorTotalGanhosMes] = useState(0)
    const [valorTotalGanhosMesAnterior, setValorTotalGanhosMesAnterior] = useState(0)
    const { showInfos, setShowInfos } = useVisu();
    const [tempDate, setTempDate] = useState(new Date());

    const fetchGanhos = async () => {
        setIsLoading(true)
        try {
            const data = await getGanhosMes(usuario?.id)
            setGanhos(data)
            //console.log('Ganhos do mês:', data);
            fetchTotalGanhos()
            fetchTotalGanhosMesAnterior()
        } catch (error) {
            console.error('Erro ao buscar ganhos:', error);
        } finally {
            setIsLoading(false)
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


    const converterDataParaExibicao = (dataISO) => {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const converterData = (dataStr) => {
        const [dia, mes, ano] = dataStr.split('/');
        if (!dia || !mes || !ano || ano.length < 4) return null;
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    };

    const abrirDatePicker = async (isEdit = false) => {
        try {
            const hoje = new Date();
            const dataAtual = data
                ? converterData(data)
                : `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
            const [ano, mes, dia] = dataAtual.split('-');
            const dateObject = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

            DateTimePickerAndroid.open({
                value: dateObject,
                mode: 'date',
                is24Hour: true,
                onChange: (event, selectedDate) => {
                    if (event.type !== 'set' || !selectedDate) return;
                    const diaFormatado = String(selectedDate.getDate()).padStart(2, '0');
                    const mesFormatado = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const anoFormatado = selectedDate.getFullYear();
                    setData(`${diaFormatado}/${mesFormatado}/${anoFormatado}`);
                }
            });
            
        } catch ({ code, message }) {
            console.warn(`Erro em Datepicker: ${message}`);
        }
    };

    const criarGanho = async () => {

        if (!nome || !valor || !data) {
            setMensagemErro("Por favor, informe os dados")
            return
        }

        const dataFormatada = converterData(data);
        if (!dataFormatada) {
            setMensagemErro("Data inválida. Use o formato DD/MM/AAAA");
            return;
        }

        const valorNumerico = parseFloat(valor.trim().replace(/\./g, '').replace(',', '.'));
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMensagemErro("Valor inválido.");
            return;
        }

        try {
            const response = await createGanhos(usuario?.id, nome, valorNumerico, dataFormatada)
            fetchGanhos()
            closeCreateModal()
        } catch (error) {
            console.error('Erro ao criar ganho:', error);
        }
    }

    const editarGanho = async (id) => {

        let dataFormatada = ''

        if (data) {
            dataFormatada = converterData(data);
            if (!dataFormatada) {
                setMensagemErro("Data inválida. Use o formato DD/MM/AAAA");
                return;
            }
        }

        const valorNumerico = parseFloat(valor.trim().replace(/\./g, '').replace(',', '.'));

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMensagemErro("Valor inválido.");
            return;
        }

        try {
            const response = await updateGanhos(id, nome, valorNumerico, dataFormatada)
            fetchGanhos()
            closeEditModal()
        } catch (error) {
            console.error('Erro ao editar ganho:', error);
        }
    }

    const removerGanho = async (id) => {
        try {
            const response = await deleteGanhos(id)
            fetchGanhos()
            closeRemoveModal()
        } catch (error) {
            console.error('Erro ao deletar ganho:', error);
        }
    }

    const quantidadeGanhos = ganhos.length

    useEffect(() => {
        fetchGanhos()
        fetchTotalGanhos()
        fetchTotalGanhosMesAnterior()
    }, [])

    useEffect(() => {
        if (mensagemErro) {
            const timer = setTimeout(() => setMensagemErro(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensagemErro]);

    const closeCreateModal = () => {
        setOpenCreateModal(false)
        setNome('')
        setValor('')
        setData('')
    }

    const editModal = (item) => {
        setItemSelecionado(item)
        setNome(item.descricao);
        setValor(item.valor.toFixed(2).replace('.', ','));
        setData(converterDataParaExibicao(item.data));
        setOpenEditModal(true);
    }

    const closeEditModal = () => {
        setNome('')
        setValor('')
        setData('')
        setOpenEditModal(false)
    }

    const removeModal = (item) => {
        setItemSelecionado(item)
        setOpenRemoveModal(true);
        setNome(item.nome);
    }

    const closeRemoveModal = () => {
        setOpenRemoveModal(false)
    }

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
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
                                onPress={() => navigation.goBack()}
                            >
                                <ArrowLeft color="white" size={30} />
                                <Text style={styles.textoVoltar}> Gerenciar Ganhos</Text>
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

                            {abrirDropdown && (
                                <Pressable
                                    style={styles.dropdownContainer}
                                    onPress={(e) => e.stopPropagation()}
                                >
                                    <UserDropdown
                                        nome={nomeUsuario}
                                        email={usuario?.email}
                                    />
                                </Pressable>
                            )}

                        </View>

                        <View style={styles.areaSaldo}>
                            <Text style={[styles.textoSaldo, { fontSize: 12 }]}> Mês Anterior: {showInfos ? Number(valorTotalGanhosMesAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={[styles.icone, { backgroundColor: '#2ecc7080', }]}>
                                    <TrendingUp color="#1E8449" size={30} />
                                </View>
                                <Text style={styles.textoSaldo}>Total de Ganhos Mensal</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Text style={[styles.textoSaldo, { color: '#00C853', fontSize: 24 }]}>{showInfos ? Number(valorTotalGanhosMes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
                                <TouchableOpacity onPress={() => setShowInfos(!showInfos)}>
                                    {showInfos ? (
                                        <EyeClosed size={30} color="#2c3e50c0" />
                                    ) : (
                                        <Eye size={30} color="#2c3e50c0" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.areaBotao}>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: '#2ECC71' }]}
                                onPress={() => setOpenCreateModal(true)}
                            >
                                <Plus color="white" size={30} />
                                <Text style={{ color: 'white', fontSize: 16 }}>Novo Ganho</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {isLoading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color="#2C3E50" />
                            <Text>Carregando dados...</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.containerGanhos}>
                                <Text style={[styles.textoSaldo, { padding: 20 }]}>
                                    Ganhos do Mês - {quantidadeGanhos} Ganhos Totais
                                </Text>

                                <View style={styles.itemList}>
                                    {ganhos.map((item) => (
                                        <View key={item.id} style={styles.item}>
                                            <View
                                                style={[
                                                    styles.icone,
                                                    { backgroundColor: '#2ecc7080', width: 40, height: 40 }
                                                ]}
                                            >
                                                <TrendingUp color="#1E8449" size={20} />
                                            </View>

                                            <View style={{ width: 115 }}>
                                                <Text style={styles.texto}>{item.descricao}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={styles.texto}>
                                                    {item.valor.toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    })}
                                                </Text>
                                                <Text style={[styles.texto, { fontSize: 8 }]}> Data: {converterDataParaExibicao(item.data)}</Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => editModal(item)}
                                            >
                                                <Pencil />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => removeModal(item)}
                                            >
                                                <Trash2 color="#FF0000" />
                                            </TouchableOpacity>

                                        </View>
                                    ))}
                                </View>
                            </View>

                            <Modal
                                visible={openCreateModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setOpenCreateModal(false)}
                            >
                                <View style={modalStyles.modalContainer}>
                                    <View style={[modalStyles.modalContent, { height: 300 }]}>
                                        <Text style={modalStyles.modalTitle}>Adicionar Ganho</Text>

                                        {mensagemErro ? (
                                            <View style={styles.aviso}>
                                                <Text style={styles.textoAviso}>{mensagemErro}</Text>
                                            </View>
                                        ) : null}


                                        <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                            <TextInput
                                                placeholder="Digite um título"
                                                style={modalStyles.TextInput}
                                                value={nome}
                                                onChangeText={setNome}
                                            />
                                            <TextInput
                                                placeholder="Digite o valor"
                                                style={modalStyles.TextInput}
                                                value={valor}
                                                onChangeText={setValor}
                                            />

                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <TextInput
                                                    placeholder="DD/MM/AAAA"
                                                    style={[modalStyles.TextInput, { flex: 1 }]}
                                                    maxLength={10}
                                                    value={data}
                                                    onChangeText={setData}
                                                />
                                                <TouchableOpacity onPress={() => abrirDatePicker()}>
                                                    <Calendar color="#2C3E50" size={24} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={modalStyles.modalButtons}>
                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                                onPress={criarGanho}
                                            >
                                                <Text style={modalStyles.buttonText}>Adicionar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                                onPress={() => closeCreateModal()}
                                            >
                                                <Text style={modalStyles.buttonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </Modal>

                            <Modal
                                visible={openEditModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setOpenEditModal(false)}
                            >
                                <View style={modalStyles.modalContainer}>
                                    <View style={[modalStyles.modalContent, { height: 300 }]}>
                                        <Text style={modalStyles.modalTitle}>Editar Ganho</Text>
                                        <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                            <TextInput
                                                value={nome}
                                                onChangeText={setNome}
                                                placeholder="Digite um título"
                                                style={modalStyles.TextInput}
                                            />
                                            <TextInput
                                                value={valor}
                                                onChangeText={setValor}
                                                placeholder="Digite o valor"
                                                style={modalStyles.TextInput}
                                            />

                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <TextInput
                                                    value={data}
                                                    onChangeText={setData}
                                                    placeholder="DD/MM/AAAA"
                                                    style={[modalStyles.TextInput, { flex: 1 }]}
                                                />
                                                <TouchableOpacity onPress={() => abrirDatePicker(true)}>
                                                    <Calendar color="#2C3E50" size={24} />
                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        <View style={modalStyles.modalButtons}>
                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                                onPress={() => editarGanho(itemSelecionado?.id)}
                                            >
                                                <Text style={modalStyles.buttonText}>Editar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                                onPress={() => closeEditModal()}
                                            >
                                                <Text style={modalStyles.buttonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </Modal>

                            <Modal
                                visible={openRemoveModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setOpenRemoveModal(false)}
                            >
                                <View style={modalStyles.modalContainer}>
                                    <View style={[modalStyles.modalContent]}>
                                        <Text style={modalStyles.modalTitle}>Remover Ganho</Text>

                                        <Text style={modalStyles.modalTexto}>Deseja remover o ganho "{itemSelecionado?.descricao}"?</Text>

                                        <View style={modalStyles.modalButtons}>
                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                                onPress={() => removerGanho(itemSelecionado?.id)}
                                            >
                                                <Text style={modalStyles.buttonText}>Remover</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                                onPress={() => closeRemoveModal()}
                                            >
                                                <Text style={modalStyles.buttonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </Modal>
                        </>
                    )}
                </Pressable>
            </ScrollView>

            <Navigation pagina={1} />
        </View>
    )
}