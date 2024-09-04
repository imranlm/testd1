import React from 'react';
import { Email, Phone, Facebook, Twitter, Instagram, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-footer_blue pt-20 pb-4">
      <div className="container mx-auto px-4">
        {/* Footer Sections */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Company Info */}
          <div className="flex flex-col w-full items-center md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-white text-center md:text-left">Company Info</h2>
            <ul className="space-y-4 text-gray-200 text-sm text-center md:text-left">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Our Mission</a></li>
              <li><a href="#" className="hover:underline">Terms and Conditions</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          {/* Resources */}
          <div className="flex flex-col w-full items-center md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-white text-center md:text-left md:pr-6">Resources</h2>
            <ul className="space-y-4 text-gray-200 text-sm text-center md:text-left">
              <li><a href="#" className="hover:underline">PMI ACP Training</a></li>
              <li><a href="#" className="hover:underline">PMI PMP Training</a></li>
              <li><a href="#" className="hover:underline">PMI PgMP Training</a></li>
              <li><a href="#" className="hover:underline">PMI CAMP Training</a></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="flex flex-col w-full items-center md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-white text-center md:text-left md:pr-6">Contact Info</h2>
            <ul className="space-y-4 text-gray-200 text-sm text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start">
                <Email className="mr-2 text-yellow-300" />
                <a href="mailto:test@gmail.com" className="hover:underline">test@gmail.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="mr-2 text-green-300" />
                <a href="tel:+92123123123" className="hover:underline">+92123123123</a>
              </li>
              <li className="flex justify-center md:justify-start space-x-4 mt-2">
                <a href="#" className="hover:text-gray-300 text-blue-500">
                  <Facebook />
                </a>
                <a href="#" className="hover:text-gray-300 text-blue-400">
                  <Twitter />
                </a>
                <a href="#" className="hover:text-gray-300 text-pink-500">
                  <Instagram />
                </a>
                <a href="#" className="hover:text-gray-300 text-green-500">
                  <WhatsApp />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center mt-12 text-gray-200 text-sm">
          <p>© Copyright 2024, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  