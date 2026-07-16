import { supabase } from '../../lib/supabase'

const transformarDataISOParaDate = (dataStr) => {
  if (!dataStr) return null
  const match = dataStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [, ano, mes, dia] = match
  return new Date(Number(ano), Number(mes) - 1, Number(dia))
}

const isDataAnteriorHoje = (dataStr) => {
  const dataAlerta = transformarDataISOParaDate(dataStr)
  if (!dataAlerta) return false
  const hoje = new Date()
  return dataAlerta < hoje
}

const isDataIgualOuAnteriorHoje = (dataStr) => {
  const dataAlerta = transformarDataISOParaDate(dataStr)
  if (!dataAlerta) return false
  const hoje = new Date()
  return dataAlerta <= hoje
}

const formatarDateParaISO = (date) => {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export const getAlertasAtivos = async (authId) => {
  const { data, error } = await supabase
    .from('alertas')
    .select('*')
    .eq('auth_id', authId)
    .eq('ativo', true)
    .order('data', { ascending: false })

  if (error) throw error
  return data || []
}

export const getAlertasDoUsuario = async (authId) => {
  const { data, error } = await supabase
    .from('alertas')
    .select('*')
    .eq('auth_id', authId)
    .order('data', { ascending: true })

  if (error) throw error
  return data || []
}

const getTotalTransacoesMesAnterior = async (authId, tipo) => {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = hoje.getMonth()
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0)
  const inicioStr = formatarDateParaISO(inicio)
  const fimStr = formatarDateParaISO(fim)

  const { data, error } = await supabase
    .from('transacoes')
    .select('valor')
    .eq('auth_id', authId)
    .eq('tipo', tipo)
    .gte('data', inicioStr)
    .lte('data', fimStr)

  if (error) throw error
  return (data || []).reduce((total, item) => total + (Number(item.valor) || 0), 0)
}

export const criarAlertaSaldoMesAnterior = async (authId) => {
  if (!authId) return null
  const hoje = new Date()
  if (hoje.getDate() !== 1) return null

  const ganhos = await getTotalTransacoesMesAnterior(authId, 'entrada')
  const gastos = await getTotalTransacoesMesAnterior(authId, 'saida')
  const diferenca = ganhos - gastos
  if (diferenca === 0) return null

  const titulo = diferenca > 0 ? 'Economia Realizada' : 'Prejuizo'
  const descricao = diferenca > 0
    ? `Parabéns! Você economizou R$ ${diferenca.toFixed(2)} ao fim do mês anterior`
    : `Poxa... Você teve um prejuízo de R$ ${Math.abs(diferenca).toFixed(2)} ao final do mês anterior`
  const hojeStr = formatarDateParaISO(hoje)

  const { data: existing, error: queryError } = await supabase
    .from('alertas')
    .select('id')
    .eq('auth_id', authId)
    .eq('data', hojeStr)
    .eq('titulo', titulo)
    .maybeSingle()

  if (queryError) throw queryError
  if (existing) return existing

  return await createAlerta(authId, titulo, descricao, hojeStr)
}

export const atualizarAlertasAtivos = async (authId) => {
  const hoje = new Date()
  const hojeStr = formatarDateParaISO(hoje)

  const { data, error } = await supabase
    .from('alertas')
    .update({ ativo: true })
    .eq('auth_id', authId)
    .eq('ativo', false)
    .lte('data', hojeStr)

  if (error) throw error
  return data || []
}

export const createAlerta = async (authId, titulo, descricao, dataFormatada) => {
  const ativo = isDataIgualOuAnteriorHoje(dataFormatada)

  const { data, error } = await supabase
    .from('alertas')
    .insert({
      auth_id: authId,
      titulo,
      descricao: descricao || null,
      data: dataFormatada,
      ativo,
    })

  if (error) throw error
  return data
}

export const updateAlerta = async (id, titulo, descricao, dataFormatada) => {
  const campos = {}
  if (titulo !== undefined) campos.titulo = titulo
  if (descricao !== undefined) campos.descricao = descricao || null
  if (dataFormatada !== undefined) {
    campos.data = dataFormatada
    campos.ativo = isDataIgualOuAnteriorHoje(dataFormatada)
  }

  const { data, error } = await supabase
    .from('alertas')
    .update(campos)
    .eq('id', id)

  if (error) throw error
  return data
}

export const deleteAlerta = async (id) => {
  const { data, error } = await supabase
    .from('alertas')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}