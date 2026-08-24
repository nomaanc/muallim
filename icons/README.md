# Icon PNG Generation

The master vector source is `icon.svg`. Generate PNG variants using any of these methods:

## Option A — svgexport (Node.js, recommended)
```bash
npm install -g svgexport
svgexport icon.svg icon-192.png 192:192
svgexport icon.svg icon-512.png 512:512
svgexport icon.svg apple-touch-icon.png 180:180
```

## Option B — Inkscape (GUI or CLI)
```bash
inkscape icon.svg --export-png=icon-192.png --export-width=192 --export-height=192
inkscape icon.svg --export-png=icon-512.png --export-width=512 --export-height=512
inkscape icon.svg --export-png=apple-touch-icon.png --export-width=180 --export-height=180
```

## Option C — cairosvg (Python)
```bash
pip install cairosvg
python -c "import cairosvg; cairosvg.svg2png(url='icon.svg', write_to='icon-192.png', output_width=192, output_height=192)"
python -c "import cairosvg; cairosvg.svg2png(url='icon.svg', write_to='icon-512.png', output_width=512, output_height=512)"
python -c "import cairosvg; cairosvg.svg2png(url='icon.svg', write_to='apple-touch-icon.png', output_width=180, output_height=180)"
```

## Option D — Online
Upload `icon.svg` to https://svgtopng.com or https://convertio.co and export at 192×192, 512×512, and 180×180.

## Required files
| File                   | Size    | Used by                        |
|------------------------|---------|--------------------------------|
| `icon-192.png`         | 192×192 | Android home screen, manifest  |
| `icon-512.png`         | 512×512 | Android splash, maskable icon  |
| `apple-touch-icon.png` | 180×180 | iOS home screen (add to home)  |

> The manifest and SW will work with just `icon.svg` until PNGs are generated.
> Chrome/Edge will show the SVG as the install icon.
