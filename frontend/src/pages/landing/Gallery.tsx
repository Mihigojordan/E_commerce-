/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  X,
  ZoomIn,
  Heart,
  Download,
  Share2,
  MessageCircle,
  GalleryVertical,
} from "lucide-react";
import image1 from "../../assets/highlights/IMGE1520.JPG";
import image2 from "../../assets/highlights/IMGE1679.JPG";
import image3 from "../../assets/highlights/IMGE1705.JPG";
import image4 from "../../assets/highlights/IMGE1638.JPG";
import image5 from "../../assets/highlights/IMGE1774.JPG";
import image6 from "../../assets/highlights/IMGE1372.JPG";
import image7 from "../../assets/highlights/IMGE1869.JPG";
import image8 from "../../assets/highlights/IMGE1610.JPG";
import image9 from "../../assets/highlights/IMGE1323.JPG";
import image10 from "../../assets/highlights/IMGE1855.JPG";
import image11 from "../../assets/highlights/IMGE1266.JPG";
import image12 from "../../assets/highlights/IMGE1811.JPG";
import image13 from "../../assets/highlights/IMGE1648.JPG";
import image14 from "../../assets/highlights/IMGE1208.JPG";
import image15 from "../../assets/highlights/IMGE1719.JPG";
import image16 from "../../assets/highlights/IMGE1618.JPG";
import image17 from "../../assets/highlights/IMGE1804.JPG";
import image18 from "../../assets/highlights/IMGE1680.JPG";
import image19 from "../../assets/highlights/IMGE1785.JPG";
import image20 from "../../assets/highlights/IMGE1592.JPG";
import HeaderBanner from "../../components/landing/HeaderBanner";

const WEBSITE_URL = "http://localhost:3001";

// --- Types ---
interface JewelryImage {
  id: number;
  height: string;
  src: string;
  title: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<JewelryImage | null>(null);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Image data
  const jewelryImages: JewelryImage[] = [
    { id: 1, height: "h-64", src: image1, title: "Diamond Ring" },
    { id: 2, height: "h-80", src: image2, title: "Gold Necklace" },
    { id: 3, height: "h-56", src: image3, title: "Emerald Earrings" },
    { id: 4, height: "h-72", src: image4, title: "Ruby Bracelet" },
    { id: 5, height: "h-68", src: image5, title: "Sapphire Pendant" },
    { id: 6, height: "h-60", src: image6, title: "Vintage Ring" },
    { id: 7, height: "h-76", src: image7, title: "Pearl Necklace" },
    { id: 8, height: "h-52", src: image8, title: "Diamond Earrings" },
    { id: 9, height: "h-64", src: image9, title: "Amethyst Ring" },
    { id: 10, height: "h-84", src: image10, title: "Luxury Bracelet" },
    { id: 11, height: "h-48", src: image11, title: "Rose Gold Ring" },
    { id: 12, height: "h-68", src: image12, title: "Silver Chain" },
    { id: 13, height: "h-56", src: image13, title: "Crystal Pendant" },
    { id: 14, height: "h-72", src: image14, title: "Wedding Band" },
    { id: 15, height: "h-60", src: image15, title: "Gemstone Earrings" },
    { id: 16, height: "h-80", src: image16, title: "Statement Necklace" },
    { id: 17, height: "h-64", src: image17, title: "Tennis Bracelet" },
    { id: 18, height: "h-52", src: image18, title: "Charm Bracelet" },
    { id: 19, height: "h-76", src: image19, title: "Drop Earrings" },
    { id: 20, height: "h-68", src: image20, title: "Layered Necklace" },
  ];

  const openModal = (image: JewelryImage) => {
    setSelectedImage(image);
    setShowShareOptions(false);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowShareOptions(false);
  };

  const toggleLike = (imageId: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newLikedImages = new Set(likedImages);
    newLikedImages.has(imageId)
      ? newLikedImages.delete(imageId)
      : newLikedImages.add(imageId);
    setLikedImages(newLikedImages);
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageName.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
  };

  const shareToWhatsApp = (image: JewelryImage) => {
    const message = `Check out this beautiful ${image.title}! 💎✨\n\nSee more amazing jewelry at: ${WEBSITE_URL}/gallery\n\nHow can I get more information about this piece?`;
    const whatsappUrl = `https://wa.me/250791813289?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyShareLink = (image: JewelryImage) => {
    const shareUrl = `${WEBSITE_URL}/gallery?item=${image.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      });
  };

  const shareViaWebAPI = async (image: JewelryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this beautiful ${image.title}!`,
          url: `${WEBSITE_URL}/gallery?item=${image.id}`,
        });
      } catch {
        console.log("Share cancelled or failed");
      }
    } else {
      copyShareLink(image);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <HeaderBanner
        title="HR Blogs"
        subtitle="Home / Blogs"
        backgroundStyle="image"
        icon={<GalleryVertical className="w-10 h-10" />}
      />

      {/* Masonry Grid */}
      <section className="py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            {jewelryImages.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="break-inside-avoid relative group cursor-pointer"
                onClick={() => openModal(image)}
              >
                <div
                  className={`${image.height} rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 relative`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-3"
                    >
                      <ZoomIn className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleLike(image.id, e)}
                      className={`p-2 backdrop-blur-sm rounded-full transition-all duration-300 ${
                        likedImages.has(image.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={likedImages.has(image.id) ? "currentColor" : "none"}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToWhatsApp(image);
                      }}
                      className="p-2 bg-green-500 backdrop-blur-sm rounded-full text-white hover:bg-green-600 transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedImage.title}
                </h3>
              </div>

              {/* Modal buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    toggleLike(selectedImage.id, {
                      stopPropagation: () => {},
                    } as unknown as MouseEvent<HTMLButtonElement>)
                  }
                  className={`p-3 backdrop-blur-sm rounded-full transition-all duration-300 ${
                    likedImages.has(selectedImage.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={likedImages.has(selectedImage.id) ? "currentColor" : "none"}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    downloadImage(selectedImage.src, selectedImage.title)
                  }
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>

                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg p-2 min-w-[160px] z-10"
                    >
                      <button
                        onClick={() => shareToWhatsApp(selectedImage)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => shareViaWebAPI(selectedImage)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-blue-600" />
                        Share Link
                      </button>
                      <button
                        onClick={() => copyShareLink(selectedImage)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareToWhatsApp(selectedImage)}
                  className="p-3 bg-green-500 backdrop-blur-sm rounded-full text-white hover:bg-green-600 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
