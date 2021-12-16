import * as vscode from 'vscode';

const THEMES_PARAMETER_NAME = "theme-by-language.themes";
const CONFIG_TARGET_PARAMETER_NAME = "theme-by-language.useGlobalConfigOnly";
const DEFAULT_THEME_LANGUAGE = "*";
const WORKBENCH_COLOR_THEME = "workbench.colorTheme";

/** Where to save `workbench.colorTheme` configuration */
function getConfigurationTarget(): vscode.ConfigurationTarget {
    let globalScope = vscode.workspace.workspaceFolders === undefined ||
        vscode.workspace.getConfiguration().has(CONFIG_TARGET_PARAMETER_NAME) &&
        vscode.workspace.getConfiguration().get<boolean>(CONFIG_TARGET_PARAMETER_NAME);
    return globalScope ? vscode.ConfigurationTarget.Global : vscode.ConfigurationTarget.Workspace;
}

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
        const configurationTarget = getConfigurationTarget();
        return vscode.workspace.getConfiguration().update(WORKBENCH_COLOR_THEME, theme, configurationTarget);
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