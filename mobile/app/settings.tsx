import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = Colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: theme.title }]}>Einstellungen</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Konto</Text>
          <SettingItem icon="person-outline" label="Profil bearbeiten (bald)" />
          <SettingItem icon="lock-closed-outline" label="Passwort ändern (bald)" />
          <SettingItem icon="trash-outline" label="Konto löschen (bald)" />
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.title} />
          <Text style={[styles.backText, { color: theme.title }]}>Zurück</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({ icon, label }: { icon: any; label: string }) {
  const theme = Colors.dark;
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons name={icon} size={22} color={theme.title} style={{ marginRight: 12 }} />
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
