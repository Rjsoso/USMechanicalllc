# ✅ Correct Sanity Query URL Format

## Your URL (Issues)
```
https://3vpl3hho.api.sanity.io/v2025-11-26/data/query/production?query=&perspective=drafts
```

## Problems:
1. ❌ **API Version**: `v2025-11-26` is incorrect (that's in the future!)
2. ❌ **Query**: Empty (`query=`) - needs a GROQ query
3. ⚠️ **Perspective**: `drafts` shows draft documents, not published ones

---

## ✅ Correct URL Format

### For Published Content (What the website uses):
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "heroSection"][0]&perspective=published
```

### For Draft Content:
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "heroSection"][0]&perspective=drafts
```

---

## URL Components

- **Base**: `https://3vpl3hho.api.sanity.io`
- **API Version**: `v2023-05-03` (or `v2024-01-01` - use what's in your code)
- **Endpoint**: `/data/query/production`
- **Query Parameter**: `query=*[_type == "heroSection"][0]` (GROQ query)
- **Perspective**: `published` (or `drafts`)

---

## Examples

### Get Hero Section:
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "heroSection"][0]&perspective=published
```

### Get All Services:
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "ourServices"][0]&perspective=published
```

### Get Company Info:
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "companyInfo"][0]&perspective=published
```

---

## URL Encoding

If your query has special characters, URL encode it:

**Before encoding:**
```
query=*[_type == "heroSection"][0]
```

**After encoding:**
```
query=*%5B_type%20%3D%3D%20%22heroSection%22%5D%5B0%5D
```

---

## Your Current Configuration

Based on your codebase:
- **Project ID**: `3vpl3hho` ✅
- **Dataset**: `production` ✅
- **API Version**: `2023-05-03` ✅
- **Perspective**: `published` ✅ (for website)

---

## Quick Test

Try this in your browser:
```
https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "heroSection"][0]&perspective=published
```

This should return your hero section data in JSON format.

