import { ExceptionTroubleshooting } from "@/logs/types";
import LogWrapper from "./LogWrapper";

export default function ExceptionSection({
  exception
}: {
  exception: ExceptionTroubleshooting | null;
}) {
  if (exception == null) return <></>;

  const whenUTC = new Date(exception.When).toUTCString();

  return (
    <div>
      <h2>Exception</h2>
      <p>
        at <time dateTime={whenUTC}>{whenUTC}</time>
      </p>
      <LogWrapper text={exception.Info} />
    </div>
  );
}
