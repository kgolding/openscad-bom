<script lang="ts">
  type Item = {
    qty: number;
    desc: String;
    len: number;
  };

  type SummaryItem = {
    [x: string]: any;
    desc: String;
    len: number;
  };

  type Result = {
    bom: Item[];
    info: String | undefined;
  };

  let src = $state("");

  let result: Result = $derived.by(() => {
    let bom = [];
    let info: String | undefined = undefined;

    src.split("\n").forEach((line, index) => {
      let parsingDesignCount = 0;
      if (line.startsWith("Parsing design")) {
        bom = []; // Restart BOM
        parsingDesignCount++;
        if (parsingDesignCount > 1) {
          info =
            "Multiple builds detected! Clear OpenSCAD log before Select All/Copy";
        }
      }
      if (line.startsWith(`ECHO: "BOM:`)) {
        const elements = line.split(":");
        const item: Item = {
          qty: 1,
          desc: "",
          len: 0,
        };
        if (elements.length < 3) {
          item.desc = `Error parsing line ${index}'${line}'`;
        } else {
          item.desc = elements[2];
          for (let i = 3; i < elements.length; i++) {
            const [key, val] = elements[i].split("=", 2);
            switch (key) {
              case "length":
                item.len = parseFloat(val);
            }
          }
        }

        // Check if item already in bom
        let existingItem = bom.find(
          (b) => b.desc == item.desc && b.len == item.len,
        );
        if (existingItem) {
          existingItem.qty = existingItem.qty + item.qty;
        } else {
          bom.push(item);
        }
      }
    });
    return { bom, info };
  });

  let summary: SummaryItem[] = $derived(
    result.bom.reduce((acc: SummaryItem[], cur: Item) => {
      if (!cur.len) return acc; // Nothing to add
      const x = acc.find((a) => a.desc == cur.desc);
      if (x) {
        x.len = x.len + cur.qty * cur.len;
        x.lens.push(cur.len)
      } else {
        acc.push({
          desc: cur.desc,
          len: cur.qty * cur.len,
          lens: [cur.len],
        });
      }
      return acc;
    }, []),
  );

  function insertSample() {
    src = `// Only BOM lines shown in sample below
ECHO: "BOM:Frame 38 x 19 mm:length=560"
ECHO: "BOM:Frame 38 x 19 mm:length=440"
ECHO: "BOM:Frame 38 x 38 mm:length=250"`;
  }
</script>

<div>
  <textarea
    class="form-control"
    bind:value={src}
    rows="4"
    placeholder="Paste output from OpenSCAD log. Only the last build from the log will be used."
  ></textarea>
  <div class="d-flex justify-content-end mt-2">
    <button class="btn btn-info" onclick={insertSample}>Insert sample</button>
    <button class="btn btn-secondary ms-2" onclick={() => (src = "")}
      >Clear</button
    >
  </div>
</div>

{#if result.info}
  <div class="alert alert-info mt-2">{result.info}</div>
{/if}

{#if result.bom.length > 0}
  <hr />
  <h3 class="mt-2">BOM (cutting list)</h3>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th class="text-end">Qty</th>
          <th>Item</th>
          <th class="text-end">Length</th>
        </tr>
      </thead>
      <tbody>
        {#each result.bom as b}
          <tr>
            <td class="text-end">{b.qty.toLocaleString()}</td>
            <td>{b.desc}</td>
            <td class="text-end">{b.len.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <h3>Summary</h3>
  <pre>{JSON.stringify(summary)}</pre>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-end">Length</th>
        </tr>
      </thead>
      <tbody>
        {#each summary as s}
          <tr>
            <td>{s.desc}</td>
            <td class="text-end">{s.len.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
