✅ PHASE 1 (UPDATED): Inventory Logic Foundation
🎯 GOAL: Build, test, and confirm that inventory is correctly updated based on recipe batches and meal logs (not per serving).
🔹 Step 1.1: Confirm Supabase Schema & Data
Ensure the following Supabase tables are correctly set up:

Table	Purpose
inventory	Tracks current stock of ingredients
recipes	Stores recipes and their total batch ingredient usage
meal_logs	Records each meal batch logged, with recipe ID & quantity

🛠️ Key Change:
Recipes now store ingredient quantities per total batch, not per serving.

🔹 Step 1.2: Seed Initial Test Data
To validate logic before full feature build:

1. Add Inventory Items:
Tomato: 2.0 kg

Onion: 1.0 kg

2. Create a Sample Recipe:
Recipe: Tomato Sauce

Quantity per 1 batch:

Tomato → 0.5 kg

Onion → 0.3 kg

3. Simulate Logging a Prep Event:
Prep 2 batches of Tomato Sauce

4. Expected Ingredient Deduction:
Tomato: 2 × 0.5 = 1.0 kg used → 1.0 kg remaining

Onion: 2 × 0.3 = 0.6 kg used → 0.4 kg remaining

✅ Use this to confirm correct deduction before building full UI.

🔹 Step 1.3: Add Inventory Deduction Logic (Core Function)
When logging a meal batch:

for (ingredient of recipe.ingredients) {
  const totalUsed = ingredient.quantityPerBatch * batchQuantity;
  deductFromInventory(ingredient.id, totalUsed);
}
addToMealLog(recipe.id, batchQuantity);

Optional: Wrap this in a Supabase transaction for consistency and rollback safety.

🔹 Step 1.4: Create Dev/Test Mode or Hidden Entry Point
Add a temporary dev-only function or button that:

Selects a recipe

Inputs a batch quantity (e.g., 2)

Runs the logMeal() logic above

✅ Add simple success/fail output like:
✅ Logged 2 batches of Tomato Sauce. Inventory updated.
❌ Not enough Tomato in stock.
This allows isolated testing before full UI is wired up.

🔹 Step 1.5: Visual Validation in Supabase
After test entry:

View inventory table → confirm correct deduction

View meal_logs table → confirm log entry added

If any errors (e.g., insufficient stock), handle them gracefully

🧪 Completion Criteria (Batch-Based)
✅	Task
✅	Can log a meal using number of batches
✅	Inventory deducts correctly (batch × ingredient amount)
✅	Recipe ingredients are tied by total batch, not per serving
✅	All updates are reflected in Supabase tables


PHASE 2 (UPDATED): Recipe Book Logic & UI Refinement
🎯 GOAL: Fully implement and test recipe creation/editing, ingredient linking, and data integrity using total batch quantities (not per serving).
This ensures accurate inventory deduction per batch of meal prep.

🔹 Step 2.1: Create/Add Recipe UI
In recipes.tsx:

Add a ＋ button to open a modal or screen for recipe creation.

🆕 Updated Form Fields:
[ Recipe Name:             _________ ]
[ Category:                ▼ Sauce  ] + Create New
[ Ingredient:              ▼ Tomato ] ← pulled from inventory
[ Quantity per Batch:      _______ kg ]
[ + Add Another Ingredient ]
[ Save Recipe ]

✅ All quantities represent total amount used per batch, not per serving.

🔹 Step 2.2: Store in Supabase
When “Save” is tapped:

Save to recipes table:

name, category, created_at

Save ingredients to a recipe_ingredients table:

recipe_id	ingredient_id	quantity_per_batch	unit
1	101	0.5	kg
1	102	0.3	kg

✅ This ensures prep and deduction logic is clean and scales with batch count.

🔹 Step 2.3: Implement "Create New Category" Option
If the user selects “+ Create New” in the category dropdown:

Show a new input field

Save the new category to a recipe_categories table or directly to Supabase

✅ Keep UX smooth without switching screens.

🔹 Step 2.4: Edit & Delete Recipes
In each recipe card (likely in RecipeCard.tsx):

Add:

[ Edit ]   [ Delete ]

Edit: Opens modal pre-filled with existing values

Delete: Confirms and removes the recipe + its ingredient links from Supabase

🔹 Step 2.5: Validate Data and Links
Run a data consistency test:

✅ Each recipe retrieves its full ingredient list

