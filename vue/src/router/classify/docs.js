import DocsTemplate from '@/views/Docs.vue'
import DocsRouter from '@/config/global/Docs'

let DocsRouterPage = DocsRouter.DocsRouter()

export const docs = {
    path: '/docs',
    component: DocsTemplate,
    children: [
        { path: '/docs', redirect: '/docs/About_Us' },
        {
            path: `/docs/:docspage(${DocsRouterPage})`,
            name: 'docs',
            meta: {
                title: 'Docs'
            },
            component: () => import('@/views/docs/Docs.vue'),
        },
        {
            path: '*',
            redirect: '/error',
        }
    ]
};
