import { Grid, Typography } from "@mui/material";
import React from "react";
import { getEstimationCurrencyDecimals } from "../../program_sdk/clientMethods";
import { Estimation, Race, Racer } from "../../types";

type Props = {
  existingRacerData: Racer | null;
  registrationOpen: boolean;
  raceData: Race;
};

const ExistingRegistration = ({
  existingRacerData,
  raceData,
  registrationOpen,
}: Props) => {
  function getCurrentEstimation(data: any, d: any) {
    const entries = Object.entries(data);
    const estIndex = Object.keys(data).indexOf(d);
    const value = entries[estIndex][1] as string;
    return parseFloat(value).toFixed(2);
  }

  if (registrationOpen && existingRacerData) {
    const isSingleForecastRace =
      existingRacerData?.account?.checkpointEstimations?.length <= 1;

    return (
      <>
        {existingRacerData?.account &&
          existingRacerData?.account.checkpointEstimations.map(
            (estArr: number[], index: number) => {
              return (
                <div key={`estimation-${index}`} style={{ width: "50%" }}>
                  {!isSingleForecastRace && (
                    <Typography
                      variant="h6"
                      className="nasa-font"
                      sx={{ marginTop: "1rem", textAlign: "center" }}
                    >
                      Checkpoint ${index + 1}
                    </Typography>
                  )}
                  <Grid container>
                    {estArr.map((est: number, index: number) => {
                      return (
                        <Grid
                          key={`race-est-${index}`}
                          item
                          md={12 / raceData.account.estimations.length}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Typography
                            variant="h6"
                            className="nasa-font"
                            // sx={{ marginTop: "1rem", textAlign: "center" }}
                          >
                            {`${raceData.account.estimations?.[
                              index
                            ]?.toUpperCase()} `}
                            <b style={{ color: "#00FFF8" }}>{`${est.toFixed(
                              2
                            )} `}</b>{" "}
                            $
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              );
            }
          )}
      </>
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

export default ExistingRegistration;
