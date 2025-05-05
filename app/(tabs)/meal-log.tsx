
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MealLog } from '../../types/types';
import { supabase } from '../../supabaseClient';
import MealLogEntry from '../../components/MealLogEntry';
import AddMealLogModal from '../../components/AddMealLogModal';

export default function MealLogScreen() {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchMealLogs = async () => {
    const { data, error } = await supabase
      .from('meal_logs')
      .select(`
        id,
        date,
        quantity,
        manualOverrideServings,
        comment,
        recipe:recipe_id (
          id,
          name,
          category,
          ingredients,
          createdAt
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching meal logs:', error);
    } else {
      const formatted = data.map((log: any) => ({
        id: log.id,
        date: log.date,
        quantity: log.quantity,
        manualOverrideServings: log.manualOverrideServings ?? null,
        notes: log.comment ?? null,
        recipe: {
          id: log.recipe.id,
          name: log.recipe.name,
          category: log.recipe.category,
          ingredients: log.recipe.ingredients,
          createdAt: log.recipe.createdAt,
          description: '',
        },
      }));
      setMealLogs(formatted);
    }
  };

  useEffect(() => {
    fetchMealLogs();
  }, []);

  const filteredLogs = mealLogs.filter(log =>
    log.recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Tracking</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search meal logs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealLogEntry mealLog={item} onDelete={() => {}} />
        )}
      />

      <AddMealLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdded={fetchMealLogs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20,
  },
  searchInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});
