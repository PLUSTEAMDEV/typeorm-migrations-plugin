"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitChangedFilesDetector = void 0;
const utils_1 = require("@/utils/database-migrations/utils");
class GitChangedFilesDetector {
    static getChangedFiles() {
        const getFileMap = {
            untracked: GitChangedFilesDetector.getUnTrackedFiles,
            unstaged: GitChangedFilesDetector.getUnstagedFiles,
            staged: GitChangedFilesDetector.getStagedFiles,
        };
        const changedFiles = new Set();
        for (const getFiles of Object.values(getFileMap)) {
            getFiles().forEach((file) => changedFiles.add(file));
        }
        changedFiles.delete("");
        return Array.from(changedFiles);
    }
}
exports.GitChangedFilesDetector = GitChangedFilesDetector;
GitChangedFilesDetector.getUnTrackedFiles = utils_1.getLinesFromCommand.bind(null, `git ls-files --others --exclude-standard`);
GitChangedFilesDetector.getUnstagedFiles = utils_1.getLinesFromCommand.bind(null, `git diff --relative --name-only`);
GitChangedFilesDetector.getStagedFiles = utils_1.getLinesFromCommand.bind(null, `git diff --relative --name-only --staged`);
//# sourceMappingURL=GitChangedFilesDetector.js.map