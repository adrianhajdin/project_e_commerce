import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

function FormInput({ name, label, required }) {
  const { control } = useFormContext();
  const isError = false;
  const errorMessage = '';

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        as={TextField}
        name={name}
        control={control}
        defaultValue=""
        label={label}
        fullWidth
        required={required}
        error={isError}
        helperText={errorMessage}
      />
    </Grid>
  );
}

export default FormInput;
