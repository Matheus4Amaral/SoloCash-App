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
import { styles } from './styles/CategoriasStyles';
import { ArrowLeft, Plus, Pencil, Trash2, Bell, User } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { styles as modalStyles } from "../components/styles/modaisStyles";
import UserDropdown from "../components/UserDropDown";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../Service/CategoriaService";
import { useAuth } from "../Contexts/AuthContext";

export default function Categorias({ navigation }) {

    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openRemoveModal, setOpenRemoveModal] = useState(false)
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [valor, setValor] = useState('');
    const [abrirDropdown, setAbrirDropdown] = useState(false);
    const { usuario, nome: nomeUsuario } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategorias = async () => {
        setIsLoading(true);
        try {
            const data = await getCategorias(usuario?.id);
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        } finally {
            setIsLoading(false);
        }

    }

    const criaCategoria = async () => {
        try {
            const response = await createCategoria(usuario?.id, nomeCategoria, valor);
            fetchCategorias()
            closeCreateModal()
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
        }
    }

    const editarCategoria = async (id) => {
    try {
        await updateCategoria(
            id,
            nomeCategoria,
            valor,
            itemSelecionado?._padrao,
            usuario?.id,
            itemSelecionado?.nome
        )
        fetchCategorias()
        closeEditModal()
    } catch (error) {
        console.error('Erro ao editar categoria:', error);
    }
}

    const removerCategoria = async (id) => {
    try {
        await deleteCategoria(id, itemSelecionado?._padrao)
        fetchCategorias()
        closeRemoveModal()
    } catch (error) {
        console.error('Erro ao remover categoria:', error);
    }
}

    useEffect(() => {
        fetchCategorias()
    }, [])

    const closeCreateModal = () => {
        setNomeCategoria('');
        setValor('');
        setOpenCreateModal(false);
    }

    const editModal = (item) => {
    setItemSelecionado(item);
    setNomeCategoria(item.nome);
    setValor(item.valor_max ? Number(item.valor_max).toFixed(2).replace('.', ',') : '');
    setOpenEditModal(true);
}

    const closeEditModal = () => {
        setNomeCategoria('');
        setValor('');
        setOpenEditModal(false);
    }

    const removeModal = (item) => {
        setItemSelecionado(item);
        setOpenRemoveModal(true);
        setNomeCategoria(item.nome);
    }

    const closeRemoveModal = () => {
        setNomeCategoria('');
        setOpenRemoveModal(false);
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
                                <Text style={styles.textoVoltar}> Gerenciar Categorias</Text>
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

                        <View style={styles.areaBotao}>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: '#1E8449' }]} onPress={() => setOpenCreateModal(true)}>
                                <Plus color="white" size={30} />
                                <Text style={{ color: 'white', fontSize: 16 }}>Nova Categoria</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.containerCategorias}>

                        {isLoading ? (
                            <View style={styles.center}>
                                <ActivityIndicator size="large" color="#2C3E50" />
                                <Text>Carregando dados...</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={[styles.textoTitulo, { padding: 20 }]}>Categorias</Text>

                                <View style={styles.itemList}>
                                    {categorias.map((item) => (
                                        <View key={item.id} style={styles.item}>
                                            <View style={{ width: 115 }}>
                                                <Text style={styles.textoNome}>{item.nome}</Text>
                                            </View>

                                            <View>
                                                <Text style={styles.textoValor}>
                                                    {item.valor_max ? `R$ ${Number(item.valor_max).toFixed(2).replace('.', ',')}` : 'Sem limite'}
                                                </Text>
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
                            </>
                        )}
                    </View>

                    <Modal
                        visible={openCreateModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setOpenCreateModal(false)}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={[modalStyles.modalContent, { height: 300 }]}>
                                <Text style={modalStyles.modalTitle}>Adicionar Categoria</Text>
                                <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                    <TextInput
                                        placeholder="Digite um título"
                                        style={modalStyles.TextInput}
                                        value={nomeCategoria}
                                        onChangeText={setNomeCategoria}
                                    />
                                    <TextInput
                                        placeholder="Digite um valor para o limite (opcional)"
                                        style={modalStyles.TextInput}
                                        value={valor}
                                        onChangeText={setValor}
                                    />

                                </View>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#1E8449' }]}
                                        onPress={() => criaCategoria()}
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
                                <Text style={modalStyles.modalTitle}>Editar Categoria</Text>
                                <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                    <TextInput
                                        value={nomeCategoria}
                                        onChangeText={setNomeCategoria}
                                        placeholder="Digite um título"
                                        style={modalStyles.TextInput}
                                    />
                                    <TextInput
                                        value={valor}
                                        onChangeText={setValor}
                                        placeholder="Digite um valor para o limite (opcional)"
                                        style={modalStyles.TextInput}
                                    />

                                </View>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                        onPress={() => editarCategoria(itemSelecionado?.id)}
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
                                <Text style={modalStyles.modalTitle}>Remover Categoria</Text>

                                <Text style={modalStyles.modalTexto}>Deseja remover a categoria "{itemSelecionado?.nome}"?</Text>

                                <View style={modalStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                                        onPress={() => removerCategoria(itemSelecionado?.id)}
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

                </Pressable>

            </ScrollView>

            <Navigation pagina={4} />
        </View>
    )
}