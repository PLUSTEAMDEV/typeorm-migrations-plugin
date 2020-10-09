import { GitFileStatus } from "@/utils/database-migrations/interfaces";
import { getFileArrayFromCommand } from "@/utils/database-migrations/utils";

export class GitChangedFilesDetector {
  getUnTrackedFiles = getFileArrayFromCommand.bind(
    null,
    `git ls-files --others --exclude-standard`
  );
  getUnstagedFiles = getFileArrayFromCommand.bind(
    null,
    `git diff --relative --name-only`
  );
  getStagedFiles = getFileArrayFromCommand.bind(
    null,
    `git diff --relative --name-only --staged`
  );

  getChangedFiles(): string[] {
    const getFileMap: Record<GitFileStatus, () => string[]> = {
      untracked: this.getUnTrackedFiles,
      unstaged: this.getUnstagedFiles,
      staged: this.getStagedFiles,
    };
    const changedFiles: Set<string> = new Set();
    for (const getFiles of Object.values(getFileMap)) {
      getFiles().forEach((file: string) => changedFiles.add(file));
    }
    changedFiles.delete("");
    return Array.from(changedFiles);
  }
}
