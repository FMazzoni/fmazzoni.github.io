

# Creating a static site with Pelican

Here is the [website](https://docs.getpelican.com/en/latest/publish.html) to the documentation.

To get started, use poetry to create a new project:

```bash
poetry install
poetry shell
```

Then serve the site with invoke:

```bash
cd blog
invoke livereload
```

alternatively, you can use the following command:

```bash
poe serve
```
