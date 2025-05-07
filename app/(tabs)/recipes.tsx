// app/(tabs)/recipes.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Recipe } from '../../types/types';
import { supabase } from "../../supabaseClient";
import RecipeFormModal from '../../components/RecipeFormModal';

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      setRecipes(data.map((r: any) => ({
        ...r,
        ingredients: r.ingredients || [],
      })) as Recipe[]);
    }
  };

  const handleDelete = async (recipeId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
          await supabase.from('recipes').delete().eq('id', recipeId);
          fetchRecipes();
        }
      },
    ]);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setModalVisible(true);
  };

  useEffect(() => { fetchRecipes(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe List</Text>
        <TouchableOpacity onPress={() => { setEditingRecipe(null); setModalVisible(true); }} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            {item.ingredients?.length ? item.ingredients.map((ing, index) => (
              <Text key={index} style={styles.ingredient}>
                • {ing.name} ({ing.quantity} {ing.unit})
              </Text>
            )) : <Text>No ingredients</Text>}

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <RecipeFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRecipeAdded={fetchRecipes}
        initialRecipe={editingRecipe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#007AFF', width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 24, lineHeight: 24 },
  card: {
    marginBottom: 20, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  category: { color: '#888' },
  ingredientsTitle: { marginTop: 8, fontWeight: 'bold' },
  ingredient: { marginLeft: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { marginRight: 10 },
  deleteButton: {},
  actionText: { color: '#007AFF' },
});
