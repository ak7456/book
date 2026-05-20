import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReadingStatus } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const OPTIONS: { value: ReadingStatus; label: string; color: string }[] = [
  { value: 'WANT_TO_READ', label: '읽고 싶다', color: Colors.want },
  { value: 'READING', label: '읽는 중', color: Colors.reading },
  { value: 'DONE', label: '완독', color: Colors.done },
];

interface Props {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
}

export function StatusSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.option, active && { backgroundColor: opt.color }]}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, active ? styles.labelActive : { color: opt.color }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bgMuted,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
  labelActive: {
    color: Colors.textInverse,
  },
});
