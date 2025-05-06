<script>
  import OpenSCADBOM from './lib/OpenSCADBOM.svelte'
</script>

<main class="container">
  <h1 class="mt-2">OpenSCAD BOM Tool</h1>
  <p>
    This tool creates a BOM/Cutting list/summary for an OpenSCAD design.<br>
    See <a href="https://github.com/kgolding/openscad-bom">github.com/kgolding/openscad-bom</a> for more information.
  </p>
  <div>
    <OpenSCADBOM />
  </div>
</main>
