<template>
    <div class="myETradeAuctions">
      <br>

      <div class="auctions" v-for="auction in auctions[currentBatch]">
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}"><img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'"></router-link>
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}">{{ auction.title }}  </router-link>
        <br><br>
      </div>

      <div class="viewBatches" v-for="batch in numberOfBatches">
        <button id="button" type="button" v-on:click="updateBatchNo(batch)" :value=batch>{{ batch }}</button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "MyCurrentAuctions",

        data: function() {
          return {
            auctions: [],
            numberOfBatches: [],
            currentBatch: 0
          }
        },

      mounted: function() {
          this.getMyAuctions();
      },

      methods: {
            getMyAuctions: function() {
              this.auctions = [];
              this.numberOfBatches = [];
              let queryParams = "?seller=" + localStorage.getItem("userId");
              this.$http.get("http://localhost:4941/api/v1/auctions" + queryParams)
                .then(function (response) {
                  let currentAuctions = [];
                  for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].endDateTime > Date.now()) {
                      currentAuctions.push(response.data[i]);
                    }
                  }
                  let numBatches = currentAuctions.length / 5;
                  for (var i = 0; i < numBatches; i++) {
                    this.auctions.push([]);
                    this.numberOfBatches.push(i);
                  }
                  let batchNo = 0;
                  for (var i = 0; i < currentAuctions.length; i++) {
                    if (i % 5 === 0 && i !== 0) {
                      batchNo++;
                    }
                    this.auctions[batchNo].push(currentAuctions[i]);
                  }
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
