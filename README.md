# R²-WAM

Project website for **R²-WAM: Repair-and-Reject Post-Training for World Action Models**.

- Website: https://r2-wam.github.io/
- Paper: https://arxiv.org/abs/2610.04913

This repository contains the static project page and demonstration media, not the model implementation.

## Publication

In GitHub repository Settings → Pages, select **Deploy from a branch**, **main**, and **/ (root)**.

## Local preview

Run `python3 -m http.server 8765 --bind 127.0.0.1` from this directory.

The default videos use 1920×720 six-panel layouts. Add `?quality=hd` to use 3840×1440 layouts (1280×720 per panel). Clean Table is encoded directly from original recordings at 5× speed and 60 fps; Fold Shirt videos use 5× speed and 24 fps. No motion interpolation is used.
