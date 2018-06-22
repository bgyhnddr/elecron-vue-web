import Vue from "vue";

Vue.directive("permissions", {
  bind: function(el, binding, vnode) {
    let userInfo = localStorage.userInfo;
    if (!userInfo) {
      el.remove();
    } else {
      userInfo = JSON.parse(userInfo);

      let permissions = binding.value;

      if (!permissions) {
        return;
      }

      if (
        permissions.some(p => {
          return userInfo.permissions.indexOf(p) >= 0;
        })
      ) {
        return;
      }

      el.remove();
    }
  }
});

export default {};
