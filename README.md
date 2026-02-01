# TestBed Reset Issue - Minimal Reproduction

## Bug Description

When running multiple test files with `@analogjs/vitest-angular` 2.2.3 and Vitest 4.0.18, the Angular TestBed is not properly reset between test files when using **indirect imports** in the test setup.

This causes the error:

```
Cannot configure the test module when the test module has already been instantiated.
Make sure you are not using `inject` before `TestBed.configureTestingModule`.
```

## Key Finding

The issue **only occurs** when `test-setup.ts` imports from another file that calls `setupTestBed()`:

```typescript
// src/test-setup.ts (BROKEN - indirect import)
import './base-test-setup';  // This file calls setupTestBed()
```

It works correctly when `setupTestBed()` is called directly:

```typescript
// src/test-setup.ts (WORKS - direct call)
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
setupTestBed();
```

This pattern (indirect import) is common in NX monorepos where libraries share a base test setup.

## Environment

- `@analogjs/vitest-angular`: 2.2.3
- `vitest`: 4.0.18
- `@angular/core`: 21.1.2
- Node.js: v22+

## Steps to Reproduce

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

## Expected Behavior

All 4 tests should pass. The `setupTestBed()` function should reset TestBed between test files regardless of how it's imported.

## Actual Behavior

- `a-first.spec.ts`: All tests pass ✅
- `b-second.spec.ts`: First test passes, second test fails ❌

The TestBed state from `a-first.spec.ts` leaks into `b-second.spec.ts`.

## Workaround

Add `pool: 'forks'` to the vitest config to force each test file to run in its own process:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    pool: 'forks', // <-- Workaround
    // ...
  },
});
```

However, this significantly slows down test execution and shouldn't be necessary.

## Related Issues

- https://github.com/analogjs/analog/issues/1994
- https://github.com/analogjs/analog/issues/2027

Both issues were marked as fixed in 2.2.0+, but this reproduction demonstrates the problem still exists when using indirect imports.

## Root Cause Hypothesis

The `setupTestBed()` function registers `beforeEach` and `afterEach` hooks:

```javascript
beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));
```

When called through an indirect import chain, these hooks may be registered in a different module context that doesn't persist across test files when Vitest processes them sequentially.
