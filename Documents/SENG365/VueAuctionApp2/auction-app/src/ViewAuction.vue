<template>
  <div>
    <div class="auctionInfo">
      <h1>{{ auction.title }}</h1>
      <h3>{{ auction.description }}</h3>
      <p>Listed by {{ auction.seller.username }}</p>
      <img :src="'http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos'"><br>

      <p v-if="ifBids">Current Bid: {{ currentBid.amount }} placed by {{ currentBid.buyerUsername }}<br>
        One-up {{ currentBid.buyerUsername }} and place a bid: <input type="number" v-model="placeBidAmount" step="0.50">
        <input button="button" v-on:click="placeBid()" value="Place bid">
      </p>



      <router-link :to="{ name: 'Home'}">Back to Home</router-link>
    </div>
  </div>
</template>

<script>
    export default {
        name: "auction",

      data: function() {
          return {
            auction: [],
            bids: [],
            currentBid: null,
            ifBids: false,
            placeBidAmount: null
          }
      },

      mounted: function() {
          this.getAuction();
          this.getAuctionBids();
      },

      methods: {

          getAuction: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId)
              .then(function (response) {
                this.auction = response.data;
                console.log(this.auction);
              }, function (error) {
                console.log(error);
              });
          },

          getAuctionBids: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/bids")
              .then(function (response) {
                this.bids = response.data;
                if (this.bids.length > 0) {
                  this.currentBid = this.bids[this.bids.length - 1];
                  this.currentBidAmount = this.currentBid.amount;
                  this.ifBids = true;
                }
              }, function(error) {
                console.log(error);
              });
          },

          placeBid: function() {
            if (this.placeBidAmount < this.currentBid.amount + 0.5) {
              alert("You need to bid at least a value of " + (this.currentBid.amount + 0.5).toString());
              return;
            }
            let authToken = localStorage.getItem("authToken");
            this.$http.post("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/bids?amount=" + this.placeBidAmount,
              {
                headers: {
                  'X-Authorization': authToken
                }
              }).then(function (response) {
                console.log("Placed bid successfully");
                this.getAuctionBids();
            }, function (error) {
                console.log(error);
            });
          }
      }
    }
</script>

<style scoped>

</style>
