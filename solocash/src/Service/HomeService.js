import { supabase } from '../../lib/supabase'

export const GetUltimasMovimentacoes = async (authId) => {

    const { data, error } = await supabase
        .from('transacoes')
        .select('*, categorias(nome), categoria_pessoal(nome)')
        .eq('auth_id', authId)
        .order('data', { ascending: false })
        .limit(5)

    if (error) throw error
    return data
}