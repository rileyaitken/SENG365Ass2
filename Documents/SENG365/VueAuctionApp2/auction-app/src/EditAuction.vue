<template>
  <div class="createContainer">
    <div v-if="idError">
      <h2>The current auction has been lost, please navigate back to the Home page and try again (do not refresh the page)</h2>
    </div>

    <div v-else>
      <div v-if="ifImage">
        <h4>Current image:</h4>
        <img height="100" width="100" :src="'http://localhost:4941/api/v1/auctions/' + this.auctionId + '/photos'"><br><br>
      </div>
      <div class="uploadPhoto">
        <input ref="image" type="file"  @change="onFileChange($event)" accept="image/*" class="input-file">
        <button type="button" v-on:click="uploadImage()" value="Upload">Upload</button>
        <button type="button" v-on:click="deleteImage()" value="Delete">Delete</button>
      </div>

      <p><b>Current title:</b> {{ auction.title }}</p> <br>
      <p><b>Current description:</b> {{ auction.description }}</p> <br>
      <p><b>Current category:</b> {{ auction.categoryTitle }}</p> <br>
      <p><b>Current starting price:</b> {{ auction.startingBid}}</p> <br>
      <p><b>Current reserve price:</b> {{ auction.reservePrice }}</p> <br>
      <p><b>Current starting date:</b> {{ auctionStartDate }}</p> <br>
      <p><b>Current ending date:</b> {{ auctionEndDate }}</p> <br>

      <h3>Make changes in the fields below:</h3>
      <div class="editForm">
        <form id="editAuction">
          Title: <input type="text" v-model="title"><br>
          Description: <input type="text" v-model="description"><br>
          Choose a category:
          <select v-model="category">
            <option selected="selected">{{ categories[0].categoryTitle }}</option>
            <option>{{ categories[1].categoryTitle }}</option>
            <option>{{ categories[2].categoryTitle }}</option>
            <option>{{ categories[3].categoryTitle }}</option>
            <option>{{ categories[4].categoryTitle }}</option>
          </select><br>
          Auction start date: <input type="date" @change="startDateSelect($event)">
          Auction start time: <input type="time" @change="startTimeSelect($event)">
          Auction end date: <input type="date" @change="endDateSelect($event)">
          Auction end time: <input type="time" @change="endTimeSelect($event)">
          Starting price: <input type="number" @change="startPriceSelect($event)" step="0.1" value="0">
          Reserve price: <input type="number" @change="reservePriceSelect($event)" step="0.1" value="0">
          <button type="button" v-on:click="validateEditListing()" value="Create Auction">Edit Auction</button>
        </form>
      </div>
    </div>

    <div v-if="updated">
      <br>Your auction has been updated. <router-link :to="{ name: 'auction', params: { auctionId: this.auctionId}}">View Your Auction</router-link>
    </div>

  </div>
</template>

