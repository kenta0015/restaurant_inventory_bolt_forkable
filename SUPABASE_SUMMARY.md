# 🗃️ SUPABASE_SUMMARY.md

This file summarizes the current Supabase configuration used in the **restaurant-inventory-app** project. It includes table structures, Row-Level Security (RLS) settings, and key implementation notes.

---

## ✅ Supabase Project Overview
- **Database Provider:** Supabase (PostgreSQL-based)
- **Used for:** Managing inventory, recipes, meal logs
- **Tables Configured:**
  - `inventory`
  - `recipes`
  - `meal_logs`

---

## 📊 Table Structures & Purpose

### 1. `inventory`
- **Purpose:** Stores raw ingredient stock data.
- **Fields:**
  - `id` (uuid, PK)
  - `name` (text)
  - `quantity` (numeric)
  - `unit` (text)
  - `alertLevel` (numeric)
- **Notes:** Used to track ingredient quantities and low-stock alerts.

### 2. `recipes`
- **Purpose:** Stores meal preparation recipes.
- **Fields:**
  - `id` (uuid, PK)
  - `name` (text)
  - `category` (text)
  - `createdAt` (timestamp)
  - `ingredients` (jsonb): list of objects with `name`, `unit`, and `quantity`
- **Notes:** Recipe data is shared across all users.

### 3. `meal_logs`
- **Purpose:** Logs prepared meals and quantities.
- **Fields:**
  - `id` (uuid, PK)
  - `recipe_id` (uuid, FK to `recipes.id`)
  - `count` (integer)
  - `manualOverrideServings` (integer, optional)
  - `comment` (text, optional)
  - `user_id` (uuid, FK to auth.users.id) ← added for RLS
  - `created_at` (timestamp)

---

## 🔐 Row-Level Security (RLS) Summary

### `inventory`
- **RLS:** Enabled
- **SELECT Policy:**
  ```sql
  USING (true)
  ```
  → Public read access (no login required)

### `recipes`
- **RLS:** Enabled
- **SELECT Policy:**
  ```sql
  USING (true)
  ```
  → Public read access

### `meal_logs`
- **RLS:** Enabled
- **SELECT Policy:**
  ```sql
  USING (auth.uid() = user_id)
  ```
  → Only the user who created a log can read it.
- **INSERT/UPDATE:** Policies not yet added

---

## 🔧 Auth Integration Status
- Currently not enforcing login in the app
- `user_id` field is present in `meal_logs`, ready for secure user-level tracking
- Future plan: add `auth.uid()`-based `INSERT` and `UPDATE` policies

---

## 📌 Recommendations
- 🔐 Add `INSERT`/`UPDATE` RLS to `meal_logs`
- 🧼 Enforce non-null `user_id` once Supabase Auth is integrated
- 📥 Consider exporting this summary to `README.md` as a quick link

---

> Last updated: May 1, 2025

