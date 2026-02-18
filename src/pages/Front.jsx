import React from "react";

import {
  Banner,
  Header,
  Hero,
  Brand,
  FeatureSection,
  FeatureTwoSection,
  DefaiSection,
  ContentSection,
  ContentTwoSection,
  ContentTwoSectionCopy,
  ContentThreeSection,
  ProcessSection,
  ReviewsSection,
  StatSection,
  RoadMap,
  TeamSection,
  FAQSection,
  CTASection,
  FooterSection,

} from '../frontend';

const Front = () => {
  return (
    <div className="">



      <Banner />
      <Header />

      <div className="page-wrapper">


        <Hero />

        <div className="brand-title-block flex justify-center items-center mt-10 mb-10">
          <div className="brand-title text-center">Strategic conversations & ecosystem outreach</div>
        </div>


        <Brand />


        <FeatureSection />
        <FeatureTwoSection />
        <DefaiSection />

        <ContentSection />
        <ContentTwoSection />
        <ContentTwoSectionCopy />
        <ContentThreeSection />

        <ProcessSection />
        {/* <ProcessWidget />
        <ProcessGraph /> */}

        <ReviewsSection />
        {/* <ReviewCard />
        <ReviewSectionHeading /> */}

        <StatSection />
        {/* <StatTextBlock />
        <StatCard /> */}
        <RoadMap />
        <TeamSection />

        <FAQSection />


        <CTASection />


        <FooterSection />


      </div>







    </div>
  );
};

export default Front;

