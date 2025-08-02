import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-sage-100 to-earth-100 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-sage-800 leading-tight">
              Empowering Women,
              <span className="block text-terracotta-600">Enriching Lives</span>
            </h1>
            <p className="text-lg text-sage-700 leading-relaxed">
              Discover authentic handmade products crafted by empowered women.
              From traditional cotton and khadi clothing to organic spices and
              sustainable household items - every purchase supports our mission
              of human welfare and women's empowerment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3 text-lg"
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-sage-600 text-sage-700 hover:bg-sage-50 px-8 py-3 text-lg"
              >
                Learn Our Story
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                alt="Women working together"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-terracotta-600">
                  500+
                </div>
                <div className="text-sm text-sage-700">Women Empowered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
