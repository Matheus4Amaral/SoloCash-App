import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";

import Login from "./src/pages/login"
import Register from "./src/pages/register"
import Home from "./src/pages/home"
import Ganhos from "./src/pages/ganhos";
import Gastos from "./src/pages/gastos";
import Historico from "./src/pages/historico";
import Alertas from "./src/pages/alertas";
import AlertasProprios from "./src/pages/alertasProprios";
import Categorias from "./src/pages/categorias";
import RedefinirSenha from "./src/pages/redefinirSenha";
import { supabase } from './lib/supabase';

const Stack = createNativeStackNavigator();
import { AuthProvider } from "./src/Contexts/AuthContext";
import { VisuProvider } from "./src/Contexts/VisuContext";

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location?.hash?.includes('type=recovery')) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(() => {
        setTimeout(() => {
          navigationRef.current?.navigate('redefinir-senha');
        }, 300);
      });
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <VisuProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Alertas" component={Alertas} />
            <Stack.Screen name="AlertasProprios" component={AlertasProprios} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Ganhos" component={Ganhos} />
            <Stack.Screen name="Gastos" component={Gastos} />
            <Stack.Screen name="Historico" component={Historico} />
            <Stack.Screen name="Categorias" component={Categorias} />
            <Stack.Screen name="redefinir-senha" component={RedefinirSenha} />
          </Stack.Navigator>
        </VisuProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}