✅ Ingredient references match those in inventory

✅ Quantity formats align with expected batch deduction logic

🧪 Example Test Case:

Create “Tomato Sauce”:

Tomato: 0.5 kg

Onion: 0.3 kg

Save and reopen to verify data

Edit → change Tomato to 0.6 kg → Save → confirm update

Delete → confirm full removal

🔹 Step 2.6 (Recommended): Visual Ingredient Preview
Display ingredient summary in each recipe card like this:

Tomato Sauce
Category: Sauce
Ingredients:
- Tomato: 0.5 kg
- Onion: 0.3 kg

✅ Gives users fast visibility into recipe structure without needing to tap.

🧪 Completion Criteria for Phase 2 (Batch Model)
✅	Requirement
✅	Can create recipes with batch-based quantities
✅	Can edit/delete recipes cleanly
✅	Ingredients stored with total batch usage (not per serving)
✅	Recipes properly link to inventory ingredients
✅	UI is clean, consistent, and mobile-friendly


✅ PHASE 3 (UPDATED): Meal Log UI & Logging System Finalization
🎯 GOAL: Complete the process of logging recipe batches, which deduct ingredients from inventory and store the result in meal_logs.
This completes the full inventory-prep-tracking loop.

🔹 Step 3.1: Build or Enhance the Meal Log Input UI
In meal-log.tsx, connect AddMealLogModal to the new batch-based logic.

🆕 Updated Modal Input Fields:

[ Recipe ▼ ]               ← Select from recipes
[ Number of Batches ]      ← Quantity to log (e.g., 2)
[ Optional Comment ]       ← Notes, e.g., “Used smaller tomatoes today.”
[ Log Meal ]               ← Executes inventory deduction

🛠️ Terminology should now reflect “batches” throughout the UI.

🔹 Step 3.2: Write logMeal() Function (Batch-Based Core Logic)
When the user taps "Log Meal":

Fetch recipe’s ingredients and batch-level quantities

Multiply by the number of batches

Deduct each ingredient from inventory

Create a meal_logs record

🧪 Updated Pseudocode:
for (ingredient of recipe.ingredients) {
  const used = ingredient.quantityPerBatch * batchCount;
  deductFromInventory(ingredient.id, used);
}
addToMealLog(recipe.id, batchCount, comment);

✅ Optional: Wrap this logic in a Supabase transaction for atomic updates.

🔹 Step 3.3: Handle Edge Cases
❌ Not enough inventory: show error/snackbar like
“Not enough Tomato in stock for 2 batches.”

⚠️ Missing recipe: block submission with alert

✅ Success:
“✅ Logged 2 batches of Tomato Sauce. Inventory updated.”

🔹 Step 3.4: Display Past Logs in FlatList
Already implemented in meal-log.tsx. Just ensure it refreshes after new log.

Date         | Recipe         | Batches
------------ |----------------|---------
2024-05-01   | Tomato Sauce   | 2
2024-04-30   | Fried Rice     | 3

✅ Allow filtering/search by recipe or date if needed.

Step 3.5: Manual Override Field (Updated)
Allow the user to optionally override the batch count, in case actual prep output differs from the planned quantity:

[ Manual Override: ____ batches ]

✅ This field allows flexibility when:

The kitchen prepares more or fewer batches than planned

Staff wants to record actual prep for traceability

🧠 You can log both:

planned_batches

actual_batches (from override, if provided)

This helps improve future batch prediction logic over time.

✅ PHASE 4 (UPDATED): Prep Sheet Modification
🎯 GOAL: Convert Prep Sheet from ingredient-based to recipe-based batch tasks, support batch-based logging, and allow real-time inventory deduction using [Done] buttons.
This phase transforms your app into a usable daily kitchen operations tool.

🔹 Step 4.1: Switch to Recipe-Based Tasks
Replace each ingredient line with a recipe-based task, where each task represents 1 or more prep batches of a recipe.

Updated Task Fields:

[ Recipe Name ]      → e.g., Tomato Sauce  
[ Batch Quantity ]   → e.g., 2  
[ Total Ingredient Amount Required ] → e.g., 6 kg  
[ Estimated Time ]   → e.g., 20 min

✅ This makes the task intuitive and matches how real kitchens work — by prepping in batches.

🔹 Step 4.2: Add [Done] and [Not Done] Buttons
✅ If "Done" is pressed:

Deduct ingredient quantities per batch × prep quantity

