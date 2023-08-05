import LogSelector from "@/components/LogSelector";
import { getLogManager, isValidID } from "@/logs";
import styles from "@/styles/styles.module.scss";

export default async function Log({
  params: { id, file },
  children
}: {
  params: { id: string; file?: string };
  children: React.ReactNode;
}) {
  if (!isValidID(id)) return <p>No.</p>;

  const logManager = await getLogManager();
  const logs = await logManager.getFiles(id);

  return (
    <main>
      <LogSelector id={id} files={logs} initialFile={file} />

      <div className={styles.logViewer}>{children}</div>
    </main>
  );
}
