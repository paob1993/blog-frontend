import HomeLayout from '@/views/Layouts/HomeLayout.vue';
import DashboardLayout from '@/views/Layouts/DashboardLayout.vue';

const routes = [
  {
    path: '/login',
    component: HomeLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/User/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../views/User/Register.vue')
      },
    ]
  },
  {
    path: "/",
    component: HomeLayout,
    redirect: "/publications",
    children: [
      {
        path: '/publications',
        name: 'publications',
        component: () => import('../views/Publication/Publications.vue')
      },
      {
        path: 'publication/details/:id',
        name: 'publication-details',
        component: () => import('../views/Publication/PublicationDetails.vue')
      },
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Publication/PublicationList.vue')
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('../views/Publication/PublicationList.vue')
      }
    ]
  },
  { path: '*', component: () => import('../views/NotFoundPage.vue') }
];

export default routes;
