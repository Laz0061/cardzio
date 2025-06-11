import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AdminPanel from '../screens/AdminPanel';
import Profile from '../screens/ProfileScreen';
import Settings from '../screens/Settings';
import Shop from '../screens/ShopScreen';
import Tables from '../screens/TableScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Profile':
              iconName = 'person';
              break;
            case 'Tables':
              iconName = 'grid';
              break;
            case 'Shop':
              iconName = 'cart';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            case 'AdminPanel':
              iconName = 'lock-closed';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#224B38',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: 'Profil' }}
      />
      <Tab.Screen
        name="Tables"
        component={Tables}
        options={{ tabBarLabel: 'Masalar' }}
      />
      <Tab.Screen
        name="Shop"
        component={Shop}
        options={{ tabBarLabel: 'Mağaza' }}
      />
      <Tab.Screen
        name="Settings"
        options={{ tabBarLabel: 'Ayarlar' }}
      >
        {() => <Settings onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{ tabBarLabel: 'Yönetici' }}
      />
    </Tab.Navigator>
  );
}
