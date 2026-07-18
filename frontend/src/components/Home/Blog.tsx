import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    image: "/img/blog/1.jpg",
    day: "14",
    month: "Mar",
    category: "Food & Health",
    title: "Healthy Fast Food: A Myth or Beautiful Reality",
    author: "James Writer",
    comments: "24 Comments",
    delay: 0,
    href: "#",
  },
  {
    id: 2,
    image: "/img/blog/2.jpg",
    day: "28",
    month: "Feb",
    category: "Food Science",
    title: "Is Fast Food Getting Healthier? Here's What We Found",
    author: "Sarah Grain",
    comments: "18 Comments",
    delay: 80,
    href: "#",
  },
  {
    id: 3,
    image: "/img/blog/3.jpg",
    day: "05",
    month: "Jan",
    category: "Recipes",
    title: "Innovative Hot Chickpeas Flake Crackin' Recipe at Home",
    author: "Chef Marcus",
    comments: "32 Comments",
    delay: 160,
    href: "#",
  },
];

export  function BlogSection() {
  return (
    <section id="blog">
      <div className="container">
        <div
          className="text-center mb-5"
          data-aos="fade-up"
        >
          <span className="slbl">News &amp; Updates</span>

          <h2 className="stitle">
            Our Latest <span>Blog</span> Posts
          </h2>

          <div className="sline"></div>
        </div>

        <div className="row g-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay={blog.delay}
            >
              <div className="blcard">
                <div className="blimg">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={600}
                    height={400}
                    className="img-fluid"
                  />

                  <div className="bldatebdg">
                    <span className="bd">{blog.day}</span>
                    <span className="bm">{blog.month}</span>
                  </div>
                </div>

                <div className="blbody">
                  <div className="bltag">{blog.category}</div>

                  <div className="bltit">
                    <Link href={blog.href}>{blog.title}</Link>
                  </div>

                  <div className="blmeta">
                    <span>
                      <i className="fas fa-user"></i>
                      {blog.author}
                    </span>

                    <span>
                      <i className="fas fa-comment"></i>
                      {blog.comments}
                    </span>
                  </div>

                  <Link
                    href={blog.href}
                    className="blmore"
                  >
                    Read More{" "}
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}