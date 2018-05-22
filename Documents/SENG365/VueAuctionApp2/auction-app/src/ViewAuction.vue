<template>
  <div>
    <div class="auctionInfo">
      <h1>{{ auction.title }}</h1>
      <h3>{{ auction.description }}</h3>
      <div v-if="isLoggedIn"> Listed by <a v-on:click="showUserInfo(auction.seller.username)">{{ auction.seller.username }}</a></div>
      <div v-else>Listed by {{ auction.seller.username }}</div>

      <img :src="'http://localhost:4941/api/v1/auctions/' + this.auctionId + '/photos'"><br><br>

      <div v-if="auctionEnded">
        This auction started at {{ auctionStartDate }} <br><br>
        This auction ended at {{ auctionEndDate }} <br><br>
        <div v-if="ifBids">
          <div v-if="reserveMet">
            <div v-if="isLoggedIn"> This auction was won by <a v-on:click="showUserInfo(currentBid.buyerUsername)">{{ currentBid.buyerUsername }}</a> with a bid of ${{ currentBid.amount }}</div>
            <div v-else>This auction was won by {{ currentBid.buyerUsername }} with a bid of ${{ currentBid.amount }}</div>
          </div>
          <div v-else>
            The reserve for this auction was not met.<br><br>
          </div>

          <h3>Bid History:</h3>
          <div v-for="bid in bids">
            <div v-if="isLoggedIn">${{ bid.amount }} placed by <a v-on:click="showUserInfo(bid.buyerUsername)">{{ bid.buyerUsername }}</a> on {{ bid.datetime }}<br></div>
            <div v-else>${{ bid.amount }} placed by {{ bid.buyerUsername }} on {{ bid.datetime }}<br><br></div>
          </div>

        </div>
        <div v-else>
          This auction ended with no bids, I guess one person's trash, in this case, was also another person's trash.<br><br>
        </div>
      </div>

      <div v-else>
        <div v-if="auctionStarted">
          This auction started at {{ auctionStartDate }} <br>
          This auction will end at {{ auctionEndDate }} <br><br>
          <div v-if="reserveMet">The reserve of ${{ auction.reservePrice }} has been met.</div>
          <div v-else>The reserve price is ${{ auction.reservePrice }}<br></div>
          <div v-if="ifBids">
            <div v-if="isLoggedIn">Current Bid: ${{ currentBid.amount }} placed by <a v-on:click="showUserInfo(currentBid.buyerUsername)">{{ currentBid.buyerUsername }}</a><br><br></div>
            <div v-else>Current Bid: ${{ currentBid.amount }} placed by {{ currentBid.buyerUsername }}<br><br></div>
            <div v-if="isLoggedIn">One-up <a v-on:click="showUserInfo(currentBid.buyerUsername)">{{ currentBid.buyerUsername }}</a> and place a bid: <input type="number" v-model="placeBidAmount" step="0.50">  <button type="button" v-on:click="placeBid()" value="Place bid">Place bid</button></div>
            <div v-else>
              One up {{ currentBid.buyerUsername }} and place a bid: <input type="number" v-model="placeBidAmount" step="0.50">
              <button type="button" v-on:click="placeBid()" value="Place bid">Place bid</button>
            </div>

            <h3>Bid History:</h3>
            <div v-for="bid in bids">
              <div v-if="isLoggedIn">${{ bid.amount }} placed by <a v-on:click="showUserInfo(bid.buyerUsername)">{{ bid.buyerUsername }}</a> on {{ bid.datetime }}</div>
              <div v-else>${{ bid.amount }} placed by {{ bid.buyerUsername }} on {{ bid.datetime }}<br><br></div>
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
          The starting bid will be ${{ auction.startingBid }}<br>
          The reserve price is ${{ auction.reservePrice }}<br><br>
          <div v-if="myAuction">
            <router-link :to="{ name: 'editauction', params: { auctionId: this.$route.params.auctionId }}">Edit</router-link>
          </div>
        </div>
      </div>

      <br>
      <div v-if="viewUser">
        <p v-if="showMyDetails">
          Username: {{ myInfo.username }}<br>
          First name: {{ myInfo.givenName }}<br>
          Last name: {{ myInfo.familyName }}<br>
          Email: {{ myInfo.email }}<br>
          Account balance: {{ myInfo.accountBalance }}<br>
        </p>

        <p v-else>
          Username: {{ userInfo.username }}<br>
          First name: {{ userInfo.givenName }}<br>
          Last name: {{ userInfo.familyName }}<br>
        </p>
        <button type="button" v-on:click="hideUserDetails()" value="Hide">Hide</button>
      </div>

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
            isLoggedIn: false,
            users: [],
            auctionId: null,
            showMyDetails: false,
            viewUser: false,
            myInfo: null,
            userInfo: null,
            reserveMet: false
          }
      },

      mounted: function() {
          this.setAuctionId();
          this.getAuction();
          this.getAuctionBids();
          this.checkLogin();
      },

      methods: {

          getAuction: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.auctionId)
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
                  this.getUsers([this.auction.seller.id]);
              }, function (error) {
                console.log(error);
              });
          },

          getAuctionBids: function() {
            this.$http.get("http://localhost:4941/api/v1/auctions/" + this.auctionId + "/bids")
              .then(function (response) {
                let bidder_ids = [];
                if (response.data.length > 0) {
                  for (let i = response.data.length - 1; i >= 0; i--) {
                    response.data[i].datetime = new Date(response.data[i].datetime).toString();
                    response.data[i].amount = response.data[i].amount / 100;
                    this.bids.push(response.data[i]);
                    bidder_ids.push(response.data[i].buyerId);
                  }
                  console.log(this.bids);
                  this.currentBid = this.bids[0];
                  console.log(this.currentBid.amount, this.auction.reservePrice);
                  if (this.currentBid.amount > this.auction.reservePrice || typeof(this.auction.reservePrice) === "undefined") {
                    this.reserveMet = true;
                  }
                  this.ifBids = true;
                }
                this.getUsers(bidder_ids);
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
            // } else if (this.auction.seller.id == localStorage.getItem("userId")) {
            //   alert("You can't bid on your own auction, you nong");
            //   placeBid = false;
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
              this.$http.post("http://localhost:4941/api/v1/auctions/" + this.auctionId + "/bids?amount=" + amountToCents, {},
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

        setAuctionId: function() {
          if (this.$route.params.auctionId) {
            localStorage.setItem("auctionId", this.$route.params.auctionId);
            this.auctionId = localStorage.getItem("auctionId");
          } else if (localStorage.getItem("auctionId")) {
            this.auctionId = localStorage.getItem("auctionId");
          } else {
            alert("You got here illegally, shame on you");
          }
        },

        checkLogin: function() {
          if (localStorage.getItem("authToken")) {
            this.isLoggedIn = true;
          }
        },

        getUsers: function(user_ids) {

            for (var i = 0; i < user_ids.length; i++) {
              if (user_ids[i] == localStorage.getItem("userId")) {
                this.$http.get("http://localhost:4941/api/v1/users/" + user_ids[i],
                  {
                    headers: {
                      'X-Authorization': localStorage.getItem("authToken")
                    }
                  }).then(function (response) {
                  this.myInfo = response.data;
                }, function (error) {
                  console.log(error);
                });
              } else {
                this.$http.get("http://localhost:4941/api/v1/users/" + user_ids[i],
                  {
                    headers: {
                      'X-Authorization': localStorage.getItem("authToken")
                    }
                  })
                  .then(function (response) {
                    this.users.push(response.data);
                  }, function (error) {
                    console.log(error);
                  });
              }
            }
        },

        showUserInfo: function(username) {
            console.log(username, localStorage.getItem("username"));
            if (username == localStorage.getItem("username")) {
              console.log("yeet");
              this.showMyDetails = true;
              this.viewUser = true;
            } else {
              for (var i = 0; i < this.users.length; i++) {
                if (username == this.users[i].username) {
                  this.userInfo = this.users[i];
                  this.viewUser = true;
                }
              }
            }
        },

        hideUserDetails: function() {
            this.viewUser = false;
        }
      }
    }
</script>

<style scoped>

</style>
