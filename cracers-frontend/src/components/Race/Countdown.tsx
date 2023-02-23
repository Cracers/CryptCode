import React, { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import { Race } from "../../types";

type Props = {
  race: Race;
  label?: string;
  type?: "start" | "end";
  variant?: "small" | "large";
};

const Countdown = ({ race, label, type = "end", variant = "large" }: Props) => {
  const [timestampDiff, setTimestampDiff] = useState<number>(0);
  const days = Math.trunc(timestampDiff / 86400000);
  const hours = Math.trunc(timestampDiff / 3600000) - days * 24;
  const minutes = Math.trunc(
    timestampDiff / 60000 - Math.trunc(timestampDiff / 3600000) * 60
  );

  const labelText =
    label || type === "end" ? "Closing Snapshot in" : "Starting in";

  const updateTime = () => {
    if (race) {
      const current = new Date().getTime();
      const timeDiff =
        type === "end"
          ? race?.account.raceEnd - current
          : current - race?.account?.raceStart;
      setTimestampDiff(timeDiff);
    }
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 30_000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race]);

  return (
    <>
      <Typography
        className="nasa-font"
        variant={variant === "small" ? "body1" : "h5"}
        component={variant === "small" ? "p" : "h5"}
        sx={{ textAlign: "center", margin: "0" }}
        gutterBottom
      >
        {labelText}
      </Typography>
      <Grid
        container
        sx={{ width: `${variant === "small" ? `auto` : `250px`}` }}
      >
        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body2" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: "center", margin: "0" }}
          >
            Days
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body2" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: "center", margin: "0" }}
          >
            Hours
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body2" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: "center", margin: "0" }}
          >
            Minutes
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body1" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {days}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body1" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {hours}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Typography
            className="nasa-font"
            variant={variant === "small" ? "body1" : "h6"}
            component={variant === "small" ? "p" : "h6"}
            color="primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {minutes}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Countdown;
