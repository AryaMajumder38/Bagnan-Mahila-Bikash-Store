"use client";

import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

export default function AboutUsPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-8">About Bagnan Mahila Bikash Store</h1>
        
        <Separator className="my-6" />
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700">
              Bagnan Mahila Bikash Store is dedicated to empowering local women through sustainable commerce. 
              Our mission is to provide high-quality, ethically sourced products while creating economic 
              opportunities for women in the Bagnan region.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-gray-700">
              Founded in 2020, our store began as a small cooperative of 15 women artisans and farmers. 
              Today, we have grown to support over 50 women entrepreneurs, providing them with a platform 
              to showcase their products and skills to a global audience.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Products</h2>
            <p className="text-lg text-gray-700">
              We offer a wide range of products, including traditional handicrafts, organic foods, 
              spices, and household items. Each product represents the rich cultural heritage and 
              skilled craftsmanship of the women in our community.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-700">
              By purchasing from Bagnan Mahila Bikash Store, you are directly contributing to the economic 
              independence and social empowerment of women in the Bagnan region. Your support helps provide 
              sustainable livelihoods, education opportunities, and healthcare access for our artisans and their families.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Join Us</h2>
            <p className="text-lg text-gray-700">
              We invite you to join our journey of empowerment and sustainability. Explore our products, 
              learn about our artisans, and become part of our growing community of conscious consumers 
              making a positive impact in the world.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
