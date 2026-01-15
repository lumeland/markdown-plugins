<!-- deno-fmt-ignore-file -->

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [0.10.1] - Unreleased
### Fixed
- Footnotes: Don't fail when a reference without a footnote is found.

## [0.10.0] - 2025-12-27
### Added
- References plugin.

### Fixed
- Handle multiple references to the same footnote [#3] [#4].

## [0.9.0] - 2025-03-04
### Changed
- Simplified Wikilinks plugin.

### Fixed
- Pass `state.env` in `footnote_reference_close` blocks [#2]

## [0.8.0] - 2024-12-31
### Added
- Wikilinks plugin.

## [0.7.1] - 2024-08-30
### Added
- Re-export available anchors from the toc plugin.

### Fixed
- Footnotes multiline note with softbreaks.

## [0.7.0] - 2023-12-19
### Added
- Support for Lume 2.

### Removed
- Support for Lume 1.

## [0.6.0] - 2023-10-29
### Added
- TOC: New option `slugify` to configure how the ids are generated
  - It can be a function `(value: string) => string`
  - Or an object with the options for the `createSlugifier` function.
  If it's not set, a new slugifier is created with the default options.

### Changed
- TOC plugin requires Lume v1.19.3

## [0.5.1] - 2023-08-01
### Fixed
- `footnotes` plugin attributes.

## [0.5.0] - 2023-05-06
### Added
- `footnotes` plugin.

## [0.4.0] - 2023-03-14
### Added
- New `attribute` option to `image` plugin to select the first image
  with a specific attribute (By default is `main`) instead of the first image found.
  For example: `![alt](/image.png){main}`

## [0.3.0] - 2023-01-28
### Added
- `transform` option to `title` plugin.

## [0.2.0] - 2023-01-03
### Added
- `image` plugin.
- Lume plugins to install the markdown plugins more easily.

### Changed
- `title` plugin doesn't override the existing value if exists.

## [0.1.0] - 2022-09-12
### Added
- `toc` plugin.
- `title` plugin.

[#2]: https://github.com/lumeland/markdown-plugins/issues/2
[#3]: https://github.com/lumeland/markdown-plugins/issues/3
[#4]: https://github.com/lumeland/markdown-plugins/issues/4

[0.10.1]: https://github.com/lumeland/markdown-plugins/compare/v0.10.0...HEAD
[0.10.0]: https://github.com/lumeland/markdown-plugins/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/lumeland/markdown-plugins/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/lumeland/markdown-plugins/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/lumeland/markdown-plugins/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/lumeland/markdown-plugins/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/lumeland/markdown-plugins/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/lumeland/markdown-plugins/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/lumeland/markdown-plugins/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/lumeland/markdown-plugins/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lumeland/markdown-plugins/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lumeland/markdown-plugins/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/lumeland/markdown-plugins/releases/tag/v0.1.0
