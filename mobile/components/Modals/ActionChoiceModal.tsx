import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Title from '@/components/Title';

interface ActionChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onHabit: () => void;
  onSpace: () => void;
}

export default function ActionChoiceModal({
  visible,
  onClose,
  onHabit,
  onSpace,
}: Readonly<ActionChoiceModalProps>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              <Title style={styles.title}>Was möchtest du erstellen?</Title>
              <View style={styles.box}>
                <TouchableOpacity onPress={onHabit} style={styles.button}>
                  <Text style={styles.text}>Habit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSpace} style={styles.button}>
                  <Text style={styles.text}>Space</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  container: {
    backgroundColor: '#121720',
    borderRadius: 16,
    padding: 24,
    minHeight: '33%',
  },
  title: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#1f2a38',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
