with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = """        id: fs.id,
        name: fs.name,
        subtitle: fs.subtitle || '',
        category: fs.category as any,
        categoryLabel: fs.category,"""

new = """        id: fs.id,
        name: fs.name,
        subtitle: fs.subtitle || '',
        category: fs.category as any,
        categoryLabel: ({
          'track-pants': 'TRACK PANTS',
          't-shirts': 'T-SHIRTS',
          'shirts': 'SHIRTS',
          'oversize-tshirts': 'OVERSIZE T-SHIRTS',
          'hoodies': 'HOODIES',
        } as Record<string,string>)[fs.category] || fs.category.toUpperCase(),"""

if old in content:
    content = content.replace(old, new, 1)
    print("SUCCESS: categoryLabel patched")
else:
    print("ERROR: block not found")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
