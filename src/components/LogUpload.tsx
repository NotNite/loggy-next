"use client";

import React from "react";
import styles from "@/styles/styles.module.scss";
import { LogUploadResponse } from "@/logs/types";

enum LogState {
  Start,
  Uploading,
  Failed
}

export default function LogUpload() {
  const [state, setState] = React.useState<LogState>(LogState.Start);

  const str = React.useMemo(() => {
    switch (state) {
      case LogState.Start:
        return "Upload a log to start!";
      case LogState.Uploading:
        return "Uploading...";
      case LogState.Failed:
        return "Failed to upload log.";
    }
  }, [state]);

  return (
    <div className={styles.logUpload}>
      <label htmlFor="upload">{str}</label>
      <input
        type="file"
        id="upload"
        accept=".log,.tspack"
        disabled={state === LogState.Uploading}
        onChange={async (e) => {
          const file = e.target?.files?.[0];
          if (file != null) {
            setState(LogState.Uploading);

            const formData = new FormData();
            formData.append("file", file);

            const req = await fetch("/api/upload", {
              method: "POST",
              body: formData
            });

            if (req.ok) {
              const resp = (await req.json()) as LogUploadResponse;
              // next redirect brokey
              window.location.href =
                resp.initial != null
                  ? `/log/${resp.id}/${resp.initial}`
                  : `/log/${resp.id}`;
            } else {
              setState(LogState.Failed);
              return;
            }
          }
        }}
      ></input>
    </div>
  );
}
