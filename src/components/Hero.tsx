import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Slider from "react-slick";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./Firebase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Categories from "./Categories";
import Contact from "./Contact";
import Navigation from "./Navigation";
import Navbar from "./Navbar";
import WelcomeForm from "./Welcome";
import TabNavigation from "./Footer";
import "@splidejs/splide";
import {Splideslide} from "@splidejs/react-splide"
import {Splide} from "@splidejs/react-splide"
import SocialFooter from "./Footer-comp/social-footer";
import { FloatingLatestProductsButton, LatestProductsModal } from "./latest-products-modal"

const Hero = () => {
  const [images, setImages] = useState<string[]>([]);
  const [splideImages, setSplideImages] = useState<string[]>([]); // New Splide carousel images

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "data"));
        const fetchedImages = querySnapshot.docs.flatMap((doc) => doc.data().heroImages || []);
        const fetchedSplideImages = querySnapshot.docs.flatMap((doc) => doc.data().splideImages || []);

        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
        }

        if (fetchedSplideImages.length > 0) {
          setSplideImages(fetchedSplideImages);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };

    fetchGalleryData();
  }, []);
  const [isLatestProductsModalOpen, setIsLatestProductsModalOpen] = useState(false)
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      {/* Hero Background Carousel */}
      <Slider {...settings} className="fixed inset-0 z-0 w-full h-[100vh]">
        {images.map((image, index) => (
          <div key={index} className="h-[100vh] w-full">
            <div
              className="h-[42vh] md:h-full  md:w-full w-[100vw]  bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/e-commerce-749a1.appspot.com/o/21005.jpg?alt=media&token=2bcf16f4-038c-464f-80db-4e793a33b3c3)`, backgroundSize:"cover" , backgroundRepeat:"no-repeat" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
          </div>
        ))}
      </Slider>

      {/* Content Overlay */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold tracking-wide"
        >
          {/* Chintamani Decors */}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white mt-4 max-w-2xl"
        >
          {/* India's leading brand for Decorative Laminates and Panels with PAN India Distribution. */}
        </motion.p>
      </div>
 {/* <button>Product</button> */}
      {/* Other Components */}
      <div className="relative z-20 min-h-screen pt-[40vh] shadow-[rgba(0,0,0,0.2)_3px_10px_90px]">
        
        <Categories />
        <WelcomeForm />
        <Navigation />
        <SocialFooter/>
    
        {/* <FloatingLatestProductsButton onClick={() => setIsLatestProductsModalOpen(true)} /> */}

{/* Latest Products Modal */}
{/* <LatestProductsModal isOpen={isLatestProductsModalOpen} onClose={() => setIsLatestProductsModalOpen(false)} /> */}
        {/* Splide Carousel for Featured Collection */}
        </div>

    </>
  );
};

export default Hero;
