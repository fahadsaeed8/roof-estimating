"use client";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0B2244] to-[#00313D] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* App Links */}
        <div className="space-y-4">
          <img
            src="/google-play.png"
            alt="Google Play"
            className="h-12 cursor-pointer"
          />
          <img
            src="/app-store.png"
            alt="App Store"
            className="h-12 cursor-pointer"
          />
        </div>

        {/* iRoofing */}
        <div>
          <h3 className="font-semibold text-lg mb-4">iRoofing</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Customer Success
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Manufacturers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Distributors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-semibold text-lg mb-4">About Us</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Company
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Demo
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Features</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Measurements
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Visualizer
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Estimator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Customer Database
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Digital Catalogs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Digital Pitch Book
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Order Materials
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Visit iRoofing */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Visit iRoofing</h3>
          <p className="text-gray-300 text-sm">
            3127 W Hallandale Beach
            <br />
            Blvd Suite 107,
            <br />
            Hallandale Beach, FL 33009
          </p>
          <p className="mt-4 text-sm text-gray-300">
            <span className="font-medium">Contact Phone:</span> +1 (800)
            646-6270
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-medium">Customer Support Mail:</span>{" "}
            info@iroofing.org
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 items-start justify-start md:justify-end">
          <FaInstagram className="h-6 w-6 cursor-pointer hover:text-pink-500" />
          <FaFacebook className="h-6 w-6 cursor-pointer hover:text-blue-500" />
          <FaYoutube className="h-6 w-6 cursor-pointer hover:text-red-500" />
          <FaLinkedin className="h-6 w-6 cursor-pointer hover:text-blue-400" />
          <FaTwitter className="h-6 w-6 cursor-pointer hover:text-sky-400" />
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
        Copyright © 2012–2025 iRoofing LLC. All rights reserved
      </div>
    </footer>
  );
}
