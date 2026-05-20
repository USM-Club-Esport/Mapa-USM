---
description: Implement code to pass existing tests (GREEN phase of TDD)
subtask: true
---
The user has a test that is failing. Implement the minimal code to make it pass.

## Steps
1. Run `npx jest --testPathPattern=<test-file>` to see the failure
2. Analyze the error — what is the test expecting?
3. Write the minimal implementation to satisfy the test
4. Run the test again until it passes
5. Run `npx jest` to confirm no regressions
6. Report the results
