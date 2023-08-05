"use client";

import { LazyLog } from "@melloware/react-logviewer";
import React from "react";

// TODO shrink the log lol
export default function LogWrapper({ text }: { text: string }) {
  // What the fuck is wrong with you RSC
  const [height, setHeight] = React.useState(0);
  const [showing, setShowing] = React.useState(true);
  const log = React.useRef<LazyLog>(null);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setShowing(!showing);
        }}
      >
        Toggle log
      </button>

      <button
        onClick={() => {
          log.current?.handleScrollToLine(0);
        }}
      >
        Scroll to top
      </button>

      <button
        onClick={() => {
          log.current?.handleScrollToLine(log.current?.state.count ?? 0);
        }}
      >
        Scroll to bottom
      </button>

      {showing && (
        <LazyLog
          text={text}
          extraLines={1}
          enableSearch
          height={height}
          ref={log}
        />
      )}
    </>
  );
}
