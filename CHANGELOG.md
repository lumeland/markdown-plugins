<!-- deno-fmt-ignore-file -->

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

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

[0.4.0]: https://github.com/lumeland/markdown-plugins/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lumeland/markdown-plugins/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lumeland/markdown-plugins/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/lumeland/markdown-plugins/releases/tag/v0.1.0
