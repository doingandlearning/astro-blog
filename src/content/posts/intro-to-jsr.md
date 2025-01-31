---
title: "Dependency Management in Deno"
date: "2025-01-31T15:50"
tags: ["jsr", "deno"]
updateDate: ""
description: "A summary of all the ways (I currently know) to manage dependencies in Deno"
imageUrl: https://res.cloudinary.com/kc-cloud/image/upload/f_auto,q_auto/v1/raycast-uploads/pazhbw3bn41lglkjclmp?_a=BAMAAAXw0
imageAlt: Deno logo
---

# Dependency Management in Deno

There are lots of ways to manage dependencies in Deno, some better and some worse. I've tried to summarise the main point here.

### **1. Installing Dependencies with `deno add`**
- If you **run `deno add <package>`** without a `deno.json` or `deno.lock`, Deno will:
  - Create **`deno.json`** (to track dependencies).
  - Create **`deno.lock`** (to lock dependency versions).
  - Fetch and install the package into Deno's **global cache** (not `node_modules`).

**Example:**
```sh
deno add jsr:@std/http
```
- This updates `deno.json`:
  ```json
  {
    "imports": {
      "jsr:@std/http": "jsr:@std/http@0.224.0"
    }
  }
  ```
- The package is now globally cached and version-pinned.

---

### **2. Importing Dependencies Without `deno add`**
- If you **import a module in your code** without using `deno add`, the first time you run it:
  - Deno **fetches and caches** dependencies.
  - Generates a **`deno.lock`** file to ensure version consistency.
  - **Does not generate a `deno.json`** (since no explicit package management commands were used).

**Example:**
```ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() => new Response("Hello Deno!"));
```
- When run for the first time:
  - `deno.lock` is created.
  - The module is cached globally.
  - Next runs are **instant** since it's already cached.

---

### **3. Using JSR Packages (`jsr:`)**
- JSR (**JavaScript Registry for Deno**) is the official package registry for Deno.
- Packages are imported using **`jsr:`** prefix.

**Example:**
```ts
import { serve } from "jsr:@std/http";
```
- JSR packages **do not require URLs**, making them more like npm.
- Versioning works like `jsr:@std/http@0.224.0`, but `deno add` simplifies this.

---

### **4. Using npm Packages (`npm:`)**
- Deno **supports npm packages** without `node_modules`.
- Uses **`npm:` prefix** to import npm dependencies.

**Example:**
```ts
import express from "npm:express";
const app = express();
```
- When you run this for the first time, Deno:
  - Fetches from **npm registry**.
  - Installs in **Deno's global cache**.
  - No `node_modules`, but `deno.lock` is updated.
  - Requires `--allow-read` and `--allow-net` if needed.

---

### **5. Summary of Behaviours**
| Action | `deno.json` Generated? | `deno.lock` Generated? | Modules Cached? |
|--------|----------------|----------------|---------------|
| `deno add <package>` | ✅ Yes | ✅ Yes | ✅ Yes |
| Importing without `deno add` | ❌ No | ✅ Yes | ✅ Yes |
| Running a cached module | ❌ No | ❌ No (if no changes) | ✅ Yes |

---


### **6. Importing from Any URL**
Deno allows you to import modules directly from URLs.

**Example (Standard Library Import from URL):**
```ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() => new Response("Hello Deno!"));
```
- This fetches the module **once**, caches it, and then uses the cached version in subsequent runs.

**Example (Third-Party Import from a Raw GitHub URL):**
```ts
import { nanoid } from "https://raw.githubusercontent.com/ai/nanoid/main/index.js";

console.log(nanoid());
```
- This works, but importing from **GitHub raw URLs is not ideal** since:
  - GitHub URLs can change.
  - There's no package versioning.
  - The module is not optimized for Deno.

---

### **7. Preferred Approaches for URL Imports**
While **any** URL works, best practices suggest using:

✅ **Deno’s Standard Library** (`https://deno.land/std`):
```ts
import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
```
- Maintained by the Deno team.
- Versioning via `@<version>` ensures stability.

✅ **Deno’s Official Registry (JSR)** (`jsr:`):
```ts
import { serve } from "jsr:@std/http";
```
- No URL required.
- Automatically handles versioning and caching.

✅ **Deno Third-Party Modules** (`https://deno.land/x`):
```ts
import { dayOfYear } from "https://deno.land/x/date_fns@2.22.1/mod.ts";
```
- `deno.land/x` hosts third-party modules with versioning.

✅ **CDN Services for npm Modules** (e.g., **esm.sh**):
```ts
import { lodash } from "https://esm.sh/lodash";
console.log(lodash.chunk([1, 2, 3, 4], 2));
```
- Works for npm packages if you **don’t** want to use `npm:`.

---

### **8. URL Import Caveats**
❌ **Avoid importing from raw GitHub URLs** unless absolutely necessary.  
❌ **Avoid unversioned URLs** (`@version` should always be included for stability).  
❌ **URLs can go down** – prefer `deno.land/x` or `jsr:` for long-term reliability.  

---

### **9. URL vs. Local vs. JSR Imports**
| Import Type | Example | Best Practice? | Notes |
|-------------|---------|---------------|-------|
| **Deno Standard Library** | `https://deno.land/std@0.224.0/...` | ✅ Yes | Official, stable, versioned |
| **Deno Third-Party (deno.land/x)** | `https://deno.land/x/oak@v12.6.0/mod.ts` | ✅ Yes | Stable, versioned, community modules |
| **JSR Registry (`jsr:`)** | `jsr:@std/http` | ✅ Yes | Officially recommended for Deno packages |
| **NPM via `npm:`** | `npm:express` | ✅ Yes | Best for npm interop |
| **CDN Services (`esm.sh`)** | `https://esm.sh/lodash` | ⚠️ Maybe | Only if `npm:` isn't viable |
| **GitHub Raw** | `https://raw.githubusercontent.com/...` | ❌ No | Unstable, not versioned |

---

- **Prefer `jsr:` for Deno-first modules.**


---

### **10. Best Practices**
- **For reproducibility**, use `deno add` to explicitly track dependencies in `deno.json`.
- **For simple scripts**, direct imports work fine (Deno handles caching automatically).
- **For npm interop**, prefix with `npm:`.
- **For Deno ecosystem packages**, prefer `jsr:` over raw URLs.
- **If you have to use urls, use `deno.land/std` or `deno.land/x` for stability.**
- **Avoid GitHub raw imports unless unavoidable.**
