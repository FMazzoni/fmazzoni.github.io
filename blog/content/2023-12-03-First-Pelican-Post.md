---
title: First Pelican Post
date: 2023-12-03
category: misc
tags: pelican, publishing
---


Following is a test of the pelican-render-math plugin.

## Writing math in markdown

Inline math written with just `$a^2+b^2=c^2$` is awesome. $a^2+b^2=c^2$ is awesome.

As well as block math:

$$
f(x) = \int_{-\infty}^\infty
\hat f(\xi) e^{2 \pi i \xi x}
 d\xi
$$

written with the below snippet surrounded by `$$`:
```latex
f(x) = \int_{-\infty}^\infty
\hat f(\xi) e^{2 \pi i \xi x}
d\xi
```

Alternatively, you can use the `equation` environment, this will allow you to reference the equation later. For example, you can write

```latex
\begin{equation}\label{gauss}
\int_0^\infty e^{-x^2} dx=\frac{\sqrt{\pi}}{2} 
\end{equation}
```  

which will render as

\begin{equation}\label{gauss}
\int_0^\infty e^{-x^2} dx=\frac{\sqrt{\pi}}{2} 
\end{equation}

and now you can reference the equation later with `\ref{gauss}`. For example, the equation $\ref{gauss}$ is awesome.



Changes to make it work:

1. python -m pip install pelican-render-math
2. python -m pip install typogrify




```mermaid

graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```


Here are the github repos:
[pelican-render-math](https://github.com/pelican-plugins/render-math)
[typogrify](https://github.com/mintchaos/typogrify)
