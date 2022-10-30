import express from 'express'
import fs, { rename } from 'fs'
import path from 'path'
import { createServer as createViteServer, loadEnv } from 'vite'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
// const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
async function createServer(isProd = true) {
    const envs = process.env
    if (envs.VITE_MODE == 'development') {
        isProd = false
    } else {
        isProd = true
    }
    console.log('isProd:', isProd)
    const resolve = path.resolve
    const indexProd = isProd
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : ''

    // @ts-ignore
    const manifest = isProd
        ?
        (await import('./dist/client/ssr-manifest.json', { assert: { type: 'json' } })).default
        : {}

    const server = express()
    server.use(cookieParser())
    let vite
    if (!isProd) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        })
        server.use(vite.middlewares)
    } else {
        server.use((await import('compression')).default())
        server.use(
            (await import('serve-static')).default(resolve('dist/client'), {
                index: false
            })
        )
    }

    server.use('*', async (req, res, next) => {
        try {
            const url = req.originalUrl
            let template, render
            if (!isProd) {
                template = fs.readFileSync(
                    path.resolve('index.html'),
                    'utf-8'
                )
                template = await vite.transformIndexHtml(url, template)
                render = await vite.ssrLoadModule('/src/entry-server.js')
            } else {
                template = indexProd
                render = await import('./dist/server/entry-server.js')

            }
            render = render.render
            const { appHtml, preloadLinks, pinia, document_title } = await render(url, manifest)
            const html = template.replace(`<!--ssr-outlet-->`, appHtml)
                .replace(`<!--Title-->`, document_title)
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--__INITIAL_STATE__-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(pinia.state.value)}</script>`)
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (err) {
            vite && vite.ssrFixStacktrace(err)
            console.log(err.stack)
            console.log('--------------------------------------')
            if (isProd) {
                res.status(500).end('服务器工作异常,请联系管理员!')
            } else {
                res.status(500).end(err.stack)
            }
            // next(e)
        }
    })
    const prot = Number(envs.VITE_PROT)
    server.listen(prot, () => { console.log(`server listen:${prot}`) })
}

createServer()