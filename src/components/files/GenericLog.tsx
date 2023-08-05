import { getLogManager } from "@/logs";
import LogWrapper from "../LogWrapper";

export default async function GenericLog({
  id,
  file
}: {
  id: string;
  file: string;
}) {
  const logManager = await getLogManager();
  const log = await logManager.readFile(id, file);

  return <LogWrapper text={log} />;
}
