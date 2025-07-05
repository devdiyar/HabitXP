import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

interface CreateSpaceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDone: (name: string, colorKey: keyof typeof Colors.habit) => void;
  existingSpaces: { name: string }[];
  initialData?: { name: string; colorKey: keyof typeof Colors.habit };
  isEditing?: boolean;
}

const CreateSpaceModal = ({
  isVisible,
  onClose,
  onDone,
  existingSpaces,
  initialData,
  isEditing,
}: CreateSpaceModalProps) => {
  const [spaceName, setSpaceName] = useState(initialData?.name ?? '');
  const colors = useTheme();
  const [selectedColorKey, setSelectedColorKey] = useState<
    keyof typeof Colors.habit
  >(initialData?.colorKey ?? 'blue');

  const handleDone = () => {
    const trimmed = spaceName.trim();
    const exists = existingSpaces.some(
      s => s.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (!trimmed) return;

    if (!isEditing && exists) {
      alert('Du hast bereits einen Space mit diesem Namen.');
      return;
    }

    onDone(trimmed, selectedColorKey);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      setSpaceName(initialData?.name ?? '');
      setSelectedColorKey(initialData?.colorKey ?? 'blue');
    }
  }, [isVisible, initialData]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width: '100%' }}
            keyboardVerticalOffset={-150}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={styles.modalTitle}>Space erstellen</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.inputBackground },
                  ]}
                  placeholder="Name des Spaces"
                  placeholderTextColor="#888"
                  value={spaceName}
                  onChangeText={setSpaceName}
                  autoFocus={!isEditing}
                  returnKeyType="done"
                  onSubmitEditing={handleDone}
                  editable={!isEditing}
                />

                <View style={styles.colorRow}>
                  {Object.entries(Colors.habit).map(([key, colorSet]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: colorSet.bg,
                          borderWidth: selectedColorKey === key ? 3 : 0,
                          borderColor: 'white',
                        },
                      ]}
                      onPress={() =>
                        setSelectedColorKey(key as keyof typeof Colors.habit)
                      }
                    />
                  ))}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleDone}
                    disabled={!spaceName.trim()}
                  >
                    <Text
                      style={[
                        styles.doneText,
                        !spaceName.trim() && styles.disabledText,
                      ]}
                    >
                      {isEditing ? 'Speichern' : 'Fertig'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelText}>Abbrechen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateSpaceModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    padding: 14,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'crimson',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    opacity: 0.4,
  },
});
