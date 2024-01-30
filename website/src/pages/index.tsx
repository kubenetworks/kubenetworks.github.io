import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import Translate, { translate } from '@docusaurus/Translate';

import config from '@generated/docusaurus.config';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  const [ver, setVer] = useState('latest');

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/kubenetworks/kubevpn/master/plugins/stable.txt',
    )
      .then(res => res.text())
      .then(ver => setVer(ver));
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img
          style={{ width: 300, height: 100, objectFit: 'cover' }}
          src={require('@site/static/img/logo.jpeg').default}
        />
        <p className="hero__subtitle">
          <Translate>Cloud Native Dev Environment</Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quickstart"
          >
            <Translate>QuickStart</Translate>
          </Link>
          <Link
            className={styles.homepageVersion}
            to="https://github.com/kubenetworks/kubevpn/releases/latest"
          >
            {ver}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={translate({
        message: 'Homepage',
      })}
      description={config.tagline}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
