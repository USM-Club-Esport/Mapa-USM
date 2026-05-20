---
description: TDD cycle: write test, implement, verify
subtask: true
---
You are in a TDD cycle for: $ARGUMENTS

## RED phase
1. Understand the feature described above
2. Write a test file in the appropriate `__tests__/` directory
3. Use `@testing-library/react-native` for components, plain Jest for logic
4. Run `npx jest --testPathPattern=<test-file>` — it MUST fail
5. Report the failure to confirm the test is valid

## GREEN phase
6. Implement the minimal code to make the test pass
7. Run the test again — it MUST pass

## REFACTOR phase
8. Improve the implementation while keeping tests green
9. Run `npx jest` to confirm all tests still pass
