import {
  Backdrop,
  Grid,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  variant?: "spinner" | "screen";
  loading?: boolean;
};

const Loader = ({ variant = "screen", loading = false }: Props) => {
  if (variant === "spinner") {
    return (
      <Stack
        sx={{ color: "grey.500", marginTop: "3rem" }}
        spacing={2}
        direction="row"
      >
        <CircularProgress color="secondary" />
      </Stack>
    );
  }
  return (
    <Backdrop
      sx={{ color: "cyan", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <Grid container>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography className="nasa-font" variant="h3">
            Loading...
          </Typography>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default Loader;
