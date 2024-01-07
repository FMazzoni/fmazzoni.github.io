Thank this dude, maybe write a pull request:

https://github.com/pelican-plugins/render-math/issues/16



For now pelican-themes is in ~/pelican-themes ... I think I should move it to the root of the project.


in the pelicanpractice folder run invoke livereload to start the server

```bash
cd pelicanpractice
invoke livereload
```


The main thing is to create a nice looking custom theme with CSS... I'm not sure how to do that yet.
Biggest thing to know is that Jinja2 is the templating language used by Pelican and that the /static folder is outputted to the /theme folder for css and js files.

```html
        <dark-mode-toggle permanent="" style="position: absolute; top: 0; border: 0; left: 1rem" mode="dark" appearance="toggle"></dark-mode-toggle>
        <script type="module" src="https://unpkg.com/dark-mode-toggle"></script>
        <script>
          const toggle = document.querySelector("dark-mode-toggle");
    
          // Set or remove the mode classes the first time:
          if (toggle.mode === "dark") {
            document.documentElement.classList.add("holiday-css-dark");
          } else if (toggle.mode === "light") {
            document.documentElement.classList.add("holiday-css-light");
          }
    
          // Listen for toggle changes (which includes `prefers-color-scheme`
          // changes) and toggle the `dark` class accordingly:
          toggle.addEventListener("colorschemechange", () => {
            document.documentElement.classList.toggle(
              "holiday-css-dark",
              toggle.mode === "dark"
            );
            document.documentElement.classList.toggle(
              "holiday-css-light",
              toggle.mode === "light"
            );
          });
        </script>
```