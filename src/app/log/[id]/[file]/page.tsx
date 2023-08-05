import DalamudLog from "@/components/files/DalamudLog";
import GenericLog from "@/components/files/GenericLog";
import XLLog from "@/components/files/XLLog";
import { isValidID } from "@/logs";

export default async function LogFile({
  params: { id, file }
}: {
  params: { id: string; file: string };
}) {
  if (!isValidID(id)) return <p>No.</p>;

  let logEl;
  switch (file) {
    case "output.log":
    case "launcher.log":
      logEl = <XLLog id={id} file={file} />;
      break;

    case "dalamud.log":
      logEl = <DalamudLog id={id} file={file} />;
      break;

    default:
      logEl = <GenericLog id={id} file={file} />;
      break;
  }

  return (
    <>
      <h1>{file}</h1>
      {logEl}
    </>
  );
}
