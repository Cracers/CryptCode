import { Grid, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Price from "./Price";
import { Race, Racer } from "../../types";
import { isRaceActive, isRaceEnded } from "../../lib/RaceMethods";
import Loader from "../Loader";
const priceSymbol = {
  sol: "SOLUSDT",
  eth: "ETHUSDT",
  btc: "BTCUSDT",
};

type Price = "sol" | "eth" | "btc";

//TODO this should be just price[]
type Props = {
  displayPrices: string[] | Price[];
  racers: Racer[] | [];
  race: Race;
  active?: boolean;
  hidden?: boolean;
  callback?: (currency: string, price: number) => void;
};

type PricesObj = {
  symbol: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

const getLowestForecast = (
  racers: Racer[] | [],
  currency: string,
  displayPrices: string[] | Price[]
) => {
  let lowestForecast = 1000000000000000000000;
  const checkpoint = 0; // @TODO create get checkpoint hook
  const currencyIndex = displayPrices.indexOf(currency as Price);
  for (const racer of racers) {
    if (
      racer.account.checkpointEstimations[checkpoint][currencyIndex] <
      lowestForecast
    ) {
      lowestForecast =
        racer.account.checkpointEstimations[checkpoint][currencyIndex];
    }
  }

  return lowestForecast;
};

const getHighestForecast = (
  racers: Racer[] | [],
  currency: string,
  displayPrices: string[] | Price[]
) => {
  let highestForecast = 0;
  const checkpoint = 0; // @TODO create get checkpoint hook
  const currencyIndex = displayPrices.indexOf(currency as Price);
  for (const racer of racers) {
    if (
      racer.account.checkpointEstimations[checkpoint][currencyIndex] >
      highestForecast
    ) {
      highestForecast =
        racer.account.checkpointEstimations[checkpoint][currencyIndex];
    }
  }

  return highestForecast;
};

const getMeanForecast = (
  racers: Racer[] | [],
  currency: string,
  displayPrices: string[] | Price[]
) => {
  let estimationSum = 0;
  const checkpoint = 0; // @TODO create get checkpoint hook
  const currencyIndex = displayPrices.indexOf(currency as Price);
  for (const racer of racers) {
    estimationSum +=
      racer.account.checkpointEstimations[checkpoint][currencyIndex];
  }

  return estimationSum / racers.length;
};

const getFinalPrice = (est: string, endPrice: Prices) => {
  const price = endPrice?.[est as keyof Prices] as unknown as string;
  if (price) {
    return parseFloat(price);
  }
  return 0;
};

type Prices = {
  sol: number;
  btc: number;
  eth: number;
};

const LivePrices = ({
  displayPrices,
  racers,
  race,
  active = true,
  hidden = false,
  callback,
}: Props) => {
  const [endPrice, setEndPrice] = useState<Prices>({
    sol: 0,
    btc: 0,
    eth: 0,
  });
  const [prices, setPrices] = useState<PricesObj[] | []>([]);
  const [intervalId, setIntervalId] = useState<
    NodeJS.Timer | number | string | undefined
  >();

  const doCallback = (currency: string, price: number) => {
    if (callback && isRaceActive(race)) {
      callback(currency, price);
    }
  };

  useEffect(() => {
    const fetchPrice = () => {
      axios
        .get(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","SOLUSDT"]&type=mini`
        )
        .then((res: AxiosResponse) => {
          setPrices(res.data);
          for (const price of res.data) {
            doCallback(
              price.symbol.substring(0, 3).toLowerCase(),
              parseFloat(price.lastPrice)
            );
          }
        })
        .catch((err: AxiosError) => {});
    };
    const interval = setInterval(fetchPrice, 10_000);
    setIntervalId(interval);

    if (isRaceEnded(race)) {
      if (interval) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
      console.log("Races is ended");
      axios
        .get(`/api/race/stats?name=${race.account.name}`)
        .then((res) => {
          console.log("Races Result", res.data);
          setEndPrice(res.data.stats);
          for (const est of race.account.estimations) {
            callback && callback(est, res.data.stats[est]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {
      clearInterval(intervalId);
      setIntervalId(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isRaceActive(race) && !isRaceEnded(race)) {
    return <></>;
  }
  console.log("prices", prices);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          className="nasa-font"
          variant="h5"
          sx={{ textAlign: "center" }}
        >
          {isRaceActive(race) ? "Live Prices" : "Final Prices"}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        {prices.length <= 0 ? (
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "25px 0 0",
              }}
            >
              <CircularProgress />
            </Grid>
            <Grid item xs={12}>
              <Typography
                className="nasa-font"
                variant="subtitle2"
                color="primary"
                sx={{ textAlign: "center", margin: "0 0 25px" }}
              >
                Loading Prices...
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container sx={{ maxWidth: "450px" }}>
            {prices
              ?.filter((price: PricesObj) =>
                displayPrices.includes(
                  price.symbol.substring(0, 3).toLowerCase() as Price
                )
              )
              .map((price: PricesObj) => {
                return (
                  <Grid
                    key={price.symbol}
                    item
                    xs={12 / displayPrices.length}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography className="nasa-font" variant="h6">
                          {price.symbol.substring(0, 3)}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {isRaceActive(race) ? (
                          <Price
                            label="Live"
                            price={parseFloat(price.lastPrice)}
                          />
                        ) : (
                          <Price
                            label="Final"
                            price={getFinalPrice(
                              price.symbol.substring(0, 3).toLowerCase(),
                              endPrice
                            )}
                          />
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Price
                          label="High"
                          color="success"
                          price={getHighestForecast(
                            racers,
                            price.symbol.substring(0, 3).toLowerCase(),
                            displayPrices
                          )}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Price
                          label="mean"
                          price={getMeanForecast(
                            racers,
                            price.symbol.substring(0, 3).toLowerCase(),
                            displayPrices
                          )}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Price
                          label="Low"
                          color="error"
                          price={getLowestForecast(
                            racers,
                            price.symbol.substring(0, 3).toLowerCase(),
                            displayPrices
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default LivePrices;
