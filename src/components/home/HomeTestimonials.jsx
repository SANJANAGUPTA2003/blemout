import FadeUp from '../ui/FadeUp';
import StarRating from '../ui/StarRating';
import { HOMEPAGE_TESTIMONIALS } from '../../data/homepageConfig';

// Placeholder testimonials – replace with client-approved customer reviews before production launch.

export default function HomeTestimonials() {
  return (
    <section className="bg-[#fafafa] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <h2 className="section-heading">Testimonials</h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {HOMEPAGE_TESTIMONIALS.map((item, index) => (
            <FadeUp key={item.id} delay={index * 0.03}>
              <article className="flex h-full flex-col bg-white p-6 md:p-7">
                <StarRating rating={item.rating} size={14} className="flex items-center gap-1 text-teal" />
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#4a5560]">
                  “{item.text}”
                </p>
                <div className="mt-6 border-t border-[#eef1f0] pt-4">
                  <p className="text-[15px] font-semibold text-[#222222]">{item.name}</p>
                  {item.concern && (
                    <p className="mt-1 text-[13px] text-[#6b7280]">{item.concern}</p>
                  )}
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
