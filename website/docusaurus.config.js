// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const isDev = process.env.NODE_ENV?.toLocaleLowerCase() !== 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KubeVPN',
  tagline: 'Cloud Native Dev Environment',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://kubenetworks.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: isDev ? '/' : '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kubenetworks', // Usually your GitHub org/user name.
  projectName: 'kubevpn', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/kubenetworks/kubenetworks.github.io/tree/master/website/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/kubenetworks/kubenetworks.github.io/tree/master/website/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'KubeVPN',
        logo: {
          alt: 'KubeVPN',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'functions',
            position: 'left',
            label: 'Functions',
          },
          {
            type: 'docSidebar',
            sidebarId: 'faq',
            position: 'left',
            label: 'FAQ',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/kubenetworks/kubevpn',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Github',
            items: [
              {
                label: 'KubeVPN',
                href: 'https://github.com/kubenetworks/kubevpn',
              },
              {
                label: 'KubeVPN Docs',
                href: 'https://github.com/kubenetworks/kubenetworks.github.io',
              },
            ],
          },
          {
            title: 'Latest Release',
            items: [
              {
                label: 'latest',
                href: 'https://github.com/kubenetworks/kubevpn/releases/latest',
              },
              {
                label: 'Archives',
                href: 'https://github.com/kubenetworks/kubevpn/releases',
              },
            ],
          },
        ],
        copyright: `${new Date().getFullYear()} kubenetworks / Built with Docusaurus`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
