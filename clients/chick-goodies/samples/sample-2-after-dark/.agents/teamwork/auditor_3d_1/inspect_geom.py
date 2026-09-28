with open(r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\experience.js', 'r', encoding='utf-8') as f:
    text = f.read()

funcs = [
    'createHoneycombLattice',
    'createHoneyDropletAssembly',
    'createProsciuttoRibbonFloret',
    'createRosemarySprig',
    'createArtisanBoard3D',
    'createBanquetTable3D',
    'createMobileCart3D',
    'createHeritageStage3D',
    'createSpatialConsole3D'
]

for fn in funcs:
    idx = text.find(f'function {fn}')
    if idx == -1:
        print(f"NOT FOUND: function {fn}")
        continue
    # find end or next function
    snippet = text[idx:idx+1500]
    first_lines = snippet.split('\n')[:25]
    print(f"=== {fn} (starts at offset {idx}) ===")
    for l in first_lines:
        print("  ", l)
    print()
