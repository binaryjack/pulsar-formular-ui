import { SelectOption } from './select-option'

interface SelectOptionsProps {
  options: SelectOption[]
  placeholder: string
}

export const SelectOptions = ({ options, placeholder, ...rest }: SelectOptionsProps) => (
  <>
    <option value="">{placeholder}</option>
    {options.map(option => (
      <SelectOption key={option.id} option={option} {...rest} />
    ))}
  </>
)
