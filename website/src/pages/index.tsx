import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';
import config from '@generated/docusaurus.config';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img style={{ width: 300, height: 100, objectFit: "cover" }} src={require('@site/static/img/logo.jpeg').default} />
        <p className="hero__subtitle">
          <Translate>Cloud Native Dev Environment</Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quickstart">
              <Translate>QuickStart</Translate>
          </Link>
          <Link
            className={styles.homepageVersion}
            to="https://github.com/KubeNetworks/kubevpn/releases/tag/v2.2.0">
            v2.2.0
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        message: "Homepage"
      })}
      description={config.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
