import React from "react";
import { styled, Theme } from "@mui/system";

type Props = {
  width: number;
  height: number;
  path: string;
  color?: string;
  fit?: boolean;
  theme?: Theme;
};

const SVG = styled("div")(
  ({ theme, width, height, path, color, fit }: Props) => ({
    width,
    height,
    backgroundColor: color,
    mask: `url(${path})`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: fit ? "contain" : "auto",
  })
);

const SolidSvg = ({
  width,
  height,
  path,
  color = "black",
  fit = false,
}: Props) => {
  return (
    <SVG width={width} height={height} path={path} color={color} fit={fit} />
  );
};

export default SolidSvg;
