import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../supabaseClient';
import { Recipe } from '../types/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddMealLogModal({ visible, onClose, onAdded }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeId, setRecipeId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [override, setOverride] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (data) setRecipes(data);
      if (error) console.error('Error fetching recipes:', error);
    };

    if (visible) {
      fetchRecipes();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!recipeId || !quantity) return;

    const { error } = await supabase.from('meal_logs').insert([
      {
        recipe_id: recipeId,
        quantity: Number(quantity),
        manualOverrideServings: override ? Number(override) : null,
        comment: comment || null,
      },
    ]);

    if (error) {
      console.error('Error inserting meal log:', error);
    } else {
      onAdded(); // Refresh meal logs
      onClose();
      setRecipeId('');
      setQuantity('');
      setOverride('');
      setComment('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Meal Log</Text>

        <Text style={styles.label}>Recipe</Text>
        {recipes.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[
              styles.recipeOption,
              r.id === recipeId && styles.recipeSelected,
            ]}
            onPress={() => setRecipeId(r.id)}
          >
            <Text>{r.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Manual Override (optional)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={override}
          onChangeText={setOverride}
        />

        <Text style={styles.label}>Comment (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Save" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { marginTop: 12, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 8, marginTop: 4,
  },
  recipeOption: {
    padding: 10, marginVertical: 4, backgroundColor: '#eee', borderRadius: 6,
  },
  recipeSelected: {
    backgroundColor: '#c0e0ff',
  },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,
  },
});
