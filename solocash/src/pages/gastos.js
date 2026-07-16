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
    ActivityIndicator,
    Modal,
} from 'react-native';
import { styles } from './styles/GastosStyles';
import { ArrowLeft, Import, TrendingDown, Eye, EyeClosed, Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Bell, User, Calendar } from 'lucide-react-native';
import { useState } from "react";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { styles as modalStyles } from "../components/styles/modaisStyles";
import { Picker } from '@react-native-picker/picker';
import UserDropdown from "../components/UserDropDown";
import { useAuth } from "../Contexts/AuthContext";
import { useVisu } from "../Contexts/VisuContext";
import { getGastosMes, createGastos, updateGastos, deleteGastos, getValorTotalGastos, getValorTotalGastosMesAnterior } from "../Service/GastosService"
import { getCategorias } from "../Service/CategoriaService";
import { useEffect } from "react";

export default function Gastos({ navigation }) {

    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openRemoveModal, setOpenRemoveModal] = useState(false)
    const [data, setData] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [modalCategorias, setModalCategorias] = useState(false);
    const [abrirDropdown, setAbrirDropdown] = useState(false);
    const [categoria2, setCategoria2] = useState('');       // label (para exibir)
    const [categoriaId, setCategoriaId] = useState(null);   // id (para salvar)
    const [abriModalCategoria, setAbriModalCategoria] = useState(false);
    const [abriEditModalCategoria, setAbriEditModalCategoria] = useState(false);
    const { usuario, nome: nomeUsuario } = useAuth();
    const { showInfos, setShowInfos } = useVisu()
    const [gastos, setGastos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [mensagemErro, setMensagemErro] = useState('');
    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [valorTotalGastosMes, setValorTotalGastosMes] = useState(0);
    const [valorTotalGastosMesAnterior, setValorTotalGastosMesAnterior] = useState(0);
    const [categoriaIsPadrao, setCategoriaIsPadrao] = useState(true);

    const editModal = (item) => {
        setItemSelecionado(item);
        setNome(item.descricao);
        setValor(item.valor.toFixed(2).replace('.', ','));
        setData(converterDataParaExibicao(item.data));
        setCategoria2(item.categoria);
        setCategoriaId(item.categoria_id ?? null);
        setOpenEditModal(true);
        setCategoria2(item.categorias?.nome || item.categoria_pessoal?.nome || '');
        setCategoriaId(item.categoria_id ?? item.categoria_pessoal_id ?? null);
        setCategoriaIsPadrao(!!item.categoria_id);
    }

    const closeModais = () => {
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setOpenRemoveModal(false);
        setCategoria2('');
        setCategoriaId(null);
        setAbriEditModalCategoria(false);
        setAbriModalCategoria(false);
        setNome('');
        setData('');
        setValor('');
        setMensagemErro('');
        setCategoriaIsPadrao(true);
    }

    const removeModal = (item) => {
        setItemSelecionado(item);
        setOpenRemoveModal(true);
        setNome(item.descricao);
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

    const abrirDatePicker = async () => {
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

    const fetchGastos = async () => {
        setIsLoading(true);
        try {
            const data = await getGastosMes(usuario?.id);
            setGastos(data);
        } catch (error) {
            console.error('Erro ao buscar gastos:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCategorias = async () => {
        setIsLoading(true);
        try {
            const data = await getCategorias(usuario?.id);
            setCategorias(data.map(item => ({
                value: item.id,
                label: item.nome,
                isPadrao: !!item._padrao
            })));
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchTotalGastos = async () => {
        try {
            const soma = await getValorTotalGastos(usuario?.id)
            setValorTotalGastosMes(soma ?? 0)
        } catch (error) {
            console.error('Erro ao buscar soma de gastos:', error);
        }
    }

    const fetchTotalGastosMesAnterior = async () => {
        try {
            const soma = await getValorTotalGastosMesAnterior(usuario?.id)
            setValorTotalGastosMesAnterior(soma ?? 0)
        } catch (error) {
            console.error('Erro ao buscar soma mes anterior:', error);
        }
    }

    const criarGasto = async () => {
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

        const categoriaIdParaSalvar = categoriaIsPadrao ? categoriaId : null;
        const categoriaPessoalIdParaSalvar = !categoriaIsPadrao ? categoriaId : null;

        try {
            await createGastos(usuario?.id, nome, valorNumerico, categoriaIdParaSalvar, categoriaPessoalIdParaSalvar, dataFormatada)
            fetchGastos()
            fetchTotalGastos()
            closeModais()
        } catch (error) {
            console.error('Erro ao criar gasto:', error);
        }
    }

    const editarGasto = async (id) => {
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

        const categoriaIdParaSalvar = categoriaIsPadrao ? categoriaId : null;
        const categoriaPessoalIdParaSalvar = !categoriaIsPadrao ? categoriaId : null;

        try {
            await updateGastos(id, nome, valorNumerico, categoriaIdParaSalvar, categoriaPessoalIdParaSalvar, dataFormatada)
            fetchGastos()
            fetchTotalGastos()
            closeModais()
        } catch (error) {
            console.error('Erro ao editar gasto:', error);
        }
    }

    const removerGasto = async (id) => {
        try {
            await deleteGastos(id)
            fetchGastos()
            fetchTotalGastos()
            closeModais()
        } catch (error) {
            console.error('Erro ao deletar gasto:', error);
        }
    }

    useEffect(() => {
        fetchGastos();
        fetchCategorias();
        fetchTotalGastos();
        fetchTotalGastosMesAnterior();
    }, [])

    const gastosFiltrados = categoria
        ? gastos.filter(item => item.categorias?.nome === categoria)
        : gastos;

    const quantidadeGastos = gastosFiltrados.length

    return (
        <View style={styles.screen}>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>

                <Pressable
                    onPress={() => setAbrirDropdown(false)}
                    style={{ flex: 1 }}
                >

                    {modalCategorias && (
                        <View style={styles.modalCategorias}>
                            {categorias.map((item, index) => (
                                <TouchableOpacity
                                    style={styles.itemModalCategoria}
                                    key={index}
                                    onPress={() => {
                                        setCategoria(item.label);
                                        setModalCategorias(false);
                                    }}
                                >
                                    <Text style={{ color: 'black' }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.container}>

                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.voltar}
                                onPress={() => navigation.goBack()}
                            >
                                <ArrowLeft color="white" size={30} />
                                <Text style={styles.textoVoltar}> Gerenciar Gastos</Text>
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
                                <View style={styles.dropdownContainer}>
                                    <UserDropdown
                                        nome={nomeUsuario}
                                        email={usuario?.email}
                                    />
                                </View>
                            )}

                        </View>

                        <View style={styles.areaSaldo}>
                            <Text style={[styles.textoSaldo, { fontSize: 12 }]}> Mês Anterior: {showInfos ? Number(valorTotalGastosMesAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>

                            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={[styles.icone, { backgroundColor: '#e74d3c77', }]}>
                                    <TrendingDown color="#E74C3C" size={30} />
                                </View>
                                <Text style={styles.textoSaldo}>Total de Gastos Mensal</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Text style={[styles.textoSaldo, { color: '#E74C3C', fontSize: 24 }]}>{showInfos ? Number(valorTotalGastosMes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '---------'}</Text>
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
                            <TouchableOpacity style={[styles.botao, { backgroundColor: '#E74C3C' }]}
                                onPress={() => setOpenCreateModal(true)}
                            >
                                <Plus color="white" size={30} />
                                <Text style={{ color: 'white', fontSize: 16 }}>Novo Gasto</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {isLoading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color="#2C3E50" />
                            <Text>Carregando dados...</Text>
                        </View>
                    ) : (

                        <View style={styles.containerGanhos}>
                            <Text style={[styles.textoSaldo, { padding: 20 }]}>
                                Gastos do Mês - {quantidadeGastos} Gastos Totais
                            </Text>

                            <View style={{ flexDirection: 'column', gap: 10, paddingHorizontal: 20, width: '100%', marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={styles.textoSaldo}>Categorias:</Text>
                                </View>
                                <View
                                    style={{
                                        position: 'relative',
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 15,
                                        zIndex: 1000
                                    }}>

                                    <TouchableOpacity
                                        style={styles.buttonCategoria}
                                        onPress={() => setModalCategorias(prev => !prev)}
                                    >
                                        <Text style={{ marginLeft: 10, color: '#2c3e50', fontSize: 13 }}>Categoria</Text>
                                        {modalCategorias ? <ChevronUp size={20} color="#2c3e50" /> : <ChevronDown size={20} color="#2c3e50" />}
                                    </TouchableOpacity>

                                    {categoria !== '' && (
                                        <View style={styles.escolhaCategoria}>
                                            <Text style={{ color: '#2c3e50', fontSize: 13, marginLeft: 10 }}>{categoria}</Text>
                                            <TouchableOpacity onPress={() => setCategoria('')}>
                                                <X size={15} />
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                </View>
                            </View>

                            <View style={styles.itemList}>

                                {gastosFiltrados.length === 0 && (
                                    <View style={{ alignItems: 'center', marginTop: 20, gap: 10 }}>
                                        <Text style={{ color: '#2c3e50', fontSize: 16 }}>
                                            Nenhum gasto encontrado.
                                        </Text>
                                    </View>
                                )}

                                {gastosFiltrados.map((item) => (
                                    <View key={item.id} style={styles.item}>
                                        <View style={[styles.icone, { backgroundColor: '#e74d3c77', width: 40, height: 40 }]}>
                                            <TrendingDown color="#E74C3C" size={20} />
                                        </View>

                                        <View style={{ width: 115, flexDirection: 'column', gap: 5, alignItems: 'center' }}>
                                            <Text style={styles.texto}>{item.descricao}</Text>
                                            <View style={styles.categoria}>
                                                <Text style={{ color: '#2c3e50', fontSize: 12 }}>{item.categoria_id ? item.categorias?.nome : item.categoria_pessoal?.nome}</Text>
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={styles.texto}>
                                                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </Text>
                                            <Text style={[styles.texto, { fontSize: 8 }]}> Data: {converterDataParaExibicao(item.data)}</Text>
                                        </View>

                                        <TouchableOpacity onPress={() => editModal(item)}>
                                            <Pencil />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => removeModal(item)}>
                                            <Trash2 color="#FF0000" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                            </View>

                        </View>

                    )}


                    <Modal
                        visible={openCreateModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => closeModais()}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={[modalStyles.modalContent, { height: 350 }]}>
                                <Text style={modalStyles.modalTitle}>Adicionar Gasto</Text>

                                {mensagemErro ? (
                                    <View style={styles.aviso}>
                                        <Text style={styles.textoAviso}>{mensagemErro}</Text>
                                    </View>
                                ) : null}

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
                                        <TouchableOpacity onPress={() => abrirDatePicker()}>
                                            <Calendar color="#2C3E50" size={24} />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.buttonCategoria, { width: 200 }]}
                                        onPress={() => setAbriModalCategoria(prev => !prev)}
                                    >
                                        <Text style={{ marginLeft: 10, color: '#2c3e50', fontSize: 13 }}>
                                            {categoria2 || 'Categoria'}
                                        </Text>
                                        {abriModalCategoria ? <ChevronUp size={20} color="#2c3e50" /> : <ChevronDown size={20} color="#2c3e50" />}
                                    </TouchableOpacity>

                                </View>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                        onPress={criarGasto}
                                    >
                                        <Text style={modalStyles.buttonText}>Adicionar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                        onPress={() => closeModais()}
                                    >
                                        <Text style={modalStyles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>

                                {abriModalCategoria && (
                                    <View style={styles.modalCategoriasForm}>
                                        {categorias.map((item, index) => (
                                            <TouchableOpacity
                                                style={styles.itemModalCategoria}
                                                key={index}
                                                onPress={() => {
                                                    setCategoria2(item.label);
                                                    setCategoriaId(item.value);
                                                    setCategoriaIsPadrao(item.isPadrao);
                                                    setAbriModalCategoria(false);
                                                }}
                                            >
                                                <Text style={{ color: 'black' }}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}

                                        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 8 }} />

                                        <TouchableOpacity
                                            style={{ alignItems: 'center', paddingVertical: 5 }}
                                            onPress={() => {
                                                closeModais();
                                                navigation.navigate('Categorias');
                                            }}
                                        >
                                            <Text style={{ color: '#2ECC71', fontWeight: 'bold' }}>
                                                + Criar nova categoria
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={openEditModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => closeModais()}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={[modalStyles.modalContent, { height: 350 }]}>
                                <Text style={modalStyles.modalTitle}>Editar Gasto</Text>

                                {mensagemErro ? (
                                    <View style={styles.aviso}>
                                        <Text style={styles.textoAviso}>{mensagemErro}</Text>
                                    </View>
                                ) : null}

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
                                        <TouchableOpacity onPress={() => abrirDatePicker()}>
                                            <Calendar color="#2C3E50" size={24} />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.buttonCategoria, { width: 200 }]}
                                        onPress={() => setAbriEditModalCategoria(prev => !prev)}
                                    >
                                        <Text style={{ marginLeft: 10, color: '#2c3e50', fontSize: 13 }}>
                                            {categoria2 || itemSelecionado?.categoria || 'Categoria'}
                                        </Text>
                                        {abriEditModalCategoria ? <ChevronUp size={20} color="#2c3e50" /> : <ChevronDown size={20} color="#2c3e50" />}
                                    </TouchableOpacity>

                                </View>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                        onPress={() => editarGasto(itemSelecionado?.id)}
                                    >
                                        <Text style={modalStyles.buttonText}>Editar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                        onPress={() => closeModais()}
                                    >
                                        <Text style={modalStyles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>

                                {abriEditModalCategoria && (
                                    <View style={styles.modalCategoriasForm}>
                                        {categorias.map((item, index) => (
                                            <TouchableOpacity
                                                style={styles.itemModalCategoria}
                                                key={index}
                                                onPress={() => {
                                                    setCategoria2(item.label);
                                                    setCategoriaId(item.value);
                                                    setCategoriaIsPadrao(item.isPadrao);
                                                    setAbriEditModalCategoria(false);
                                                }}
                                            >
                                                <Text style={{ color: 'black' }}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}

                                        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 8 }} />

                                        <TouchableOpacity
                                            style={{ alignItems: 'center', paddingVertical: 5 }}
                                            onPress={() => {
                                                closeModais();
                                                navigation.navigate('Categorias');
                                            }}
                                        >
                                            <Text style={{ color: '#2ECC71', fontWeight: 'bold' }}>
                                                + Criar nova categoria
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={openRemoveModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => closeModais()}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={[modalStyles.modalContent]}>
                                <Text style={modalStyles.modalTitle}>Remover Gasto</Text>

                                <Text style={modalStyles.modalTexto}>Deseja remover o gasto "{nome}"?</Text>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                        onPress={() => removerGasto(itemSelecionado?.id)}
                                    >
                                        <Text style={modalStyles.buttonText}>Remover</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                                        onPress={() => closeModais()}
                                    >
                                        <Text style={modalStyles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                </Pressable>

            </ScrollView>

            <Navigation pagina={2} />

        </View>
    )
}
