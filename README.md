# Math API

Place LaTeX Math equation on anywhere as `<img>` tag.

https://math.now.sh

## Usage

```
curl https://math.now.sh?from=\sum^{N}_{i}x_i
```

### HTML

```
<img src="https://math.now.sh?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```

<img src="https://math.now.sh?from=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />

```
<img src="https://math.now.sh?inline=\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}" />
```

<img src="https://math.now.sh?inline=\log\prod^N_{i}x_i=\sum^N_i\log{x_i}" />
    
### Markdown

```
![](https://math.now.sh?from=\LaTeX)
```

![](https://math.now.sh?from=\LaTeX)

## Option

### **.svg** extension

Params with **.svg** extension will be treated as normal math formula.

Some Markdown blog services won't recognize image tag which has not any image extention on it. This option covers those situations.
