import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null)
    const [nome, setNome] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const carregarUsuario = async (user) => {

            if (!user) {
                setUsuario(null)
                setNome('')
                setLoading(false)
                return
            }

            setUsuario(user)

            const { data, error } = await supabase
                .from('usuarios')
                .select('nome')
                .eq('auth_id', user.id)
                .single()

            if (!error && data) {
                setNome(data.nome)
            }

            setLoading(false)
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            carregarUsuario(session?.user ?? null)
        })


        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                carregarUsuario(session?.user ?? null)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }

    }, [])

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

    
        const { data: usuarioData, error: erroUsuario } = await supabase
            .from('usuarios')
            .select('status')
            .eq('auth_id', data.user.id)
            .single()

        if (erroUsuario) throw erroUsuario

        if (usuarioData.status === 0) {
            await supabase.auth.signOut()
            throw new Error('Conta desativada')
        }
    }

    const signUp = async (nome, email, password) => {

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error

        if (!data.user) {
            throw new Error('Usuário não criado')
        }

        const { error: erroUsuario } = await supabase
            .from('usuarios')
            .insert({
                nome,
                auth_id: data.user.id,
                status: 1
            })

        if (erroUsuario) throw erroUsuario
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                nome,
                loading,
                signIn,
                signUp,
                signOut
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)