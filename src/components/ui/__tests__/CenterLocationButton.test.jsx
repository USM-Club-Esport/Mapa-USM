import { render, screen, fireEvent } from '@testing-library/react-native';
import CenterLocationButton from '../CenterLocationButton';

jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
}));

describe('CenterLocationButton', () => {
    it('renders without crashing', () => {
        render(<CenterLocationButton onPress={() => {}} isActive={false} />);
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        render(<CenterLocationButton onPress={onPress} isActive={false} />);

        fireEvent.press(screen.root);

        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('has white background when active', () => {
        render(<CenterLocationButton onPress={() => {}} isActive={true} />);

        expect(screen.root.props.style).toMatchObject({
            backgroundColor: 'white',
        });
    });

    it('has grey background when inactive', () => {
        render(<CenterLocationButton onPress={() => {}} isActive={false} />);

        expect(screen.root.props.style).toMatchObject({
            backgroundColor: '#F5F5F5',
        });
    });
});
