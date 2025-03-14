# Changelog

All notable changes to this project will be documented in this file.

## 2.2.0-beta

Released on **2025/03/14**.

### Added

- Adds `beforetoggle` and `toggle` events.
- Adds `tabsGenerator` function.
- Adds `triggerActiveClass` to `DroppyOptions`.

### Changed

- Renames `generator` to `menuGenerator`.
- Improves docs.

### Removed

- Removes `clickAwayToClose` from `DroppyOptions`.
- The `DroppyContext` no longer registers the `click` handler used for the 'click away' functionality.

## 2.1.0

Released on **2025/03/07**.

### Added

- Adds `DroppyContenxt` class.

### Changed

- Improved default generatorOptions: `{ wrapper: 'li', trigger: 'a', drop: 'ul' }`.

## 2.0.1

Released on **2025/02/28**.

### Changed

- The `generator()` function ignores wrappers that don't contain a trigger or drop element.
- Improved default generatorOptions: `{ wrapper: 'li', trigger: 'a', drop: 'ul.menu' }`.

### Fixed

- Clicking inside a trigger sub-element closes the dropdown.

## v2.0.0 

Released on **2025/02/27**.

### Added

- `generator()` function.
- Uses ES6 module.

### Changed

- `options` object has been simplified.
- License from GNU GPLv3 to MIT.

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
