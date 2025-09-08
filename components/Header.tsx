"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Button from "./CustomButton";

interface HeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

interface MenuItem {
  label: string;
  link: string;
  subItems?: MenuItem[];
}

const Header: React.FC<HeaderProps> = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const whyRoof: MenuItem[] = [
    {
      label: "Contractor Reviews",
      link: "/contractor-reviews",
    },
    {
      label: "About Us",
      link: "/about",
    },
    {
      label: "Manufacturers",
      link: "/manufacturers",
    },
    {
      label: "Distributors",
      link: "/distributors",
    },
  ];

  const features: MenuItem[] = [
    { label: "Roof Measurements", link: "/features/roof-measurements" },
    { label: "Clearoof™ Aerial Imagery", link: "/features/aerial-imagery" },
    { label: "Order Roof Reports", link: "/features/roof-reports" },
    { label: "Instant Roofing Estimator", link: "/features/roofing-estimator" },
    { label: "AI Roof Color Visualizer", link: "/features/color-visualizer" },
    { label: "Sales Presentations", link: "/features/sales-presentations" },
    { label: "Catalogs & Materials", link: "/features/catalogs-materials" },
    { label: "Signatures & Documents", link: "/features/signatures-documents" },
    { label: "Supply Orders", link: "/features/supply-orders" },
    { label: "Project Management", link: "/features/project-management" },
  ];

  const resources: MenuItem[] = [
    { label: "Help Center", link: "/resources/help-center" },
    { label: "Tutorial Videos", link: "/resources/tutorials" },
    { label: "Roofing Blog", link: "/resources/blog" },
    {
      label: "Client? Schedule Training",
      link: "/resources/schedule-training",
    },
    { label: "Demo App", link: "/resources/demo-app" },
  ];

  const contact: MenuItem[] = [
    { label: "New? Schedule Demo", link: "/contact/schedule-demo" },
    { label: "Client? Schedule Training", link: "/contact/schedule-training" },
    { label: "Contact Us", link: "/contact" },
  ];

  const renderDropdown = (items: MenuItem[], menuName: string) => (
    <div
      className={`absolute left-0 top-full bg-[#DDDDDD] text-black shadow-lg rounded md:w-58 
        ${
          isMobile
            ? activeMenu === menuName
              ? "block"
              : "hidden"
            : "hidden group-hover:block"
        } 
        z-50`}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group/sub"
          onMouseEnter={() => !isMobile && setHoveredItem(item.label)}
          onMouseLeave={() => !isMobile && setHoveredItem(null)}
        >
          <a
            href={item.link}
            className="flex justify-between items-center px-4 py-2 text-[16px] font-bold hover:bg-gray-100 cursor-pointer"
            onClick={(e) => {
              if (isMobile && item.subItems) {
                e.preventDefault();
                setHoveredItem(hoveredItem === item.label ? null : item.label);
              }
            }}
          >
            {item.label}
            {item.subItems && (
              <i className="fas fa-chevron-right ml-2 md:ml-0 text-[14px] md:text-lg"></i>
            )}
          </a>

          {item.subItems && (
            <div
              className={`absolute top-0 left-full bg-[#DDDDDD] text-black min-w-[140px] md:min-w-[180px] shadow-lg rounded z-50 
                ${
                  isMobile
                    ? hoveredItem === item.label
                      ? "block"
                      : "hidden"
                    : hoveredItem === item.label
                    ? "block"
                    : "hidden"
                }`}
            >
              {item.subItems.map((subItem, subIdx) => (
                <a
                  key={subIdx}
                  href={subItem.link}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer font-bold text-[18px]"
                >
                  {subItem.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setHoveredItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isActive = (path: string) => pathname === path;

  const bgClass = isHomePage
    ? scrolled
      ? "bg-black/60"
      : "bg-transparent"
    : "bg-black/60";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <div className="relative w-full h-screen overflow-hidden" ref={menuRef}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://s3.us-central-1.wasabisys.com/ezsign/Private/Drakerversion.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay (optional for contrast) */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div
        className={`w-full text-sm pl-15 pr-34 font-medium fixed top-0 left-0 z-40 pt-[50px] transition-colors duration-300 ${
          scrolled ? "bg-black/60" : "bg-transparent"
        }`}
      >
        <div className="md:flex justify-between items-center">
          <div className="flex mt-5 md:mt-0 items-center space-x-6 relative">
            <Image src={"/Logo.png"} width={225} height={5} alt="logo" />
          </div>
          <div className="lg:flex md:flex-wrap items-center space-x-6 text-black relative">
            <div
              className="relative group"
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
            >
              <Link
                href="/product-pages"
                className={`flex items-center gap-1 text-[18px] cursor-pointer p-2 font-semibold hover:bg-[#2d394b] ${
                  isActive("/product-pages")
                    ? "bg-[#2d394b] text-white"
                    : "text-white"
                }`}
                onClick={() => isMobile && toggleMenu("products")}
              >
                Why roofing{" "}
                <i className="fas fa-chevron-down text-xs mt-[2px]"></i>
              </Link>
              {renderDropdown(whyRoof, "products")}
            </div>

            <div
              className="relative group"
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
            >
              <div
                className="flex items-center gap-1 text-[18px] cursor-pointer text-white hover:text-white hover:bg-[#2d394b] p-2 font-semibold"
                onClick={() => isMobile && toggleMenu("teamStore")}
              >
                Features{" "}
                <i className="fas fa-chevron-down text-xs mt-[2px]"></i>
              </div>
              {renderDropdown(features, "teamStore")}
            </div>

            <div
              className="relative group"
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
            >
              <div
                className="flex items-center gap-1 text-[18px] cursor-pointer text-white hover:text-white hover:bg-[#2d394b] p-2 font-semibold"
                onClick={() => isMobile && toggleMenu("support")}
              >
                Resources
                <i className="fas fa-chevron-down text-xs mt-[2px]"></i>
              </div>
              {renderDropdown(resources, "support")}
            </div>

            <div className="relative group">
              <Link href={"/membership"}>
                <div className="flex items-center gap-1 text-[18px] cursor-pointer text-white hover:text-white hover:bg-[#2d394b] p-2 font-semibold">
                  Pricing
                </div>
              </Link>
            </div>
            <div
              className="relative group"
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
            >
              <div
                className="flex items-center gap-1 text-[18px] cursor-pointer text-white hover:text-white hover:bg-[#2d394b] p-2 font-semibold"
                onClick={() => isMobile && toggleMenu("support")}
              >
                Contact
                <i className="fas fa-chevron-down text-xs mt-[2px]"></i>
              </div>
              {renderDropdown(contact, "contact")}
            </div>
          </div>
        </div>

        <div className="p-5 text-white w-[70%]">
          <h3 className="text-[65px] font-bold leading-[75px]">
            Win More Jobs with The Best Roofing Software!
          </h3>
          <p className="text-[35px] mt-15">
            Measure, estimate & simulate roofs in minutes.
          </p>
          <div className="flex gap-8 mt-5">
            <Button className="!bg-black !px-20 !py-3 hover:!bg-gray-800">
              Subscribe Now
            </Button>

            <Button className="!bg-green-900 !px-20 !py-3 hover:!bg-green-700">
              Book A Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
