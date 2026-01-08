"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Shield, Truck, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function AboutPage() {
  const { settings } = useStoreSettings();

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Breadcrumb */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">About Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4A9EFF]/20 to-[#FFA726]/20 border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-[#4A9EFF]">{settings.storeName}</span>
            </h1>
            <p className="text-xl text-[#B0B0B0] leading-relaxed">
              Your trusted technology partner since 2010. We provide the best computer 
              hardware, software, and accessories with exceptional service and support.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#4A9EFF] to-[#FFA726] mx-auto"></div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-8">
            <p className="text-[#B0B0B0] leading-relaxed mb-6">
              Computer World was founded in 2010 with a simple mission: to provide 
              high-quality computer products and exceptional customer service to 
              individuals and businesses alike. What started as a small retail shop 
              has grown into one of the leading technology retailers in the region.
            </p>
            <p className="text-[#B0B0B0] leading-relaxed mb-6">
              Over the years, we have built strong relationships with top global brands 
              including ASUS, Apple, Dell, HP, Lenovo, MSI, NVIDIA, AMD, Intel, and many 
              more. This allows us to offer authentic products at competitive prices with 
              official warranty coverage.
            </p>
            <p className="text-[#B0B0B0] leading-relaxed">
              Today, we serve thousands of satisfied customers, from gamers and creative 
              professionals to corporate clients and educational institutions. Our team 
              of experts is always ready to help you find the perfect technology solutions 
              for your needs.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#4A9EFF] to-[#FFA726] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <div className="w-14 h-14 bg-[#4A9EFF]/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#4A9EFF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Authentic Products</h3>
              <p className="text-[#808080]">
                100% genuine products sourced directly from authorized distributors 
                with official brand warranty.
              </p>
            </div>
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <div className="w-14 h-14 bg-[#FFA726]/10 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-[#FFA726]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-[#808080]">
                Quick and reliable delivery across the country with real-time 
                tracking and secure packaging.
              </p>
            </div>
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center mb-4">
                <HeadphonesIcon className="w-7 h-7 text-[#4CAF50]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-[#808080]">
                Knowledgeable team ready to help you choose the right products 
                and provide after-sales support.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Get In Touch</h2>
            <p className="text-[#808080]">Have questions? We&apos;d love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4A9EFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#4A9EFF]" />
              </div>
              <div>
                <p className="text-white font-medium">Visit Us</p>
                <p className="text-[#808080] text-sm">{settings.storeAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFA726]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#FFA726]" />
              </div>
              <div>
                <p className="text-white font-medium">Call Us</p>
                <p className="text-[#808080] text-sm">{settings.storePhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <div>
                <p className="text-white font-medium">Email Us</p>
                <p className="text-[#808080] text-sm">{settings.storeEmail}</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
