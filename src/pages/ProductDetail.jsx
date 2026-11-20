                <p className="mt-2 text-[15px] text-soft-text">
                  Suitable for: <span className="text-text font-semibold">{product.skinType}</span>
                </p>
              )}
              {typeof product.stock === 'number' && product.stock === 0 && (
                <p className="mt-2 text-[14px] text-soft-text">Currently unavailable</p>
              )}

              {includedLabels.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#111111]">
                    Includes
                  </p>
                  <ul className="space-y-1.5 text-[16px] text-[#4a5560]">
                    {includedLabels.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div ref={purchaseRef} className="mt-6 inline-flex items-center border border-gray-200 rounded-full">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-soft-text hover:text-dark-teal"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="p-3 text-soft-text hover:text-dark-teal"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="flex-1 gap-2" disabled={product.stock === 0}>
                  <ShoppingBag size={16} /> Add to Cart
                </Button>
                <Button variant="outline" onClick={handleBuyNow} className="flex-1" disabled={product.stock === 0}>
                  Buy Now
                </Button>
              </div>

              <div className="mt-8 space-y-3 text-[15px] text-soft-text">
                <p className="flex items-center gap-2">
                  <Truck size={16} className="text-teal" /> Secure shipping across India
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-teal" /> Dermatologically inspired formulas
                </p>
              </div>

              <div className="mt-10 border-t border-gray-100">
                {accordionDefs.map((item) => {
                  if (item.key === 'faqs' && !accordionContent.faqs) return null;
                  const open = openAccordion === item.key;
                  return (
                    <div key={item.key} className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(open ? '' : item.key)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="text-[15px] font-semibold text-text">{item.label}</span>
                        <span className="text-teal text-lg leading-none">{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div className="pb-5 text-[15px] text-soft-text leading-relaxed">
                          {accordionContent[item.key]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeUp>

        <ProductRecommendCarousel
          products={related}
          title={
            product.isCombo || product.category === 'Combo'
              ? 'Pair With These Essentials'
              : 'You May Also Like'
          }
        />
      </div>

      <ImageZoomLightbox
        open={zoomOpen}
        src={
          getResponsiveImage(images[activeImage] || product.imageUrl, 'main').webpSrc ||
          images[activeImage] ||
          product.imageUrl
        }
        alt={product.name}
        onClose={() => setZoomOpen(false)}
      />
      <StickyPurchaseBar
        targetRef={purchaseRef}
        productName={product.name}
        price={sellingPrice}
        imageUrl={images[0] || product.imageUrl}
        onAdd={handleAddToCart}
        hidden={zoomOpen || isDrawerOpen || quickAddOpen}
      />
      <ProductQuickAdd
        product={product}
        disabled={zoomOpen || isDrawerOpen}
        onOpenChange={setQuickAddOpen}
      />
    </div>
  );
}
