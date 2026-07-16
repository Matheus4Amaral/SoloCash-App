import Navigation from "../components/navigation";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { styles } from './styles/AlertasStyles';
import { ArrowLeft, Plus, Search, Calendar } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth } from '../Contexts/AuthContext';
import { getAlertasAtivos, atualizarAlertasAtivos, criarAlertaSaldoMesAnterior, createAlerta } from '../Service/AlertasService';
import { styles as modalStyles } from "../components/styles/modaisStyles";

export default function Alertas({ navigation }) {

    const { usuario } = useAuth();
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [nomeBusca, setNomeBusca] = useState('');
    const [dataInicioBusca, setDataInicioBusca] = useState('');
    const [dataFimBusca, setDataFimBusca] = useState('');
    const [alertas, setAlertas] = useState([]);
    const [alertasFiltrados, setAlertasFiltrados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');

    const handleCreateAlerta = async () => {
        if (!usuario) return;
        const dataISO = formatarDataISO(data);
        if (!dataISO) {
            setMensagemErro('Data inválida');
            return;
        }

        try {
            setMensagemErro('');
            await createAlerta(usuario.id, titulo, descricao, dataISO);
            await atualizarAlertasAtivos(usuario.id);
            const dadosAtivos = await getAlertasAtivos(usuario.id);
            setAlertas(dadosAtivos || []);

            setOpenCreateModal(false);
            setTitulo('');
            setDescricao('');
            setData('');
        } catch (error) {
            console.error('Erro ao criar alerta:', error);
            setMensagemErro(error.message || 'Erro ao criar alerta');
        }
    };

    const fetchAlertas = async () => {
        if (!usuario) return;
        setIsLoading(true);
        try {
            await criarAlertaSaldoMesAnterior(usuario?.id);
            await atualizarAlertasAtivos(usuario?.id);
            const dadosAtivos = await getAlertasAtivos(usuario?.id);
            setAlertas(dadosAtivos || []);
        } catch (error) {
            console.error('Erro ao buscar alertas ativos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlertas();
    }, []);


    const parseData = (texto) => {
        if (!texto) return null;

        const padraoBr = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (padraoBr) {
            const dia = Number(padraoBr[1]);
            const mes = Number(padraoBr[2]);
            const ano = Number(padraoBr[3]);
            const data = new Date(ano, mes - 1, dia);
            const dataValida =
                data.getFullYear() === ano &&
                data.getMonth() === mes - 1 &&
                data.getDate() === dia;
            return dataValida ? data : null;
        }

        const padraoISO = texto.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (padraoISO) {
            const ano = Number(padraoISO[1]);
            const mes = Number(padraoISO[2]);
            const dia = Number(padraoISO[3]);
            const data = new Date(ano, mes - 1, dia);
            const dataValida =
                data.getFullYear() === ano &&
                data.getMonth() === mes - 1 &&
                data.getDate() === dia;
            return dataValida ? data : null;
        }

        return null;
    };

    const formatarDataLocal = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const formatarDataParaExibicao = (valor) => {
        if (!valor) return '';
        const isoMatch = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) {
            return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
        }
        return valor;
    };

    const abrirDatePicker = async (campo) => {
        const valorAtual = campo === 'inicio' ? dataInicioBusca : dataFimBusca;
        let dateObject = new Date();

        if (valorAtual) {
            const partes = valorAtual.split('/');
            if (partes.length === 3) {
                const [dia, mes, ano] = partes.map(Number);
                if (dia && mes && ano) {
                    dateObject = new Date(ano, mes - 1, dia);
                }
            }
        }

        DateTimePickerAndroid.open({
            value: dateObject,
            mode: 'date',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (event.type !== 'set' || !selectedDate) return;
                const dataFormatada = formatarDataLocal(selectedDate);
                if (campo === 'inicio') {
                    setDataInicioBusca(dataFormatada);
                } else {
                    setDataFimBusca(dataFormatada);
                }
            }
        });
    };

    const abrirDatePickerModal = async (isEdit = false) => {
        const valorAtual = data || '';
        let dateObject = new Date();

        if (valorAtual) {
            const partes = valorAtual.split('/');
            if (partes.length === 3) {
                const [dia, mes, ano] = partes.map(Number);
                if (dia && mes && ano) {
                    dateObject = new Date(ano, mes - 1, dia);
                }
            }
        }

        DateTimePickerAndroid.open({
            value: dateObject,
            mode: 'date',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (event.type !== 'set' || !selectedDate) return;
                const dataFormatada = formatarDataLocal(selectedDate);
                setData(dataFormatada);
            }
        });
    };

    useEffect(() => {
        const dataInicio = parseData(dataInicioBusca);
        const dataFim = parseData(dataFimBusca);

        const listaFiltrada = alertas.filter(item =>
            ((item.titulo?.toLowerCase().includes(nomeBusca.toLowerCase()) || item.descricao?.toLowerCase().includes(nomeBusca.toLowerCase()) || item.data?.includes(nomeBusca))) &&
            (!dataInicio || parseData(item.data) >= dataInicio) &&
            (!dataFim || parseData(item.data) <= dataFim)
        );

        setAlertasFiltrados(listaFiltrada);
    }, [nomeBusca, dataInicioBusca, dataFimBusca, alertas]);

    const formatarDataISO = (dataStr) => {
        if (!dataStr) return null;
        const partes = dataStr.split('/');
        if (partes.length !== 3) return null;
        const [dia, mes, ano] = partes.map(Number);
        if (!dia || !mes || !ano) return null;
        return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    };

    const closeCreateModal = () => {
        setOpenCreateModal(false);
        setTitulo('');
        setDescricao('');
        setData('');
        setMensagemErro('');
    };

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.voltar}
                            onPress={() => navigation.goBack()}
                        >
                            <ArrowLeft color="white" size={30} />
                            <Text style={styles.textoVoltar}> Alertas</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.areaBotao}>
                        <TouchableOpacity style={[styles.botaoAlerta, { backgroundColor: '#1E8449' }]} onPress={() => setOpenCreateModal(true)}>
                            <Plus color="white" size={30} />
                            <Text style={{ color: 'white', fontSize: 16 }}>Novo Alerta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.botaoVisualizar, { backgroundColor: '#D5DBDB' }]} onPress={() => navigation.navigate('AlertasProprios')}>
                            <Text style={{ color: 'black', fontSize: 16 }}>Visualizar</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={styles.containerBusca}>
                    <View style={styles.inputBuscaArea}>
                        <Search size={28} color="#738496" />
                        <TextInput
                            style={[styles.inputBusca, { height: 36, fontSize: 14 }]}
                            placeholder="Buscar Alerta"
                            placeholderTextColor="#738496"
                            value={nomeBusca}
                            onChangeText={setNomeBusca}
                        />
                    </View>

                    <Text style={styles.textoPeriodo}>Análise por período:</Text>
                    <View style={styles.areaPeriodo}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={[styles.inputPeriodo, { flex: 1 }]}>
                                <TextInput
                                    style={[styles.textoInputPeriodo, { height: 36, fontSize: 13, paddingVertical: 4 }]}
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#64748b"
                                    value={dataInicioBusca}
                                    onChangeText={setDataInicioBusca}
                                />
                            </View>
                            <TouchableOpacity onPress={() => abrirDatePicker('inicio')}>
                                <Calendar color="#2c3e50" size={22} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 15, color: '#2c3e50', fontWeight: '500' }}>até</Text>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={[styles.inputPeriodo, { flex: 1 }]}>
                                <TextInput
                                    style={[styles.textoInputPeriodo, { height: 36, fontSize: 13, paddingVertical: 4 }]}
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#64748b"
                                    value={dataFimBusca}
                                    onChangeText={setDataFimBusca}
                                />
                            </View>
                            <TouchableOpacity onPress={() => abrirDatePicker('fim')}>
                                <Calendar color="#2C3E50" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.containerAlertas}>
                    <Text style={[styles.textoTitulo, { padding: 20 }]}>Notificações</Text>

                    <View style={styles.itemList}>
                        {alertasFiltrados.map((item) => (
                            <View key={item.id} style={styles.item}>
                                <View style={styles.cabecalhoItem}>
                                    <View>
                                        <Text style={styles.textoItemTitulo}>{item.titulo || item.titulo}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.textoItemData}>{formatarDataParaExibicao(item.data)}</Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={styles.textoItemMensagem}>{item.descricao || ''}</Text>
                                </View>

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
                            <Text style={modalStyles.modalTitle}>Adicionar Alerta</Text>
                            {mensagemErro ? (
                                <View style={styles.aviso}>
                                    <Text style={styles.textoAviso}>{mensagemErro}</Text>
                                </View>
                            ) : null}
                            <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                <TextInput
                                    value={titulo}
                                    onChangeText={setTitulo}
                                    placeholder="Digite um título"
                                    style={modalStyles.TextInput}
                                />
                                <TextInput
                                    value={descricao}
                                    onChangeText={setDescricao}
                                    placeholder="Digite uma descrição (opcional)"
                                    style={modalStyles.TextInput}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            value={data}
                                            onChangeText={setData}
                                            placeholder="DD/MM/AAAA"
                                            placeholderTextColor="#64748b"
                                            style={[modalStyles.TextInput, { paddingVertical: 8 }]}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => abrirDatePickerModal(false)}>
                                        <Calendar size={22} color="#2c3e50" />
                                    </TouchableOpacity>
                                </View>

                            </View>

                            <View style={modalStyles.modalButtons}>
                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#1E8449' }]}
                                    onPress={handleCreateAlerta}
                                >
                                    <Text style={modalStyles.buttonText}>Adicionar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                    onPress={closeCreateModal}
                                >
                                    <Text style={modalStyles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </Modal>

            </ScrollView>

            <Navigation pagina={-1} />
        </View>
    )
}