import { ExceptionTroubleshooting } from "@/logs/types";
import LogWrapper from "./LogWrapper";

export default function ExceptionSection({
  exception
}: {
  exception: ExceptionTroubleshooting | null;
}) {
  if (exception == null) return <></>;

  return (
    <div>
      <h2>Exception</h2>
      <p>at {new Date(exception.When).toString()}</p>
      <LogWrapper text={exception.Info} />
    </div>
  );
}
