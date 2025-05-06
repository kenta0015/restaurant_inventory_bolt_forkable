// app/screens/DevTestScreen.tsx

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { devTestLogMeal } from '../dev/devTestLogMeal';

export default function DevTestScreen() {
  useEffect(() => {
    devTestLogMeal(); // 起動と同時に在庫減算ロジック実行
  }, []);

  return (
    <View style={{ padding: 40 }}>
      <Text>🧪 Running devTestLogMeal()...</Text>
    </View>
  );
}
