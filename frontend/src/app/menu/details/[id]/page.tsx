'use client';

import React, { useState,useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import '@/assets/CSS/item-details-page.css';
import axiosInstance from '@/libs/axiosInstance';
import { toast } from 'sonner';
import Image from 'next/image';
import SpinnerCircle from '@/components/Spinner';

// TypeScript Interface based on your provided schema
interface ItemImage {
  id: number;
    secure_url: string;
    public_id: string;
}

interface MenuItem {
  id: number;
  badge: string;
  categoryName: string;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  itemImages: ItemImage[];
}

// Default mock data injecting your exact provided sample

export default function ItemDetails() {
    const [item, setItem] = useState<MenuItem>();
    const [loading , setLoading] = useState<boolean>(false)
    const param = useParams();
    const itemId = param.id;
    console.log(itemId);
    
    

    useEffect(() => {
        if (!itemId) return;

      
        const loadItemDetails = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/get/item/${itemId}`);

                if (response.status === 200 || response.status === 304) {
                    toast.success('record fetch successfully')
                    setItem(response.data?.item);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
                
            } finally {
                setLoading(false);
            }
        };

         loadItemDetails();

        
    }, [itemId]);

  const [currentIdx, setCurrentIdx] = useState(0);

  const nextImage = () => {
    setCurrentIdx((prev) => {
      const length = item?.itemImages?.length ?? 0;
      return prev === (length - 1) ? 0 : prev + 1;
    });
  };

  const prevImage = () => {
    setCurrentIdx((prev) => {
      const length = item?.itemImages?.length ?? 0;
      let newIndex: number;
      if (prev === 0) {
        newIndex = length > 0 ? length - 1 : 0;
      } else {
        newIndex = prev - 1;
      }
      return newIndex;
    });
  };

    if (loading) {
        return <><span>
            <p>Loading Item ........ please wait</p>
        </span>
            <SpinnerCircle size={128} /> </>
    }
    
  return (
    <div className="page-wrapper">
      <main className="item-card">
        
        {/* Left Side: Image Slider */}
        <section className="slider-section">
          {item?.itemImages?.map((img, index) => (
            <img
              key={img.id}
              src={img.secure_url}
              alt={`${item.itemName} - View ${index + 1}`}
              className={`slider-image ${index === currentIdx ? 'active' : ''}`}
            />
          ))}
          
          {/* Slider Controls */}
          {item?.itemImages && item?.itemImages.length > 1 && (
            <>
              <button className="slider-btn prev" onClick={prevImage} aria-label="Previous image">
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button className="slider-btn next" onClick={nextImage} aria-label="Next image">
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
              
              <div className="slider-dots">
                {item?.itemImages.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`dot ${idx === currentIdx ? 'active' : ''}`}
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Right Side: Product Details */}
        <section className="details-section">
          
          <div className="meta-row">
            <span className="category-name">{item?.categoryName}</span>
            {item?.badge && (
              <span className="badge-premium">{item.badge}</span>
            )}
          </div>

          <h1 className="item-title">{item?.itemName}</h1>
          
          {/* Formatted Price */}
          <div className="item-price">
            ${item?.itemPrice.toFixed(2)}
          </div>

          <p className="item-description">
            {item?.itemDescription}
          </p>

          <div className="action-area">
            <button className="add-to-cart-btn">
              <ShoppingBag size={20} />
              Add to Order
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}