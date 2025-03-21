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
      .then(res => (res.ok ? res.text() : undefined))
      .then(ver => ver && setVer(ver));
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0.5rem 0',
          }}
        >
          KubeVPN
        </h1>
        <p className="hero__subtitle">
          <Translate>Cloud Native Dev Environment</Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            style={{ width: 144, paddingRight: 0, paddingLeft: 0 }}
            className="button button--secondary button--lg"
            to="/docs/quickstart"
          >
            <Translate>QuickStart</Translate>
          </Link>
          <Link
            style={{
              width: 144,
              paddingRight: 0,
              paddingLeft: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="button button--secondary button--lg"
            to="https://github.com/kubenetworks/kubevpn"
          >
            <img
              style={{ marginRight: 8 }}
              className={styles.githubLogo}
              src="img/github.svg"
            ></img>
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
