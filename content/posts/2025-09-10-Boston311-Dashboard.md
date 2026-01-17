---
title: Boston 311 Dashboard
date: 2025-09-10
category: misc
tags: python, geospatial, dashboard, duckdb, panel, lonboard
excerpt: "A weekend project exploring Boston's 311 service data with DuckDB, Panel, and Lonboard - building an interactive geospatial dashboard to visualize civic service requests."
---


## What I Built

I found Boston's 311 service request data was publicly available and spent a weekend building a simple dashboard to explore it. The dataset has about 14 years worth of records (2011-2025), which turned out to be a decent challenge for interactive visualization.

The result is a basic geospatial dashboard using DuckDB for data queries, Panel for the interface, and Lonboard for GPU-accelerated mapping. Nothing fancy, but it gets the job done.

**Try the interactive dashboard below** - you can filter by time period and neighborhood to explore Boston's 311 service requests:

<div class="iframe-container">
<iframe
 src="https://fmazzoni-boston311.hf.space"
 frameborder="0"
 allowfullscreen
></iframe>
</div>

*Want to check out the dashboard on Hugging Face Spaces? [Try it here](https://huggingface.co/spaces/fmazzoni/boston311) or look at the [code](https://github.com/FMazzoni/boston311_paneldashboard) to see how it's built.*

## Technical Choices

### The Stack

I picked a few tools that seemed like they'd work well together:

**DuckDB**: Good for analytical queries and has a spatial extension that handles geographic data without needing PostGIS.

**Lonboard**: A mapping library built on deck.gl that uses WebGL for rendering lots of points smoothly.

**Panel**: Dashboard framework that handles the interactive bits and state management reasonably well.

### Handling Spatial Data

The spatial data needed some processing since it comes as hex-encoded binary. DuckDB's spatial extension handles the conversion:

```python
@pn.cache
def init_duckdb(file_path: Path) -> duckdb.DuckDBPyConnection:
    con = duckdb.connect()
    con.install_extension("spatial")
    con.load_extension("spatial")
    con.sql(f"CREATE TABLE requests AS SELECT * FROM '{file_path}'")
    return con
```

The data extraction converts the hex-encoded geometry during preprocessing rather than at query time.

## Data Processing Pipeline

### Getting the Data

Instead of manually downloading CSVs, I built a scraper that automatically finds and processes new data from Boston's data portal:

```python
def get_service_requests_urls() -> list[tuple[str, str]]:
    """Scrapes Boston's data portal for all available 311 datasets"""
    response = requests.get("https://data.boston.gov/dataset/311-service-requests")
    # Regex pattern matching for dynamic URL discovery
    pattern = r'<a href="(https://data\.boston\.gov/dataset/[a-f0-9-]+/resource/[a-f0-9-]+/download/tmp[a-z0-9_]+\.csv)"[^>]*aria-label="([^"]*)"'
    return re.findall(pattern, response.text)
```

### Processing Spatial Data

The geometry data comes as hex-encoded binary that needs conversion:

```sql
SELECT 
    *,
    CASE 
        WHEN geom_4326 IS NOT NULL 
        THEN ST_GeomFromHEXEWKB(geom_4326)
        ELSE NULL 
    END as geometry
FROM service_requests_raw
WHERE geom_4326 IS NOT NULL
```

This preprocessing step converts the hex-encoded geometry into a format that works with the mapping library.

### CSV to Parquet Conversion

The scraper downloads CSV files for each year, but the dashboard actually uses Parquet files for better performance. The extraction script handles this conversion:

1. **Download CSVs** from Boston's data portal (one file per year)
2. **Process geometry** using DuckDB's spatial extension to convert hex-encoded data
3. **Save as Parquet** for faster loading in the dashboard
4. **Filter out invalid records** during the conversion process

This means the Panel app works with pre-processed Parquet files rather than raw CSVs, which makes the initial data loading much faster.

## Performance Notes

### Caching and Data Handling

The dashboard uses a few basic optimizations:

- Panel's `@pn.cache` decorator for database operations
- Parquet format for reasonably fast data loading
- Hard limits to keep the UI responsive

```python
# Data limits in config.py (only required for the table view)
MAX_DISPLAY_RECORDS = 100
MAX_SELECTION_RECORDS = 1000
```

Nothing too fancy, but it keeps things from getting too slow.

## How Panel Works Here

Panel turned out to be a good choice for this kind of dashboard. Here's how I used it:

### Reactive Parameters

Panel's `param` system handles the interactive filters. When a user changes a time period or neighborhood filter, it automatically triggers updates to the data and map:

```python
class StateViewer(pn.viewable.Viewer):
    time_period = param.Selector(default="Year to Date", objects=TIME_PERIODS.keys())
    neighborhood = param.Selector(default="All", objects=get_neighborhoods())
    
    @param.depends("time_period", "neighborhood", watch=True)
    def _update_data(self):
        # Automatically rebuilds SQL query when filters change
```

### Caching Integration

Panel's `@pn.cache` decorator prevents expensive operations from running repeatedly. Database connections and data queries get cached automatically, so switching between filters is fast.

### Widget Integration

The dashboard uses Panel widgets for controls and integrates Lonboard (an ipywidgets-compatible mapping library) directly into the layout. Panel handles the communication between the Python backend and the web frontend.

## Deployment

### Docker Setup

Pretty standard Docker setup for a Python app:

- Uses Python 3.13 slim base image
- UV for dependency management  
- Installs geospatial system libraries (GDAL, PROJ, GEOS)
- Runs as non-root user

```dockerfile
FROM python:3.13-slim
# System dependencies for geospatial libraries
RUN apt-get update && apt-get install -y \
    gcc g++ libgdal-dev libproj-dev libgeos-dev \
    && rm -rf /var/lib/apt/lists/*
```

Configuration is just hardcoded values in a dataclass.

## What I Learned

A few things I picked up during this weekend project:

- DuckDB is pretty fast for analytical queries on moderately large datasets
- Lonboard/deck.gl handles lots of map points smoothly
- Panel is decent for quick dashboard prototypes
- Hex-encoded geometry data needs `ST_GeomFromHEXEWKB`, not the regular WKB functions
- Hugging Face Spaces is convenient for deploying simple apps

## Code Organization

I tried to keep things reasonably organized:

- Split functionality into separate modules
- Added type hints where they seemed useful
- Used Ruff for linting
- Basic error handling for the main user interactions

Nothing too sophisticated, but it's readable and the modules have clear purposes.

## Key Takeaways

A few things that seemed to matter for this type of project:

1. **Keep it responsive**: Even basic optimizations like data limits and caching make a big difference for user experience.

2. **Start simple**: DuckDB + Panel + Lonboard was a good combination that didn't require too much setup complexity.

3. **Modular helps**: Splitting the code into focused modules made it easier to debug and extend.

## Future Ideas

If I were to extend this, some things that might be interesting:

- Add more chart types (time series, histograms)
- Better mobile responsiveness
- Export functionality for filtered data
- Maybe connect to the real-time 311 API if Boston has one

## Final Thoughts

This was a fun weekend project that turned out reasonably well. DuckDB + Panel + Lonboard is a solid stack for geospatial dashboards, and the Boston 311 data is interesting to explore.

The main lesson was probably that you don't need super complex architecture to build something useful - sometimes simple tools that work well together are enough.

**Technologies**: Python 3.13, DuckDB, Panel, Lonboard, Docker, Parquet, Hugging Face Spaces
