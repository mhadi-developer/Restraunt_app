import Image from "next/image";

const categories = [
  {
    name: "All Items",
    count: "99 items",
    image: "/img/category/1.jpg",
    filter: "all",
    active: true,
  },
  {
    name: "Burgers",
    count: "24 items",
    image: "/img/category/2.jpg",
    filter: "burgers",
  },
  {
    name: "Pizza",
    count: "18 items",
    image: "/img/category/3.jpg",
    filter: "pizza",
  },
  {
    name: "Fried Chicken",
    count: "15 items",
    image: "/img/category/4.jpg",
    filter: "chicken",
  },
  {
    name: "Wraps",
    count: "12 items",
    image: "/img/category/5.jpg",
    filter: "wraps",
  },
  {
    name: "Desserts",
    count: "20 items",
    image: "/img/category/6.jpg",
    filter: "desserts",
  },
];

export default function CategorySection() {
  return (
    <section id="category">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
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

        <div className="row g-3 justify-content-center">
          {categories.map((category, index) => (
            <div
              key={category.filter}
              className="col-6 col-sm-4 col-md-3 col-lg-2"
              data-aos="zoom-in"
              data-aos-delay={index * 70}
            >
              <div
                className={`catcard ${
                  category.active ? "active" : ""
                }`}
                data-filter={category.filter}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  className="catimg"
                  width={120}
                  height={120}
                />

                <div className="catnm">{category.name}</div>

                <div className="catct">{category.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}