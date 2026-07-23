import HomeBestSellers from '../components/home/HomeBestSellers';
import HeroCarousel from '../components/home/HeroCarousel';
import ShopByConcernHome from '../components/home/ShopByConcernHome';
import HomeEditorialFeature from '../components/home/HomeEditorialFeature';
import HomeTestimonials from '../components/home/HomeTestimonials';
import ExploreMoreProducts from '../components/home/ExploreMoreProducts';
import { HOMEPAGE_EDITORIAL } from '../data/homepageConfig';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const { getBySlug } = useProducts();

  return (
    <div>
      <HeroCarousel />
      <HomeBestSellers />
      <ShopByConcernHome />

      {HOMEPAGE_EDITORIAL.map((feature) => {
        const product = getBySlug(feature.slug);
        if (!product) return null;
        return (
          <HomeEditorialFeature
            key={feature.slug}
            product={product}
            promotionalImage={feature.promotionalImage}
            imagePosition={feature.imagePosition}
            eyebrow={feature.eyebrow}
          />
        );
      })}

      <HomeTestimonials />
      <ExploreMoreProducts />
    </div>
  );
}
