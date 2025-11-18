---
title: Visualizing Earth's Geoid in 3D
date: 2025-11-17
category: misc
tags: python, geospatial, visualization, threejs, geoid, gis
excerpt: "An interactive 3D visualization of Earth's geoid—the shape of mean sea level—using Python, Three.js, and the EGM2008 gravity model. Explore how gravity shapes our planet's reference surface."
---

## What is the Geoid?

If you've worked with GPS or elevation data, you've probably heard of the geoid, but what exactly is it? Simply put, **the geoid is the shape that the ocean surface would assume if it were at rest**—an equipotential surface of Earth's gravity field. It represents mean sea level extended across the entire planet, even through continents.

Why does this matter? When your GPS gives you a height, it's measuring distance from a mathematical ellipsoid (like WGS84). But to get your actual elevation above sea level, you need to account for the geoid. The geoid undulation (the difference between the geoid and the ellipsoid) can vary by over 100 meters in places like the Indian Ocean.

**Try the interactive visualization below**—you can rotate, zoom, and adjust the deformation to see how Earth's gravity field shapes this fundamental reference surface:

<div class="iframe-container">
<iframe
 src="https://fmazzoni.github.io/geoid-globe/"
 frameborder="0"
 allowfullscreen
></iframe>
</div>

*The visualization shows geoid undulation from -106 meters (blue) to +85 meters (red), with the sphere deformed to exaggerate the variations. Use the controls to adjust deformation, rotation speed, and colormap. [View full screen](https://fmazzoni.github.io/geoid-globe/)*

### Demo Video

Here's a quick walkthrough of the interactive visualization:

<video controls width="100%">
  <source src="/geoid-globe-demo.webm" type="video/webm">
  Your browser does not support the video tag. <a href="/geoid-globe-demo.webm">Download the video</a> instead.
</video>

## Why Visualize the Geoid?

The geoid is a fundamental concept in geodesy and GIS, but it's often abstract and hard to grasp from 2D maps or numbers. A 3D interactive visualization helps:

- **Understand the concept**: See how the geoid differs from a perfect sphere
- **Explore patterns**: Notice how geoid highs and lows relate to Earth's structure
- **Appreciate scale**: The variations are subtle (meters) but significant for precise measurements

The Indian Ocean geoid low (the deep blue region) is particularly striking—it's about 77 meters below the reference ellipsoid, reflecting the mass distribution in Earth's mantle below.

## The Technical Stack

This project uses a straightforward combination of tools:

**Python (pyshtools)**: Computes the geoid from the EGM2008 (Earth Gravitational Model 2008) gravity model using spherical harmonics. EGM2008 is a standard model that represents Earth's gravity field as a series of mathematical functions.

**Three.js**: Renders the interactive 3D globe in the browser. Three.js handles the WebGL rendering, camera controls, and geometry manipulation needed to visualize the deformed sphere.

**Data Pipeline**: A simple preprocessing workflow converts the gravity model data into a format suitable for web visualization.

## Data Processing Pipeline

The workflow is straightforward:

### 1. Generate Geoid Data

Using pyshtools, we compute geoid undulation from the EGM2008 model:

```python
import pyshtools as pysh
from pyshtools import constants

# Load EGM2008 gravity model
clm = pysh.datasets.Earth.EGM2008(lmax=800)

# Get WGS84 ellipsoid parameters
a = constants.Earth.wgs84.a.value
f = constants.Earth.wgs84.f.value
u0 = constants.Earth.wgs84.u0.value

# Compute geoid undulation
earth_geoid = clm.geoid(potref=u0, a=a, f=f)
```

The `lmax` parameter controls the level of detail—higher values (up to 2160 for EGM2008) include more fine-scale variations but require more computation and storage.

### 2. Convert to Web Format

The geoid data is saved as a GeoTIFF, then converted to JSON for efficient loading in the browser:

```python
# Convert GeoTIFF to JSON
raster = rioxarray.open_rasterio("geoid.tif")
data = raster.isel(band=0).data

output_data = {
    "heights": data.tolist(),
    "lats": lats.tolist(),
    "lons": lons.tolist(),
    "minHeight": float(np.nanmin(data)),
    "maxHeight": float(np.nanmax(data)),
    "shape": list(data.shape),
}
```

This creates a compact JSON file that the browser can load and use for height lookups.

### 3. Preprocess Boundaries

World boundary polygons are cleaned and converted to LineStrings for optional wireframe rendering, helping orient the viewer on the globe.

## The Visualization

The Three.js visualization works by:

1. **Creating a high-resolution sphere**: 512×512 segments provide enough vertices to accurately sample the geoid data
2. **Deforming vertices**: Each vertex is moved radially based on its geoid height value
3. **Color mapping**: Heights are mapped to colors using scientific colormaps (Viridis, Plasma, etc.)
4. **Interactive controls**: Users can rotate, zoom, adjust deformation, and change colormaps

The key insight is that we're not just coloring a sphere—we're actually deforming the geometry to show the geoid's shape. The deformation can be exaggerated (up to 50%) to make the variations more visible, since the actual undulation is only about 0.003% of Earth's radius.

### Vertex-Level Processing

For each vertex on the sphere:

1. Calculate its latitude and longitude
2. Look up the geoid height at that location (using bilinear interpolation)
3. Scale the vertex position radially based on the height
4. Assign a color based on the height value

This happens for all ~260,000 vertices, creating a smooth, accurate representation of the geoid surface.

## Practical Applications

Understanding the geoid is important for:

- **GPS height conversion**: Converting ellipsoidal heights (from GPS) to orthometric heights (elevation above sea level) using the formula: **H = h - N**, where H is elevation, h is GPS height, and N is geoid undulation
- **Surveying and mapping**: Precise elevation measurements require geoid models
- **Satellite altimetry**: Measuring sea surface height relative to the geoid
- **Understanding Earth's structure**: Geoid patterns reveal information about mass distribution in Earth's interior

## Key Takeaways

1. **The geoid is mean sea level**: It's the equipotential surface that represents where water would settle if oceans extended through continents.

2. **It's not a perfect ellipsoid**: Variations of ±100 meters reflect Earth's internal mass distribution.

3. **It's essential for height systems**: Converting GPS heights to elevations requires geoid models like EGM2008.

4. **3D visualization helps**: Seeing the geoid as a deformed sphere makes the concept more intuitive than 2D maps or numbers.

5. **The tools are accessible**: Python (pyshtools) and Three.js make it straightforward to compute and visualize geoid data.

## Technical Notes

- **Data source**: EGM2008 (Earth Gravitational Model 2008), computed to degree 800
- **Visualization**: Three.js with 512×512 sphere segments for high detail
- **Data format**: JSON raster with bilinear interpolation for height lookups
- **Performance**: Optimized for smooth 60 FPS rendering with interactive controls

The visualization is deployed as a standalone interactive page, making it easy to embed in blog posts or share directly.

## Further Reading

If you want to dive deeper into the geoid:

- **pyshtools documentation**: <https://shtools.github.io/SHTOOLS/> - Comprehensive tools for working with spherical harmonics
- **EGM2008**: The Earth Gravitational Model 2008 used in this visualization
- **Geodesy basics**: Understanding reference surfaces (ellipsoid, geoid, topography) and height systems

The geoid is a fundamental concept in GIS and geodesy, and visualizing it in 3D helps make this abstract concept more tangible. Whether you're working with GPS data, doing surveying, or just curious about how gravity shapes our planet, understanding the geoid is essential.

**Technologies**: Python, pyshtools, Three.js, EGM2008, GeoTIFF, JSON
