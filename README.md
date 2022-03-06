# Math API

[![workflow-badge]][workflow-url]

[workflow-badge]: https://github.com/uetchy/math-api/workflows/test/badge.svg
[workflow-url]: https://github.com/uetchy/math-api/actions?workflow=test

Place LaTeX Math equation on anywhere as `<img>` tag.

- https://math.vercel.app
- [Online Editor](https://math.vercel.app/#online-editor)

## Usage

```
curl https://math.vercel.app?from=\sum^{N}_{i}x_i
```

### HTML

```
<img src="https://math.vercel.app?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```

<img src="https://math.vercel.app?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />

```
<img src="https://math.vercel.app?inline=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```

<img src="https://math.vercel.app?inline=\log\prod^N_{i}x_i=\sum^N_i\log{x_i}" />
    
### Markdown

```
![](https://math.vercel.app?from=\LaTeX)
```

![Equation 1](https://math.vercel.app?from=\LaTeX)

## Option

### **.svg** extension

URL ends with **.svg** extension will be treated as a normal math formula.

Some Markdown blog services won't treat image tags correctly whose URL has no any image extension in it. This option may give fixes to these situations.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/uetchy"><img src="https://avatars.githubusercontent.com/u/431808?v=4?s=100" width="100px;" alt=""/><br /><sub><b>uetchy</b></sub></a><br /><a href="https://github.com/uetchy/math-api/commits?author=uetchy" title="Code">💻</a> <a href="#design-uetchy" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/Long0x0"><img src="https://avatars.githubusercontent.com/u/51022287?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Long0x0</b></sub></a><br /><a href="https://github.com/uetchy/math-api/commits?author=Long0x0" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
