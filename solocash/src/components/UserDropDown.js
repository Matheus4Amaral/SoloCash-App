import React, { useRef, useState, } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { styles } from './styles/DropdownStyles';
import { styles as modalStyles } from './styles/modaisStyles';
import { useNavigation } from '@react-navigation/native';
import { EyeOff, Eye, LogOut } from 'lucide-react-native';
import { useAuth } from '../Contexts/AuthContext';
import { useEffect } from 'react';
import { updateSenha, disableConta } from '../Service/UsuarioService';
export default function UserDropdown({ nome, email }) {

  const navigation = useNavigation();
  const { signOut, usuario } = useAuth()
  const [aberto, setAberto] = useState(false);
  const [OpenModalLogout, setOpenModalLogout] = useState(false);
  const [OpenModalDesativar, setOpenModalDesativar] = useState(false);
  const [OpenModalEditarSenha, setOpenModalEditarSenha] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showNewSenha, setShowNewSenha] = useState(false);
  const [showConfirmNewSenha, setShowConfirmNewSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("")
  const [NewSenha, setNewSenha] = useState("")
  const [NewConfirmSenha, setNewConfirmSenha] = useState("")
  const [mensagemErro, setMensagemErro] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const animacao = useRef(new Animated.Value(0)).current;

  function toggleDropdown() {
    if (aberto) {
      Animated.timing(animacao, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start(() => setAberto(false));
    } else {
      setAberto(true);
      Animated.timing(animacao, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  }

  const editarSenha = async () => {

    if (!senhaAtual || !NewSenha || !NewConfirmSenha) {
      setMensagemErro("Preencha todos os campos")
      return
    }

    if (NewSenha === senhaAtual) {
      setMensagemErro("A nova senha deve ser diferente da antiga")
      return
    }

    if (NewSenha !== NewConfirmSenha) {
      setMensagemErro("A confirmação de senha não confere")
      return
    }

    const email = usuario.email

    try {
      await updateSenha(email, senhaAtual, NewSenha)
      setOpenModalEditarSenha(false)
      await signOut()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })

    } catch (error) {
      setMensagemErro(error.message)
    }

  }


  const desativarSenha = async () => {

    try {
      await disableConta(usuario.id)
      setOpenModalDesativar(false)
      await signOut()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (mensagemErro) {
      const timer = setTimeout(() => setMensagemErro(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErro]);


  const alturaDropdown = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170],
  });

  const opacidadeDropdown = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotacaoSeta = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const iniciais = nome
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const logout = async () => {
    setIsLoading(true);
    setOpenModalLogout(false);
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
    setIsLoading(false)
  };




  const visibilidadeSenha = () => {
    setShowSenha(!showSenha);
  }

  const visibilidadeNewSenha = () => {
    setShowNewSenha(!showNewSenha);
  }

  const visibilidadeConfirmNewSenha = () => {
    setShowConfirmNewSenha(!showConfirmNewSenha);
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.botaoUsuario} onPress={toggleDropdown}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais}</Text>
        </View>

        <View style={styles.infoUsuario}>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
        </View>

        <Animated.Text
          style={[
            styles.seta,
            { transform: [{ rotate: rotacaoSeta }] },
          ]}
        >
          ▼
        </Animated.Text>
      </Pressable>

      {aberto && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              height: alturaDropdown,
              opacity: opacidadeDropdown,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.item}
            onPress={() => setOpenModalDesativar(true)}
          >
            <Text style={styles.itemTexto}>Desativar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => setOpenModalEditarSenha(true)}>
            <Text style={styles.itemTexto}>Editar Senha</Text>
          </TouchableOpacity>

          <View style={styles.divisor} />

          <TouchableOpacity
            style={styles.item}
            onPress={logout}
          >
            {isLoading ? (
              <View style={styles.center}>
                <ActivityIndicator size="small" color="#2C3E50" />
                <Text>Deslogando...</Text>
              </View>
            ): (
              <>
                <Text style={styles.itemTextoSair}>Sair</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        visible={OpenModalLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModalLogout(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Confirmação de Logout</Text>
            <Text style={modalStyles.modalTexto}>Deseja realmente sair?</Text>
            <View style={modalStyles.modalButtons}>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                onPress={() => setOpenModalLogout(false)}
              >
                <Text style={modalStyles.buttonText}>Sair</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                onPress={() => setOpenModalLogout(false)}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

      <Modal
        visible={OpenModalDesativar}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModalDesativar(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={[modalStyles.modalContent, { height: 250 }]}>
            <Text style={modalStyles.modalTitle}>Desativar Conta</Text>
            <Text style={modalStyles.modalTexto}>Deseja realmente desativar a conta?</Text>

            <Text style={[modalStyles.modalTexto, { fontSize: 12, textAlign: 'center' }]}>Você poderá reativar em até 1 mês. Caso contrário, será excluída PERMANENTEMENTE.</Text>

            <View style={modalStyles.modalButtons}>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                onPress={() => desativarSenha()}
              >
                <Text style={modalStyles.buttonText}>Desativar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                onPress={() => setOpenModalDesativar(false)}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

      <Modal
        visible={OpenModalEditarSenha}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModalEditarSenha(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={[modalStyles.modalContent, { height: 380 }]}>
            <Text style={modalStyles.modalTitle}>Editar Senha</Text>

            {mensagemErro ? (
              <View style={styles.aviso}>
                <Text style={styles.textoAviso}>{mensagemErro}</Text>
              </View>
            ) : null}

            <View style={{ flexDirection: 'column', gap: 10, marginTop: 10, marginBottom: 20 }}>
              <View style={modalStyles.inputSenha}>
                <TextInput
                  style={modalStyles.inputComIcone}
                  placeholder="Senha atual"
                  secureTextEntry={!showSenha}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                />

                <TouchableOpacity onPress={visibilidadeSenha}>
                  {showSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
                </TouchableOpacity>
              </View>
              <View style={modalStyles.inputSenha}>
                <TextInput
                  style={modalStyles.inputComIcone}
                  placeholder="Nova senha"
                  secureTextEntry={!showNewSenha}
                  value={NewSenha}
                  onChangeText={setNewSenha}
                />
                <TouchableOpacity onPress={visibilidadeNewSenha}>
                  {showNewSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
                </TouchableOpacity>
              </View>

              <View style={modalStyles.inputSenha}>
                <TextInput
                  style={modalStyles.inputComIcone}
                  placeholder="Confirmar nova senha"
                  secureTextEntry={!showConfirmNewSenha}
                  value={NewConfirmSenha}
                  onChangeText={setNewConfirmSenha}
                />
                <TouchableOpacity onPress={visibilidadeConfirmNewSenha}>
                  {showConfirmNewSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={modalStyles.modalButtons}>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                onPress={() => editarSenha()}
              >
                <Text style={modalStyles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                onPress={() => setOpenModalEditarSenha(false)}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

    </View >
  );
}

