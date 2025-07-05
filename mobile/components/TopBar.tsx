import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TopBarProps {
  onPressAdd?: () => void;
  tab: string;
}

const TopBar = ({ onPressAdd, tab }: TopBarProps) => {
  const handlePress = () => {
    if (onPressAdd) {
      onPressAdd();
    }
  };

  return (
    <View style={styles.top}>
      <Text style={styles.name}>Jonas</Text>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {tab === 'space' ? (
          <Ionicons name="add" size={32} color="white" />
        ) : (
          <Image
            source={require('@/assets/images/icons/home/menu.png')}
            style={{ width: 18, height: 18, marginTop: 5 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  top: {
    marginBottom: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },
  editBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
