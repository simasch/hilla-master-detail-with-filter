import {Route} from '@vaadin/router';
import './views/helloworld/hello-world-view';
import './views/main-layout';

export type ViewRoute = Route & {
    title?: string;
    icon?: string;
    children?: ViewRoute[];
};

export const views: ViewRoute[] = [
    // place routes below (more info https://hilla.dev/docs/routing)
    {
        path: '',
        component: 'hello-world-view',
        icon: '',
        title: '',
    },
    {
        path: 'hello-world',
        component: 'hello-world-view',
        icon: 'la la-globe',
        title: 'Hello World',
    },
    {
        path: 'master-detail',
        component: 'master-detail-view',
        icon: 'la la-columns',
        title: 'Master-Detail',
        action: async (_context, _command) => {
            await import('./views/masterdetail/master-detail-view');
            return;
        },
    },
];
export const routes: ViewRoute[] = [
    {
        path: '',
        component: 'main-layout',
        children: [...views],
    },
];
