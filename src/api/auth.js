import http_util from "../util/http";
import store from "../store";
export default {
  async login(params) {
    let result = await http_util.post("/sys/login", params);
    return result;
  }
};
