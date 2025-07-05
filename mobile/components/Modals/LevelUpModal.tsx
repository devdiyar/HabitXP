import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface LevelUpModalProps {
  visible: boolean;
  onSelect: (choice: 'HEALTH' | 'TASK_LIMIT') => void;
}

export default function LevelUpModal({ visible, onSelect }: LevelUpModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🎉 Level Up!</Text>
          <Text style={styles.subtitle}>Wähle deine Belohnung</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('HEALTH')}
          >
            <Ionicons name="heart" size={24} color="#e63946" />
            <Text style={styles.optionText}>+ Gesundheit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('TASK_LIMIT')}
          >
            <Ionicons name="add-circle" size={24} color="#1d3557" />
            <Text style={styles.optionText}>+ mehr Aufgabenlimit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.dark.background,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.title,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.dark.subtitle,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1faee',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    width: '100%',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
});
