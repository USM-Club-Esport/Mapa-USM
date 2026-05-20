---
description: Write a failing test (RED phase of TDD)
---
Write a test first for: $ARGUMENTS

## Project test conventions
- Library: `@testing-library/react-native` + Jest
- Test location: `__tests__/` directory next to the source file
- Mocks available in `jest-setup.js` (maps, reanimated, R3F, gesture-handler)
- Expo native modules auto-mocked by `jest-expo` preset
- For component tests, mock icon libraries:
  ```js
  jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
    Ionicons: 'Ionicons',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    FontAwesome5: 'FontAwesome5',
  }));
  ```

## Steps
1. Create a test file in `src/**/__tests__/` following conventions
2. Name: `<Component>.test.jsx` or `<util>.test.js`
3. Run `npx jest --testPathPattern=<file>` to confirm it fails
4. Show the failure output to the user
