import datetime
import os

AUTHOR = "Fernando"
SITENAME = "site"
SITEURL = "https://fmazzoni.github.io"
EMAIL = ""

PATH = "content"

TIMEZONE = "America/New_York"

DEFAULT_LANG = "en"

# print home directory
THEME = "../custom_theme/"
STYLESHEET_URL = "https://cdn.jsdelivr.net/npm/holiday.css@0.11.2"  # STYLESHEET_URL = "/theme/css/style.css"


# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ("Python", "https://www.python.org/"),
    ("Pelican", "https://getpelican.com/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
)

# Social widget
SOCIAL = (
    ("GitHub", "https://github.com/FMazzoni"),
    ("LinkedIn", "https://www.linkedin.com/in/fernando-mazzoni-166443187"),
    # ("Another social link", "#"),
)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True


JINJA_GLOBALS = {
    "now": datetime.datetime.utcnow(),
    "current_year": datetime.datetime.utcnow().year,
}

MATH_JAX = {
    "equation_numbering": "AMS",
}


# Extra settings
DISPLAY_PAGES_ON_MENU = True
DISPLAY_CATEGORIES_ON_MENU = True
