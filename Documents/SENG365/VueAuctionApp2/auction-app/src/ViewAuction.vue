<template>
  <div>
    <div class="auctionInfo">
      <h1>{{ auction.title }}</h1>
      <h3>{{ auction.description }}</h3>
      <p>Listed by {{ auction.seller.username }}</p>
      <img :src="'http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos'"><br><br>

      <div v-if="auctionEnded">
        This auction started at {{ auctionStartDate }} <br>
        This auction ended at {{ auctionEndDate }} <br>
      </div>

      <div v-else>
        <div v-if="auctionStarted">
          This auction started at {{ auctionStartDate }} <br>
          This auction will end at {{ auctionEndDate }} <br><br>
          <div v-if="ifBids">Current Bid: ${{ currentBid.amount }} placed by {{ currentBid.buyerUsername }}<br>
            One-up {{ currentBid.buyerUsername }} and place a bid: <input type="number" v-model="placeBidAmount" step="0.50">
            <input button="button" v-on:click="placeBid()" value="Place bid">

            <h3>Bid History:</h3>
            <div v-for="bid in bids">
              ${{ bid.amount }} placed by {{ bid.buyerUsername }} on {{ bid.datetime }}<br>
            </div>
          </div>

          <p v-else>Get this auction crackalackin with a bid (starting price = {{ auction.startingBid }}:
            <input type="number" v-model="placeBidAmount" step="0.50">
            <input button="button" v-on:click="placeBid()" value="Place bid">
          </p>
        </div>

        <div v-else>
          This auction will start at {{ auctionStartDate }}<br>
          This auction will end at {{ auctionEndDate }}<br>
          <div v-if="myAuction">
            <router-link :to="{ name: 'editauction', params: { auctionId: this.$route.params.auctionId }}">Edit</router-link>
          </div>
        </div>
      </div>

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
            placeBidAmount: null,
            myAuction: false,
            auctionStarted: false,
            auctionEnded: false,
            auctionStartDate: "",
            auctionEndDate: "",
            currentBidAmount: null,
            isLoggedIn: false
          }
      },

      mounted: function() {
          this.getAuction();
          this.getAuctionBids();
          this.checkLogin();
      },

      methods: {

          getAuction: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId)
              .then(function (response) {
                  this.auction = response.data;
                  this.auctionStartDate = new Date(this.auction.startDateTime).toString();
                  this.auctionEndDate = new Date(this.auction.endDateTime).toString();
                  if (this.auction.seller.id == localStorage.getItem("userId")) {
                    this.myAuction = true;
                  } if (this.auction.startDateTime < Date.now()) {
                    this.auctionStarted = true;
                  } if (Date.now() > this.auction.endDateTime) {
                      this.auctionEnded = true;
                  }
              }, function (error) {
                console.log(error);
              });
          },

          getAuctionBids: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/bids")
              .then(function (response) {
                if (response.data.length > 0) {
                  for (let i = response.data.length - 1; i >= 0; i--) {
                    response.data[i].datetime = new Date(response.data[i].datetime).toString();
                    response.data[i].amount = response.data[i].amount / 100;
                    this.bids.push(response.data[i]);
                  }
                  console.log(this.bids);
                  this.currentBid = this.bids[0];
                  this.ifBids = true;
                }
              }, function(error) {
                console.log(error);
              });
          },

          placeBid: function() {
            this.checkLogin();
            let placeBid = true;
            if (this.isLoggedIn == false) {
              alert("You must be logged in to place a bid.");
              placeBid = false;
            } else if (this.ifBids) {
              console.log(this.placeBidAmount, this.currentBid.amount + 0.5);
              if (this.placeBidAmount < this.currentBid.amount + 0.5) {
                alert("You need to bid at least a value of $" + (this.currentBid.amount + 0.5).toString());
                placeBid = false;
              }
            } else if (this.placeBidAmount < this.auction.startingBid) {
              alert("You must place a bid of at least the starting price of $" + this.auction.startingBid);
              placeBid = false;
            }
            if (placeBid) {
              let amountToCents = this.placeBidAmount * 100;
              let authToken = localStorage.getItem("authToken");
              console.log(authToken);
              this.$http.post("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/bids?amount=" + amountToCents, {},
                {
                  headers: {
                    'X-Authorization': authToken
                  }
                }).then(function (response) {
                console.log("Placed bid successfully");
                alert("Bid was placed successfully");
                this.bids = [];
                this.getAuctionBids();
              }, function (error) {
                console.log(error);
              });
            }
          },

        checkLogin: function() {
          if (localStorage.getItem("authToken")) {
            this.isLoggedIn = true;
          }
        }
      }
    }
</script>

<style scoped>

</style>
