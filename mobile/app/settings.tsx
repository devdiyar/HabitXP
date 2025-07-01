import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Einstellungen</Text>

      <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/account')}>
        <Ionicons name="arrow-back-outline" size={24} color="#1d3557" />
        <Text style={styles.backText}>Zurück zum Profil</Text>
      </Pressable>

      {/* Hier können später weitere Einstellungsoptionen folgen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d3557',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
});