<script>
    export default {
      name: "EditAuction",
      data: function () {
        return {
          selectedImage: null,
          auction: null,
          auctionStartDate: null,
          auctionEndDate: null,
          title: "",
          description: "",
          categories: [],
          category: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          startPrice: null,
          reservePrice: null,
          idError: false,
          auctionId: null,
          ifImage: true,
          updated: false
        }
      },

      mounted: function () {
        this.resetFields();
        this.setAuctionId();
        this.getCategories();
        this.getAuction();
      },

      methods: {

        resetFields: function() {
          this.startDate = "";
          this.startTime = "";
          this.endDate = "";
          this.endTime = "";
          this.title = "";
          this.description = "";
          this.selectedImage = null;
          this.startPrice = null;
          this.reservePrice = null;
          this.category = "";
        },

        startDateSelect: function(event) {
          console.log(event);
          this.startDate = event.target.value;
        },

        endDateSelect: function(event) {
          console.log(event);
          this.endDate = event.target.value;
        },

        startTimeSelect: function(event) {
          this.startTime = event.target.value;
        },

        endTimeSelect: function(event) {
          this.endTime = event.target.value;
        },

        startPriceSelect: function(event) {
          this.startPrice = event.target.value;
        },

        reservePriceSelect: function(event) {
          this.reservePrice = event.target.value;
        },

        validateEditListing: function() {

          if (this.selectedImage !== null) {
            this.uploadImage();
          }

          var jsonObj = {};
          let edit = true;

          if (this.startDate !== "") {
            if (this.startTime !== "") {
              var startDateTimeInt = Date.parse(this.startDate + "T" + this.startTime);
            } else {
              let currentTime = new Date(this.auction.endDateTime).toLocaleTimeString();
              currentTime = currentTime.slice(0, 5);
              console.log(currentTime);
              var startDateTimeInt = Date.parse(this.startDate + "T" + currentTime);
            }
            if (startDateTimeInt < Date.now()) {
              alert("Choose a start date and time combination that is sometime in the future. (If you are changing the start date to today, ensure that the start time is later than now.)");
              edit = false;
            } else {
              jsonObj.startDateTime = parseInt(startDateTimeInt);
            }
          } if (this.startTime !== "" && this.startDate === "") {
              let currentDateStr = this.getCurrentDate(this.auction.startDateTime);
              console.log(currentDate);
              var startDateTimeInt = Date.parse(currentDateStr + "T" + this.startTime);
              if (startDateTimeInt < Date.now()) {
                alert("Choose a start date and time combination that is sometime in the future. (If you are changing the start time and the start date is today, ensure that the start time is later than now.)");
                edit = false;
              } else {
                jsonObj.startDateTime = parseInt(startDateTimeInt);
              }
          } if (this.endDate !== "") {
              if (this.endTime !== "") {
                var endDateTimeInt = Date.parse(this.endDate + "T" + this.endTime);
              } else {
                let currentTime = new Date(this.auction.endDateTime).toLocaleTimeString();
                currentTime = currentTime.slice(0, 5);
                console.log(currentTime);
                var endDateTimeInt = Date.parse(this.endDate + "T" + currentTime);
              }
              if (this.startDate === "" && this.startTime === "") {
                if (endDateTimeInt <= this.auction.startDateTime) {
                  alert("Choose a end date/time combination that is later than the start date/time.");
                  edit = false;
                } else {
                  jsonObj.endDateTime = parseInt(endDateTimeInt);
                }
              } else {
                if (endDateTimeInt <= startDateTimeInt) {
                  alert("Choose a end date/time combination that is later than the start date/time.");
                  edit = false;
                } else {
                  jsonObj.endDateTime = parseInt(endDateTimeInt);
                }
              }
          } if (this.endTime !== "" && this.endDate === "") {
            let currentDateStr = this.getCurrentDate(this.auction.endDateTime);
            console.log(currentDateStr);
            var endDateTimeInt = Date.parse(currentDateStr + "T" + this.endTime);
            if (endDateTimeInt < Date.now()) {
              alert("Choose a start date and time combination that is sometime in the future. (If you are changing the start time and the start date is today, ensure that the start time is later than now.)");
              edit = false;
            } else {
              jsonObj.endDateTime = parseInt(endDateTimeInt);
            }
          }

          console.log(this.title);

          if (edit) {
            if (this.category !== "") {
              for (var i = 0; i < this.categories.length; i++) {
                if (this.category === this.categories[i].categoryTitle) {
                  jsonObj.categoryId = parseInt(this.categories[i].categoryId);
                }
              }
            } if (this.title !== "") {
              jsonObj.title = this.title;
            } if (this.description !== "") {
              jsonObj.description = this.description;
            } if (this.startPrice !== null) {
              jsonObj.startingBid = parseInt(this.startPrice);
            } if (this.reservePrice !== null) {
              jsonObj.reservePrice = parseInt(this.reservePrice);
            }

            console.log(jsonObj);

            this.$http.patch("http://localhost:4941/api/v1/auctions/" + this.auctionId, JSON.stringify(jsonObj),
              {
                headers: {
                  'X-Authorization': localStorage.getItem("authToken")
                }
              }).then(function (response) {
              console.log("Updated auction successfully");
              this.updated = true;
              this.resetFields();
            }, function (error) {
              console.log(error);
            });
          }
        },

        deleteImage: function() {
          let authToken = localStorage.getItem("authToken");
          console.log(authToken);
          this.$http.delete("http://localhost:4941/api/v1/auctions/" + this.auctionId + "/photos",
            {
              headers: {
                'X-Authorization': authToken
              }
            }
           ).then(function(response) {
              console.log("Image deleted.");
              this.ifImage = false;
          }, function (error) {
              console.log(error);
          });
        },

        uploadImage: function() {
          // this.formData = new FormData();
          // console.log(this.selectedImage.type);
          // let data = this.getRawData();
          if (this.selectedImage == null) {
            alert("Please select a jpeg or png file to upload");
          } else {
            console.log(this.auctionId);
            if (this.ifImage) {
              this.deleteImage();
            }
            let authToken = localStorage.getItem("authToken");
            this.$http.post("http://localhost:4941/api/v1/auctions/" + this.auctionId + "/photos", this.selectedImage,
              {
                emulateJSON: false,
                headers: {
                  'X-Authorization': authToken,
                  'Content-Type': this.selectedImage.type
                }
              }).then(function (response) {
                alert("Image uploaded successfully, reload the page to see the new image.");
              console.log("Uploaded image successfully");
              this.ifImage = true;
            }, function (error) {
              console.log(error);
            });
          }
          // this.formData.append('image', this.selectedImage, this.selectedImage.name);
          // console.log(this.formData);
        },

        onFileChange: function(event) {
          this.selectedImage = event.target.files[0];
          console.log(this.selectedImage.type);
          if (this.selectedImage.type != "image/jpeg" && this.selectedImage.type != "image/png" && this.selectedImage != "image/jpg") {
            alert("Please select an image of type png or jpg");
            this.reset();
          }
          console.log(this.selectedImage);
        },

        reset: function() {
          this.currentStatus = STATUS_INITIAL;
          this.uploadError = null;
        },

        getAuction: function() {
          this.$http.get("http://localhost:4941/api/v1/auctions/" + this.auctionId)
            .then(function (response) {
              this.auction = response.data;
              this.auctionStartDate = new Date(this.auction.startDateTime).toString();
              this.auctionEndDate = new Date(this.auction.endDateTime).toString();
            }, function (error) {
              console.log(error);
            });
        },

        getCategories: function () {
          this.$http.get("http://localhost:4941/api/v1/categories")
            .then(function (response) {

              for (let i = 0; i < response.data.length; i++) {
                this.categories.push(response.data[i]);
              }
            }, function (error) {
              console.log(error);
            });
        },

        setAuctionId: function() {
          if (this.$route.params.auctionId) {
            localStorage.setItem("auctionId", this.$route.params.auctionId);
            this.auctionId = localStorage.getItem("auctionId");
          } else if (localStorage.getItem("auctionId")) {
            this.auctionId = localStorage.getItem("auctionId");
          } else {
            this.idError = true;
          }
        },

        dateTimeToInteger: function(dateStr, timeStr) {
          let date = Date.parse(dateStr + "T" + timeStr + ":00+12:00");
          console.log(date, Date.now());
          return date;
        },

        getCurrentDate: function(timeInt) {
          let currentDate = new Date(timeInt).getDate().toString();
          let currentMonth = new Date(timeInt).getMonth() + 1;
          currentMonth = currentMonth.toString();
          let currentYear = new Date(timeInt).getFullYear().toString();
          let dateStr = currentYear + "-" + currentMonth + "-" + currentDate;
          return dateStr;
        }
      }
    }
</script>

<style scoped>

</style>
