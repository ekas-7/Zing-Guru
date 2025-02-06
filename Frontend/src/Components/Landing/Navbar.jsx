import { useState, useEffect } from 'react';
import logo from "../../assets/zing_logo_lt2.png"
import DarkModeToggle from '../ui/DarkModeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg my-4 mx-6 rounded-2xl'
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="text-2xl font-bold">
              <img src={logo} alt="logo" className="h-10" />
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#home" 
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    : 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white'
                  }
                `}
              >
                Home
              </a>
              <a 
                href="#features" 
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    : 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white'
                  }
                `}
              >
                Features
              </a>
              <a 
                href="#contact" 
                className={`
                  transition-colors duration-300
                  ${isScrolled
                    ? 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    : 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white'
                  }
                `}
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <button className={`
              hidden md:block font-semibold transition-colors duration-300
              ${isScrolled
                ? 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                : 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white'
              }
            `}>
              Sign up
            </button>
            <button className="bg-[#ADFF00] text-black px-6 py-2 rounded-2xl hover:bg-[#9EFF00] transition-colors duration-300">
              Free Trial
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
  
  