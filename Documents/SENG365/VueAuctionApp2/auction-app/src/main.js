import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
/*import ViewAuction from './ViewAuction.vue';
import Register from './Register.vue';
import CreateAuction from './CreateAuction.vue';*/

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.http.options.emulateJSON = true;

const vue_routes = [
  {
    path: "/",
    component: Home,
    name: "Home"
  }
  //,
  // {
  //     path: "/auction",
  //     component: ViewAuction,
  //     name: "auction"
  // }
  // },
  // {
  //     path: "/login",
  //     component: Login,
  //     name: "login"
  // },
  // {
  //     path: "/register",
  //     component: Register,
  //     name: "register"
  // },
  // {
  //     path: "/createauction",
  //     component: CreateAuction,
  //     name: "createauction"
  // }
];

const my_router = new VueRouter({
  routes: vue_routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: my_router,
  render: h => h(App)
});
