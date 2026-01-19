# Orphaned Sanity Documents - Manual Deletion Required

## ⚠️ IMPORTANT: Content Publishing Conflict Identified

The audit found **2 orphaned documents** in your Sanity dataset that are likely causing content to "publish over" incorrectly to the website. These documents use **deleted schema types** and must be removed.

---

## Documents to Delete:

### 1. servicesSection Document
- **Document ID**: `4b3afd35-8572-475b-82a7-d8d2fd98010e`
- **Type**: `servicesSection` (schema deleted)
- **Title**: "Our Services"
- **Problem**: This old schema type was superseded by `ourServices`

### 2. servicesPage Document
- **Document ID**: `cdd58cfc-e3fd-4f9a-8f09-d91aece89a69`
- **Type**: `servicesPage` (schema never used)
- **Problem**: This schema was never implemented in the website

---

## How to Delete (3 Options)

### Option 1: Via Sanity Studio Vision Tool (Recommended)

1. Go to your Sanity Studio: https://usmechanicalllc.com/studio
2. Click on "Vision" in the sidebar (query tool)
3. Run this query to find the documents:
   ```groq
   *[_type in ["servicesSection", "servicesPage"]]
   ```
4. For each document, click the "..." menu → "Delete"

### Option 2: Via Sanity Manage Console

1. Go to: https://www.sanity.io/manage/personal/project/3vpl3hho/datasets/production
2. Use the Vision tool there with the same query
3. Delete the found documents

### Option 3: Via Command Line (if you have write token)

If you have your `VITE_SANITY_WRITE_TOKEN` set up:

```bash
cd react-site
node delete-orphaned-docs.mjs
```

---

## Verification

After deletion, run the query script to verify cleanup:

```bash
cd react-site
node query-orphaned-docs.mjs
```

Expected output: "✨ Your Sanity dataset is clean - no orphaned documents found!"

---

## Why This Matters

These orphaned documents are using old, deleted schema types. When they exist in your dataset:
- They can conflict with current content
- They may cause unexpected data to appear on the website
- They create confusion about which documents are "active"

Deleting them ensures:
- ✅ Only current schema types have documents
- ✅ No conflicting content sources
- ✅ Clean, maintainable content structure

---

**Generated**: January 15, 2026  
**Audit Script**: `query-orphaned-docs.mjs`
