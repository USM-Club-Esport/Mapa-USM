import { Platform, useWindowDimensions } from 'react-native';
import MobileView from './components/MobileView';
import WebView from './components/WebView';

export default function App() {
  const { width } = useWindowDimensions();
  const isMobileView = Platform.OS !== 'web' || width < 768; // Consideramos móvil a la app nativa o a la web en pantallas pequeñas

  if (isMobileView) {
    return <MobileView />;
  }

  return <WebView />;
}
