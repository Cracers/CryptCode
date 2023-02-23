import { Button } from "@mui/material";
import { randomUUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isRaceActive, isRaceEnded } from "../../lib/RaceMethods";
import { Race } from "../../types";
import uuid from "react-uuid";
type Props = {
  race: Race;
};

const RegisterButton = ({ race }: Props) => {
  const [active, setActive] = useState<boolean>(isRaceActive(race));
  const [ended, setEnded] = useState<boolean>(isRaceEnded(race));
  const [ticking, setTicking] = useState(isRaceActive(race));

  useEffect(() => {
    const interval = setInterval(() => {
      if (ticking) {
        setActive(isRaceActive(race));
        setEnded(isRaceEnded(race));
      }
    }, 950);

    if (!active) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticking]);

  if (active || ended) {
    return <></>;
  }
  return (
    <Link href={`/register/${race.publicKey}`}>
      <Button
        className="nasa-font"
        variant="outlined"
        color="primary"
        disabled={active}
        sx={{
          fontSize: "1.2rem",
          margin: "0 auto",
          // width: "100%",
        }}
      >
        Register
      </Button>
    </Link>
  );
};

export default RegisterButton;
