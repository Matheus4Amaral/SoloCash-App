import { supabase } from '../../lib/supabase'

export const getTodasMovimentacoes = async (authId) => {

    const { data, error } = await supabase
    .from('transacoes')
    .select('*, categorias(nome), categoria_pessoal(nome)')
    .eq('auth_id', authId)
    
    if (error) throw error
    return data

}