<template>
  <div id="app">
    <header>
      <div class="heading">
        <h1 id="siteheading">eTrade: Buy and Sell</h1>
      </div>
    </header>
    <router-view></router-view>
    <footer>
      copy
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>
