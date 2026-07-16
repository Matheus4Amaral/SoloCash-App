import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { styles as modalStyles } from "../components/styles/modaisStyles";
import Svg, { Path } from 'react-native-svg';
import { EyeOff, Eye } from 'lucide-react-native';
import { styles } from './styles/LoginStyles';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Contexts/AuthContext';
import { enviarCodigo, verificarEAtivarConta, verificaPrazoParaAtivar } from '../Service/UsuarioService';
function Login({ navigation }) {

  const { signIn, usuario } = useAuth();
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemErroRedefinir, setMensagemErroRedefinir] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [isloadingRedefinir, setIsLoadingRedefinir] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [emailRedefinir, setEmailRedefinir] = useState('');
  const [modalAtiva, setModalAtiva] = useState(false);
  const [ativo, setAtivo] = useState(false);
  const [emailAtivar, setEmailAtivar] = useState('');
  const [isLoadingAtivar, setIsLoadingAtivar] = useState(false);
  const [mensagemErroAtiva, setMensagemErroAtiva] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [prazoExpirado, setPrazoExpirado] = useState(false);

  const RealizarLogin = async () => {
    if (!email || !senha) {
      setMensagemErro("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, senha);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      setIsLoading(false); // para ANTES de abrir o modal

      if (error.message.includes('Invalid login credentials')) {
        setMensagemErro('Email ou senha incorretos');
      } else if (error.message.includes('Conta desativada')) {
        const { error: prazoError } = await verificaPrazoParaAtivar(email);
        if (prazoError) {
          setMensagemErro(prazoError);
        } else {
          setModalAtiva(true);
        }
      } else {
        setMensagemErro('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  const redirectTo = Platform.OS === 'web'
    ? 'http://localhost:8081/redefinir-senha'
    : 'solocash://redefinir-senha';

  async function handleEsqueceuSenha() {

    setIsLoadingRedefinir(true);

    if (!emailRedefinir) {
      setMensagemErroRedefinir("Digite seu email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailRedefinir, { redirectTo: redirectTo });

    closeModal();
    setIsLoadingRedefinir(false);

    if (error) {
      setMensagemErroRedefinir('Erro ao enviar email: ' + error.message);
    }
  }


  const handleAtivarConta = async () => {
    if (!emailAtivar) {
      setMensagemErroAtiva("Digite seu email.");
      return;
    }

    setIsLoadingAtivar(true);

    const { error } = await enviarCodigo(emailAtivar);

    if (error) {
      setMensagemErroAtiva(typeof error === 'string' ? error : "Erro ao enviar código.");
      setIsLoadingAtivar(false);
      return;
    }

    setCodigoEnviado(true);
    setIsLoadingAtivar(false);
  };

  const handleVerificarCodigo = async () => {
    if (!codigoDigitado) {
      setMensagemErroAtiva("Digite o código recebido.");
      return;
    }

    setIsLoadingAtivar(true);

    const resultado = await verificarEAtivarConta(emailAtivar, codigoDigitado);

    if (!resultado.sucesso) {
      setMensagemErroAtiva(resultado.erro || "Código inválido ou expirado.");
      setIsLoadingAtivar(false);
      return;
    }

    closeModalAtiva();
    setMensagemErro("Conta ativada! Faça login novamente.");
    setIsLoadingAtivar(false);
  };


  const visibilidadeSenha = () => {
    setShowSenha(!showSenha);
  }

  useEffect(() => {
    if (mensagemErro) {
      const timer = setTimeout(() => setMensagemErro(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErro]);

  useEffect(() => {
    if (mensagemErroRedefinir) {
      const timer = setTimeout(() => setMensagemErroRedefinir(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErroRedefinir]);




  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text>Carregando dados...</Text>
      </View>
    )
  }

  const closeModal = () => {
    setOpenModal(false);
    setEmailRedefinir('');
    setMensagemErroRedefinir('');
  }

  const closeModalAtiva = () => {

    setModalAtiva(false);
    setEmailAtivar('');
    setIsLoadingAtivar(false)
    setAtivo(false)
    setCodigoDigitado('')
    setCodigoEnviado(false)
  }

  return (
    <View style={styles.screen}>
      <View style={styles.logo}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00C853"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </Svg>
      </View>

      <Text style={styles.nome}> SoloCash </Text>

      <Text style={styles.textoInicio}> Controle financeiro para quem mora sozinho </Text>


      <View style={styles.form}>
        <Text style={styles.titulo}> Entrar </Text>
        <Text style={styles.texto}>
          {' '}
          Acesse sua conta para gerenciar suas finanças{' '}
        </Text>

        {mensagemErro ? (
          <View style={styles.aviso}>
            <Text style={styles.textoAviso}>{mensagemErro}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          onChangeText={setEmail}
          value={email}>
        </TextInput>

        <View style={styles.inputSenha}>
          <TextInput
            style={styles.inputComIcone}
            placeholder="Digite sua senha"
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={!showSenha}
          />

          <TouchableOpacity onPress={visibilidadeSenha}>
            {showSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setOpenModal(true)}
        >
          <Text style={styles.esqSenha}>Esqueceu sua Senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmar}
          onPress={() => RealizarLogin()}
        >
          <Text
            style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.texto1}> OU </Text>

        <TouchableOpacity
          style={styles.cancelar}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.textoBotao1}>
            Criar Conta
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.textoFinal}>
        {' '}
        Ao continuar, você concorda com nosso Termos de Uso e Política de
        Privacidade.{' '}
      </Text>

      <Modal
        visible={openModal}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModal(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Redefinir Senha</Text>

            {mensagemErroRedefinir ? (
              <View style={styles.aviso}>
                <Text style={styles.textoAviso}>{mensagemErroRedefinir}</Text>
              </View>
            ) : null}

            <TextInput
              placeholder="Digite seu email"
              style={modalStyles.TextInput}
              value={emailRedefinir}
              onChangeText={setEmailRedefinir}
            />

            <View style={modalStyles.modalButtons}>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                onPress={handleEsqueceuSenha}
              >
                <Text style={modalStyles.buttonText}>
                  {isloadingRedefinir ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text>Enviar</Text>
                  )}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                onPress={closeModal}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalAtiva}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAtiva(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={modalStyles.modalContainer}>
            <View style={[modalStyles.modalContent, { height: 350 }]}>
              <Text style={modalStyles.modalTitle}>Status da Conta</Text>

              <Text style={[modalStyles.modalMessage, { textAlign: 'center' }]}>
                Sua conta está desativada. Para ativá-la, clique em reativar para receber as instruções.
              </Text>

              {mensagemErroAtiva ? (
                <View style={styles.aviso}>
                  <Text style={styles.textoAviso}>{mensagemErroAtiva}</Text>
                </View>
              ) : null}

              {!prazoExpirado && (
                <TouchableOpacity
                  style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                  onPress={() => setAtivo(true)}
                >
                  <Text style={modalStyles.buttonText}>Reativar Conta</Text>
                </TouchableOpacity>
              )}

              {ativo && (
                <>
                  <Text style={modalStyles.modalMessage}>Informe seu e-mail</Text>
                  <TextInput
                    placeholder="Digite seu email"
                    style={modalStyles.TextInput}
                    value={emailAtivar}
                    onChangeText={setEmailAtivar}
                  />

                  {codigoEnviado && (
                    <TextInput
                      placeholder="Digite o código recebido"
                      style={modalStyles.TextInput}
                      value={codigoDigitado}
                      onChangeText={setCodigoDigitado}
                      keyboardType="numeric"
                      maxLength={8}
                    />
                  )}
                </>
              )}

              <View style={modalStyles.modalButtons}>
                <TouchableOpacity
                  style={[modalStyles.button, { backgroundColor: '#2ECC71' }]}
                  onPress={codigoEnviado ? handleVerificarCodigo : handleAtivarConta}
                >
                  <Text style={modalStyles.buttonText}>
                    {isLoadingAtivar ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text>{codigoEnviado ? 'Verificar' : 'Enviar'}</Text>
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[modalStyles.button, { backgroundColor: '#e74d3c96' }]}
                  onPress={closeModalAtiva}
                >
                  <Text style={modalStyles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

export default Login;


