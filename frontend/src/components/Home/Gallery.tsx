"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  alt: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 0,
    image: "/img/portfolio/work1.jpg",
    title: "Gourmet Burgers",
    description:
      "Our award-winning smash burgers, hand-crafted with 100% premium beef, aged cheddar and house-made sauces.",
    alt: "Burgers",
  },
  {
    id: 1,
    image: "/img/portfolio/work2.jpg",
    title: "Wood-Fired Pizza",
    description:
      "Authentic Neapolitan-style pizzas fired at 900°F in our wood-burning stone oven for the perfect char.",
    alt: "Pizza",
  },
  {
    id: 2,
    image: "/img/portfolio/work3.jpg",
    title: "Crispy Fried Chicken",
    description:
      "Double-brined, hand-battered chicken fried to golden perfection using our 15-spice secret blend.",
    alt: "Chicken",
  },
  {
    id: 3,
    image: "/img/portfolio/work4.jpg",
    title: "Sweet Desserts",
    description:
      "Handcrafted desserts—from molten lava cakes to artisan ice cream sundaes and seasonal pastries.",
    alt: "Desserts",
  },
  {
    id: 4,
    image: "/img/portfolio/work5.jpg",
    title: "Fresh Wraps & Rolls",
    description:
      "Loaded fresh wraps packed with grilled proteins, crunchy vegetables and our house-made sauces.",
    alt: "Wraps",
  },
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openPopup = (index: number) => {
    setCurrentIndex(index);
  };

  const closePopup = () => {
    setCurrentIndex(null);
  };

  const prevImage = () => {
    if (currentIndex === null) return;

    setCurrentIndex(
      currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1
    );
  };

  const nextImage = () => {
    if (currentIndex === null) return;

    setCurrentIndex(
      currentIndex === galleryItems.length - 1 ? 0 : currentIndex + 1
    );
  };

  const currentItem =
    currentIndex !== null ? galleryItems[currentIndex] : null;

  return (
    <>
      <section id="gallery">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">Food Showcase</span>

            <h2 className="stitle">
              Let&apos;s See Our <span>Fast Food</span>
            </h2>

            <div className="sline"></div>
          </div>

          <div className="ggrid" data-aos="fade-up">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="gitem"
                onClick={() => openPopup(index)}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={500}
                  height={500}
                />

                <div className="gover">
                  <span>
                    <i className="fas fa-expand-alt"></i>{" "}
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Popup */}

      {currentItem && (
        <div id="galPop">
          <div className="gpbox">
            <button className="gpclose" onClick={closePopup}>
              <i className="fas fa-times"></i>
            </button>

            <Image
              src={currentItem.image}
              alt={currentItem.alt}
              width={900}
              height={700}
              id="gpImg"
            />

            <div className="gpcap">
              <h5>{currentItem.title}</h5>

              <p>{currentItem.description}</p>
            </div>

            <div className="gpnav">
              <button onClick={prevImage}>
                <i className="fas fa-chevron-left me-1"></i>
                Prev
              </button>

              <button onClick={nextImage}>
                Next
                <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}