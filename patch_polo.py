with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the mergedProducts useMemo and update it to inject polo colors
old_merge = """        images: {
          primary: fs.primaryImage || p.images.primary,
          secondary: fs.secondaryImage || p.images.secondary,
          detail: fs.detailImage || p.images.detail,
        },
      };
    });
  }, [fsProducts]);"""

new_merge = """        images: {
          primary: fs.primaryImage || p.images.primary,
          secondary: fs.secondaryImage || p.images.secondary,
          detail: fs.detailImage || p.images.detail,
        },
        productType: fs.productType || 'standard',
        poloColors: fs.poloColors || [],
        // For polo products, override colors with the polo color swatches
        colors: (fs.productType === 'polo' && fs.computedColors && fs.computedColors.length > 0)
          ? fs.computedColors
          : p.colors,
      };
    });
  }, [fsProducts]);"""

if old_merge in content:
    content = content.replace(old_merge, new_merge, 1)
    print("SUCCESS: mergedProducts patched with polo colors")
else:
    print("ERROR: mergedProducts block not found")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("App.tsx written")
