// Example unit test for Button component
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading prop is true', () => {
    const { getByTestId } = render(
      <Button title="Test Button" loading={true} />
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" disabled={true} onPress={onPress} />
    );
    
    const button = getByText('Test Button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
