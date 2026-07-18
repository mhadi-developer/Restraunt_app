const timelineItems = [
  {
    year: "2012",
    title: "Evolution of Restaurants",
    description:
      "Sarab opens its first 20-seat diner on Flavor Street. Within 3 months, lines stretch around the block every evening as word of our food spreads.",
  },
  {
    year: "2015",
    title: "Fine Dining & The Concept",
    description:
      "Expanding the vision—we introduced our signature tasting menu and hired our first Michelin-trained chef, elevating our craft to remarkable new heights.",
  },
  {
    year: "2019",
    title: "Modern Fast Food Origins",
    description:
      "Launched our signature fast-food line, merging gourmet quality with speed and convenience. Within 6 months we won 3 prestigious culinary awards nationally.",
  },
  {
    year: "2026",
    title: "National Expansion",
    description:
      "Now operating in 8 cities across the US with an online delivery platform handling 10,000+ orders weekly—and growing every single day.",
  },
];

export default function HistorySection() {
  return (
    <section id="history">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">Our Journey</span>

          <h2 className="stitle">
            A History of <span>Restaurant</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "480px" }}
          >
            From humble beginnings to the city&apos;s most beloved restaurant —
            every chapter written with passion.
          </p>
        </div>

        <div className="timeline" data-aos="fade-up">
          {timelineItems.map((item, index) => (
            <div key={index} className="tli">
              <div className="tl-left">
                <div className="tlyear">{item.year}</div>

                <h5>{item.title}</h5>

                <p>{item.description}</p>
              </div>

              <div className="tl-center">
                <div className="tldot"></div>
              </div>

              <div className="tl-right">
                <div className="tlyear">{item.year}</div>

                <h5>{item.title}</h5>

                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}