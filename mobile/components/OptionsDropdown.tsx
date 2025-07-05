import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const OptionsDropdown = ({
  accentColor,
  onEdit,
  onDelete,
  isOpen,
  setIsOpen,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionPress = (option: string, callback: () => void) => {
    setSelectedOption(option);
    setIsOpen(false);
    setTimeout(() => {
      setSelectedOption(null);
      callback();
    }, 20);
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: accentColor }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Ionicons name="ellipsis-vertical" size={16} color="white" />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownMenu, { backgroundColor: accentColor }]}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              selectedOption === 'edit' && styles.menuItemActive,
            ]}
            onPress={() => handleOptionPress('edit', onEdit)}
          >
            <Text style={styles.menuText}>Bearbeiten</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              selectedOption === 'delete' && styles.menuItemActive,
            ]}
            onPress={() => handleOptionPress('delete', onDelete)}
          >
            <Text style={styles.menuText}>Löschen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OptionsDropdown;

const styles = StyleSheet.create({
  editButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 38,
    right: 0,
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 140,
    paddingHorizontal: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    width: '100%',
  },
  menuText: {
    fontSize: 16,
    color: 'white',
  },
});
