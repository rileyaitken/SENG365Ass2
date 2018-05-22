<template>
  <div class="myCurrentAuctions">
    <br>

    <div v-if="ifAuction">
      <div class="auctions" v-for="auction in auctions[currentBatch]">
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}"><img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'"></router-link>
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id, isExpired: true }}">{{ auction.title }}  </router-link>
        <br><br>
      </div>

      <div class="viewBatches" v-for="batch in numberOfBatches">
        <button id="button" type="button" v-on:click="updateBatchNo(batch)" :value=batch>{{ batch }}</button>
      </div>
    </div>

    <div v-else>
      You haven't won any auctions yet, gummon
    </div>
  </div>
</template>

<script>
    export default {
        name: "MyWonAuctions",

      data: function() {
        return {
          auctions: [],
          numberOfBatches: [],
          currentBatch: 0,
          ifAuction: true
        }
      },

      mounted: function() {
        this.getMyWonAuctions();
      },

      methods: {

        getMyWonAuctions: function() {
          this.auctions = [];
          this.numberOfBatches = [];
          console.log(localStorage.getItem("userId"));
          let queryParams = "?status=won&winner=" + localStorage.getItem("userId");
          console.log(queryParams);
          this.$http.get("http://localhost:4941/api/v1/auctions" + queryParams)
            .then(function (response) {
              if (response.data.length === 0) {
                this.ifAuction = false;
              }
              let numBatches = response.data.length / 5;
              for (var i = 0; i < numBatches; i++) {
                this.auctions.push([]);
                this.numberOfBatches.push(i);
              }
              let batchNo = 0;
              for (var i = 0; i < response.data.length; i++) {
                if (i % 5 === 0 && i !== 0) {
                  batchNo++;
                }
                this.auctions[batchNo].push(response.data[i]);
                console.log(batchNo);
              }
              console.log(this.auctions[0])
            }, function (error) {
              console.log("Got error");
              console.log(error);
            });
          console.log(this.auctions);
        },

        updateBatchNo: function(batchNo) {
          this.currentBatch = batchNo;
        }
      }
    }
</script>

<style scoped>

</style>
