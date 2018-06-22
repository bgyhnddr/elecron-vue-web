import http_util from "../util/http";

export default {
  async getUsers(params) {
    let result = await http_util.get("/sys/getUsers", params);
    return result;
  },
  async getRoles(params) {
    let result = await http_util.get("/sys/getRoles", params);
    return result;
  },
  async getUserRoles(params) {
    let result = await http_util.get("/sys/getUserRoles", params);
    return result;
  },
  async editUserRoles(params) {
    let result = await http_util.post("/sys/editUserRoles", params);
    return result;
  },
  async getPermissions(params) {
    let result = await http_util.get("/sys/getPermissions", params);
    return result;
  },
  async getRolePermissions(params) {
    let result = await http_util.get("/sys/getRolePermissions", params);
    return result;
  },
  async editRolePermissions(params) {
    let result = await http_util.post("/sys/editRolePermissions", params);
    return result;
  },
  async editRole(params) {
    let result = await http_util.post("/sys/editRole", params);
    return result;
  },
  async removeRole(params) {
    let result = await http_util.post("/sys/removeRole", params);
    return result;
  },
  async editPermission(params) {
    let result = await http_util.post("/sys/editPermission", params);
    return result;
  },
  async removePermission(params) {
    let result = await http_util.post("/sys/removePermission", params);
    return result;
  },
  async addUser(params) {
    let result = await http_util.post("/sys/addUser", params);
    return result;
  },
  async editUser(params) {
    let result = await http_util.post("/sys/editUser", params);
    return result;
  },
  async removeUser(params) {
    let result = await http_util.post("/sys/removeUser", params);
    return result;
  }
};
