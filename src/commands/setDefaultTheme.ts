import * as vscode from 'vscode';
import { listThemes, applyCurrentEditorTheme, applyTheme, setDefaultTheme } from '../configuration';

export function createSetDefaultThemeCommand() {
    const command = vscode.commands.registerCommand('theme-by-language.setDefaultTheme', () => {
        vscode.window.showQuickPick(listThemes(), {
            canPickMany: false, placeHolder: 'Select default theme', onDidSelectItem: i => {
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
                setDefaultTheme(theme).then(() => applyCurrentEditorTheme());
            } else {
                applyCurrentEditorTheme();
            }
        }, () => {
            applyCurrentEditorTheme();
        });
    });

    return command;
}