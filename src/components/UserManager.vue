<template>
  <div user-manager v-permissions="['rbac']">
    <h1>用户管理</h1>
    <div>
      <div style="width:200px;display:inline-block;">
        <i-input @on-enter="filterUser" v-model="filterKey">
          <Button slot="append" @click="filterUser" icon="ios-search"></Button>
        </i-input>
      </div>
      <div style="display:inline-block;">
        <div style="display:table;">
          <Button type="primary" @click="addUser">添加用户</Button>
        </div>
      </div>
      <div style="display:inline-block;">
        <div style="display:table;">
          <Button type="primary" @click="getUsers">刷新</Button>
        </div>
      </div>
    </div>
    <Table :columns="userColumns" :data="list" :loading="loading"></Table>
    <Page @on-change="changePage" @on-page-size-change="changeSize" :total="total" size="small" show-sizer show-elevator></Page>
    <Modal :mask-closable="false" v-model="showUserEdit" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>修改密码</span>
      </p>
      <Form ref="userData" :model="userData" :rules="ruleUserData" label-position="top">
        <FormItem label="account" prop="account">
          <i-input :disabled="!!userData.id" v-model="userData.account"></i-input>
        </FormItem>
        <FormItem v-if="!!userData.id" label="password" prop="password">
          <i-input placeholder="新密码" v-model="userData.password"></i-input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" long :loading="editUserLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import rbacUtil from "../api/rbac";
import UserRolePermissionTree from "./extends/UserRolePermissionTree";

export default {
  name: "UserManager",
  components: {
    UserRolePermissionTree
  },
  data() {
    return {
      total: 0,
      page: 0,
      count: 10,
      list: [],
      userColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(UserRolePermissionTree, {
              props: {
                userId: params.row.id
              }
            });
          }
        },
        {
          title: "账号",
          key: "account"
        },
        {
          title: "密码",
          key: "password"
        },
        {
          title: "创建时间",
          key: "created_at"
        },
        {
          title: "更新时间",
          key: "updated_at"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row);
                    }
                  }
                },
                "修改密码"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      loading: false,
      filterKey: "",
      showUserEdit: false,
      editUserLoading: false,
      userData: {
        id: "",
        account: "",
        password: ""
      },
      ruleUserData: {
        account: [
          {
            validator(rule, value, callback) {
              if (value === "") {
                callback(new Error("请输入code"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          {
            validator(rule, value, callback) {
              if (value === "") {
                callback(new Error("请输入name"));
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
  methods: {
    filterUser() {
      this.page = 0;
      this.getUsers();
    },
    changePage(page) {
      this.page = page - 1;
      this.getUsers();
    },
    changeSize(count) {
      this.page = 0;
      this.count = count;
      this.getUsers();
    },
    getUsers() {
      this.loading = true;
      rbacUtil
        .getUsers({
          page: this.page,
          count: this.count,
          filterKey: this.filterKey
        })
        .then(result => {
          this.total = result.data.total;
          this.list = result.data.list.map(o => {
            return o;
          });
        })
        .catch(e => {
          this.$Message.error(e.message);
        })
        .then(() => {
          this.loading = false;
        });
    },
    addUser() {
      this.userData.id = "";
      this.userData.account = "";
      this.userData.password = "";
      this.showUserEdit = true;
    },
    editUser(row) {
      this.userData.id = row.id;
      this.userData.account = row.account;
      this.userData.password = "";
      this.showUserEdit = true;
    },
    submitUser() {
      this.$refs.userData.validate(valid => {
        if (valid) {
          this.editUserLoading = true;
          if (this.userData.id) {
            rbacUtil
              .editUser({
                id: this.userData.id,
                password: this.userData.password
              })
              .then(() => {
                this.showUserEdit = false;
                this.getUsers();
              })
              .catch(e => {
                this.$Message.error(e.message);
              })
              .then(() => {
                this.editUserLoading = false;
              });
          } else {
            rbacUtil
              .addUser(this.userData)
              .then(() => {
                this.showUserEdit = false;
                this.getUsers();
              })
              .catch(e => {
                this.$Message.error(e.message);
              })
              .then(() => {
                this.editUserLoading = false;
              });
          }
        }
      });
    },
    deleteUser(row) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>是否确认删除(" + row.account + ")账号</p>",
        loading: true,
        onOk: () => {
          rbacUtil
            .removeUser({
              id: row.id
            })
            .then(() => {
              this.$Modal.remove();
              this.getUsers();
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
    this.getUsers();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
[user-manager] {
  position: relative;
  min-height: calc(100vh - 88px);
}
</style>
