import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Miette aims to package everything you need from a diagnostic and error handling toolkit into a simple to use package.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    description: (
      <>
        Miette makes it easy to write code and give your users actionable feedback on how to move forward.
      </>
    ),
  },
  {
    title: 'Powered by You',
    description: (
      <>
        Extend or customize your error output with Miette. From diagnostic codes to help messages to elaborate decoration of our your output, you are in charge.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <img src={require('../../static/img/screenshot.png').default} alt="example output"/>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
