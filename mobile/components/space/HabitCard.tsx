import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface HabitCardProps {
  name: string;
  bg: string;
}

const HabitCard = ({ name, bg }: HabitCardProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default HabitCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    minWidth: '48%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
