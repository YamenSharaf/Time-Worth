<template>
  <div id="app">
    <app-navbar/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar'
import AppFooter from './components/AppFooter'

export default {
  name: 'app',
  components: {
    'app-navbar': AppNavbar,
    'app-footer': AppFooter
  }
}
</script>

<style>

</style>
