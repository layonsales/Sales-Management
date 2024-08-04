import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Historico',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book-outline' : 'book-sharp'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Venda',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cash-outline' : 'cash-sharp'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bag-add-outline' : 'bag-add-sharp'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
