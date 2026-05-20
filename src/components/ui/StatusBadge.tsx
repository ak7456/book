import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReadingStatus } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const STATUS_LABEL: Record<ReadingStatus, string> = {
  WANT_TO_READ: '읽고 싶다',
  READING: '읽는 중',
  DONE: '완독',
};

const STATUS_COLOR: Record<ReadingStatus, string> = {
  WANT_TO_READ: Colors.want,
  READING: Colors.reading,
  DONE: Colors.done,
};

interface Props {
  status: ReadingStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLOR[status] + '22' }, size === 'md' && styles.badgeMd]}>
      <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />
      <Text style={[styles.label, { color: STATUS_COLOR[status] }, size === 'md' && styles.labelMd]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeMd: { paddingHorizontal: 10, paddingVertical: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  labelMd: { fontSize: Typography.size.sm },
});
