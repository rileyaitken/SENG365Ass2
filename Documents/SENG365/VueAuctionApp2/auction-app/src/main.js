import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import ViewAuction from './ViewAuction.vue';
import CreateAuction from './CreateAuction.vue';
import EditAuction from './EditAuction.vue';
import MyCurrentAuctions from './MyCurrentAuctions.vue';
import MySoldAuctions from './MySoldAuctions.vue';
import MyCurrentBids from './MyCurrentBids.vue';
import MyExpiredAuctions from './MyExpiredAuctions.vue';
import MyWonAuctions from './MyWonAuctions.vue';
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
  },
  {
    path: "/auction",
    component: ViewAuction,
    name: "auction"
  },
  {
    path: "/createauction",
    component: CreateAuction,
    name: "createauction"
  },
  {
    path: "/editauction",
    component: EditAuction,
    name: "editauction"
  },
  {
    path: '/mycurrentauctions',
    component: MyCurrentAuctions,
    name: 'mycurrentauctions'
  },
  {
    path: '/myexpiredauctions',
    component: MyExpiredAuctions,
    name: 'myexpiredauctions'
  },
  {
    path: '/mywonauctions',
    component: MyWonAuctions,
    name: 'mywonauctions'
  },
  {
    path: '/mysoldauctions',
    component: MySoldAuctions,
    name: 'mysoldauctions'
  },
  {
    path: '/mycurrentbids',
    component: MyCurrentBids,
    name: 'mycurrentbids'
  }
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

