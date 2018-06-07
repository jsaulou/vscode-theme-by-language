import * as vscode from 'vscode';
import { listThemes, applyTheme, getDefaultTheme, setDefaultTheme, saveThemeForLanguage, applyCurrentEditorTheme, getWorkbenchTheme } from '../configuration';

export function createSetThemeForCurrentFileLanguageCommand() {
    const command = vscode.commands.registerCommand('theme-by-language.setThemeForCurrentFileLanguage', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const languageId = editor.document.languageId;
            const currentTheme = getWorkbenchTheme();

            vscode.window.showQuickPick(listThemes(), {
                canPickMany: false, placeHolder: `Select theme for language ${languageId}`, onDidSelectItem: i => {
                    let selectedTheme;
                    if (typeof i === 'string') {
                        selectedTheme = i;
                    } else {
                        selectedTheme = i.label;
                    }
                    applyTheme(selectedTheme);
                }
            }).then(theme => {
                if (theme) {
                    // If no default theme is set (first run), set the default theme to the current theme
                    if (!getDefaultTheme()) {
                        setDefaultTheme(currentTheme).then(() => saveThemeForLanguage(languageId, theme));
                    } else {
                        saveThemeForLanguage(languageId, theme);
                    }
                } else {
                    // Restore theme because previews may have changed it
                    applyCurrentEditorTheme();
                }
            }, () => {
                applyCurrentEditorTheme();
            });
        }
    });

    return command;
}