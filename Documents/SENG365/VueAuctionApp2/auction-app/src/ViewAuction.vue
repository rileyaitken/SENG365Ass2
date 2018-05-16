<template>
  <div>
    <div class="auctionInfo">
      {{ auction.title }}
      {{ auction.description }}

      <router-link :to="{ name: 'Home'}}">Back to Home</router-link>
    </div>
  </div>
</template>

<script>
    export default {
        name: "auction",

      data: function() {
          return {
            auction: [],
            auction_photo: null
          }
      }
      mounted: function() {
          this.getAuction();
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

              this.$http.get("http://localhost:4941/api/v1/auctions/" + this,$route.params.auctionId + "/photos")
                .then(function (response) {
                  this.auction_photo = response.data;
                })
          }
      }
    }
</script>

<style scoped>

</style>
