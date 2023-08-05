"use client";

import { LazyLog } from "@melloware/react-logviewer";
import React from "react";

// TODO shrink the log lol
export default function LogWrapper({ text }: { text: string }) {
  // What the fuck is wrong with you RSC
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const [showing, setShowing] = React.useState(true);

  return (
    <>
      <button
        onClick={() => {
          setShowing(!showing);
        }}
      >
        Toggle log
      </button>
      {showing && (
        <LazyLog text={text} extraLines={1} enableSearch height={height} />
      )}
    </>
  );
}
