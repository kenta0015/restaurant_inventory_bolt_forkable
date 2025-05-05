# Error1❗ Supabase "No API Key Found" Error Summary
### ❌ Problem
During development, the following error occurred in the browser console when trying to fetch meal_logs from Supabase:

json
コピーする
編集する
{
  "message": "No API key found in request",
  "hint": "No `apikey` request header or url param was found."
}
### 🧠 Cause
This error means Supabase did not receive the apikey (usually the public anon key). It usually happens because:

Environment variables like process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY are not correctly loaded in the frontend (especially with web builds).

The Supabase client was initialized with undefined as the key.

ts
コピーする
編集する
// This results in key = undefined if .env isn't loaded properly
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

### 🔍 How to Confirm
Add the following debug log inside supabaseClient.ts:

ts
コピーする
編集する
console.log('Supabase Key:', supabaseKey);
If it prints undefined in the browser console → .env is not working properly

If it prints your real key → .env is working

### ✅ Immediate Workaround (Confirmed Working)
Instead of using process.env, temporarily hardcode your key:

ts
コピーする
編集する
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-public-anon-key'
);
🛠 Future Proper Fix
Create a .env file at the root:

ini
コピーする
編集する
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
Ensure the filename is exactly .env (no .env.local etc.)

Run:

sh
コピーする
編集する
npx expo start --clear
⚠ .env support for Expo Web builds can be flaky. Native (iOS/Android) is more reliable.

🧩 Other Notes
This error affects any fetch to Supabase: recipes, meal_logs, inventory, etc.

Until fixed, Meal Log screen will show nothing even though data exists.

Once fixed, meal log entries will load normally.



