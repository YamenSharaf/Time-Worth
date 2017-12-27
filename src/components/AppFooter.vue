<template>
  <footer class="footer">
    <div class="container">
      <span class="text-muted">
        {{getCurrentYear}} All rights reserved to Yamen Sharaf
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'app-footer',
  computed: {
    getCurrentYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../sass/base/_vars.scss';

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: $color-white;
}
</style>

