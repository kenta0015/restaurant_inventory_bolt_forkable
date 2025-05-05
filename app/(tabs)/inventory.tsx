import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { InventoryItem } from '../../types/types';
import { supabase } from '../../supabaseClient';

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      console.log('📦 Inventory fetch result:', { data, error });

      if (error) {
        console.error('❌ Error fetching inventory:', error);
      } else {
        setItems(data as InventoryItem[]);
      }
    };

    fetchInventory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory List</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Quantity: {item.quantity} {item.unit}</Text>
            {/* ↓ category が undefined でも落ちないように修正 */}
            <Text style={styles.category}>
              Category: {item.category ?? 'N/A'}
            </Text>
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
});
