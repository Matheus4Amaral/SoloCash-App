import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { styles } from '../pages/styles/GraficoStyles';
import { getGastosMes } from '../Service/GastosService';
import { useAuth } from "../Contexts/AuthContext";

export default function Grafico() {

    const [gastos, setGastos] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const { usuario } = useAuth();

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

    useEffect(() => {
        fetchGastos();
    }, [])

    const widthAndHeight = 140;

    const Cores = [
        '#A9C9DC', '#1F78B4', '#A8D46A', '#FF7F00', '#E31A1C',
        '#6A3D9A', '#B15928', '#33A02C', '#FB9A99', '#FDBF6F',
    ];

    const getColor = (index) => Cores[index % Cores.length];

    const categorias = Object.values(
        gastos.reduce((acc, gasto) => {
            const nome = gasto.categorias?.nome || gasto.categoria_pessoal?.nome || 'Sem categoria';
            const valor = parseFloat(gasto.valor);

            if (!acc[nome]) {
                acc[nome] = {
                    nome,
                    valor: 0,
                    cor: getColor(Object.keys(acc).length),
                };
            }
            acc[nome].valor += valor;

            return acc;
        }, {})
    );

    //console.log(categorias)

    const series = categorias.map(({ valor, cor }) => ({ value: valor, color: cor }));

    const total = categorias.reduce((acc, item) => acc + item.valor, 0);

    const calcularPorcentagem = (valor) => {
        return ((valor / total) * 100).toFixed(2).replace('.', ',') + '%';
    };

    return (
        <View style={styles.container}>

            {isloading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2C3E50" />
                    <Text>Carregando dados...</Text>
                </View>
            ) : total === 0 ? (
                <View style={styles.center}>
                    <Text>Nenhum gasto registrado este mês.</Text>
                </View>
            ) : (
                <>
                    <View style={styles.chartArea}>
                        <PieChart
                            widthAndHeight={widthAndHeight}
                            series={series}
                            coverRadius={0.85}
                            innerRadius={70}
                            coverFill="#FFFFFF"
                        />
                    </View>

                    <View style={styles.legendArea}>
                        {categorias.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.dot, { backgroundColor: item.cor }]} />
                                    <View>
                                        <Text style={styles.label}>{item.nome}</Text>
                                        <Text style={styles.value}>
                                            R$ {item.valor.toFixed(2).replace('.', ',')}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.percent}>
                                    {calcularPorcentagem(item.valor)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

        </View>
    );
}

