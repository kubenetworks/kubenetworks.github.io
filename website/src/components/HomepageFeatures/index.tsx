import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import Translate from '@docusaurus/Translate';

type FeatureItem = {
    title: React.JSX.JSXElement;
    Svg: React.JSX.ComponentType<React.JSX.ComponentProps<'svg'>>;
    description: React.JSX.JSXElement;
};

const FeatureList: FeatureItem[] = [
    {
        title: <Translate>Local to Remote</Translate>,
        Svg: require('@site/static/img/homepage_coding.svg').default,
        description: (
            <Translate>
                access remote kubernetes cluster network
            </Translate>
        ),
    },
    {
        title: <Translate>Remote to Local</Translate>,
        Svg: require('@site/static/img/homepage_worldwide.svg').default,
        description: (
            <Translate>
                remote kubernetes cluster service can also access your local service
            </Translate>
        ),
    },
    {
        title: <Translate>And more</Translate>,
        Svg: require('@site/static/img/homepage_team.svg').default,
        description: (
            <Translate>
                run your kubernetes pod on local Docker container with same environment、volume、and network
            </Translate>
        ),
    },
];

function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): React.JSX.JSXElement {
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
