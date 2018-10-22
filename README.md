# math API

Place LaTeX Math equation on anywhere as `<img>` tag.

https://math.now.sh

## Usage

```
curl https://math.now.sh?from=\sum^{N}_{i}x_i
```

### HTML

```
<img src="https://math.now.sh?from=\log \prod^N_i x_i = \sum^N_i \log x_i" />
```

<img src="https://math.now.sh?from=\log \prod^N_i x_i = \sum^N_i \log x_i" />

```
<img src="https://math.now.sh?inline=\log \prod^N_i x_i = \sum^N_i \log x_i" />
```

<img src="https://math.now.sh?inline=\log \prod^N_i x_i = \sum^N_i \log x_i" />
    
### Markdown

```
![](https://math.now.sh?from=LaTeX equation)
```
