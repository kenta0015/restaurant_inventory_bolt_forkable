import React, { useEffect, useState } from 'react'; 
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Recipe } from '../../types/types';
import { supabase } from "../../supabaseClient";

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*');

      console.log('Fetched recipes:', data);
      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        setRecipes(data.map((r: any) => ({
          ...r,
          ingredients: r.ingredients || [],
        })) as Recipe[]);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe List</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            {item.ingredients.map((ing, index) => (
              <Text key={index} style={styles.ingredient}>
                • {ing.name} ({ing.quantity} {ing.unit})
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: { marginBottom: 20, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  category: { color: '#888' },
  ingredientsTitle: { marginTop: 8, fontWeight: 'bold' },
  ingredient: { marginLeft: 8 },
});
