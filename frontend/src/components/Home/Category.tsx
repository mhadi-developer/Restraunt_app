"use client";
import { Suspense, useEffect, useState } from "react";

import Image from "next/image";
import axiosInstance from "@/libs/axiosInstance";
import Spinner from "../Spinner";
import { type Category } from "@/types/catgory";
import { useRouter } from "next/navigation";


export default function CategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading , setLoading] = useState<boolean>(false)

useEffect(() => {
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get/categories");
      if (response.status === 200 || response.status === 304) {
        setCategories(response?.data?.fetchedCategoires);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, []);

  if (loading) {
    return <Spinner size={32}/>
  }
 
  const handelSearch = (search: string) => {
    const param = new URLSearchParams()
    if(search){
      param.set("category", search)
    }

    router.push(`/menu?${param.toString()}`);
    
  }


  return (
     <section id="category">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up" suppressHydrationWarning>
          <span className="slbl">What We Offer</span>

          <h2 className="stitle">
            Browse by <span>Category</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "480px" }}
          >
            From sizzling burgers to exotic world cuisines — find your
            favourite in our menu.
          </p>
        </div>
        <Suspense fallback={<Spinner size={30} />}>
      <div className="row g-3 justify-content-center">
            {categories?.map((category, index) => (
    
    <div
      key={category.id}
      className="col-6 col-sm-4 col-md-3 col-lg-2"
      data-aos="zoom-in"
      data-aos-delay={index * 70}
              >
                <div   className="cat-card">
                  <button style={{
                    "border": "none",
                    "background":"transparent"
                  }}
                  onClick={()=>handelSearch(category.categoryName)}
                >
        <div className="cat-card-imgwrap">
                    <Image
            src={category.categoryImage.secure_url}
            alt={category.categoryName}
            className="catimg"
            width={120}
            height={120}
          />
        </div>

        <div className="catnm">{category.categoryName}</div>
      </button> 
        </div>
        
    </div>
  ))}
</div>
</Suspense>
      </div>
    </section>

  );
}