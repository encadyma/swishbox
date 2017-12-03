import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/search',
      name: 'search-page',
      component: require('@/components/SearchPage').default
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
