'use strict';
import * as vscode from 'vscode';
import { createSetThemeForCurrentFileLanguageCommand } from './commands/setThemeForCurrentFileLanguage';
import { createSetDefaultThemeCommand } from './commands/setDefaultTheme';
import { createUseDefaultThemeForCurrentFileLanguageCommand } from './commands/useDefaultThemeForCurrentFileLanguage';
import { createClearCustomThemesForLanguageCommand } from './commands/clearCustomThemesForLanguage';
import { applyCurrentEditorTheme, applyDefaultTheme } from './configuration';

let timeout: NodeJS.Timer | undefined;

export function activate(context: vscode.ExtensionContext) {
    const activeEditorDisposable = vscode.window.onDidChangeActiveTextEditor((e) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        if (e) {
            applyCurrentEditorTheme();
        } else {
            if (vscode.window.visibleTextEditors.length === 0) {
                timeout = setTimeout(() => {
                    applyDefaultTheme();
                    timeout = undefined;
                }, 200);
            }
        }
    });

    context.subscriptions.push(createSetThemeForCurrentFileLanguageCommand());
    context.subscriptions.push(createSetDefaultThemeCommand());
    context.subscriptions.push(createUseDefaultThemeForCurrentFileLanguageCommand());
    context.subscriptions.push(createClearCustomThemesForLanguageCommand());

    context.subscriptions.push(activeEditorDisposable);
}

export function deactivate() {
}