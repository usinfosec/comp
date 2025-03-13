"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: 1, label: "Blog", href: "/blog" },
  { id: 2, label: "About Us", href: "/about-us" },
  { id: 3, label: "Case Studies", href: "#" },
  { id: 4, label: "Company", href: "#" },
];

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const menuContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotate: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    rotate: 5,
    transition: {
      duration: 0.1,
    },
  },
};

const drawerMenuVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: -10,
  },
};

const drawerMenuContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
  },
};

const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 15,
};

const navVariants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

// Add this new variant for header animation
const headerVariants = {
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  hidden: {
    y: "-100%",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const pathname = usePathname();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Close drawer if open while scrolling
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
      }

      // Handle header visibility
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;

      setIsVisible(!isScrollingDown || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDrawerOpen, prevScrollPos]);

  const isActivePath = (href: string) => {
    if (href === "#") return false;
    return pathname === href;
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 p-4 text-white"
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      variants={headerVariants}
    >
      <motion.nav
        className="flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm border border-white/[0.05] p-2 rounded-lg pl-4"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.572 9.5236L28.4064 8.68598L20.7044 3.15647C20.4554 2.97775 20.1202 2.97774 19.8713 3.15644L2.0126 15.976C1.82568 16.1102 1.71484 16.3262 1.71484 16.5563V23.4427C1.71484 23.6728 1.82567 23.8888 2.01256 24.0229L19.8712 36.844C20.1202 37.0228 20.4554 37.0228 20.7044 36.844L38.56 24.0229C38.7469 23.8887 38.8577 23.6728 38.8577 23.4427V16.5563C38.8577 16.3262 38.7469 16.1102 38.56 15.976L29.572 9.5236ZM19.8713 6.51332C20.1202 6.33459 20.4554 6.33458 20.7044 6.51329L25.2604 9.78381C25.6575 10.0689 25.6574 10.6597 25.2601 10.9446L23.099 12.4941V12.4941C22.9403 12.6077 22.7268 12.6075 22.5682 12.4937L20.7044 11.1558C20.4554 10.9771 20.1202 10.9772 19.8713 11.1559L13.6676 15.6095C13.2706 15.8945 13.2706 16.485 13.6676 16.77L15.4049 18.017L17.7422 19.6971L19.8711 21.2252C20.1201 21.404 20.4554 21.4039 20.7044 21.225L26.9076 16.7682C27.3042 16.4832 27.3042 15.8931 26.9076 15.6081L25.4374 14.5515C25.3072 14.4579 25.3074 14.2642 25.4378 14.1709V14.1709L27.9915 12.3399C28.2404 12.1614 28.5755 12.1615 28.8243 12.3401L33.3782 15.6096C33.7751 15.8946 33.7751 16.485 33.3782 16.77L31.2161 18.3226L20.7059 25.8694C20.457 26.0481 20.1217 26.0481 19.8728 25.8694L14.508 22.0183L12.1707 20.3415L9.35954 18.3242L7.19859 16.7717C6.80182 16.4866 6.80193 15.8963 7.19879 15.6113L19.8713 6.51332Z"
              fill="#00DC73"
            />
          </svg>
          <p className="text-xl font-medium">CompAI</p>
        </Link>
      </motion.nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />
            <motion.div
              className="fixed inset-x-0 w-[95%] mx-auto bottom-3 bg-[#16171B] border border-[#26272B] p-4 rounded-xl shadow-lg z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="flex items-center gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.572 9.5236L28.4064 8.68598L20.7044 3.15647C20.4554 2.97775 20.1202 2.97774 19.8713 3.15644L2.0126 15.976C1.82568 16.1102 1.71484 16.3262 1.71484 16.5563V23.4427C1.71484 23.6728 1.82567 23.8888 2.01256 24.0229L19.8712 36.844C20.1202 37.0228 20.4554 37.0228 20.7044 36.844L38.56 24.0229C38.7469 23.8887 38.8577 23.6728 38.8577 23.4427V16.5563C38.8577 16.3262 38.7469 16.1102 38.56 15.976L29.572 9.5236ZM19.8713 6.51332C20.1202 6.33459 20.4554 6.33458 20.7044 6.51329L25.2604 9.78381C25.6575 10.0689 25.6574 10.6597 25.2601 10.9446L23.099 12.4941V12.4941C22.9403 12.6077 22.7268 12.6075 22.5682 12.4937L20.7044 11.1558C20.4554 10.9771 20.1202 10.9772 19.8713 11.1559L13.6676 15.6095C13.2706 15.8945 13.2706 16.485 13.6676 16.77L15.4049 18.017L17.7422 19.6971L19.8711 21.2252C20.1201 21.404 20.4554 21.4039 20.7044 21.225L26.9076 16.7682C27.3042 16.4832 27.3042 15.8931 26.9076 15.6081L25.4374 14.5515C25.3072 14.4579 25.3074 14.2642 25.4378 14.1709V14.1709L27.9915 12.3399C28.2404 12.1614 28.5755 12.1615 28.8243 12.3401L33.3782 15.6096C33.7751 15.8946 33.7751 16.485 33.3782 16.77L31.2161 18.3226L20.7059 25.8694C20.457 26.0481 20.1217 26.0481 19.8728 25.8694L14.508 22.0183L12.1707 20.3415L9.35954 18.3242L7.19859 16.7717C6.80182 16.4866 6.80193 15.8963 7.19879 15.6113L19.8713 6.51332Z"
                      fill="#00DC73"
                    />
                  </svg>
                  <p className="text-xl font-medium">CompAI</p>
                </Link>

                <button
                  type="button"
                  onClick={toggleDrawer}
                  className=" text-white border border-[#26272B] rounded-md p-1 cursor-pointer active:scale-[98%] transition-all duration-300 ease-in-out"
                >
                  <X className="size-5" />
                </button>
              </div>
              <motion.ul
                className="flex flex-col text-sm mb-4 border border-[#26272B]/20 rounded-md"
                variants={drawerMenuContainerVariants}
              >
                <AnimatePresence>
                  {navItems.map((item) => (
                    <motion.li
                      key={item.id}
                      className="p-2.5 border-b border-[#26272B]/20 last:border-b-0"
                      variants={drawerMenuVariants}
                    >
                      <a
                        href={item.href}
                        className={`font-mono underline-offset-4 hover:text-white/80 transition-colors ${isActivePath(item.href)
                          ? "text-[#00DC73] font-medium"
                          : "text-white/70"
                          }`}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
