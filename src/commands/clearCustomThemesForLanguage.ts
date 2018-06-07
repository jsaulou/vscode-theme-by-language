import * as vscode from 'vscode';
import { clearAllLanguageThemes } from '../configuration';

export function createClearCustomThemesForLanguageCommand() {
    const command = vscode.commands.registerCommand('theme-by-language.clearCustomThemesForFileLanguage', () => {
        clearAllLanguageThemes();
    });

    return command;
}