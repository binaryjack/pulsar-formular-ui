import { IBaseClass } from '@shared/index'

export interface SelectOption extends IBaseClass {}

export interface SelectOptionProps extends Partial<React.ComponentProps<'option'>> {
  option: SelectOption
}

export const SelectOption = ({ option }: SelectOptionProps) => (
  <option key={option.id} title={option.name} value={option.id}>
    {option.name}
  </option>
)
