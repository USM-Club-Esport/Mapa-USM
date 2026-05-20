jest.mock('react-native-gesture-handler', () => {
  const Actual = jest.requireActual('react-native-gesture-handler');
  return {
    ...Actual,
    GestureHandlerRootView: ({ children }) => children,
    Swipeable: ({ children }) => children,
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => React.createElement(View, { testID: 'map-view', ...props });
  const MockMarker = (props) => React.createElement(View, { testID: 'marker', ...props });
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: () => null,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-three/fiber', () => ({ Canvas: () => null }));
jest.mock('@react-three/drei', () => ({ OrbitControls: () => null }));
jest.mock('three', () => ({}));
