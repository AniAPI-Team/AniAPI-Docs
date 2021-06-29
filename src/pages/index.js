import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src="img/aniapi_logo.png" className="hero__logo"></img>
        {/*<h1 className="hero__title">{siteConfig.title}</h1>*/}
        <h3 className="hero__subtitle">{siteConfig.tagline}</h3>
        {/*<div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
  </div>*/}
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title=""
      description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className="get-started-section">
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/">
              Get started
            </Link>
          </div>
        </section>

      </main>
    </Layout>
  );
}
