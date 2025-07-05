import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = Colors.dark;

  const [deleteVisible, setDeleteVisible] = useState(false);
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    setDeleteVisible(false);
    try {
      await deleteAccount();
      router.replace('/login');
    } catch (err) {
      console.error('Löschen fehlgeschlagen:', err);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: theme.title }]}>
          Einstellungen
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>
            Konto
          </Text>
          <SettingItem icon="person-outline" label="Profil bearbeiten" />
          <SettingItem icon="lock-closed-outline" label="Passwort ändern" />
          <SettingItem
            icon="trash-outline"
            label="Konto löschen"
            onPress={() => setDeleteVisible(true)}
          />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={theme.title} />
          <Text style={[styles.backText, { color: theme.title }]}>Zurück</Text>
        </TouchableOpacity>

        <DeleteAccountModal
          visible={deleteVisible}
          title="dein Konto"
          type="space"
          onCancel={() => setDeleteVisible(false)}
          onConfirm={handleDeleteAccount}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  const theme = Colors.dark;
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={theme.title}
        style={{ marginRight: 12 }}
      />
      <Text style={[styles.itemText, { color: theme.title }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
