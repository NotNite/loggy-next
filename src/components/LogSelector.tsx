"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function LogSelector({
  id,
  files,
  initialFile
}: {
  id: string;
  files: string[];
  initialFile?: string;
}) {
  const router = useRouter();
  const [file, setFile] = React.useState<string>(initialFile ?? "");

  return (
    <select
      value={file}
      onChange={async (e) => {
        const file = e.target.value;
        await setFile(file);
        if (file === "") {
          await router.replace(`/log/${id}`);
        } else {
          await router.replace(`/log/${id}/${file}`);
        }
      }}
    >
      <option value="">Select a file</option>
      {files.map((file) => (
        <option key={file} value={file}>
          {file}
        </option>
      ))}
    </select>
  );
}
