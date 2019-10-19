import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Map from "../components/map";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Map />
  </Layout>
);

export default IndexPage;
