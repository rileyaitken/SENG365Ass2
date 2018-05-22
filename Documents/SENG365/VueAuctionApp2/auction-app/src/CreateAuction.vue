<template>
  <div class="createContainer">
    <h2>Create auction</h2><br>
    <div class="uploadPhoto">
      <form novalidate v-if="isInitial || isSaving">
        <h4>Upload an image for your auction</h4>
        <div class="dropbox">
          <input ref="image" type="file"  :disabled="isSaving" @change="onFileChange($event)" accept="image/*" class="input-file">
        </div>
      </form>

      <div v-if="isFailed">
        <h2>Upload was unsuccessful</h2>
        <button v-on:click="reset()">Try again</button>
      </div>
    </div>

    <br>

    <div class="createForm">
      <form id="createAuction">
        <ul>
          <li>Title: <input type="text" v-model="title" required></li><br>
          <li>Description: <input type="text" v-model="description" required></li><br>
          <li>Choose a category:
          <select v-model="category" required>
            <option selected="selected">{{ categories[0].categoryTitle }}</option>
            <option>{{ categories[1].categoryTitle }}</option>
            <option>{{ categories[2].categoryTitle }}</option>
            <option>{{ categories[3].categoryTitle }}</option>
            <option>{{ categories[4].categoryTitle }}</option>
          </select></li><br>
          <li>Auction start date: <input type="date" v-model="startDate" required></li><br>
          <li>Auction start time: <input type="time" v-model="startTime" required></li><br>
          <li>Auction end date: <input type="date" v-model="endDate" required></li><br>
          <li>Auction end time: <input type="time" v-model="endTime" required></li><br>
          <li>Starting price: $<input type="number" v-model="startPrice" step="0.1"></li><br>
          <li>Reserve price: $<input type="number" v-model="reservePrice" step="0.1"></li><br>
          <li><button type="button" v-on:click="validateCreateListing()" value="Create Auction">Create Auction</button></li>
        </ul>
      </form>
    </div>

    <div v-if="isCreated">
      <br><br>Your auction has been created successfully.
      <router-link :to="{ name: 'auction', params: { auctionId: this.auctionId}}">View Your Auction</router-link>
    </div>
  </div>
</template>

