import { supabase } from '../../lib/supabase'

export const updateSenha = async (email, senhaAtual, newSenha) => {

    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: senhaAtual
    })

    if (loginError) throw new Error('Senha atual incorreta')

    const { error } = await supabase
        .auth.updateUser({
            password: newSenha
        })

    if (error) throw error

}

export const disableConta = async (id) => {
    const { error } = await supabase
        .from('usuarios')
        .update({
            status: 0,
            desativo_em: new Date().toISOString()
        })
        .eq('auth_id', id)
}

export const verificaPrazoParaAtivar = async (email) => {

    const { data: authId, error: rpcError } = await supabase
        .rpc('get_user_id_by_email', { user_email: email });

    if (rpcError || !authId) return { error: 'Usuário não encontrado.' };


    const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('desativo_em')
        .eq('auth_id', authId)
        .single();

    if (userError || !usuario) return { error: 'Usuário não encontrado.' };

    const desativoEm = new Date(usuario.desativo_em);
    const umMesDepois = new Date(desativoEm);
    umMesDepois.setMonth(umMesDepois.getMonth() + 1);

    if (new Date() > umMesDepois) {
        return { error: 'Prazo para reativação expirado. Conta não pode ser reativada.' };
    }

     return { error: null }

}

export const enviarCodigo = async (email) => {

    const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: false }
    });

    return { error };
};

export const verificarEAtivarConta = async (email, codigo) => {

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: codigo,
        type: 'magiclink'
    });

    if (error) return { sucesso: false, erro: error.message };

    const { data: authId, error: rpcError } = await supabase
        .rpc('get_user_id_by_email', { user_email: email });

    if (rpcError || !authId) return { sucesso: false, erro: 'Usuário não encontrado.' };

    const { error: updateError } = await supabase
        .from('usuarios')
        .update({ status: 1, desativo_em: null })
        .eq('auth_id', authId);

    if (updateError) return { sucesso: false, erro: updateError.message };

    await supabase.auth.signOut();

    return { sucesso: true };
};

export async function redefinirSenha(novaSenha) {

    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) throw error;
}