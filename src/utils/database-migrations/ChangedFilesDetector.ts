const { spawnSync } = require("child_process");

export class ChangedFilesDetector {
  changedFiles: string[];
  commands: string[] = [
    `git ls-files --others --exclude-standard`,
    `git diff --relative --name-only`,
    `git diff --relative --name-only --staged`,
  ];

  fetchGitFiles(command: string): string[] {
    let [bin, ...args] = command.split(" ");
    let changedFiles = spawnSync(bin, args);
    let files = changedFiles.stdout.toString().split("\n");
    files = files.slice(0, -1);
    return files;
  }

  removeDuplicatedFiles(changedFilesByCommand: string[][]): void {
    this.changedFiles = [
      ...new Set([
        ...changedFilesByCommand[0],
        ...changedFilesByCommand[1],
        ...changedFilesByCommand[2],
      ]),
    ];
  }

  getChangedFiles(): string[] {
    const changedFilesByCommand = this.commands.map((command: string) =>
      this.fetchGitFiles(command)
    );
    this.removeDuplicatedFiles(changedFilesByCommand);
    return this.changedFiles;
  }
}
