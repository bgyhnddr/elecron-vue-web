import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {
      name: ""
    }
  },
  mutations: {
    login(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.userInfo = JSON.stringify(userInfo);
    },
    logout(state) {
      state.userInfo = { token: undefined };
      localStorage.removeItem("userInfo");
    }
  }
});

export default store;
