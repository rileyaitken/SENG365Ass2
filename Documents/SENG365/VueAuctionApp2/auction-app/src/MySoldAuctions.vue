<template>
  <div class="myETradeAuctions">
    <br>

    <div v-if="ifAuction">
      <div class="auctions" v-for="auction in auctions[currentBatch]">
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}"><img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'"></router-link>
        <router-link :to="{ name: 'auction', params: { auctionId: auction.id, isSold: true }}">{{ auction.title }}  </router-link><br>
        <br><br>
      </div>

      <div class="viewBatches" v-for="batch in numberOfBatches">
        <button id="button" type="button" v-on:click="updateBatchNo(batch)" :value=batch>{{ batch }}</button>
      </div>
    </div>

    <div v-else>
      You have not sold any auctions as of yet.
    </div>

  </div>
</template>

<script>
    export default {
        name: "MySoldAuctions",

      data: function() {
        return {
          auctions: [],
          ifAuction: false,
          numberOfBatches: [],
          currentBatch: 0
        }
      },

      mounted: function() {
        this.getMySoldAuctions();
      },

      methods: {
        getMySoldAuctions: function() {
          this.auctions = [];
          this.numberOfBatches = [];
          let queryParams = "?status=won&seller=" + localStorage.getItem("userId");
          this.$http.get("http://localhost:4941/api/v1/auctions" + queryParams)
            .then(function (response) {
              if (response.data.length > 0) {
                this.ifAuction = true;
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
