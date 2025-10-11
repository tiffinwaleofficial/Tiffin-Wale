// Unit test for Input component
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from 'react-native';

// Mock Input component (assuming it exists)
const Input = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  error = false,
  disabled = false,
  testID 
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: boolean;
  disabled?: boolean;
  testID?: string;
}) => (
  <TextInput
    testID={testID}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    editable={!disabled}
    style={{
      borderColor: error ? 'red' : 'gray',
      borderWidth: 1,
      padding: 10,
    }}
  />
);

describe('Input Component', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={jest.fn()} placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input value="" onChangeText={onChangeText} placeholder="Enter text" />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('shows error state when error prop is true', () => {
    const { getByPlaceholderText } = render(
      <Input 
        value="" 
        onChangeText={jest.fn()} 
        placeholder="Enter text" 
        error={true}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.style.borderColor).toBe('red');
  });

  it('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <Input 
        value="" 
        onChangeText={jest.fn()} 
        placeholder="Enter text" 
        disabled={true}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });

  it('shows secure text when secureTextEntry is true', () => {
    const { getByPlaceholderText } = render(
      <Input 
        value="" 
        onChangeText={jest.fn()} 
        placeholder="Enter password" 
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Enter password');
    expect(input.props.secureTextEntry).toBe(true);
  });
});







