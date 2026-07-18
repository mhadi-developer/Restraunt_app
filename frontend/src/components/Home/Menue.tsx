"use client";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  category: string;
  image: string;
  price: string;
  oldPrice?: string;
  rating: string;
  reviews: number;
  description: string;
  badge?: string;
  badgeType?: string;
  aosDelay?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Classic Smash Burger",
    category: "burgers",
    image: "/img/menu/1.jpg",
    price: "$14.99",
    oldPrice: "$18.99",
    rating: "4.9",
    reviews: 128,
    description:
      "Double smashed patty, cheddar, caramelized onions, pickles & special sauce",
    badge: "Hot",
    badgeType: "hot",
  },

  {
    id: 2,
    title: "Margherita Royale",
    category: "pizza",
    image: "/img/menu/2.jpg",
    price: "$19.99",
    oldPrice: "$24.99",
    rating: "4.8",
    reviews: 95,
    description:
      "San Marzano tomatoes, buffalo mozzarella, basil & truffle oil on sourdough",
    badge: "New",
    badgeType: "new",
    aosDelay: 80,
  },

  {
    id: 3,
    title: "Nashville Hot Chicken",
    category: "chicken",
    image: "/img/menu/3.jpg",
    price: "$12.99",
    oldPrice: "$16.99",
    rating: "5.0",
    reviews: 210,
    description:
      "Crispy fried chicken in fiery Nashville spice blend with honey drizzle",
    badge: "Best Seller",
    aosDelay: 160,
  },

  {
    id: 4,
    title: "Loaded Fajita Wrap",
    category: "wraps",
    image: "/img/menu/4.jpg",
    price: "$10.99",
    rating: "4.5",
    reviews: 74,
    description:
      "Grilled chicken, peppers, sour cream & guacamole in a warm tortilla",
  },

  {
    id: 5,
    title: "Nutella Lava Cake",
    category: "desserts",
    image: "/img/menu/5.jpg",
    price: "$8.99",
    oldPrice: "$11.99",
    rating: "4.9",
    reviews: 56,
    description:
      "Molten chocolate cake with Nutella center, vanilla ice cream & caramel",
    badge: "New",
    badgeType: "new",
    aosDelay: 80,
  },

  {
    id: 6,
    title: "Truffle Mushroom Pasta",
    category: "pasta",
    image: "/img/menu/6.jpg",
    price: "$16.99",
    rating: "4.9",
    reviews: 88,
    description:
      "Al dente tagliatelle, wild mushrooms, black truffle, parmesan & thyme",
    badge: "Chef's Pick",
    badgeType: "hot",
    aosDelay: 160,
  },
];


export const MenuSection = () => {

  const categories = [
    "all",
    "burgers",
    "pizza",
    "chicken",
    "wraps",
    "desserts",
    "pasta",
  ];


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
            menuItems.map((item)=>(

              <div
                key={item.id}
                className={`col-sm-6 col-lg-4 mwrap`}
                data-c={item.category}
                data-aos="fade-up"
                data-aos-delay={item.aosDelay}
              >


                <div className="mcard">


                  {/* Image */}
                  <div className="mimg">

                            <Image
                                width={300}
                                height={200}
                      src={item.image}
                      alt={item.title}
                    />


                    {
                      item.badge && (

                        <div className={`mbdg ${item.badgeType ?? ""}`}>
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
                        item.category
                      }
                    </div>


                    <div className="mtit">
                      {
                        item.title
                      }
                    </div>


                    <div className="mdesc">
                      {
                        item.description
                      }
                    </div>



                    <div className="mfoot">

                      <div>

                        <div className="mprice">

                          {item.price}

                          {
                            item.oldPrice && (
                              <small>
                                {item.oldPrice}
                              </small>
                            )
                          }

                        </div>


                        <div className="mstars">

                          <i className="fas fa-star"></i>

                          <span 
                            style={{
                              color:"#bbb",
                              fontSize:".7rem"
                            }}
                          >
                            ({item.reviews})
                          </span>

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


