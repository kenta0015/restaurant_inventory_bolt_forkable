import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { InventoryItem as InventoryItemType } from '../types/types';

interface InventoryItemProps {
  item: InventoryItemType;
  onEdit?: () => void;
  onDelete: () => void;
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
}

export default function InventoryItem({ item, onEdit, onDelete, onUpdateQuantity }: InventoryItemProps) {
  // Only check low stock
  const isLowStock = item.quantity <= item.alertLevel;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.quantityContainer}>
            <Text style={[styles.quantityText, isLowStock && styles.lowStockText]}>
              {item.quantity} {item.unit}
            </Text>
            {isLowStock && (
              <Text style={styles.lowStockIndicator}>Low stock</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit?.()}
        >
          <Edit2 color="#4CAF50" size={20} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onDelete}
        >
          <Trash2 color="#FF5252" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'column',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  lowStockText: {
    color: '#FF7F00',
  },
  lowStockIndicator: {
    fontSize: 12,
    color: '#FF7F00',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 6,
  },
});
