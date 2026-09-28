with open(r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\experience.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function updateQuote' in line:
        start = max(0, i - 10)
        end = min(len(lines), i + 120)
        print(f"Lines {start+1} to {end}:")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end='')
        break
