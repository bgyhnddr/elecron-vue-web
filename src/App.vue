<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
[disabled],
.ivu-select-disabled .ivu-select-selection,
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background: transparent;
}
</style>
