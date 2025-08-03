"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaHandsHelping, FaLeaf, FaShoppingBag } from "react-icons/fa";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <Image
          src="/media/women.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-[center_45%] opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">
            Empowering Women, One Product at a Time
          </h1>
          <p className="text-lg max-w-2xl">
            Handmade with care, inspired by tradition, and delivered with love.
          </p>
          <div>
            <Link href="/src/app/(app)/(home)/products/page.tsx">
              <Button className="mt-8 px-6 py-3 text-lg bg-white text-black">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-center text-gray-600 mb-10">Discover our bestsellers and new arrivals, crafted with love by our artisan community</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            src: "/media/turmeric.jpg",
            title: "Organic Turmeric Powder",
            price: "₹280"
          }, {
            src: "/media/scarf.jpg",
            title: "Handwoven Cotton Scarf",
            price: "₹800"
          }, {
            src: "/media/ceramic.jpg",
            title: "Artisan Ceramic Vase",
            price: "₹650"
          }].map((product, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center"
            >
              <Image src={product.src} alt={product.title} width={300} height={300} className="rounded-xl w-full h-auto object-contain" />
              <p className="mt-4 font-semibold">{product.title}</p>
              <p className="text-gray-600">{product.price}</p>
              <Link href="/src/app/(app)/(home)/cart/page.tsx">
                <Button className="mt-2">Add to Cart</Button>
              </Link>
              <Link href="/src/app/(app)/(home)/products/page.tsx">
                <Button variant="outline" className="mt-1">Details</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Our Community Impact ===== */}
      <section className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-2">Our Community Impact</h3>
        <p className="text-center text-gray-600 mb-8">Together, we're making a difference in the lives of women and communities</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 shadow rounded-xl flex flex-col items-center">
            <FaHandsHelping className="text-4xl text-pink-600 mb-3" />
            <h4 className="text-2xl font-bold">500+</h4>
            <p className="text-gray-600">Artisans Supported</p>
          </div>
          <div className="bg-white p-6 shadow rounded-xl flex flex-col items-center">
            <FaLeaf className="text-4xl text-green-600 mb-3" />
            <h4 className="text-2xl font-bold">100%</h4>
            <p className="text-gray-600">Eco-friendly Products</p>
          </div>
          <div className="bg-white p-6 shadow rounded-xl flex flex-col items-center">
            <FaShoppingBag className="text-4xl text-blue-600 mb-3" />
            <h4 className="text-2xl font-bold">10K+</h4>
            <p className="text-gray-600">Happy Customers</p>
          </div>
        </div>
      </section>

      {/* ===== Community Image & Text ===== */}
      <section className="py-16 px-6 text-center">
        <Image src="/media/community.jpg" alt="Community" width={120} height={120} className="rounded-full mx-auto mb-4" />
        <p className="max-w-xl mx-auto text-lg text-gray-700">
          Chitra is e-commerce with a heart, connecting women artisans to a global audience.
        </p>
      </section>

      {/* ===== Upper Footer ===== */}
      <section className="bg-gray-300 py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-xl font-bold mb-2">Chitra</h4>
            <p>Empowering women artisans through sustainable e-commerce.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/src/app/(app)/(home)/products/page.tsx">Shop</Link></li>
              <li><Link href="/src/app/(app)/(home)/about/page.tsx">About Us</Link></li>
              <li><Link href="/src/app/(app)/(home)/contact/page.tsx">Contact</Link></li>
              <li><Link href="#">Support</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Shipping</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Contact Info</h4>
            <p>Bagnan, West Bengal, India</p>
            <p>+91 98765 43210</p>
            <p>hello@chitra.in</p>
          </div>
        </div>
      </section>
    </div>
  );
}