<script>

    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

    export default {
        name: "CreateAuction",
        data: function() {
          return {
            formData: null,
            currentStatus: null,
            uploadError: null,
            uploadFieldName: "Photos",
            selectedImage: null,
            title: "",
            description: "",
            categories: [],
            category: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            startPrice: 0,
            reservePrice: 0,
            isCreated: false,
            auctionId: null,
          }
        },

      mounted: function() {
          this.getCategories();
          this.reset();
        },

      computed: {
          isInitial() {
            return this.currentStatus === STATUS_INITIAL;
          },
          isSaving() {
            return this.currentStatus === STATUS_SAVING;
          },
          isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
          },
          isFailed() {
            return this.currentStatus === STATUS_FAILED;
          }
      },

      methods: {

          // startDateSelect: function(event) {
          //   console.log(event);
          //   this.startDate = event.target.value;
          // },
          //
          // endDateSelect: function(event) {
          //   console.log(event);
          //   this.endDate = event.target.value;
          // },
          //
          // startTimeSelect: function(event) {
          //   this.startTime = parseInt(event.target.value);
          // },
          //
          // endTimeSelect: function(event) {
          //   this.endTime = parseInt(event.target.value);
          // },

          // startPriceSelect: function(event) {
        //   this.startPrice = parseInt(event.target.value);
        // },
        //
        // reservePriceSelect: function(event) {
        //   this.reservePrice = parseInt(event.target.value);
        // },

          reset: function() {
            this.currentStatus = STATUS_INITIAL;
            this.uploadError = null;
          },

          uploadImage: function() {
            // this.formData = new FormData();
            // console.log(this.selectedImage.type);
            // let data = this.getRawData();
            this.currentStatus = STATUS_SAVING;
            let authToken = localStorage.getItem("authToken");
            this.$http.post("http://localhost:4941/api/v1/auctions/" + this.auctionId + "/photos", this.selectedImage,
              {
                emulateJSON: false,
                headers: {
                  'X-Authorization': authToken,
                  'Content-Type': this.selectedImage.type
                }
              }).then(function (response) {
              console.log("Uploaded image successfully");
              this.currentStatus = STATUS_SUCCESS;
            }, function (error) {
              console.log(error);
              this.currentStatus = STATUS_FAILED;
            });
              // this.formData.append('image', this.selectedImage, this.selectedImage.name);
              // console.log(this.formData);
          },

          onFileChange: function(event) {
              this.selectedImage = event.target.files[0];
              console.log(this.selectedImage.type);
              if (this.selectedImage.type != "image/jpeg" && this.selectedImage.type != "image/png") {
                alert("Please select an image of type png or jpg");
                this.reset();
              }
              console.log(this.selectedImage);
          },

        getCategories: function() {
          this.$http.get("http://localhost:4941/api/v1/categories")
            .then(function (response) {

              for (let i = 0; i < response.data.length; i++) {
                this.categories.push(response.data[i]);
              }
            }, function (error) {
              console.log(error);
            });
        },

        validateCreateListing: function() {

          if (this.startDate === "") {
            alert("Please select a starting date for your auction.");
          } else if (this.endDate === "") {
            alert("Please select an end date for your auction.");
          } else if (this.startTime === "") {
            alert("Please select a start time for your auction.");
          } else if (this.endTime === "") {
            alert("Please select an end time for your auction.");
          } else {

            let create = true;
            var startDateTime = this.dateTimeToInteger(this.startDate, this.startTime);
            var endDateTime = this.dateTimeToInteger(this.endDate, this.endTime);

            if (this.category === "") {
              alert("Please select a category for your item.");
              create = false;
            } else if (this.title === "") {
              alert("Please enter a title for your item.");
              create = false;
            } else if (this.description === "") {
              alert("Please enter a description for your item.");
              create = false;
            } else if (startDateTime < Date.now()) {
              alert("Please select a start date and end time for the auction that is in the future.");
              create = false;
            } else if (endDateTime < Date.now() || startDateTime >= endDateTime) {
              alert("Please select a end date and end time for the auction that is in the future, and that is after the specified start time.");
              create = false;
            }

            if (create) {

              let categoryId = null;
              for (let i = 0; i < this.categories.length; i++) {
                if (this.categories[i].categoryTitle === this.category) {
                  categoryId = this.categories[i].categoryId;
                }
              }

              console.log(typeof(this.startPrice), typeof(this.reservePrice));
              var startPriceCents = Math.round(this.startPrice * 100);
              var reservePriceCents = Math.round(this.reservePrice * 100);

              let authToken = localStorage.getItem("authToken");
              this.$http.post("http://localhost:4941/api/v1/auctions",
                  {
                    "categoryId": parseInt(categoryId),
                    "title": this.title,
                    "description": this.description,
                    "startDateTime": parseInt(startDateTime),
                    "endDateTime": parseInt(endDateTime),
                    "reservePrice": this.reservePrice,
                    "startingBid": startPriceCents,
                    "reservePrice": reservePriceCents
                  },
                {
                  headers: {
                    'X-Authorization': authToken
                  }
                }).then(function(response) {
                this.auctionId = response.data.id;
                if (this.selectedImage != null) {
                  this.uploadImage();
                }
                this.isCreated = true;
              }, function (error) {
                  alert("There was an error creating your auction.");
                  console.log(error);
              });
            }
          }
        },

        dateTimeToInteger: function(dateStr, timeStr) {
            console.log(dateStr, timeStr);
            let date = Date.parse(dateStr + "T" + timeStr + ":00+12:00");
            console.log(date, Date.now());
            return date;
        }
      }
    }
</script>

<style scoped>

</style>
