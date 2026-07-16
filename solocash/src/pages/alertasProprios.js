import Navigation from "../components/navigation";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { styles } from './styles/AlertasPropriosStyles';
import { ArrowLeft, Plus, Pencil, Trash2, Calendar } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth } from '../Contexts/AuthContext';
import { getAlertasDoUsuario, createAlerta, updateAlerta, deleteAlerta } from '../Service/AlertasService';
import { styles as modalStyles } from "../components/styles/modaisStyles";


export default function AlertasProprios({ navigation }) {

    const { usuario } = useAuth();
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openRemoveModal, setOpenRemoveModal] = useState(false)
    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [alertas, setAlertas] = useState([]);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [mensagemErro, setMensagemErro] = useState('');

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

    const formatarDataISO = (dataStr) => {
        if (!dataStr) return null;
        const partes = dataStr.split('/');
        if (partes.length !== 3) return null;
        const [dia, mes, ano] = partes.map(Number);
        if (!dia || !mes || !ano) return null;
        return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    };

    const abrirDatePickerModal = async () => {
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

    const fetchAlertas = async () => {
        if (!usuario) return;
        try {
            const dados = await getAlertasDoUsuario(usuario?.id);
            setAlertas(dados || []);
        } catch (error) {
            console.error('Erro ao buscar alertas do usuário:', error);
        }
    };

    useEffect(() => {
        fetchAlertas();
    }, []);

    const editModal = (item) => {
        setItemSelecionado(item);
        setTitulo(item.titulo || '');
        setData(formatarDataParaExibicao(item.data));
        setDescricao(item.descricao || '');
        setOpenEditModal(true);
    }

    const removeModal = (item) => {
        setItemSelecionado(item);
        setTitulo(item.titulo || '');
        setOpenRemoveModal(true);
    }

    const closeCreateModal = () => {
        setOpenCreateModal(false);
        setTitulo('');
        setDescricao('');
        setData('');
        setItemSelecionado(null);
        setMensagemErro('');
    };

    const closeEditModal = () => {
        setOpenEditModal(false);
        setTitulo('');
        setDescricao('');
        setData('');
        setItemSelecionado(null);
        setMensagemErro('');
    };

    const closeRemoveModal = () => {
        setOpenRemoveModal(false);
        setTitulo('');
        setItemSelecionado(null);
    };

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
            closeCreateModal();
            fetchAlertas();
        } catch (error) {
            console.error('Erro ao criar alerta:', error);
            setMensagemErro(error.message || 'Erro ao criar alerta');
        }
    };

    const handleUpdateAlerta = async () => {
        if (!itemSelecionado) return;
        const dataISO = formatarDataISO(data);
        if (!dataISO) {
            setMensagemErro('Data inválida');
            return;
        }

        try {
            setMensagemErro('');
            await updateAlerta(itemSelecionado.id, titulo, descricao, dataISO);
            closeEditModal();
            fetchAlertas();
        } catch (error) {
            console.error('Erro ao editar alerta:', error);
            setMensagemErro(error.message || 'Erro ao editar alerta');
        }
    };

    const handleDeleteAlerta = async () => {
        if (!itemSelecionado) return;
        try {
            await deleteAlerta(itemSelecionado.id);
            closeRemoveModal();
            fetchAlertas();
        } catch (error) {
            console.error('Erro ao deletar alerta:', error);
        }
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

                <View style={styles.containerCategorias}>
                    <Text style={[styles.textoTitulo, { padding: 20 }]}>Notificações Próprias</Text>

                    <View style={styles.itemList}>
                        {alertas.filter((item) => item.ativo === false).map((item) => (
                            <View key={item.id} style={styles.item}>
                                <View style={styles.cabecalhoItem}>
                                    <Text style={styles.textoNome}>{item.titulo || ''}</Text>

                                    <Text style={styles.textoValor}>{formatarDataParaExibicao(item.data)}</Text>

                                    <TouchableOpacity onPress={() => editModal(item)}>
                                        <Pencil />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => removeModal(item)}>
                                        <Trash2 color="#FF0000" />
                                    </TouchableOpacity>
                                </View>

                                {item.descricao?.trim().length > 0 && (
                                    <View>
                                        <Text style={styles.textoItemDescricao}>{item.descricao}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                <Modal
                    visible={openEditModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOpenEditModal(false)}
                >
                    <View style={modalStyles.modalContainer}>
                        <View style={[modalStyles.modalContent, { height: 300 }]}>
                            <Text style={modalStyles.modalTitle}>Editar Alerta</Text>
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
                                    <TouchableOpacity onPress={() => abrirDatePickerModal(true)}>
                                        <Calendar size={22} color="#2c3e50" />
                                    </TouchableOpacity>
                                </View>

                            </View>

                            <View style={modalStyles.modalButtons}>
                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                    onPress={handleUpdateAlerta}
                                >
                                    <Text style={modalStyles.buttonText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                    onPress={() => setOpenEditModal(false)}
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
                            <Text style={modalStyles.modalTitle}>Remover Categoria</Text>
                            <Text style={modalStyles.modalTexto}>Deseja remover o alerta "{titulo}"?</Text>
                            <View style={modalStyles.modalButtons}>
                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                    onPress={handleDeleteAlerta}
                                >
                                    <Text style={modalStyles.buttonText}>Remover</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                    onPress={() => setOpenRemoveModal(false)}
                                >
                                    <Text style={modalStyles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </Modal>

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
                                    style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
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

            <Navigation pagina={-2} />
        </View>
    )
}