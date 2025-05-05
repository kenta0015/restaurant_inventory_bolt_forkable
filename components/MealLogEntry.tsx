import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealLog } from '../types/types';

interface Props {
  mealLog: MealLog;
  onDelete: () => void;
}

export default function MealLogEntry({ mealLog, onDelete }: Props) {
  return (
    <View style={styles.entry}>
      <Text style={styles.recipe}>{mealLog.recipe.name}</Text>
      <Text style={styles.details}>
        Quantity: {mealLog.quantity}
        {mealLog.manualOverrideServings !== null &&
          ` → Override: ${mealLog.manualOverrideServings}`}
      </Text>
      {mealLog.notes && (
        <Text style={styles.comment}>Note: {mealLog.notes}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  recipe: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 4,
  },
  comment: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#666',
  },
});
