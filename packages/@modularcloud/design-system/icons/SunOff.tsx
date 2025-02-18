import * as React from "react";
import { SVGProps } from "react";
const SvgSunOff = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.5 10h3m3.494-6.5v3M13.5 10h3m-6.494 3.5v3M5.404 5.404l2.121 2.121M14.592 5.4 12.471 7.52m.004 4.954 2.121 2.121M7.53 12.48 5.408 14.6"
      stroke="#888A90"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={10}
      cy={10}
      r={3.5}
      fill="#888A90"
      fillOpacity={0.1}
      stroke="#888A90"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgSunOff;
