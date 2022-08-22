import { defineConfig } from 'vitepress'
import { version } from '../package.json'
import {
  contributing,
  discord,
  font,
  github,
  ogImage,
  ogUrl,
  releases,
  twitter,
  vitestDescription,
  vitestName,
} from './meta'
import { teamMembers } from './contributors'

export default defineConfig({
  lang: 'en-US',
  title: vitestName,
  description: vitestDescription,
  head: [
    ['meta', { name: 'theme-color', content: '#729b1a' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['meta', { name: 'author', content: `${teamMembers.map(c => c.name).join(', ')} and ${vitestName} contributors` }],
    ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, c8, node' }],
    ['meta', { property: 'og:title', content: vitestName }],
    ['meta', { property: 'og:description', content: vitestDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: vitestName }],
    ['meta', { name: 'twitter:description', content: vitestDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { href: font, rel: 'stylesheet' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitest-dev/vitest/tree/main/docs/:path',
      text: 'Sugerir cambios en esta página',
    },

    // algolia: {
    //   appId: 'ZTF29HGJ69',
    //   apiKey: '9c3ced6fed60d2670bb36ab7e8bed8bc',
    //   indexName: 'vitest',
    //   // searchParameters: {
    //   //   facetFilters: ['tags:en'],
    //   // },
    // },

    localeLinks: {
      text: 'Español',
      items: [
        { text: 'English', link: 'https://vitest.dev' },
        { text: '简体中文', link: 'https://cn.vitest.dev' },
      ],
    },

    socialLinks: [
      { icon: 'twitter', link: twitter },
      { icon: 'discord', link: discord },
      { icon: 'github', link: github },
    ],

    footer: {
      message: 'Publicado bajo la licencia MIT.',
      copyright: 'Copyright © 2021-PRESENTE Anthony Fu, Matías Capeletto y contribuidores de Vitest',
    },

    nav: [
      { text: 'Guía', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Configuración', link: '/config/' },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Notas de publicación ',
            link: releases,
          },
          {
            text: 'Contribuir ',
            link: contributing,
          },
        ],
      },
    ],

    sidebar: {
      // TODO: bring sidebar of apis and config back
      '/': [
        {
          text: 'Guía',
          items: [
            {
              text: '¿Por qué Vitest?',
              link: '/guide/why',
            },
            {
              text: 'Introducción',
              link: '/guide/',
            },
            {
              text: 'Características',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Filtrado de Tests',
              link: '/guide/filtering',
            },
            {
              text: 'Cobertura',
              link: '/guide/coverage',
            },
            {
              text: 'Instantáneas',
              link: '/guide/snapshot',
            },
            {
              text: 'Mocks',
              link: '/guide/mocking',
            },
            {
              text: 'Interfaz de Usuario',
              link: '/guide/ui',
            },
            {
              text: 'Pruebas en el Origen',
              link: '/guide/in-source',
            },
            {
              text: 'Contexto del Test',
              link: '/guide/test-context',
            },
            {
              text: 'Ampliación de Comparadores',
              link: '/guide/extending-matchers',
            },
            {
              text: 'Integración con IDE',
              link: '/guide/ide',
            },
            {
              text: 'Depuración',
              link: '/guide/debugging',
            },
            {
              text: 'Comparaciones',
              link: '/guide/comparisons',
            },
            {
              text: 'Guía de Migración',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: 'Referencia de la API',
              link: '/api/',
            },
          ],
        },
        {
          text: 'Configuración',
          items: [
            {
              text: 'Referencia de la Configuración',
              link: '/config/',
            },
          ],
        },
      ],
    },
  },
})
