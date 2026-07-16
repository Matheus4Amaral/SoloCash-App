import { supabase } from '../../lib/supabase'

export const getGanhosMes = async (authId) => {

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const inicio = new Date(ano, mes, 1);
    const fim = new Date(ano, mes + 1, 0);

    const inicioStr = inicio.toISOString().split('T')[0];
    const fimStr = fim.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('auth_id', authId)
        .eq('tipo', 'entrada')
        .gte('data',inicioStr)
        .lte('data', fimStr);

    if (error) throw error
    return data
}

export const createGanhos = async (authId, nome, valor, dataFormatada) => {

    const { data, error } = await supabase
        .from('transacoes')
        .insert({
            auth_id: authId,
            tipo: 'entrada',
            descricao: nome,
            valor: valor ? Number(valor) : null,
            categoria_id: null,
            data: dataFormatada
        })

    if (error) throw error
}

export const updateGanhos = async (id, nome, valor, dataFormatada) => {

    const campos = {}

    if (nome !== undefined) campos.descricao = nome
    if (valor !== undefined) campos.valor = valor ? Number(valor) : null
    if (dataFormatada !== undefined) campos.data = dataFormatada

    const { data, error } = await supabase
        .from('transacoes')
        .update(campos)
        .eq('id', id)

    if (error) throw error
}

export const deleteGanhos = async (id) => {
    const { data, error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const getValorTotalGanhos = async (authId) => {
    const { data, error } = await supabase
        .from('soma_ganhos_mes')
        .select('total')
        .eq('auth_id', authId)
        .maybeSingle();

    if (error) throw error;
    return data?.total ?? 0;
}

export const getValorTotalGanhosMesAnterior = async (authId) => {

    const { data, error } = await supabase
        .from('soma_ganhos_mes_anterior')
        .select('total')
        .eq('auth_id', authId)
        .maybeSingle();

    if (error) throw error;
    return data?.total ?? 0;
}
