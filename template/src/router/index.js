import Vue from 'vue';
import VueRouter from 'vue-router';
import Hello from '../pages/Hello.vue';
import About from '../pages/About.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/about',
      component: About
    }
  ]
});
