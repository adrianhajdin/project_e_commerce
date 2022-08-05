import React from "react";
import { InputLabel, Select, Grid, MenuItem } from "@material-ui/core";

const SelectInput = ({ label, value, onChange, options }) => {
  return (
    <Grid style={{ marginTop: "15px" }} item xs={12} sm={6}>
      <InputLabel> {label}</InputLabel>
      <Select value={value} fullWidth onChange={onChange}>
        {options.map(({ id, label }) => (
          <MenuItem key={id} value={id}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default SelectInput;
