import { supabase } from '../../lib/supabase'

export const getCategorias = async (authId) => {
  const { data: padrao, error: erroPadrao } = await supabase
    .from('categorias')
    .select('*')

  if (erroPadrao) throw erroPadrao

  const { data: pessoal, error: erroPessoal } = await supabase
    .from('categoria_pessoal')
    .select('*')
    .eq('auth_id', authId)

  if (erroPessoal) throw erroPessoal


  const pessoalMap = new Map(pessoal.map(c => [c.nome.toLowerCase(), c]))

  const juncao = padrao.map(c => pessoalMap.get(c.nome.toLowerCase()) ?? { ...c, _padrao: true })

  const nomesPadrao = new Set(padrao.map(c => c.nome.toLowerCase()))
  const extras = pessoal.filter(c => !nomesPadrao.has(c.nome.toLowerCase()))

  return [...juncao, ...extras]
}

export const createCategoria = async (authId, nome, valor) => {
  const { data, error } = await supabase
    .from('categoria_pessoal')
    .insert({ auth_id: authId, nome, valor_max: valor ? Number(valor) : null })

  if (error) throw error
}

export const updateCategoria = async (id, nome, valor, isPadrao, authId, nomeOriginal) => {
  const campos = {}
  if (nome !== undefined) campos.nome = nome
  if (valor !== undefined) campos.valor_max = valor ? Number(valor.replace(',', '.')) : null

  if (isPadrao) {
    const { error } = await supabase
      .from('categoria_pessoal')
      .insert({ auth_id: authId, nome: nomeOriginal, ...campos })

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('categoria_pessoal')
      .update(campos)
      .eq('id', id)

    if (error) throw error
  }
}

export const deleteCategoria = async (id, isPadrao) => {
  if (isPadrao) return 

  const { error } = await supabase
    .from('categoria_pessoal')
    .delete()
    .eq('id', id)

  if (error) throw error
}