import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-sage-800">
              Our Mission for
              <span className="block text-terracotta-600">Human Welfare</span>
            </h2>
            <p className="text-sage-600 text-lg leading-relaxed">
              Seva Wings is more than just an e-commerce platform. We are a
              self-help group dedicated to empowering women and creating
              sustainable livelihoods through traditional craftsmanship and
              authentic products.
            </p>
            <p className="text-sage-600 leading-relaxed">
              Every product you purchase directly supports women artisans in
              rural communities, helping them gain financial independence while
              preserving age-old traditions of handloom weaving, organic
              farming, and eco-friendly manufacturing.
            </p>

            <div className="grid grid-cols-2 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-terracotta-600">
                  500+
                </div>
                <div className="text-sage-600">Women Empowered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terracotta-600">
                  2,000+
                </div>
                <div className="text-sage-600">Products Sold</div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
            >
              Learn More About Us
            </Button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop"
                alt="Women working"
                className="rounded-xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop"
                alt="Traditional crafts"
                className="rounded-xl shadow-lg mt-8"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-terracotta-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold">Impact Since 2020</div>
                <div className="text-sm opacity-90">Building Communities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
