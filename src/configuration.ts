import * as vscode from 'vscode';

const THEMES_PARAMETER_NAME = "theme-by-language.themes";
const DEFAULT_THEME_LANGUAGE = "*";
const WORKBENCH_COLOR_THEME = "workbench.colorTheme";

export function hasThemeConfiguration() {
    return vscode.workspace.getConfiguration().has(THEMES_PARAMETER_NAME);
}

export function getThemeConfiguration(): any {
    return vscode.workspace.getConfiguration().get(THEMES_PARAMETER_NAME);
}

export function getTheme(language: string): string | undefined {
    const conf = getThemeConfiguration();
    return conf ? conf[language] : undefined;
}

export function getDefaultTheme() {
    return getTheme(DEFAULT_THEME_LANGUAGE);
}

export function setDefaultTheme(theme: string) {
    return saveThemeForLanguage(DEFAULT_THEME_LANGUAGE, theme);
}

export function saveThemeForLanguage(language: string, theme: string) {
    const targetThemes = getThemeConfiguration();
    targetThemes[language] = theme;
    return vscode.workspace.getConfiguration().update(THEMES_PARAMETER_NAME, targetThemes, true);
}

export function removeThemeForLanguage(language: string) {
    const targetThemes = getThemeConfiguration();
    delete (targetThemes[language]);
    return vscode.workspace.getConfiguration().update(THEMES_PARAMETER_NAME, targetThemes, true);
}

export function clearAllLanguageThemes() {
    if (hasThemeConfiguration()) {
        const defaultTheme = getDefaultTheme();
        return vscode.workspace.getConfiguration().update(THEMES_PARAMETER_NAME, undefined, true).then(() => {
            if (defaultTheme) {
                return applyTheme(defaultTheme);
            }
        });
    }
}

export function getWorkbenchTheme(): any {
    return vscode.workspace.getConfiguration().get(WORKBENCH_COLOR_THEME);
}

export function applyDefaultTheme() {
    return applyLanguageTheme(DEFAULT_THEME_LANGUAGE);
}

export function applyLanguageTheme(language: string) {
    let theme = getTheme(language) || getDefaultTheme();
    if (theme) {
        return applyTheme(theme);
    }
}

export function applyTheme(theme: string) {
    if (theme !== getWorkbenchTheme()) {
        return vscode.workspace.getConfiguration().update(WORKBENCH_COLOR_THEME, theme, true);
    }
}

export function applyCurrentEditorTheme() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        return applyLanguageTheme(editor.document.languageId);
    } else {
        return applyDefaultTheme();
    }
}

export function listThemes(): string[] {
    const extensions = vscode.extensions.all;
    const themeLabels: string[] = [];

    extensions.forEach(e => {
        const contributes = e.packageJSON.contributes;
        if (contributes) {
            const contributedThemes = contributes.themes;
            if (contributedThemes) {
                contributedThemes.forEach((theme: any) => themeLabels.push(theme.id || theme.label));
            }
        }
    });

    return themeLabels.sort();
}