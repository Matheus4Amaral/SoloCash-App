import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { EyeOff, Eye } from 'lucide-react-native';
import { styles } from './styles/RegisterStyles';
import { supabase } from "../../lib/supabase";
import { useAuth } from '../Contexts/AuthContext';
function Register({ navigation }) {

    const { signUp } = useAuth();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');

    const RealizarCadastro = async () => {

        if (!nome || !email || !senha || !confirmarSenha) {
            setMensagemErro("Preencha todos os campos.");
            return;
        }


        if (senha !== confirmarSenha) {
            setMensagemErro("As senhas não coincidem.");
            return;
        }

        try {
            await signUp(nome, email, senha);
            navigation.navigate('Login');
        } catch (error) {
            if (error.message.includes('invalid format')) {
                setMensagemErro('Email inválido');
            } else if (error.message.includes('already registered')) {
                setMensagemErro('Email já cadastrado');
            } else if (error.message.includes('at least 6')) {
                setMensagemErro('A senha deve ter no mínimo 6 caracteres');
            } else {
                setMensagemErro('Erro ao criar conta. Tente novamente.');
            }
        }
    }

    const visibilidadeSenha = () => {
        setShowSenha(!showSenha);
    }

    const visibilidadeConfirmarSenha = () => {
        setShowConfirmarSenha(!showConfirmarSenha);
    }

    useEffect(() => {
        if (mensagemErro) {
            const timer = setTimeout(() => setMensagemErro(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensagemErro]);


    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.voltar}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.seta}>←</Text>
                    <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logo}>
                <Svg
                    width={50}
                    height={50}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00C853"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                    <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </Svg>
            </View>

            <Text style={styles.nome}>SoloCash</Text>

            <Text style={styles.texto}>Comece a controlar suas finanças hoje</Text>

            <View style={styles.form}>
                <Text style={styles.titulo}>Criar Conta</Text>

                {mensagemErro ? (
                    <View style={styles.aviso}>
                        <Text style={styles.textoAviso}>{mensagemErro}</Text>
                    </View>
                ) : null}

                <TextInput
                    style={styles.input}
                    placeholder="Digite seu Nome"
                    onChangeText={setNome}
                    value={nome}
                />

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={setEmail}
                    value={email}
                />

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

                <View style={styles.inputSenha}>
                    <TextInput
                        style={styles.inputComIcone}
                        placeholder="Confirme sua senha"
                        onChangeText={setConfirmarSenha}
                        value={confirmarSenha}
                        secureTextEntry={!showConfirmarSenha}
                    />

                    <TouchableOpacity onPress={visibilidadeConfirmarSenha}>
                        {showConfirmarSenha ? <EyeOff size={20} color="#2C3E50" /> : <Eye size={20} color="#2C3E50" />}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.confirmar}
                    onPress={() => RealizarCadastro()}
                >
                    <Text style={styles.textoBotao}>Confirmar</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                    <Text style={styles.texto1}>Já tem uma conta? </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.entrar}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Register;