Log a new entry in meal_logs (e.g., 2 batches of Tomato Sauce)

❌ If "Not Done" is pressed:

No deduction

No meal log entry

Task remains and rolls over to the next day

✅ This supports partial completion and flexible prep workflows.

🔹 Step 4.3: Add Comment Box at the Top
One shared comment box across the entire day’s prep sheet:

📝 Comment: [ Tomatoes arrived late. Use older batch first. ]


✅ Comment is:

Editable by kitchen staff

Auto-copied from the previous day unless changed

Stored in a prep_notes table keyed by date

🔹 Step 4.4: Implement Tap-to-Open Detail Screen
When tapping a recipe task, open a detailed view with:

[ Tomato Sauce – Detail ]
Description: Italian base for pasta

✅ Stock Sufficient

Ingredients Required per Batch:
- Tomato: 0.5 kg
- Onion: 0.3 kg

[ Prep Quantity: [ 2 ▼ ]  ]  ← Number of batches

[ Confirm ]

✅ You’ll reuse logic from the Prep Guide (Prep Suggestion) section to:

Pre-fill prep quantity using weekday-based 3-week average

Check if inventory is sufficient or low

🧠 No need to rebuild logic — just plug it into this UI flow.

🧪 Completion Criteria for Phase 4 (Batch Model)
✅	Requirement
✅	Tasks are recipe-based, not ingredient-based
✅	Tasks show batch count + estimated time + total quantity required
✅	“Done” deducts inventory and logs the batch to meal_logs
✅	“Not Done” defers task to next day
✅	Comment field syncs with previous day’s entry
✅	Tapping a task opens a recipe detail view with batch logic
✅	Prep quantity is editable and defaults to smart batch prediction


✅ PHASE 5 (UPDATED): Prep Guide + Prep Sheet Integration
🎯 GOAL: Eliminate redundancy by fully integrating Prep Suggestion logic into the Prep Sheet screen, using batch-based recipe logic.
This unifies prep planning and execution into one smooth workflow.

🔹 Step 5.1: Remove Ingredient Dropdowns & Manual Quantity Editors
Remove these from the Prep Sheet task list UI:

❌ Ingredient toggle/expanders from previous ingredient-based layout

❌ Inline quantity editors (used in early versions)

✅ These are now replaced by:

The Prep Detail View (tap to open)

A clear, centralized batch quantity field

🔹 Step 5.2: Merge Prep Suggestion Logic into Prep Sheet
Use the Prep Guide's core logic, but now apply it inside each task on the Prep Sheet:

✅ Reused Logic:
3-week weekday-based moving average
(e.g., average of past 3 Wednesdays for "Tomato Sauce")

Stock sufficiency check
(Is there enough Tomato in inventory for 2 batches?)

Used Inside:

const suggestedBatchQty = getSuggestedPrepBatch(recipeId, weekday);


➡️ This fills the prep quantity field (in batches) by default, when opening a task.

✅ Still editable by the user.

🔹 Step 5.3: Safely Retire the Prep Guide Tab
Once Phase 5 is complete and fully verified:

✅ Delete prep-suggestions.tsx from app/(tabs)/

✅ Remove its route from the tab navigator

✅ Keep prepSuggestionUtils.ts logic (used by Prep Sheet detail)

💡 You’re removing redundant UI, not the smart suggestion logic itself.

🔹 Step 5.4: Final Confirmation Loop
After integration is done, the Prep Sheet becomes your all-in-one planning & action tool:

It now includes:

✅ Comment box (persisted from previous day)

✅ Recipe-based prep tasks

✅ Smart batch suggestions

✅ Tap-to-open detail view:

Recipe description

Total ingredients needed

Stock status

Editable batch quantity

✅ [Done] logs to meal_logs & deducts inventory

✅ [Not Done] rolls over to next day

🎯 This completes the prep cycle loop without switching screens or tabs.

🧪 Completion Criteria for Phase 5 (Batch Model)
✅	Requirement
✅	Prep Sheet shows batch-based suggestions using Prep Guide logic
✅	Ingredient dropdowns and inline quantity editors are removed
✅	Prep quantity defaults to average batch count (editable)
✅	Prep Guide tab is removed safely and logic reused internally
✅	Tap-to-open detail screen handles all quantity and deduction control
✅	The entire workflow (suggest ➝ confirm ➝ log ➝ track) is unified and efficientgit add .