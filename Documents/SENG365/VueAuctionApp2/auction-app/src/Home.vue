<template>
	<div>

		<div class="searchSection">
			   <form id="searchbox" align="left" v-on:submit="getAuctions()">
           Search for an auction title: <input v-model="q" placeholder="Title" />
				  Category:
          <select v-model="currentCategory">
            <option selected="selected">Any</option>
            <option>{{ categories[0].categoryTitle }}</option>
            <option>{{ categories[1].categoryTitle }}</option>
            <option>{{ categories[2].categoryTitle }}</option>
            <option>{{ categories[3].categoryTitle }}</option>
            <option>{{ categories[4].categoryTitle }}</option>
          </select>

          Auction Status:
          <input type="radio" id="all" value="all" v-model="status" checked>
          <label for="all">All</label>
          <input type="radio" id="upcoming" value="upcoming" v-model="status">
          <label for="upcoming">Upcoming</label>
          <input type="radio" id="active" value="active" v-model="status">
          <label for="active">Active</label>
          <input type="radio" id="expired" value="expired" v-model="status">
          <label for="expired">Expired</label>
          <input type="radio" id="won" value="won" v-model="status">
          <label for="won">Won</label>

           <button type="button" v-on:click="getAuctions()" value="Search">Search</button>

			</form>
		</div>

    <br>

    <div class="auctions" v-for="auction in auctions[currentBatch]">
      <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}"><img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'" class="img-thumbnail" height="100px" width="100px"></router-link>
      <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}">{{ auction.title }}  </router-link>
      <br><br>
    </div>

    <ul class="pagination">
      <div v-for="batch in numberOfBatches">
          <li><a v-on:click="updateBatchNo(batch)" :value=batch>{{ batch }}</a></li>
      </div>
    </ul>


	</div>

</template>

<script>
	export default {
		name: "Home",
		data: function() {
			return {
				q: "Title",
				status: "",
				auctions: [],
				categories: [],
				currentCategory: "",
        numberOfBatches: [],
        currentBatch: 0
			}
		},

		mounted: function() {
			this.getCategories();
      this.getAuctions();
		},

		methods: {

		  /*resetDb: function () {
		    this.$http.post("http://localhost:4941/api/v1/reset")
          .then(function (response) {
            console.log("Reset database");
          }, function (error) {
            console.log(error);
          });*/

		   /* this.$http.post("http://localhost:4941/api/v1/resample")
          .then(function (response) {
            console.log("Resampled database");
          }, function (error) {
            console.log(error);
          });
      },*/

			getAuctions: function() {
				this.auctions = [];
        this.numberOfBatches = [];
				if (this.status === "") {
					this.status = "all";
				}
				if (this.currentCategory === "") {
					this.currentCategory = "Any";
				}

				let queryParams = "?status=" + this.status;

				if (this.q !== "Title") {
					queryParams += "&q=" + this.q;
				}

				if (this.currentCategory !== 'Any') {
					for (let i = 0; i < this.categories.length; i++) {
						if (this.categories[i].categoryTitle === this.currentCategory) {
							let categoryId = this.categories[i].categoryId;
							queryParams += "&category-id=" + categoryId.toString();
						}
					}
				}

				let query = "http://localhost:4941/api/v1/auctions" + queryParams;
				this.$http.get(query)
					.then(function (response) {
						console.log("Got auctions");
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
						}
					}, function (error) {
						console.log("Got error");
						console.log(error);
					});
			},

			getCategories: function() {
				this.$http.get("http://localhost:4941/api/v1/categories")
					.then(function(response) {

						for (let i = 0; i < response.data.length; i++) {
							this.categories.push(response.data[i]);
						}
					}, function (error) {
						console.log(error);
					});
				console.log(this.categories);
			},

      updateBatchNo: function(batchNo) {
			  this.currentBatch = batchNo;
      }
		}
	}
</script>

