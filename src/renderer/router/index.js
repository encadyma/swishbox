import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/preferences',
      name: 'preferences-page',
      component: require('@/components/PreferencesPage').default
    },
    {
      path: '/search',
      name: 'search-page',
      component: require('@/components/SearchPage').default
    },
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/HomePage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
