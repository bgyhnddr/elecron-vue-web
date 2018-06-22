<template>
    <div main>
        <layout>
            <i-header>
                <i-menu mode="horizontal" theme="dark" active-name="1">
                    <div @click="gohome" class="layout-logo">
                        <img width="200px" src="../assets/logo.svg" alt="">
                    </div>
                    <div class="layout-nav">
                        <menu-item name="1">
                            <dropdown @on-click="dropdownClick" trigger="click" placement="bottom-start">
                                <span>
                                    {{account}}
                                    <icon type="arrow-down-b"></icon>
                                </span>
                                <dropdown-menu slot="list">
                                    <dropdown-item name="logout">登出</dropdown-item>
                                </dropdown-menu>
                            </dropdown>
                        </menu-item>
                    </div>
                </i-menu>
            </i-header>
            <layout class="content-full">
                <sider collapsible :collapsed-width="0" v-model="isCollapsed" :style="{background: '#fff'}">
                    <i-menu @on-select="select" active-name="" theme="light" width="auto" :open-names="['1']">
                        <submenu v-permissions="['rbac']" name="1">
                            <template slot="title">
                                系统管理
                            </template>
                            <menu-item name="/UserManager">用户管理</menu-item>
                        </submenu>
                    </i-menu>
                </sider>
                <layout class="content-full">
                    <i-content class="content-padding" :class="collapsedClasses">
                        <router-view/>
                    </i-content>
                </layout>
            </layout>
        </layout>
    </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return { isCollapsed: false };
  },
  computed: {
    account() {
      return this.$store.state.userInfo.name;
    },
    collapsedClasses: function() {
      return [this.isCollapsed ? "collapsed" : ""];
    }
  },
  methods: {
    select(name) {
      this.$router.replace(name);
    },
    dropdownClick(name) {
      console.log(name);
      if (name == "logout") {
        this.logout();
      }
    },
    gohome() {
      this.$router.replace("/");
    },
    logout() {
      this.$store.commit("logout");
      this.$router.replace("/Login");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
[main] .layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

[main] .layout-logo {
  width: 100px;
  height: 30px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 12px;
  left: 20px;
}

[main] .layout-nav {
  width: 120px;
  margin: 0 auto;
  margin-right: 20px;
}

[main] .content-full {
  height: calc(100vh - 64px);
}

[main] .content-padding {
  padding: 12px;
}

[main] .content-padding.collapsed {
  padding: 45px;
}
</style>
