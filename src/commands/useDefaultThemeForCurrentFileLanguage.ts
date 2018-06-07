import * as vscode from 'vscode';
import { removeThemeForLanguage, applyDefaultTheme } from '../configuration';

export function createUseDefaultThemeForCurrentFileLanguageCommand() {
    const command = vscode.commands.registerCommand('theme-by-language.useDefaultThemeForCurrentFileLanguage', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const languageId = editor.document.languageId;
            removeThemeForLanguage(languageId).then(() => applyDefaultTheme());
        }
    });

    return command;
}