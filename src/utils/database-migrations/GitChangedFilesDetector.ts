import { GitFileStatus } from "@/utils/database-migrations/interfaces";
import { getLinesFromCommand } from "@/utils/database-migrations/utils";

export class GitChangedFilesDetector {
  static getUnTrackedFiles = getLinesFromCommand.bind(
    null,
    `git ls-files --others --exclude-standard`
  );
  static getUnstagedFiles = getLinesFromCommand.bind(
    null,
    `git diff --relative --name-only`
  );
  static getStagedFiles = getLinesFromCommand.bind(
    null,
    `git diff --relative --name-only --staged`
  );

  static getChangedFiles(): string[] {
    const getFileMap: Record<GitFileStatus, () => string[]> = {
      untracked: GitChangedFilesDetector.getUnTrackedFiles,
      unstaged: GitChangedFilesDetector.getUnstagedFiles,
      staged: GitChangedFilesDetector.getStagedFiles,
    };
    const changedFiles: Set<string> = new Set();
    for (const getFiles of Object.values(getFileMap)) {
      getFiles().forEach((file: string) => changedFiles.add(file));
    }
    changedFiles.delete("");
    return Array.from(changedFiles);
  }
}
