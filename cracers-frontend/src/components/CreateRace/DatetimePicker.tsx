import * as React from "react";
import { useMediaQuery } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import Stack from "@mui/material/Stack";

type Props = {
  label: string;
  onChange: (date: Date | null) => void;
  disablePast?: boolean;
};

export default function DatetimePicker({
  label,
  onChange,
  disablePast = true,
}: Props) {
  const mobile = useMediaQuery(`(max-width: 960px)`);

  const [value, setValue] = React.useState<Date | null>(new Date(Date.now()));
  const handleChange = (newValue: Date | null, e: any) => {
    setValue(newValue);
    onChange(newValue);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        {mobile ? (
          <MobileDateTimePicker
            label={label}
            disablePast={disablePast}
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                variant="filled"
                helperText="Select race start date & time"
                {...params}
              />
            )}
          />
        ) : (
          <DateTimePicker
            label={label}
            disablePast={disablePast}
            renderInput={(params) => (
              <TextField
                variant="filled"
                helperText="Select date & time"
                {...params}
              />
            )}
            value={value}
            onChange={handleChange}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
