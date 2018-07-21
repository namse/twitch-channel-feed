import Vue from 'vue';
import Router from 'vue-router';
import View from './views/View.vue';
import Edit from './views/Edit.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
    },
    {
      path: '/feed/:userId',
      name: 'view',
      component: View,
    }
  ],
});
