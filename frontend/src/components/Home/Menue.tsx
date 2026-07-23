"use client";
import axiosInstance from "@/libs/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type MenuItem } from "@/types/imenuItems";
import SpinnerCircle from "../Spinner";








export const MenuSection = () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get("/get/items");
        if (response.status === 200 || response.status === 304) {
          setItems(response.data.items);
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return <div><p>Loading Items .......... </p> <SpinnerCircle size={128}/></div>
  }
  
  return (
    <section id="menu">

      <div className="container">


        {/* Heading */}
        <div 
          className="text-center mb-5"
          data-aos="fade-up"
        >

          <span className="slbl">
            What&apos;s Cooking
          </span>

          <h2 className="stitle">
            Our Delicious <span>Menu</span>
          </h2>

          <div className="sline"></div>

        </div>



        {/* Filters */}
        {/* <div 
          className="text-center mb-4"
          data-aos="fade-up"
        >

          {
            categories.map((cat,index)=>(
              <button
                key={cat}
                className={`filtbtn ${index===0 ? "active":""}`}
                data-f={cat}
              >
                {
                  cat.charAt(0).toUpperCase()+cat.slice(1)
                }
              </button>
            ))
          }

        </div> */}




        {/* Menu Cards */}
        <div className="row g-4" id="mgrid">


          {
            items?.map((item)=>(

              <div
                key={item.id}
                className={`col-sm-6 col-lg-4 mwrap`}
                data-c={item.categoryName}
                data-aos="fade-up"
                data-aos-delay="120"
              >


                <div className="mcard">


                  {/* Image */}
                  <div className="mimg">

                            <Image
                                width={300}
                                height={200}
                      src={item.itemImages[0].secure_url}
                      alt={item.itemName}
                    />


                    {
                      item.badge && (

                        <div className={`mbdg ${item.badge ?? ""}`}>
                          <i className="fas fa-star"></i>
                          {" "}
                          {item.badge}
                        </div>

                      )
                    }


                    <div className="mhrt">
                      <i className="far fa-heart"></i>
                    </div>


                  </div>




                  {/* Body */}
                  <div className="mbody">


                    <div className="mcat">
                      {
                        item.categoryName
                      }
                    </div>


                    <div className="mtit">
                      {
                        item.itemName
                      }
                    </div>


                    <div className="mdesc">
                      {
                        item.itemDescription
                      }
                    </div>



                    <div className="mfoot">

                      <div>

                        <div className="mprice">

                          {item.itemPrice}$

                        </div>

                      </div>



                      <button 
                        className="madd"
                        title="View Details"
                      >
                        <i className="fas fa-plus"></i>
                      </button>


                    </div>


                  </div>


                </div>


              </div>

            ))
          }


        </div>




        <div className="text-center mt-5">

          <Link href="/menu" className="btn-red">
      <i className="fas fa-th-large"></i>
        View Full Menu

          </Link>

        </div>



      </div>

    </section>
  );
};


