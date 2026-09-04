with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_merge = """  const mergedProducts: Product[] = React.useMemo(() => {
    if (fsProducts.length === 0) return PRODUCTS;
    return PRODUCTS.map(p => {
      const fs = fsProducts.find(f => f.name === p.name);
      if (!fs) return p;
      return {
        ...p,
        price: fs.price,
        originalPrice: fs.originalPrice || p.originalPrice,
        description: fs.description || p.description,
        fabricGsm: fs.fabricGsm || p.fabricGsm,
        composition: fs.composition || p.composition,
        silhouette: fs.silhouette || p.silhouette,
        isNew: fs.isNew,
        isBestseller: fs.isBestseller,
        edition: fs.edition || p.edition,
        images: {
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

new_merge = """  const FALLBACK_COLORS = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#F5F5F5' },
  ];

  const mergedProducts: Product[] = React.useMemo(() => {
    // If Firestore has products, use them directly (ignore hardcoded PRODUCTS)
    if (fsProducts.length > 0) {
      return fsProducts.map(fs => ({
        id: fs.id,
        name: fs.name,
        subtitle: fs.subtitle || '',
        category: fs.category as any,
        categoryLabel: fs.category,
        price: fs.price,
        originalPrice: fs.originalPrice || undefined,
        description: fs.description || '',
        details: [],
        fabricGsm: fs.fabricGsm || '',
        composition: fs.composition || '',
        silhouette: fs.silhouette || '',
        sizes: (fs.sizes || ['S','M','L','XL']) as ('S'|'M'|'L'|'XL')[],
        isNew: fs.isNew || false,
        isBestseller: fs.isBestseller || false,
        edition: fs.edition || '',
        productType: fs.productType || 'standard',
        poloColors: fs.poloColors || [],
        colors: (fs.productType === 'polo' && fs.computedColors && fs.computedColors.length > 0)
          ? fs.computedColors
          : FALLBACK_COLORS,
        images: {
          primary: fs.primaryImage || '',
          secondary: fs.secondaryImage || '',
          detail: fs.detailImage || undefined,
        },
      }));
    }
    // Fallback to hardcoded products only if Firestore is empty
    return PRODUCTS;
  }, [fsProducts]);"""

if old_merge in content:
    content = content.replace(old_merge, new_merge, 1)
    print("SUCCESS: mergedProducts now uses Firestore products directly")
else:
    print("ERROR: old_merge block not found exactly")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done writing App.tsx")
