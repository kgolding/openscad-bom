# OpenSCAD BOM Generation tool

This tool creates a BOM/Cutting list/Order summary for an OpenSCAD design.

1. Add a echo statement in the OpenSCAD code wherever a new item is to be added to the BOM: e.g.
    >`echo(str("BOM:PAR Softwood 2x1:length=", length));`

    The content must start with "BOM:", and be in the format below (note all units must be the same e.g. mm, inch, foot etc):
    >`BOM:<Item description>:length=xxx:`
1. Clear the OpenSCAD console log **(right click/Clear)** (optional)
1. Select all **(right click/Select All)** and copy **(right click/Copy)** OpenSCAD console log into the clipboard
1. Paste the clipboard content into the field below

