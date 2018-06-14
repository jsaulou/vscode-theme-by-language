# Theme by language

Themes are great but sometimes some are better than others for a certain language.

This extension lets you select which theme to apply by language.

If you prefer, like me, to edit Markdown and AsciiDoc files using a dark theme but code using a light theme, or prefer the coloration of a theme for a specific language, this extension is made for you.

## Preview

![Preview](/images/preview.gif)

## How to use

> **Important**: If you have set a theme for a language, changing the color theme using the standard vscode menu **will not work**. To change the default theme, use the `Set default theme` command.

### Set default theme fallback

Use the command `Set default theme` to set the default theme.
This theme will be used for all file languages that do not have a custom theme set.

### Set custom theme for a filetype

Open a file and use the command `Set theme for current file language` to set the theme to use for this file language.

To revert to the default theme for the current file language, use the command `Use the default for current file language`.

### Clear all custom themes

To unregister all custom themes, use the command `Clear all registered custom themes for file languages`.

## Limitations

- Changing the language manually for the current file will not automatically change the theme. You will need to switch editors.
- Does not work well when switching between multiple instances of vscode

Special thanks to [@MrDoomy](https://github.com/MrDoomy) for creating the logo!

**Enjoy!**