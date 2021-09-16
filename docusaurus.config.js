const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'AniAPI',
  tagline: 'Your favourite anime WebAPI ♥',
  url: 'https://aniapi.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'AniAPI-Team',
  projectName: 'AniAPI-Docs',
  themeConfig: {
    /*algolia: {
      apiKey: '',
      indexName: ''
    },*/
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true
    },
    navbar: {
      title: 'AniAPI Docs',
      logo: {
        alt: 'My Site Logo',
        src: 'img/aniapi_icon.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs'
        },
        {
          to: '/blog/',
          label: 'Blog',
          position: 'left'
        },
        {
          to: 'https://opencollective.com/aniapi',
          label: 'Help us',
          position: 'right'
        },
        {
          to: 'login',
          label: 'Login',
          position: 'right'
        },
        {
          to: 'https://github.com/AniAPI-Team/AniAPI',
          prependBaseUrlToHref: false,
          className: 'navbar-github-link',
          title: 'Github',
          position: 'right'
        },
        {
          to: 'https://discord.gg/xQjZx5aWkR',
          prependBaseUrlToHref: false,
          className: 'navbar-discord-link',
          title: 'Join discord',
          position: 'right'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/',
            },
            {
              label: 'OAuth',
              to: '/docs/oauth/implicit_grant'
            },
            {
              label: 'Resources',
              to: '/docs/resources/anime'
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/AniAPI-Team',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/xQjZx5aWkR',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Help us',
              to: 'https://opencollective.com/aniapi'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <b>AniAPI</b>, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/AniAPI-Team/AniAPI-Docs/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/AniAPI-Team/AniAPI-Docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus2-dotenv',
      {
        systemvars: true,
        silent: true
      }
    ]
  ],
  themes: [
    '@docusaurus/theme-live-codeblock'
  ],
  scripts: [
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js'
  ]
};
