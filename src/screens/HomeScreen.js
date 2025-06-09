import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RegistrarAulaScreen from './RegistrarAulaScreen';
import UsuariosScreen from './UsuariosScreen';
import ContaScreen from './ContaScreen';


const Drawer = createDrawerNavigator();

export default function HomeScreen({ uid, setUid }) {
  const navigation = useNavigation();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`);
        const data = await response.json();
        if (response.ok && data.admin) setAdmin(true);
      } catch (err) {
        console.error('Erro ao verificar admin:', err);
      }
    };

    if (uid) verificarAdmin();
  }, [uid]);

  const logout = async () => {
    await AsyncStorage.removeItem('uid');
    setUid(null);
  };

  return (
    <Drawer.Navigator initialRouteName="Main" screenOptions={{ unmountOnBlur: true }}>
      <Drawer.Screen name="Main" component={MainScreen} initialParams={{ uid }} />
      <Drawer.Screen name="Registrar Aula" component={RegistrarAulaScreen} initialParams={{ uid }} />
      
      <Drawer.Screen
        name={admin ? "Usuários" : "Conta"}
        options={{ drawerLabel: admin ? "Usuários" : "Conta" }}
      >
        {(props) => admin
          ? <UsuariosScreen {...props} uid={uid} />
          : <ContaScreen {...props} uid={uid} />
        }
      </Drawer.Screen>


      <Drawer.Screen
        name="Sair"
        component={MainScreen}
        options={{ drawerLabel: 'Sair' }}
        listeners={{ focus: () => logout() }}
      />
    </Drawer.Navigator>
  );
}
