import { execSync } from "child_process";

export function getFileArrayFromCommand(command: string) {
  return execSync(command).toString().split("\n");
}
