# Changelog

All notable changes to this project will be documented in this file.

## v2.0.0 

[unreleased]

### Added

- `generator()` function.
- Uses ES6 module.

### Changed

- `options` object has been simplified.

### Removed

- All events have been removed.

## v1.1.1

Released on **2017/10/26**.

### Added

- CHANGELOG.md
- You will be able to open a drop-down with a closed parent.
- Implemented custom events `open`, `close`, `openAll`, `closeAll`, `init` and `destroy`.
- `preventDefault` set to `true` will let you open the link in a new tab using `Ctrl + Click`.

### Changed

- Updated `README.md` adding *Events* section and `TinyEmitter` inherited methods.
- Updated Node.js dev-dependencies.
- Simplified `clickHandler()` function. 

### Deprecated

- Callbacks are deprecated in favor of events in `v2.0.0`.
- Support for IE9 and IE10 will be removed in `v2.0.0`.

### Removed

- Removed `.eslintrc.json` file.
