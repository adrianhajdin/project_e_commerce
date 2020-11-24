import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const MuiSelect = (props) => {
  const { label, name, options } = props;

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select id={name} {...props}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

function FormSelect(props) {
  const { control } = useFormContext();
  const { name, label, defaultValue, onChange } = props;

  console.log(defaultValue);

  return (
    <>
      <Controller
        as={MuiSelect}
        control={control}
        onChange={onChange}
        name={name}
        label={label}
        defaultValue={defaultValue}
        {...props}
      />
    </>
  );
}

export default FormSelect;
