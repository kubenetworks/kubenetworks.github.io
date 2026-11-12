// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const isDev = process.env.NODE_ENV?.toLocaleLowerCase() !== 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KubeVPN',
  tagline: 'Cloud Native Dev Environment',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://kubevpn.dev/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: isDev ? '/' : '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kubenetworks', // Usually your GitHub org/user name.
  projectName: 'kubevpn', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // English FAQ redirects
          { from: '/faq/1', to: '/docs/faq/image-pull' },
          { from: '/faq/2', to: '/docs/faq/wsl-docker' },
          { from: '/faq/3', to: '/docs/faq/run-mode-apiserver' },
          { from: '/faq/6', to: '/docs/faq/windows-vmp' },
          { from: '/faq/7', to: '/docs/faq/linux-dns' },
          // Also support /docs/ prefix for old paths
          { from: '/docs/faq/1', to: '/docs/faq/image-pull' },
          { from: '/docs/faq/2', to: '/docs/faq/wsl-docker' },
          { from: '/docs/faq/3', to: '/docs/faq/run-mode-apiserver' },
          { from: '/docs/faq/6', to: '/docs/faq/windows-vmp' },
          { from: '/docs/faq/7', to: '/docs/faq/linux-dns' },
        ],
        createRedirects(existingPath) {
          // Handle Chinese locale paths
          if (existingPath.startsWith('/zh/docs/faq/')) {
            const slug = existingPath.replace('/zh/docs/faq/', '');
            const slugToNumber = {
              'image-pull': '1',
              'wsl-docker': '2',
              'run-mode-apiserver': '3',
              'windows-vmp': '6',
              'linux-dns': '7',
            };
            const number = slugToNumber[slug];
            if (number) {
              return [
                `/zh/faq/${number}`,
                `/zh/docs/faq/${number}`,
              ];
            }
          }
          return undefined;
        },
      },
    ],
  ],

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
          editUrl: ({ locale, docPath }) => {
            if (locale === 'zh') {
              return `https://github.com/kubenetworks/kubenetworks.github.io/edit/master/i18n/zh/docusaurus-plugin-content-docs/current/${docPath}`;
            }
            return `https://github.com/kubenetworks/kubenetworks.github.io/edit/master/docs/${docPath}`;
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-C8ZKDJK4K3',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Project social card
      image: 'img/kubevpn-social-card.png',
      metadata: [
        { name: 'description', content: 'KubeVPN - Cloud Native Dev Environment. Connect to Kubernetes cluster network, develop locally with same environment, volumes and network.' },
        { name: 'keywords', content: 'Kubernetes, VPN, Development, Cloud Native, Dev Environment' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'KubeVPN - Cloud Native Dev Environment' },
        { property: 'og:description', content: 'Connect to Kubernetes cluster network, develop locally with same environment, volumes and network.' },
        { property: 'og:image', content: 'https://kubevpn.dev/img/kubevpn-social-card.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      navbar: {
        title: 'KubeVPN',
        logo: {
          alt: '',
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
            sidebarId: 'commands',
            position: 'left',
            label: 'Commands',
          },
          {
            type: 'docSidebar',
            sidebarId: 'functions',
            position: 'left',
            label: 'Functions',
          },
          {
            type: 'docSidebar',
            sidebarId: 'architecture',
            position: 'left',
            label: 'Architecture',
          },
          {
            type: 'docSidebar',
            sidebarId: 'faq',
            position: 'left',
            label: 'FAQ',
          },
          {
            label: 'Donate',
            to: 'docs/donate',
            position: 'right',
          },
          {
            type: 'html',
            value: '<a href="https://applink.larkoffice.com/client/chat/chatter/add_by_link?link_token=d00ubb87-739f-490b-80ad-26e242be3e40" target="_blank" rel="noopener noreferrer" aria-label="Chat on Lark"><img style="width:30px;height:30px;vertical-align:middle" src="/img/contact/lark.svg" alt="Lark" /></a>',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Git Repo',
            items: [
              {
                label: 'Gitee',
                href: 'https://gitee.com/kubevpn/kubevpn',
              },
              {
                label: 'GitLab',
                href: 'https://gitlab.com/kubevpn/kubevpn',
              },
            ],
          },
          {
            title: 'Latest Release',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/kubenetworks/kubevpn/releases/latest',
              },
              {
                label: 'Archives',
                href: 'https://github.com/kubenetworks/kubevpn/releases',
              },
            ],
          },
          {
            title: 'Blog',
            items: [
              {
                label: 'Blog',
                href: 'https://wencaiwulue.github.io/',
              },
              {
                label: 'CSDN',
                href: 'https://blog.csdn.net/u012803274',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} KubeVPN`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        language: ['en', 'zh'],
        // ```
      },
    ],
  ],
};

module.exports = config;
