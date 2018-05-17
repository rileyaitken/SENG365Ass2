<template>
  <div id="app">
    <header>
      <div class="heading">
        <h1 id="siteheading">eTrade: Buy and Sell</h1>
      </div>

      <div class="navigation">
        <ul>
          <li><router-link :to="{ name: 'Home'}">Home - View Auctions</router-link></li>
          <li><router-link :to="{ name: 'createauction'}">List Auction</router-link></li>
          <li><router-link :to="{ name: 'register'}">Create Account</router-link></li>
          <li>
            <div class="dropdown">
              <button v-on:click="showMyETrade()" class="dropbtn">My E-Trade</button>
              <div v-bind:class="[showDropdown ? 'show' : '', 'dropdown-content']">
                <router-link :to="{ name: 'mycurrentauctions'}">My Current Auctions</router-link>
                <router-link :to="{ name: 'mysoldauctions'}">My Sold Auctions</router-link>
                <router-link :to="{ name: 'myexpiredauctions'}">My Expired Auctions</router-link>
                <router-link :to="{ name: 'mycurrentbids'}">My Current Bids</router-link>
                <router-link :to="{ name: 'mywonauctions'}">My Won Auctions</router-link>
              </div>
            </div>
          </li>
        </ul>
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
