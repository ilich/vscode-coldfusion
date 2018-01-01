# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## v1.0.1 - 2018-01-01
### Added
- CFML tags support to CFScript context.
### Changed
- Fixed https://github.com/ilich/vscode-coldfusion/issues/36.

## v1.0.0 - 2017-12-29
### Added
- `CFML Light` and `CFML Dark` themes with CFML tags support.
- `cfml.snippets.enabled` setting.
### Changed
- Changed language ID to be `cfml`.
- Updated syntax highlighting based on the latest TextMate ColdFusion bundle. New syntax file understands built-in CFML tags.
- Updated CFML snippets using https://cfdocs.org/ content.
- Line comments (`CTRL+/`) and block comments (`SHIFT+ALT+A`) take current context into account.
- Fixed https://github.com/ilich/vscode-coldfusion/issues/32.
- Fixed https://github.com/ilich/vscode-coldfusion/issues/27.

## v0.0.11 - 2017-08-25
### Added
- `WriteDump` snippet.
### Changed
- Use CFML comments by default instead of CFScript comments.

## v0.0.10 - 2017-07-18
### Changed
- Use `lang-cfml` as the language identifier for the extension due some other extension compatibility issues.

## v0.0.9 - 2017-07-17
### Changed
- Use `cfml` instead of `lang-cfml` as the language identifier for the extension.

## v0.0.8 - 2017-07-16
### Added
- Extension logo.

## v0.0.7 - 2017-07-16
### Changed
- Updated syntax highlighting based on SublimeText bundle.

## v0.0.6 - skipped

## v0.0.5 - skipped

## v0.0.4 - 2016-11-23
### Added
- Language configuration: comments support.

## v0.0.3 - 2016-02-16
### Changed
- Updated syntax highlighting and added snippets TextMate ColdFusion bundle.

## v0.0.2 - 2016-02-14
### Changed
- Syntax highlighting and refactoring.

## v0.0.1 - 2015-11-29
### Added
- Initial Release.