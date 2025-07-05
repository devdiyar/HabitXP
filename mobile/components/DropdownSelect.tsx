import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import NormalText from './NormalText';
import useTheme from '@/hooks/useTheme';

type Option = { label: string; value: string };

interface DropdownSelectProps {
  label?: string;
  value: string;
  data: Option[];
  onChange: (item: Option) => void;
  placeholder?: string;
  style?: any;
}

export default function DropdownSelect({
  label,
  value,
  data,
  onChange,
  placeholder,
  style,
}: Readonly<DropdownSelectProps>) {
  const colors = useTheme();

  return (
    <View style={style}>
      {label && <NormalText style={styles.label}>{label}</NormalText>}
      <Dropdown
        style={[styles.dropdown, { backgroundColor: colors.inputBackground }]}
        containerStyle={[
          styles.dropdownContainer,
          { backgroundColor: colors.inputBackground },
        ]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={[styles.selectedText, { color: colors.inputText }]}
        activeColor={colors.primary}
        itemTextStyle={{ color: colors.inputText, fontSize: 16 }}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        itemContainerStyle={styles.itemContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: 'white',
  },
  dropdown: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  dropdownContainer: {
    borderRadius: 14,
    borderWidth: 0,
  },
  placeholder: {
    color: '#aaa',
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
  },
  itemContainer: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});
