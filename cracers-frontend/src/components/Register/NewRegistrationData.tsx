import { Grid, Typography, TextField, useMediaQuery } from "@mui/material";
import React from "react";

type Props = {
  raceData: any;
  registrationOpen: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: () => void;
};

const NewRegistrationData = ({ raceData, registrationOpen, onBlur }: Props) => {
  const mobile = useMediaQuery(`(max-width: 760px)`);
  const numEstimationFieldsAsArray = Array(
    raceData.account.numberOfCheckpoints
  ).fill(0);

  if (
    registrationOpen
    // true
  ) {
    return (
      <div>
        <Grid item xs={12} sm={12}>
          {numEstimationFieldsAsArray.map((e, index) => (
            <Grid
              key={e}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={1}
                // sx={{ display: "flex", justifyContent: "center" }}
              >
                <Typography
                  variant="h5"
                  className="nasa-font"
                  sx={{
                    margin: "20px 0 0",
                    textAlign: "center",
                    color: "#ddb9f5",
                  }}
                >
                  {mobile && "Checkpoint "}
                  {index + 1}
                </Typography>
              </Grid>
              {raceData.account.estimations.map((e: any, index2: number) => (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={12 / raceData.account.estimations.length - 1}
                    sx={{
                      margin: "20px 0 0",
                    }}
                  >
                    <TextField
                      onBlur={onBlur}
                      label={<>{e.toLocaleUpperCase()} Price</>}
                      placeholder="0.00"
                      inputProps={{ step: "0.01", min: "0" }}
                      id="outlined-number"
                      name={`${e}-${index}`}
                      type="number"
                      sx={{
                        width: "100%",
                        margin: "0 5px",
                        "&:after, &:before, &:hover": {},
                        input: {
                          textAlign: "center",
                          fontFamily: "nasa",
                          fontSize: "1.2rem",
                        },
                        "input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
                          {
                            "-webkit-appearance": "none",
                          },
                      }}
                    />
                  </Grid>
                </>
              ))}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  } else {
    return (
      <Typography
        variant="h5"
        className="nasa-font"
        color="error"
        sx={{
          margin: "20px 0 0",
          textAlign: "center",
          // color: "#ddb9f5",
        }}
      >
        Registration Closed
      </Typography>
    );
  }
};

export default NewRegistrationData;
