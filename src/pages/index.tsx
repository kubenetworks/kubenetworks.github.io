import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import config from '@generated/docusaurus.config';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  const [ver, setVer] = useState(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const cachedData = localStorage.getItem('kubevpn-version');
      if (cachedData) {
        try {
          const { version, timestamp } = JSON.parse(cachedData);
          const now = Date.now();
          if (now - timestamp < 600000) {
            return version;
          }
        } catch (e) {
          console.error('Failed to parse version from localStorage', e);
        }
      }
    }
    return 'latest';
  });

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    const fetchVersion = async () => {
      // check local cache
      try {
        const cachedData = localStorage.getItem('kubevpn-version');
        const now = Date.now();

        if (cachedData) {
          const { version, timestamp } = JSON.parse(cachedData);
          // cache 10 minutes
          if (now - timestamp < 600000) {
            setVer(version);
            return;
          }
        }

        // cache expired or doesn't exist, fetch
        const res = await fetch(
          'https://raw.githubusercontent.com/kubenetworks/kubevpn/master/plugins/stable.txt',
        );
        if (res.ok) {
          const version = await res.text();
          if (version) {
            setVer(version);
            localStorage.setItem(
              'kubevpn-version',
              JSON.stringify({
                version,
                timestamp: now,
              }),
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch version', error);
      }
    };

    fetchVersion();
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
