import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
    title: React.JSX.Element;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: React.JSX.Element;
    link: string;
};

const FeatureList: FeatureItem[] = [
    {
        title: <Translate>Access Cluster Network</Translate>,
        Svg: require('@site/static/img/homepage_coding.svg').default,
        description: (
            <Translate>
                Connect directly to your Kubernetes cluster network from local
            </Translate>
        ),
        link: '/docs/functions/connect_to_k8s_cluster_network',
    },
    {
        title: <Translate>Header Traffic Interception</Translate>,
        Svg: require('@site/static/img/homepage_worldwide.svg').default,
        description: (
            <Translate>
                Intercept and route traffic with headers to your local services
            </Translate>
        ),
        link: '/docs/functions/reverse_proxy_with_mesh',
    },
    {
        title: <Translate>Run Pods Locally in Docker</Translate>,
        Svg: require('@site/static/img/homepage_team.svg').default,
        description: (
            <Translate>
                Run Kubernetes pods locally with same environment, volumes and network
            </Translate>
        ),
        link: '/docs/functions/run_mode_in_local',
    },
    {
        title: <Translate>File Sync</Translate>,
        Svg: require('@site/static/img/homepage_coding.svg').default,
        description: (
            <Translate>
                Sync files between local and remote pods seamlessly
            </Translate>
        ),
        link: '/docs/functions/sync_mode',
    },
    {
        title: <Translate>Multiple Clusters</Translate>,
        Svg: require('@site/static/img/homepage_worldwide.svg').default,
        description: (
            <Translate>
                Connect to multiple Kubernetes clusters simultaneously
            </Translate>
        ),
        link: '/docs/functions/connect_to_multiple_cluster_network',
    },
    {
        title: <Translate>Nested VPN / Proxy-Out</Translate>,
        Svg: require('@site/static/img/homepage_team.svg').default,
        description: (
            <Translate>
                Chain VPN connections or route traffic through proxy
            </Translate>
        ),
        link: '/docs/functions/proxy_out',
    },
];

function Feature({title, Svg, description, link}: FeatureItem) {
    return (
        <div className={clsx('col col--4', styles.featureCard)}>
            <Link to={link} className={styles.featureLink}>
                <div className="text--center">
                    <Svg className={styles.featureSvg} role="img" aria-hidden="true"/>
                </div>
                <div className="text--center padding-horiz--md">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className={styles.featureButton}>
                        <Translate>View Guide</Translate> →
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function HomepageFeatures(): React.JSX.Element {
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
