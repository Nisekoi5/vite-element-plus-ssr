import { basename } from 'node:path'

import { createApp } from "./main"
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory } from 'vue-router'
import { ID_INJECTION_KEY } from 'element-plus';
import { useCounterStore } from '@/stores/index'


export async function render(url, manifest) {
  const { app, router, pinia } = createApp(createMemoryHistory());
  app.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0,
  })
  const store = useCounterStore(pinia)

  router.push(url)
  await router.isReady();

  const ctx = {}
  const appHtml = await renderToString(app, ctx);
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
  // console.log(preloadLinks)
  // console.log(ctx, 'ctx====')
  return { appHtml, preloadLinks, pinia }

}

function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  // console.log(file, 'entry-server----file')
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}