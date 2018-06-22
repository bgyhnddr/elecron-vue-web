<template>
  <div user-role-tree>
    <table class="edit-table">
      <tbody>
        <tr>
          <td>
            <Card class="card">
              <Spin size="large" fix v-if="roleLoading"></Spin>
              <p slot="title">用户角色</p>
              <Tree @on-select-change="selectRole" @on-check-change="checkRole" :data="roleTree" show-checkbox></Tree>
            </Card>
          </td>
          <td>
            <Card class="card" style="min-width:300px" v-if="selectNodes.length>0">
              <Spin size="large" fix v-if="permissionLoading"></Spin>
              <p slot="title">{{permissionTitle}}权限</p>
              <a href="#" slot="extra" @click.prevent="deleteRole">
                <Icon type="ios-close-empty"></Icon>
                删除角色
              </a>
              <Tree @on-check-change="checkPermission" :data="permissionTree" show-checkbox></Tree>
            </Card>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal :mask-closable="false" v-model="showRoleAdd" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加新角色</span>
      </p>
      <Form ref="roleData" :model="roleData" :rules="ruleRoleData" label-position="top">
        <FormItem label="角色" prop="code">
          <i-input v-model="roleData.code"></i-input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" long :loading="addRoleLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import rbacUtil from "../../api/rbac";
export default {
  props: {
    userId: String
  },
  data() {
    return {
      roleTree: [],
      permissionTree: [],
      selectNodes: [],
      roleLoading: false,
      permissionLoading: false,
      showRoleAdd: false,
      addRoleLoading: false,
      roleData: {
        code: ""
      },
      ruleRoleData: {
        code: [
          {
            validator(rule, value, callback) {
              if (value === "") {
                callback(new Error("请输入角色"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      rulePermissionData: {
        code: [
          {
            validator(rule, value, callback) {
              if (value === "") {
                callback(new Error("请输入权限"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    permissionTitle() {
      return this.selectNodes.length > 0 ? this.selectNodes[0].value.name : "";
    }
  },
  methods: {
    getRoles() {
      return rbacUtil.getRoles();
    },
    getUserRoles(id) {
      return rbacUtil.getUserRoles({
        id: id
      });
    },
    getPermissions() {
      return rbacUtil.getPermissions();
    },
    getRolePermissions(code) {
      return rbacUtil.getRolePermissions({
        code: code
      });
    },
    editUserRoles(id, roles) {
      return rbacUtil.editUserRoles({
        id,
        roles
      });
    },
    editRolePermissions(code, permissions) {
      return rbacUtil.editRolePermissions({
        code,
        permissions
      });
    },
    selectRole(nodes) {
      this.selectNodes = nodes.filter(o => o.value);
      if (this.selectNodes.length > 0) {
        this.getPermissionTree();
      }
    },
    checkRole(nodes) {
      this.roleLoading = true;
      this.editUserRoles(
        this.userId,
        nodes.filter(o => o.value).map(o => {
          return {
            code: o.value.code,
            name: o.value.name
          };
        })
      )
        .then(() => {})
        .catch(e => {
          this.$Message.error(e.message);
        })
        .then(() => {
          this.roleLoading = false;
        });
    },
    checkPermission(nodes) {
      this.permissionLoading = true;
      this.editRolePermissions(
        this.selectNodes[0].value.code,
        nodes.filter(o => o.value).map(o => o.value)
      )
        .then(() => {})
        .catch(e => {
          this.$Message.error(e.message);
        })
        .then(() => {
          this.permissionLoading = false;
        });
    },
    async getRoleTree() {
      this.roleLoading = true;
      try {
        var roles = await this.getRoles();
        var userRoles = await this.getUserRoles(this.userId);
        let tree = [
          {
            title: "角色",
            disabled: true,
            expand: true,
            render: (h, { root, node, data }) => {
              return h(
                "span",
                {
                  class: {
                    "ivu-tree-title": true
                  }
                },
                [
                  h("span", data.title),
                  h("Button", {
                    domProps: {
                      innerHTML: "添加角色"
                    },
                    props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: this.addRole
                    }
                  })
                ]
              );
            },
            children: roles.data.list.map(o => {
              let node = {
                title: o.name,
                value: o,
                checked: userRoles.data.list.some(ur => {
                  return ur.sys_role_code == o.code;
                })
              };
              if (this.selectNodes.length > 0) {
                node.selected = this.selectNodes[0].value.code == o.code;
              }
              return node;
            })
          }
        ];
        this.roleTree = tree;
      } catch (e) {
        this.$Message.error(e.message);
      }

      this.roleLoading = false;
    },
    async getPermissionTree() {
      let code = this.selectNodes[0].value.code;
      this.permissionLoading = true;
      try {
        var permissions = await this.getPermissions();
        var rolePermissions = await this.getRolePermissions(code);
        let tree = [
          {
            title: "权限",
            disabled: true,
            expand: true,
            render: (h, { root, node, data }) => {
              return h(
                "span",
                {
                  class: {
                    "ivu-tree-title": true
                  }
                },
                [h("span", data.title)]
              );
            },
            children: permissions.data.list.map(o => {
              return {
                title: o,
                value: o,
                checked: rolePermissions.data.list.some(ur => {
                  return ur.permission == o;
                }),
                render: (h, { root, node, data }) => {
                  return h(
                    "span",
                    {
                      class: {
                        "ivu-tree-title": true
                      }
                    },
                    [h("span", data.title)]
                  );
                }
              };
            })
          }
        ];
        this.permissionTree = tree;
      } catch (e) {
        this.$Message.error(e.message);
      }

      this.permissionLoading = false;
    },
    addRole() {
      this.roleData.code = "";
      this.showRoleAdd = true;
    },
    submitRole() {
      this.$refs.roleData.validate(valid => {
        if (valid) {
          this.addRoleLoading = true;
          rbacUtil
            .editRole({
              code: this.roleData.code,
              name: this.roleData.code
            })
            .then(() => {
              this.showRoleAdd = false;
              this.getRoleTree();
            })
            .catch(e => {
              this.$Message.error(e.message);
            })
            .then(() => {
              this.addRoleLoading = false;
            });
        }
      });
    },
    deleteRole() {
      this.$Modal.confirm({
        title: "删除确认",
        content:
          "<p>是否确认删除(" + this.selectNodes[0].value.name + ")角色</p>",
        loading: true,
        onOk: () => {
          rbacUtil
            .removeRole({
              code: this.selectNodes[0].value.code
            })
            .then(() => {
              this.$Modal.remove();
              this.selectNodes = [];
              this.getRoleTree();
            })
            .catch(e => {
              this.$Modal.remove();
              this.$Message.error(e.message);
            });
        }
      });
    }
  },
  mounted() {
    this.getRoleTree();
  }
};
</script>

<style>
[user-role-tree] card {
  min-height: 200px;
  position: relative;
}

[user-role-tree] .edit-table td {
  vertical-align: top;
  padding-top: 12px;
  padding-right: 12px;
  background-color: transparent;
  border: none;
}
</style>

