import type { Meta, StoryObj } from '@storybook/html';
import { FormInput } from './form-input';

const meta: Meta = {
  title: 'Components/FormInput',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url']
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.maxWidth = '400px';
    
    // Render the component
    const component = FormInput({
      name: args.name || 'example',
      label: args.label || 'Label',
      placeholder: args.placeholder || 'Enter text...',
      required: args.required,
      disabled: args.disabled,
      error: args.error,
      helperText: args.helperText,
      type: args.type || 'text'
    });
    
    container.appendChild(component);
    return container;
  },
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    required: false,
    disabled: false,
    helperText: 'Choose a unique username'
  }
};

export const WithError: Story = {
  ...Default,
  args: {
    name: 'email',
    label: 'Email',
    placeholder: 'email@example.com',
    type: 'email',
    required: true,
    error: 'Please enter a valid email address'
  }
};

export const Required: Story = {
  ...Default,
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    helperText: 'Must be at least 8 characters'
  }
};

export const Disabled: Story = {
  ...Default,
  args: {
    name: 'readonly',
    label: 'Read Only Field',
    value: 'This field is disabled',
    disabled: true
  }
};
