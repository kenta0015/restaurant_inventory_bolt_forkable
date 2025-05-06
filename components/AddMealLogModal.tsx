import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

export default function AddMealLogModal({ visible, onClose, onAdded }: any) {
  const [recipeId, setRecipeId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSave = async () => {
    if (!recipeId || !quantity) {
      Alert.alert('Error', 'Please enter recipe ID and quantity');
      return;
    }

    const batchCount = parseInt(quantity);

    // 1. Get ingredients from recipe
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('ingredients')
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipeData) {
      console.error('❌ Failed to fetch recipe:', recipeError);
      Alert.alert('Error', 'Failed to fetch recipe data');
      return;
    }

    // 2. Deduct from inventory
    for (const ingredient of recipeData.ingredients) {
      const totalUsed = ingredient.quantity * batchCount;

      // Get current inventory
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', ingredient.id)
        .single();

      if (fetchError || !currentItem) {
        console.error('❌ Failed to fetch inventory item:', fetchError);
        continue;
      }

      const newQuantity = currentItem.quantity - totalUsed;

      // Update inventory
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', ingredient.id);

      if (updateError) {
        console.error('❌ Error updating inventory:', updateError);
      }
    }

    // 3. Add to meal_logs
    const { error: insertError } = await supabase.from('meal_logs').insert({
      recipe_id: recipeId,
      quantity: batchCount,
    });

    if (insertError) {
      console.error('❌ Failed to log meal:', insertError);
    } else {
      console.log('✅ Meal logged');
      onAdded();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.label}>Recipe ID:</Text>
        <TextInput
          style={styles.input}
          value={recipeId}
          onChangeText={setRecipeId}
        />

        <Text style={styles.label}>Batch Quantity:</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007aff',
    fontSize: 16,
  },
});
