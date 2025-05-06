
console.log('🚀 devTestLogMeal() start');

import { supabase } from '../../supabaseClient';

export async function devTestLogMeal() {
  const testRecipeId = '07f1877a-edde-49ca-83ca-1f830c2167eb'; // tomato sauce のレシピID
  const batchCount = 2;

  console.log('🔍 Running devTestLogMeal()...');

  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .select('ingredients')
    .eq('id', testRecipeId)
    .single();

  if (recipeError || !recipeData) {
    console.error('❌ Failed to fetch recipe:', recipeError);
    return;
  }

  console.log('📦 recipeData:', recipeData);
  console.log('🧂 ingredients:', recipeData.ingredients);

  for (const ingredient of recipeData.ingredients) {
    console.log('🔍 Checking ingredient:', ingredient); // 👈 NEW

    if (!ingredient.id || !ingredient.quantity) {
      console.warn('⚠️ Missing id or quantity in ingredient:', ingredient); // 👈 NEW
      continue;
    }

    const totalUsed = ingredient.quantity * batchCount;

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

    const { error: updateError } = await supabase
      .from('inventory')
      .update({ quantity: newQuantity })
      .eq('id', ingredient.id);

    if (updateError) {
      console.error(`❌ Failed to update inventory for ${ingredient.id}:`, updateError);
    } else {
      console.log(`✅ Deducted ${totalUsed} from ${ingredient.id}`);
    }
  }

  const { error: insertError } = await supabase.from('meal_logs').insert({
    recipe_id: testRecipeId,
    quantity: batchCount,
  });

  if (insertError) {
    console.error('❌ Failed to insert into meal_logs:', insertError);
  } else {
    console.log('✅ Meal log inserted successfully');
  }
}
