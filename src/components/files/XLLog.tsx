import { fishForRegex, getLogManager } from "@/logs";
import GenericLog from "./GenericLog";
import LogWrapper from "../LogWrapper";
import {
  XLTroubleshooting,
  xlRegex,
  exceptionRegex,
  IndexIntegrity,
  DalamudLoadMethod,
  Platform,
  ExceptionTroubleshooting
} from "@/logs/types";
import ExceptionSection from "../ExceptionSection";

function InfoSection({
  troubleshooting
}: {
  troubleshooting: XLTroubleshooting;
}) {
  return (
    <div>
      <h2>Info</h2>
      <ul>
        <li>XIVLauncher version: {troubleshooting.LauncherVersion}</li>
        <li>XIVLauncher git hash: {troubleshooting.LauncherHash}</li>
        <li>
          Official XIVLauncher release:{" "}
          {troubleshooting.Official ? "true" : "false"}
        </li>
        <li>Platform: {Platform[troubleshooting.Platform]}</li>
        {troubleshooting.When && (
          <li>Timestamp: {new Date(troubleshooting.When).toString()}</li>
        )}

        <br />

        <li>Autologin: {troubleshooting.IsAutoLogin ? "true" : "false"}</li>
        <li>DirectX: {troubleshooting.IsDx11 ? "DX11" : "DX9"}</li>
        <li>DPI aware: {troubleshooting.DpiAwareness ? "true" : "false"}</li>
        <li>
          Encrypted arguments:{" "}
          {troubleshooting.EncryptArguments ? "true" : "false"}
        </li>
        <li>UID cache: {troubleshooting.IsUidCache ? "true" : "false"}</li>
        <li>
          Dalamud enabled: {troubleshooting.DalamudEnabled ? "true" : "false"}
        </li>

        {troubleshooting.DalamudEnabled && (
          <div>
            <li>
              Injection method:{" "}
              {DalamudLoadMethod[troubleshooting.DalamudLoadMethod]}
            </li>
            <li>Injection delay: {troubleshooting.DalamudInjectionDelay}ms</li>
          </div>
        )}

        <br />

        <li>A Realm Reborn: {troubleshooting.ObservedGameVersion}</li>
        <li>Heavensward: {troubleshooting.ObservedEx1Version}</li>
        <li>Stormblood: {troubleshooting.ObservedEx2Version}</li>
        <li>Shadowbringers: {troubleshooting.ObservedEx3Version}</li>
        <li>Endwalker: {troubleshooting.ObservedEx4Version}</li>
        <li>
          Index integrity: {IndexIntegrity[troubleshooting.IndexIntegrity]}
        </li>
      </ul>
    </div>
  );
}

function WarningsSection({
  troubleshooting
}: {
  troubleshooting: XLTroubleshooting;
}) {
  const warnings = [];

  if (!troubleshooting.Official) {
    warnings.push(
      "You are using an unofficial build of XIVLauncher. You will not receive any support and it is highly encouraged to use an official release."
    );
  }

  if (troubleshooting.IndexIntegrity != IndexIntegrity.Success) {
    warnings.push(
      "Index integrity did not succeed. Your game client may be corrupted - right click Login and select Repair game in XIVLauncher."
    );
  }

  if (troubleshooting.IsUidCache) {
    warnings.push(
      "You have the UID cache enabled - you almost certainly do not want to enable this."
    );
  }

  if (warnings.length === 0) return <></>;

  return (
    <div>
      <h2>Warnings</h2>
      <ul>
        {warnings.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function XLLog({
  id,
  file
}: {
  id: string;
  file: string;
}) {
  const logManager = await getLogManager();
  const log = await logManager.readFile(id, file);

  const exception = fishForRegex<ExceptionTroubleshooting>(log, exceptionRegex);
  const troubleshooting = fishForRegex<XLTroubleshooting>(log, xlRegex);

  if (troubleshooting == null) {
    return (
      <>
        <p>No troubleshooting detected.</p>
        <GenericLog id={id} file={file} />
      </>
    );
  }

  return (
    <>
      <InfoSection troubleshooting={troubleshooting} />
      <WarningsSection troubleshooting={troubleshooting} />
      <ExceptionSection exception={exception} />

      <div>
        <h2>Log</h2>
        <LogWrapper text={log} />
      </div>
    </>
  );
}
