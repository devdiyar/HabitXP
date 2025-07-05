import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface StatIndicatorProps {
  value: number;
  iconType: 'image' | 'icon';
  iconSource?: any;
  iconName?: IoniconName;
  iconColor?: string;
  iconSize?: number;
}

const StatIndicator: React.FC<StatIndicatorProps> = ({
  value,
  iconType,
  iconSource,
  iconName,
  iconColor = 'white',
  iconSize = 22,
}) => {
  return (
    <View style={styles.container}>
      {iconType === 'image' ? (
        <Image source={iconSource} style={styles.imageIcon} />
      ) : (
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      )}
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default StatIndicator;
