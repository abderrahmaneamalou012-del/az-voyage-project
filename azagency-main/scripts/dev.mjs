import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import readline from "node:readline";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const services = [
  { name: "frontend", cwd: path.join(rootDir, "agency-travel") },
  { name: "cms", cwd: path.join(rootDir, "cms") },
];

let shuttingDown = false;
let pendingExitCode = 0;

const children = services.map((service) => startService(service));

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => shutdown(0, signal));
}

function startService(service) {
  const child = spawn(npmCommand, ["run", "dev"], {
    cwd: service.cwd,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  forwardLines(child.stdout, service.name, process.stdout);
  forwardLines(child.stderr, service.name, process.stderr);

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      maybeExit();
      return;
    }

    pendingExitCode = code ?? 1;
    const reason = signal ? `signal ${signal}` : `code ${pendingExitCode}`;
    process.stderr.write(`[${service.name}] exited with ${reason}\n`);
    shutdown(pendingExitCode);
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    pendingExitCode = 1;
    process.stderr.write(`[${service.name}] failed to start: ${error.message}\n`);
    shutdown(pendingExitCode);
  });

  return child;
}

function forwardLines(stream, label, target) {
  if (!stream) return;

  const lineReader = readline.createInterface({ input: stream });
  lineReader.on("line", (line) => {
    target.write(`[${label}] ${line}\n`);
  });
}

function shutdown(exitCode, signal = "SIGTERM") {
  if (shuttingDown) return;
  shuttingDown = true;
  pendingExitCode = exitCode;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) {
        child.kill("SIGKILL");
      }
    }
    maybeExit();
  }, 1500).unref();
}

function maybeExit() {
  const runningChildren = children.filter((child) => child.exitCode === null && child.signalCode === null);
  if (runningChildren.length === 0) {
    process.exit(pendingExitCode);
  }
}
