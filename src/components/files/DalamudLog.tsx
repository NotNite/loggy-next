import { fishForRegex, getLogManager } from "@/logs";
import GenericLog from "./GenericLog";
import LogWrapper from "../LogWrapper";
import {
  DalamudTroubleshooting,
  ExceptionTroubleshooting,
  PluginState,
  dalamudRegex,
  exceptionRegex
} from "@/logs/types";
import ExceptionSection from "../ExceptionSection";

interface Plugin {
  name: string;
  internalName: string;
  version: string;
  thirdParty: boolean;
  repoUrl: string | null;
  state: PluginState;
}

function InfoSection({
  troubleshooting
}: {
  troubleshooting: DalamudTroubleshooting;
}) {
  return (
    <div>
      <h2>Info</h2>
      <ul>
        <li>Dalamud version: {troubleshooting.DalamudVersion}</li>
        <li>Dalamud git hash: {troubleshooting.DalamudGitHash}</li>
        <li>Game version: {troubleshooting.GameVersion}</li>
        <li>
          Interface loaded: {troubleshooting.InterfaceLoaded ? "true" : "false"}
        </li>
        <li>
          Has external plugin repositories:{" "}
          {troubleshooting.HasThirdRepo ? "true" : "false"}
        </li>
        <li>Testing key: {troubleshooting.BetaKey ?? "null"}</li>
      </ul>
    </div>
  );
}

function WarningsSection({
  troubleshooting,
  plugins
}: {
  troubleshooting: DalamudTroubleshooting;
  plugins: Plugin[];
}) {
  const warnings = [];

  if (
    plugins
      .filter((x) => x.state === PluginState.Loaded)
      .filter((x) => x.thirdParty).length > 0
  ) {
    warnings.push("Plugins from custom repositories are enabled.");
  }

  if (troubleshooting.BetaKey != null) {
    warnings.push("Dalamud testing is enabled.");
  }

  if (troubleshooting.DoPluginTest) {
    warnings.push("Dalamud plugin testing is enabled.");
  }

  if (troubleshooting.ForcedMinHook) {
    warnings.push("ForcedMinHook is enabled.");
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

function PluginsSection({ plugins }: { plugins: Plugin[] }) {
  const entries: JSX.Element[] = [];
  const sorted = plugins.sort((a, b) =>
    a.internalName.localeCompare(b.internalName)
  );

  for (const plugin of sorted) {
    const nameEl =
      plugin.repoUrl != null ? (
        <a href={plugin.repoUrl}>{plugin.name}</a>
      ) : (
        <span>{plugin.name}</span>
      );

    const el = (
      <span>
        {nameEl} - {plugin.version} ({plugin.internalName} - {plugin.state})
      </span>
    );

    entries.push(<li key={plugin.internalName}>{el}</li>);
  }

  return (
    <div>
      <h2>Plugins</h2>
      <ul>{entries}</ul>
    </div>
  );
}

export default async function DalamudLog({
  id,
  file
}: {
  id: string;
  file: string;
}) {
  const logManager = await getLogManager();
  const log = await logManager.readFile(id, file);

  const exception = fishForRegex<ExceptionTroubleshooting>(log, exceptionRegex);
  const troubleshooting = fishForRegex<DalamudTroubleshooting>(
    log,
    dalamudRegex
  );

  if (troubleshooting == null) {
    return (
      <>
        <p>No troubleshooting detected.</p>
        <GenericLog id={id} file={file} />
      </>
    );
  }

  const pluginSources = [
    null,
    "",
    "https://kamori.goats.dev/Plugin/PluginMaster",
    "https://raw.githubusercontent.com/goatcorp/DalamudPlugins/api6/pluginmaster.json",
    "OFFICIAL"
  ];

  const plugins: Plugin[] = [];
  for (const plugin of troubleshooting!.LoadedPlugins) {
    plugins.push({
      name: plugin.Name,
      internalName: plugin.InternalName,
      version: plugin.AssemblyVersion,
      thirdParty:
        !pluginSources.includes(plugin.InstalledFromUrl) ||
        plugin.DownloadLinkInstall === null,
      repoUrl: plugin.RepoUrl,
      state:
        troubleshooting.PluginStates[plugin.InternalName] ?? PluginState.Unknown
    });
  }

  return (
    <>
      <InfoSection troubleshooting={troubleshooting} />
      <WarningsSection troubleshooting={troubleshooting} plugins={plugins} />
      <ExceptionSection exception={exception} />
      <PluginsSection plugins={plugins} />

      <div>
        <h2>Log</h2>
        <LogWrapper text={log} />
      </div>
    </>
  );
}
