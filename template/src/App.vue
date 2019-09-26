<template>
  <div id="app">
    <h2>Vue Project Template</h2>
    <img :src="logo" alt="" />
    <!-- 雪碧图 -->
    <ul>
      <li class="ico ico-s1"></li>
      <li class="ico ico-s2"></li>
      <li class="ico ico-s3"></li>
      <li class="ico ico-s4"></li>
    </ul>
    {{#router}}
    <router-view />
    {{/router}}
  </div>
</template>

<script>
// /* eslint-disable */ 整个文件禁止规则的使用
import logo from './assets/logo.png';

export default {
  name: 'App',
  data() {
    return {
      logo
    };
  },
  methods: {
  }
};
</script>

<style lang="scss">
// @import "~sprite.scss";
@import "~sprite2.scss";
$fontColor: salmon;

h2 {
  display: flex;
  width: 20%;
  color: $fontColor;
  border: 1px solid yellowgreen;
  transform: rotate(340deg);
}
</style>
