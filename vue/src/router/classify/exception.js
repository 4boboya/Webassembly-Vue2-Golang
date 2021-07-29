import ErrorTemplate from '@/views/Error.vue';

export const Exceptions = {
    path: '/error',
    name: 'error',
    // route level code-splitting
    // which is lazy-loaded when the route is visited.
    component: ErrorTemplate,
    meta: {
        title: 'Not Found'
    }
};
