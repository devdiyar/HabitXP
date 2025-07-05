import { router, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useUserData } from '@/hooks/useUserData';
import { useState } from 'react';
import LimitReachedModal from '@/components/Modals/LimitReachedModal';
import ActionChoiceModal from '@/components/Modals/ActionChoiceModal';
import { ROUTES } from '@/routes';
import CreateSpaceModal from '@/components/Modals/CreateSpaceModal';
import { createSpace } from '@/services/spaceService';
import { useSpaces } from '@/hooks/useSpaces';

export default function TabsLayout() {
  const { data: userData, isLoading } = useUserData();
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [spaceModalVisible, setSpaceModalVisible] = useState(false);
  const { data: spaces, refetch } = useSpaces();

  const handleAddPress = () => {
    if (!userData) return;
    setActionModalVisible(true);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#8985e9',
          tabBarInactiveTintColor: '#99999b',
          tabBarStyle: {
            height: 80,
            paddingTop: 10,
            position: 'relative',
            backgroundColor: '#121720',
            borderTopWidth: 0,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name={'index'}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={'home'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name={'space'}
          options={{
            title: 'Bereiche',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={'apps'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name={'add'}
          options={{
            title: '',
            tabBarIcon: ({ size }) => (
              <View style={styles.addButton}>
                <Ionicons name={'add'} color={'white'} size={size + 10} />
              </View>
            ),
          }}
          listeners={() => ({
            tabPress: e => {
              e.preventDefault();
              handleAddPress();
            },
          })}
        />
        <Tabs.Screen
          name={'shop'}
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={'cart'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name={'account'}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={'person'} color={color} size={size} />
            ),
          }}
        />
      </Tabs>

      <ActionChoiceModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        onHabit={() => {
          setActionModalVisible(false);
          if (!userData) return;
          if (userData.currentTasks >= userData.taskLimit) {
            setLimitModalVisible(true);
          } else {
            router.push(ROUTES.CREATE_HABIT);
          }
        }}
        onSpace={() => {
          setActionModalVisible(false);
          setSpaceModalVisible(true);
        }}
      />

      <CreateSpaceModal
        isVisible={spaceModalVisible}
        onClose={() => setSpaceModalVisible(false)}
        existingSpaces={spaces || []}
        onDone={async (name, colorKey) => {
          await createSpace({ name, colorKey, userId: userData?.id! });
          await refetch();
        }}
      />

      <LimitReachedModal
        visible={limitModalVisible}
        onClose={() => setLimitModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#9c80d0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
  },
});
