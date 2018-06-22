import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import Login from "@/components/Login";
import Main from "@/components/Main";
import UserManager from "@/components/UserManager";
import HelloWorld from "@/components/HelloWorld";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: Main,
      children: [
        {
          path: "",
          name: "Hello",
          component: HelloWorld
        },
        {
          path: "UserManager",
          name: "UserManager",
          component: UserManager
        }
      ],
      beforeEnter(to, from, next) {
        if (!store.state.userInfo.token) {
          store.commit("logout")
          next({
            path: "/Login",
            replace: true
          });
        } else {
          next();
        }
      }
    },
    {
      path: "/Login",
      component: Login,
      beforeEnter(to, from, next) {
        if (localStorage.userInfo) {
          next({
            path: "/",
            replace: true
          });
        } else {
          next();
        }
      }
    }
  ]
});

export default router;
