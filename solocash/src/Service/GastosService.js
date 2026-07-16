import { supabase } from '../../lib/supabase'

const verificarLimitesGasto = async (authId, categoriaPessoalId, dataFormatada) => {
  if (!categoriaPessoalId) return

  const { data: categoriaData, error: catError } = await supabase
    .from('categoria_pessoal')
    .select('nome, valor_max')
    .eq('id', categoriaPessoalId)
    .single()

  if (catError || !categoriaData || !categoriaData.valor_max) return

  const dataAtual = new Date(dataFormatada)
  const ano = dataAtual.getFullYear()
  const mes = dataAtual.getMonth()
  const inicio = new Date(ano, mes, 1)

  const inicioStr = inicio.toISOString().split('T')[0]
  const fimStr = dataFormatada

  const { data: transacoes, error: transError } = await supabase
    .from('transacoes')
    .select('valor')
    .eq('auth_id', authId)
    .eq('tipo', 'saida')
    .eq('categoria_pessoal_id', categoriaPessoalId)
    .gte('data', inicioStr)
    .lte('data', fimStr)

  if (transError) return

  const totalGasto = (transacoes || []).reduce((sum, t) => sum + (Number(t.valor) || 0), 0)
  const valorMax = Number(categoriaData.valor_max)
  const percentual = (totalGasto / valorMax) * 100

  let valorAtingido = null
  if (percentual >= 100) valorAtingido = 100
  else if (percentual >= 80) valorAtingido = 80
  else if (percentual >= 60) valorAtingido = 60

  if (valorAtingido) {
    const titulo = 'Gasto Alto'
    const descricao = `Você atingiu ${valorAtingido}% do limite em gastos em ${categoriaData.nome}`

    const { data: existingAlert } = await supabase
      .from('alertas')
      .select('id')
      .eq('auth_id', authId)
      .eq('titulo', titulo)
      .eq('descricao', descricao)
      .eq('data', dataFormatada)
      .maybeSingle()

    if (!existingAlert) {
      await supabase
        .from('alertas')
        .insert({
          auth_id: authId,
          titulo,
          descricao,
          data: dataFormatada,
          ativo: true,
        })
    }
  }
}

export const getGastosMes = async (authId) => {

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const inicio = new Date(ano, mes, 1);
    const fim = new Date(ano, mes + 1, 0);

    const inicioStr = inicio.toISOString().split('T')[0];
    const fimStr = fim.toISOString().split('T')[0];
    
    const { data, error } = await supabase
        .from('transacoes')
        .select('*, categorias(nome), categoria_pessoal(nome)')
        .eq('auth_id', authId)
        .eq('tipo', 'saida')
        .gte('data', inicioStr)
        .lte('data', fimStr);

    if (error) throw error
    return data
}

export const createGastos = async (authId, nome, valor, idCategoria, idCategoriaPessoal, dataFormatada) => {

    const { data, error } = await supabase
        .from('transacoes')
        .insert({
            auth_id: authId,
            tipo: 'saida',
            descricao: nome,
            valor: valor ? Number(valor) : null,
            categoria_id: idCategoria,
            categoria_pessoal_id: idCategoriaPessoal,
            data: dataFormatada
        })

    if (error) throw error

    await verificarLimitesGasto(authId, idCategoriaPessoal, dataFormatada)
}

export const updateGastos = async (id, nome, valor, idCategoria, idCategoriaPessoal, dataFormatada) => {

    const campos = {}

    if (nome !== undefined) campos.descricao = nome
    if (valor !== undefined) campos.valor = valor ? Number(valor) : null
    if (dataFormatada !== undefined) campos.data = dataFormatada

    if (idCategoria !== undefined || idCategoriaPessoal !== undefined) {
        campos.categoria_id = idCategoria ?? null
        campos.categoria_pessoal_id = idCategoriaPessoal ?? null
    }

    const { data: currentData } = await supabase
        .from('transacoes')
        .select('auth_id, categoria_pessoal_id, data')
        .eq('id', id)
        .single()

    const { data, error } = await supabase
        .from('transacoes')
        .update(campos)
        .eq('id', id)

    if (error) throw error

    const categoriaPessoalIdToCheck = idCategoriaPessoal ?? currentData?.categoria_pessoal_id
    const dataToCheck = dataFormatada || currentData?.data
    
    if (currentData?.auth_id && categoriaPessoalIdToCheck && dataToCheck) {
        await verificarLimitesGasto(currentData.auth_id, categoriaPessoalIdToCheck, dataToCheck)
    }
}

export const deleteGastos = async (id) => {
    const { data, error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const getValorTotalGastos = async (authId) => {
    const { data, error } = await supabase
        .from('soma_gastos_mes')
        .select('total')
        .eq('auth_id', authId)
        .maybeSingle();

    if (error) throw error;
    return data?.total ?? 0;
}

export const getValorTotalGastosMesAnterior = async (authId) => {
    const { data, error } = await supabase
        .from('soma_gastos_mes_anterior')
        .select('total')
        .eq('auth_id', authId)
        .maybeSingle();

    if (error) throw error;
    return data?.total ?? 0;
}