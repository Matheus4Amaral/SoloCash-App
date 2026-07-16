import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { EyeOff, Eye } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from './styles/LoginStyles';
import { supabase } from '../../lib/supabase';
import { redefinirSenha } from '../Service/UsuarioService';

function RedefinirSenha({ navigation }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mensagemErro) {
      const timer = setTimeout(() => setMensagemErro(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErro]);

  const handleRedefinir = async () => {
    if (!novaSenha || !confirmarSenha) {
      setMensagemErro('Preencha todos os campos.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagemErro('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setMensagemErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      await redefinirSenha(novaSenha);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      setMensagemErro('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  useEffect(() => {
    // Web
    if (typeof window !== 'undefined' && window.location?.hash.includes('type=recovery')) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          setTimeout(() => navigationRef.current?.navigate('redefinir-senha'), 300);
        });
      return;
    }

    // Mobile (deep link)
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('type=recovery')) {
        const params = new URLSearchParams(url.split('#')[1]);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => {
            setTimeout(() => navigationRef.current?.navigate('redefinir-senha'), 300);
          });
      }
    });
  }, []);
  
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
        <Text style={styles.titulo}>Nova Senha</Text>
        <Text style={styles.texto}>Digite e confirme sua nova senha</Text>

        {mensagemErro ? (
          <View style={styles.aviso}>
            <Text style={styles.textoAviso}>{mensagemErro}</Text>
          </View>
        ) : null}

        <View style={styles.inputSenha}>
          <TextInput
            style={styles.inputComIcone}
            placeholder="Nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={!showNovaSenha}
          />
          <TouchableOpacity onPress={() => setShowNovaSenha(!showNovaSenha)}>
            {showNovaSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
          </TouchableOpacity>
        </View>

        <View style={styles.inputSenha}>
          <TextInput
            style={styles.inputComIcone}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!showConfirmarSenha}
          />
          <TouchableOpacity onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}>
            {showConfirmarSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.confirmar, { marginBottom: 20 }]} onPress={handleRedefinir}>
          <Text style={styles.textoBotao}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.textoFinal}>
        Ao continuar, você concorda com nosso Termos de Uso e Política de Privacidade.
      </Text>
    </View>
  );
}

export default RedefinirSenha;