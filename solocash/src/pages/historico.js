import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native";
import { ArrowLeft, Clock3, ChevronDown, ChevronUp, Search, Bell, User, TrendingDown, TrendingUp, X, FileText, BanknoteX, BanknoteArrowDown, BanknoteArrowUp, ArrowDownWideNarrow, MoveDown, ArrowDownNarrowWide, Calendar } from "lucide-react-native";
import Navigation from "../components/navigation";
import { styles } from "./styles/HistoricoStyles";
import { useAuth } from "../Contexts/AuthContext";
import UserDropdown from "../components/UserDropDown";
import { getTodasMovimentacoes } from "../Service/HistoricoService";
import { getCategorias } from "../Service/CategoriaService";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const formatarMoeda = (valor) =>
	valor.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

const parseData = (texto) => {
	if (!texto) return null;

	const partes = texto.split("/");
	if (partes.length !== 3) return null;
	const [dia, mes, ano] = partes.map(Number);
	if (!dia || !mes || !ano || ano < 1000) return null;
	const data = new Date(ano, mes - 1, dia);

	if (data.getDate() !== dia || data.getMonth() !== mes - 1) return null;

	return data;
};

const converterDataParaExibicao = (dataISO) => {
	if (!dataISO) return '';
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
};

export default function Historico({ navigation }) {

	const [tipoFiltro, setTipoFiltro] = useState("todos");
	const [busca, setBusca] = useState("");
	const [dataInicioBusca, setDataInicioBusca] = useState('');
	const [dataFimBusca, setDataFimBusca] = useState('');
	const [abrirCategorias, setAbrirCategorias] = useState(false);
	const [categoria, setCategoria] = useState("");
	const [ordenarPor, setOrdenarPor] = useState("nenhum");
	const [ordenarDataPor, setOrdenarDataPor] = useState("decrescente");
	const { usuario, nome: nomeUsuario } = useAuth();
	const [abrirDropdown, setAbrirDropdown] = useState(false);
	const [historico, setHistorico] = useState([])
	const [categorias, setCategorias] = useState([])
	const [abrirPeriodo, setAbrirPeriodo] = useState(false);
	const [isLoading, setIsLoading] = useState(false)

	const fetchTodasMovimentacoes = async () => {
		setIsLoading(true)
		try {
			const response = await getTodasMovimentacoes(usuario?.id)
			setHistorico(response)
		} catch (error) {
			console.error('Erro ao buscar todas movimentações:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const fetchCategorias = async () => {
		try {
			const data = await getCategorias(usuario?.id);
			setCategorias(data);
		} catch (error) {
			console.error('Erro ao buscar categorias:', error);
		}
	}

	useEffect(() => {
		fetchTodasMovimentacoes()
		fetchCategorias()
	}, [])



	const alternarEstado = (estado, estados) => {
		const indice = estados.indexOf(estado);
		return estados[(indice + 1) % estados.length];
	};

	const formatarDataLocal = (date) => {
		const dia = String(date.getDate()).padStart(2, '0');
		const mes = String(date.getMonth() + 1).padStart(2, '0');
		const ano = date.getFullYear();
		return `${dia}/${mes}/${ano}`;
	};

	const abrirDatePicker = (campo) => {
		const valorAtual =
			campo === 'inicio'
				? dataInicioBusca
				: dataFimBusca;

		let dateObject = new Date();

		if (valorAtual) {
			const partes = valorAtual.split('/');
			if (partes.length === 3) {
				const [dia, mes, ano] = partes.map(Number);
				dateObject = new Date(ano, mes - 1, dia);
			}
		}

		DateTimePickerAndroid.open({
			value: dateObject,
			mode: 'date',
			is24Hour: true,
			onChange: (event, selectedDate) => {
				if (event.type !== 'set' || !selectedDate) return;

				const dataFormatada =
					formatarDataLocal(selectedDate);

				if (campo === 'inicio') {
					setDataInicioBusca(dataFormatada);
				} else {
					setDataFimBusca(dataFormatada);
				}
			}
		});
	};

	const transacoesFiltradas = useMemo(() => {
		const inicio = parseData(dataInicioBusca);
		const fim = parseData(dataFimBusca);
		let resultado = historico.filter((item) => {
			const ehGanho = item.tipo == "entrada";
			const nomeCategoria = item.categorias?.nome || item.categoria_pessoal?.nome || "";
			const texto = `${item.descricao} ${nomeCategoria}`.toLowerCase();
			const dataItem = parseData(converterDataParaExibicao(item.data));

			if (tipoFiltro === "entrada" && !ehGanho) return false;
			if (tipoFiltro === "saida" && ehGanho) return false;
			if (categoria && nomeCategoria !== categoria) return false;
			if (busca && !texto.includes(busca.toLowerCase())) return false;
			if (inicio && dataItem && dataItem < inicio) return false;
			if (fim && dataItem && dataItem > fim) return false;

			return true;
		});

		const comparadores = [];

		if (ordenarPor === "crescente") {
			comparadores.push((a, b) => a.valor - b.valor);
		} else if (ordenarPor === "decrescente") {
			comparadores.push((a, b) => b.valor - a.valor);
		}

		if (ordenarDataPor === "crescente") {
			comparadores.push((a, b) => parseData(a.data) - parseData(b.data));
		} else if (ordenarDataPor === "decrescente") {
			comparadores.push((a, b) => parseData(b.data) - parseData(a.data));
		}

		resultado.sort((a, b) => {
			for (const comparar of comparadores) {
				const valorComparacao = comparar(a, b);
				if (valorComparacao !== 0) return valorComparacao;
			}

			return 0;
		});

		return resultado;
	}, [busca, historico, categoria, dataFimBusca, dataInicioBusca, tipoFiltro, ordenarPor, ordenarDataPor]);

	const entradasTotal = transacoesFiltradas
		.filter((item) => item.tipo === "entrada")
		.reduce((total, item) => total + item.valor, 0);

	const saidasTotal = transacoesFiltradas
		.filter((item) => item.tipo === "saida")
		.reduce((total, item) => total + item.valor, 0);

	const montarHtml = (transacoes, periodoTexto) => {
		const entradas = transacoes.filter(i => i.tipo === 'entrada').reduce((t, i) => t + i.valor, 0);
		const saidas = transacoes.filter(i => i.tipo === 'saida').reduce((t, i) => t + i.valor, 0);

		const linhas = transacoes.map((item, index) => {
			const ehGanho = item.tipo === 'entrada';
			const nomeCategoria = item.categorias?.nome || item.categoria_pessoal?.nome || '-';
			const corValor = ehGanho ? '#1E8449' : '#E74C3C';
			const corFundo = index % 2 === 0 ? '#FFFFFF' : '#F8F9FA';

			return `
			<tr style="background-color: ${corFundo};">
			<td>${item.descricao}</td>
			<td>
				<span style="
				padding: 3px 10px;
				border-radius: 12px;
				font-size: 11px;
				font-weight: bold;
				color: white;
				background-color: ${ehGanho ? '#1E8449' : '#E74C3C'};
				">
				${ehGanho ? 'Ganho' : 'Gasto'}
				</span>
			</td>
			<td>${nomeCategoria}</td>
			<td style="color: ${corValor}; font-weight: bold;">${formatarMoeda(item.valor)}</td>
			<td>${converterDataParaExibicao(item.data)}</td>
			</tr>
		`;
		}).join('');

		return `
		<html>
		<head>
			<style>
			body { font-family: Helvetica, Arial, sans-serif; color: #2C3E50; padding: 30px; }
			h1 { color: #2C3E50; border-bottom: 3px solid #2ECC71; padding-bottom: 10px; }
			.resumo { display: flex; gap: 20px; margin: 20px 0 30px; }
			.card { flex: 1; border-radius: 10px; padding: 15px; text-align: center; }
			.card-entrada { background-color: #1E844915; border: 1px solid #1E8449; }
			.card-saida { background-color: #E74C3C15; border: 1px solid #E74C3C; }
			.card-titulo { font-size: 12px; color: #5D6D7E; margin-bottom: 5px; }
			.card-valor { font-size: 20px; font-weight: bold; }
			.topo { display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
			table { width: 100%; border-collapse: collapse; margin-top: 10px; }
			th { background-color: #2C3E50; color: white; padding: 10px; text-align: left; font-size: 12px; }
			td { padding: 10px; font-size: 12px; border-bottom: 1px solid #E0E0E0; }
			.periodo { font-size: 13px; color: #5D6D7E; font-weight: normal; margin-top: -5px; }
			</style>
		</head>
		<body>
			<div class="topo">
				<h1>Histórico SoloCash</h1>
				<h3 class="periodo">${periodoTexto}</h3>
			</div>
			<div class="resumo">
				<div class="card card-entrada">
					<div class="card-titulo">Entradas</div>
					<div class="card-valor" style="color: #1E8449;">${formatarMoeda(entradas)}</div>
				</div>
				<div class="card card-saida">
					<div class="card-titulo">Saídas</div>
					<div class="card-valor" style="color: #E74C3C;">${formatarMoeda(saidas)}</div>
				</div>
			</div>
			<table>
				<tr>
					<th>Descrição</th>
					<th>Tipo</th>
					<th>Categoria</th>
					<th>Valor</th>
					<th>Data</th>
				</tr>
				${linhas}
			</table>
		</body>
		</html>
	`;
	};

	const gerarPDF = async (transacoes) => {

		const PeriodoTexto = dataInicioBusca && dataFimBusca && `Período: ${dataInicioBusca} até ${dataFimBusca}`

		const html = montarHtml(transacoes, PeriodoTexto);

		const { uri } = await Print.printToFileAsync({ html });

		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(uri);
		}
	};

	const aplicarPeriodo = (meses) => {
		const hoje = new Date();
		const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - meses, hoje.getDate());

		const formatar = (data) => {
			const dia = String(data.getDate()).padStart(2, '0');
			const mes = String(data.getMonth() + 1).padStart(2, '0');
			const ano = data.getFullYear();
			return `${dia}/${mes}/${ano}`;
		};

		setDataInicioBusca(formatar(inicio));
		setDataFimBusca(formatar(hoje));
		setAbrirPeriodo(false);
	};


	return (
		<View style={styles.screen}>
			<ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 160 }]}>
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
								<Text style={styles.textoVoltar}> Histórico Financeiro</Text>
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

						<View style={styles.cardsResumo}>
							<View style={styles.cardResumo}>
								<View style={[styles.iconeResumo, styles.iconeEntrada]}>
									<TrendingUp color="#1E8449" size={26} />
								</View>
								<Text style={styles.tituloResumo}>Entradas</Text>
								<Text style={[styles.valorResumo, styles.valorEntrada]}>
									{formatarMoeda(entradasTotal)}
								</Text>
							</View>

							<View style={styles.cardResumo}>
								<View style={[styles.iconeResumo, styles.iconeSaida]}>
									<TrendingDown color="#E74C3C" size={26} />
								</View>
								<Text style={styles.tituloResumo}>Saídas</Text>
								<Text style={[styles.valorResumo, styles.valorSaida]}>
									{formatarMoeda(saidasTotal)}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.filtroCard}>
						<View style={styles.buscaArea}>
							<Search size={22} color="#8091A7" />
							<TextInput
								value={busca}
								onChangeText={setBusca}
								placeholder="Buscar Transação"
								placeholderTextColor="#8091A7"
								style={styles.inputBusca}
							/>
						</View>

						<View style={styles.filtrosTipo}>
							<TouchableOpacity
								style={[styles.botaoTipo, tipoFiltro === "todos" && styles.botaoTipoAtivo]}
								onPress={() => setTipoFiltro("todos")}
							>
								<Text style={styles.textoBotaoTipo}>Todos</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.botaoTipo,
									tipoFiltro === "entrada" && styles.botaoTipoAtivoGanhos,
								]}
								onPress={() => setTipoFiltro("entrada")}
							>
								<TrendingUp size={18} color={tipoFiltro === "entrada" ? "white" : "#334155"} />
								<Text style={[styles.textoBotaoTipo, tipoFiltro === "entrada" && styles.textoBotaoTipoAtivo]}>
									Ganhos
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.botaoTipo,
									tipoFiltro === "saida" && styles.botaoTipoAtivoGastos,
								]}
								onPress={() => setTipoFiltro("saida")}
							>
								<TrendingDown size={18} color={tipoFiltro === "saida" ? "white" : "#334155"} />
								<Text style={[styles.textoBotaoTipo, tipoFiltro === "saida" && styles.textoBotaoTipoAtivo]}>
									Gastos
								</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.tituloSecao}>Categorias:</Text>
						<View style={styles.areaCategoria}>
							<TouchableOpacity
								style={styles.botaoCategoria}
								onPress={() => setAbrirCategorias((prev) => !prev)}
							>
								<Text style={styles.textoCategoriaBotao}>
									{categoria || "Categoria"}
								</Text>
								{abrirCategorias ? (
									<ChevronUp size={16} color="#94A3B8" />
								) : (
									<ChevronDown size={16} color="#94A3B8" />
								)}
							</TouchableOpacity>

							{categoria ? (
								<TouchableOpacity
									style={styles.botaoLimparCategoria}
									onPress={() => setCategoria("")}
								>
									<X size={14} color="#334155" />
								</TouchableOpacity>
							) : null}

							{abrirCategorias && (
								<View style={styles.listaCategorias}>
									<TouchableOpacity
										style={styles.itemCategoria}
										onPress={() => {
											setCategoria("");
											setAbrirCategorias(false);
										}}
									>
										<Text style={styles.textoItemCategoria}>Todas</Text>
									</TouchableOpacity>
									{categorias.map((item) => (
										<TouchableOpacity
											key={item.id}
											style={styles.itemCategoria}
											onPress={() => {
												setCategoria(item.nome);
												setAbrirCategorias(false);
											}}
										>
											<Text style={styles.textoItemCategoria}>{item.nome}</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						<View>
							<Text style={styles.tituloSecao}>Análise por período:</Text>

							<View style={styles.areaCategoria}>
								<TouchableOpacity
									style={styles.botaoCategoria}
									onPress={() => setAbrirPeriodo((prev) => !prev)}
								>
									<Text style={styles.textoCategoriaBotao}>
										{dataInicioBusca && dataFimBusca ? `${dataInicioBusca} até ${dataFimBusca}` : "Selecionar período"}
									</Text>
									{abrirPeriodo ? (
										<ChevronUp size={16} color="#94A3B8" />
									) : (
										<ChevronDown size={16} color="#94A3B8" />
									)}
								</TouchableOpacity>

								{(dataInicioBusca || dataFimBusca) ? (
									<TouchableOpacity
										style={styles.botaoLimparCategoria}
										onPress={() => {
											setDataInicioBusca("");
											setDataFimBusca("");
										}}
									>
										<X size={14} color="#334155" />
									</TouchableOpacity>
								) : null}

								{abrirPeriodo && (
									<View style={styles.listaCategorias}>
										<TouchableOpacity style={styles.itemCategoria} onPress={() => aplicarPeriodo(1)}>
											<Text style={styles.textoItemCategoria}>Últimos 30 dias</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.itemCategoria} onPress={() => aplicarPeriodo(3)}>
											<Text style={styles.textoItemCategoria}>Últimos 90 dias</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.itemCategoria} onPress={() => aplicarPeriodo(6)}>
											<Text style={styles.textoItemCategoria}>Últimos 180 dias</Text>
										</TouchableOpacity>
									</View>
								)}

							</View>
						</View>


						<View style={styles.areaPeriodo}>
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
								<TextInput
									value={dataInicioBusca}
									onChangeText={setDataInicioBusca}
									placeholder="DD/MM/AAAA"
									placeholderTextColor="#94A3B8"
									style={[styles.inputPeriodo, { flex: 1, fontSize: 11 }]}
								/>
								<TouchableOpacity onPress={() => abrirDatePicker('inicio')}>
									<Calendar color="#2C3E50" size={22} />
								</TouchableOpacity>
							</View>

							<Text style={styles.textoEntrePeriodo}>até</Text>

							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
								<TextInput
									value={dataFimBusca}
									onChangeText={setDataFimBusca}
									placeholder="DD/MM/AAAA"
									placeholderTextColor="#94A3B8"
									style={[styles.inputPeriodo, { flex: 1, fontSize: 11 }]}
								/>
								<TouchableOpacity onPress={() => abrirDatePicker('fim')}>
									<Calendar color="#2C3E50" size={22} />
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={styles.listaCard}>
						{transacoesFiltradas.length === 0 ? (
							<View style={styles.estadoVazio}>
								<Text style={styles.textoVazio}>Nenhuma transação encontrada.</Text>
							</View>
						) : (
							<>
								<View style={styles.cabecalhoResultados}>
									<Text style={styles.tituloResultados}>
										{transacoesFiltradas.length === 1
											? "1 resultado obtido"
											: `${transacoesFiltradas.length} resultados obtidos`}
									</Text>
									<View style={styles.areaIconesOrdenacao}>
										<TouchableOpacity
											style={styles.botaoIcone}
											onPress={() => gerarPDF(transacoesFiltradas)}
										>
											<FileText size={22} color="#E74C3C" />
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.botaoIcone}
											onPress={() => setOrdenarPor((estado) => alternarEstado(estado, ["nenhum", "crescente", "decrescente"]))}
										>
											{ordenarPor === "nenhum" ? (
												<BanknoteX size={22} color="#334155" />
											) : ordenarPor === "crescente" ? (
												<BanknoteArrowDown size={22} color="#334155" />
											) : (
												<BanknoteArrowUp size={22} color="#334155" />
											)}
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.botaoIcone}
											onPress={() => setOrdenarDataPor((estado) => alternarEstado(estado, ["decrescente", "nenhum", "crescente"]))}
										>
											{ordenarDataPor === "decrescente" ? (
												<ArrowDownWideNarrow size={22} color="#334155" />
											) : ordenarDataPor === "nenhum" ? (
												<MoveDown size={22} color="#334155" />
											) : (
												<ArrowDownNarrowWide size={22} color="#334155" />
											)}
										</TouchableOpacity>
									</View>
								</View>
								{isLoading ? (
									<View style={styles.center}>
										<ActivityIndicator size="large" color="#2C3E50" />
										<Text>Carregando dados...</Text>
									</View>
								) : (
									<View style={styles.listaResultados}>
										{transacoesFiltradas.map((item) => {
											const ehGanho = item.tipo == "entrada";

											return (
												<View key={item.id} style={styles.itemResultado}>
													<View style={[styles.iconeItemResultado, ehGanho ? styles.iconeEntrada : styles.iconeSaida]}>
														{ehGanho ? (
															<TrendingUp color="#1E8449" size={20} />
														) : (
															<TrendingDown color="#E74C3C" size={20} />
														)}
													</View>

													<Text style={styles.textoNomeResultado}>{item.descricao}</Text>

													<Text style={[styles.textoValorResultado, ehGanho ? styles.valorEntrada : styles.valorSaida]}>
														{formatarMoeda(item.valor)}
													</Text>

													<Text style={styles.textoDataResultado}>{converterDataParaExibicao(item.data)}</Text>
												</View>
											);
										})}
									</View>
								)}
							</>
						)}
					</View>
				</Pressable>
			</ScrollView>

			<Navigation pagina={3} />
		</View>
	);
}
