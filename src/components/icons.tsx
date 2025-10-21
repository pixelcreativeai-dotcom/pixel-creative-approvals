import type { SVGProps } from "react";

export function PixelCreativeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 32a96 96 0 1 0 96 96a96.11 96.11 0 0 0-96-96Zm0 176a80 80 0 1 1 80-80a80.09 80.09 0 0 1-80 80Z" />
        <path d="M168 96a40 40 0 1 0-40 40a40 40 0 0 0 40-40Zm-40 24a24 24 0 1 1 24-24a24 24 0 0 1-24 24Z" />
      </g>
    </svg>
  );
}
