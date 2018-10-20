'use strict';
import * as vscode from 'vscode';
import { createSetThemeForCurrentFileLanguageCommand } from './commands/setThemeForCurrentFileLanguage';
import { createSetDefaultThemeCommand } from './commands/setDefaultTheme';
import { createUseDefaultThemeForCurrentFileLanguageCommand } from './commands/useDefaultThemeForCurrentFileLanguage';
import { createClearCustomThemesForLanguageCommand } from './commands/clearCustomThemesForLanguage';
import { applyCurrentEditorTheme, applyDefaultTheme } from './configuration';

let timeout: NodeJS.Timer | undefined;

export function activate(context: vscode.ExtensionContext) {
    // Check active editor
    if (vscode.window.activeTextEditor) {
        applyCurrentEditorTheme();
    }

    // Listen for active editor changes
    const visibleEditorsDisposable = vscode.window.onDidChangeVisibleTextEditors((e) => {
        // There is only one editor visible but it is not a file => Revert to default theme
        if (e.length === 1 && !isFileEditor(e[0])) {
            applyDefaultThemeTimeout();
        }
    });

    const activeEditorDisposable = vscode.window.onDidChangeActiveTextEditor((e) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        if (e) {
            if (isFileEditor(e)) {
                // Current editor is a file editor
                applyCurrentEditorTheme();
            } else {
                // There is only one editor visible but it is not a file => Revert to default theme
                if (vscode.window.visibleTextEditors.length === 1) {
                    applyDefaultThemeTimeout();
                }
            }
        } else {
            // No editor is visible => Revert to default theme
            if (vscode.window.visibleTextEditors.length === 0) {
                applyDefaultThemeTimeout();
            }
        }
    });

    context.subscriptions.push(createSetThemeForCurrentFileLanguageCommand());
    context.subscriptions.push(createSetDefaultThemeCommand());
    context.subscriptions.push(createUseDefaultThemeForCurrentFileLanguageCommand());
    context.subscriptions.push(createClearCustomThemesForLanguageCommand());

    context.subscriptions.push(activeEditorDisposable);
    context.subscriptions.push(visibleEditorsDisposable);
}

export function deactivate() {
}

function isFileEditor(e: vscode.TextEditor): boolean {
    return e.document.uri.scheme !== 'output';
}

function applyDefaultThemeTimeout() {
    timeout = setTimeout(() => {
        applyDefaultTheme();
        timeout = undefined;
    }, 200);
}