import router from "../router";
import store from "../store";

let request = (path, params) => {
  return ipcRequest(path, {
    token: store.state.userInfo.token,
    data: params
  }).then(result => {
    console.log(result)
    if (result.success) {
      return result;
    } else if (result.code == "notlogin") {
      store.commit("logout");
      router.replace("/Login");
      return Promise.reject({
        message: result.message
      });
    } else {
      return Promise.reject({
        message: result.message ? result.message : "未知错误"
      });
    }
  })
}

export default {
  get(path, params) {
    return request(path, params)
  },
  post(path, params) {
    return request(path, params)
  }
};
