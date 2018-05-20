<template>
  <div id="app">
    <header>
      <div class="heading">
        <h1 id="siteheading">eTrade: Buy and Sell</h1>
      </div>

      <div class="navigation">
        <ul>
          <li><router-link :to="{ name: 'Home'}">Home - View Auctions</router-link></li>
          <li v-if="isLoggedIn"><router-link :to="{ name: 'createauction'}">List Auction</router-link></li>
          <li v-if="isLoggedIn">
            <div class="dropdown">
              <button v-on:click="showMyETrade()" class="dropbtn">My E-Trade</button>
              <div v-bind:class="[showDropdown ? 'show' : '', 'dropdown-content']">
                <router-link :to="{ name: 'Home', params: { myCurrent: true }}">My Current Auctions</router-link><br>
                <router-link :to="{ name: 'Home', params: { mySold: true }}">My Sold Auctions</router-link><br>
                <router-link :to="{ name: 'Home', params: { myExpired: true }}">My Expired Auctions</router-link><br>
                <router-link :to="{ name: 'Home', params: { myBids: true }}">My Current Bids</router-link><br>
                <router-link :to="{ name: 'Home', params: { myWon: true }}">My Won Auctions</router-link><br>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="loginSection">
        <div v-if="isLoggedIn">
          You are logged in.
          <button type="button" v-on:click="logout()" value="Logout">Logout</button>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myInfoModal">View Your Details</button>
        </div>

        <div v-else>
          You are not logged in. <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal">Login</button>
          <button type="button" class="btn btn-register" data-toggle="modal" data-target="#registerModal">Create Account</button>

          <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="loginModalLabel">Login</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                      Username: <input type="text" v-model="username" name="username" value="Enter username"><br>
                      Email:      <input type="text" v-model="email" name="email" value="Enter email"><br>
                      Password: <input type="password" v-model="password" name="password" value="Enter password"><br>
                      <button type="button" v-on:click="validateLogin()" value="Login" data-dismiss="modal">Login</button>
                    </form>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-closelogin" data-dismiss="modal">Close login view</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="myInfoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="infoModalLabel">Your Details</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div v-if="editBool">
                    Enter first name: <input type="text" v-model="firstName" name="firstName" value="Enter first name"><br>
                    Enter last name: <input type="text" v-model="lastName" name="firstName" value="Enter first name"><br>
                    <button type="button" v-on:click="editUser()" value="Submit changes" data-dismiss="modal">Submit changes</button>
                    <button type="button" v-on:click="toggleEdit()" value="Cancel">Cancel</button>
                  </div>
                  <div v-else>
                    Email: {{ user.email }}<br>
                    Username: {{ user.username }}<br>
                    First name: {{ user.givenName }}<br>
                    Last name: {{ user.familyName }}<br>
                    Account balance: {{ user.accountBalance }}
                    <button type="button" v-on:click="toggleEdit()" value="Edit Details">Edit Details</button>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-closeinfo" data-dismiss="modal">Close your details</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="registerModalLabel">Create Account</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="registerForm" >
                    First name: <input type="text" v-model="firstName" name="regFName"><br>
                    Last name: <input type="text" v-model="lastName" name="regLName"><br>
                    Username: <input type="text" v-model="username" name="username" value="Enter username"><br>
                    Email: <input type="text" v-model="email" name="email" value="Enter email"><br>
                    Password: <input type="password" v-model="password" name="password" value="Enter password"><br>
                    <input type="button" v-on:click="validateRegister()" value="Register" data-dismiss="modal"/>
                  </form>
                </div>
                <div class="modal-footer">
                  <p v-if="registerErr">{{ errorMsg }}</p>
                  <button class="btn btn-closeregister" data-dismiss="modal">Close register view</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </header>
    <router-view></router-view>
    <footer>
      <div class="footer">
        <h3 id="siteinfo">eTrade -- 2018, all rights reserved, yadda yadda yadda</h3>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        isLoggedIn: false,
        user: "",
        showDropdown: false,
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        registerErr: "",
        errorMsg: "",
        editBool: false
      }
    },

    mounted: function() {
      this.checkLogin();
    },

    methods: {

      showMyETrade: function () {
        this.showDropdown = !this.showDropdown;
      },

      validateLogin: function() {
        let login = true;
        if (this.username === "" && this.email === "") {
          alert("Please enter in username and/or email");
          login = false;
        } else if (this.password === "") {
          alert("Please enter in a password");
          login = false;
        } else if (this.validateEmail(this.email) === false && this.username === "") {
          alert("Please enter in a valid email.");
          login = false;
        }
        if (login) {
          this.login(this.username, this.email, this.password);
        }
        this.username = "";
        this.firstName = "";
        this.email = "";
        this.lastName = "";
        this.password = "";
      },

      login: function(username, email, password) {
        this.$http.post("http://localhost:4941/api/v1/users/login", JSON.stringify(
          {
            "username": username,
            "email": email,
            "password": password
          })).then(function (response) {
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("authToken", response.data.token);
            console.log(localStorage.getItem("authToken"));
            this.isLoggedIn = true;
            this.$http.get("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), {},
              {
                headers: {
                  'X-Authorization': localStorage.getItem("authToken")
                }
              }).then(function(response) {
                this.user = response.data;
            }, function (error) {
                console.log(error);
            });
            console.log("Logged in");
        }, function (error) {
          console.log(error);
        });
      },

      validateEmail: function(email) {
        let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (re.test(email)) {
          return true;
        } else {
          return false;
        }
      },

      validateRegister: function() {
        let register = true;
        if (this.email === "" || this.validateEmail(this.email) === false) {
          alert("Please enter in a valid email");
          register = false;
        } else if (this.username === "") {
          alert("Please enter a username");
          register = false;
        } else if (this.firstName === "" || this.lastName === "") {
          alert("Please enter in both a first name and a last name");
        } else if (this.password === "") {
          alert("Please enter in a password");
        }
        if (register) {
          this.register(this.firstName, this.lastName, this.username, this.email, this.password);
        }
        this.username = "";
        this.firstName = "";
        this.email = "";
        this.lastName = "";
        this.password = "";
      },

      register: function(fName, lName, user, email, pw) {
        this.$http.post("http://localhost:4941/api/v1/users", JSON.stringify(
          {
            "username": user,
            "givenName": fName,
            "familyName": lName,
            "email": email,
            "password": pw
          }
        )).then(function (response) {
          this.login(user, email, pw);
          this.registerErr = false;
        }, function (error) {
          console.log(error);
          this.registerErr = true;
          this.errorMsg = "Username/email already taken";
        });
      },

      logout: function() {
        let authToken = localStorage.getItem("authToken");
        this.$http.post("http://localhost:4941/api/v1/users/logout", {}, {
          headers: {
            "X-Authorization": authToken
          }
        }).then(function (response) {
          alert("You have been logged out.");
          this.isLoggedIn = false;
          localStorage.removeItem("authToken");
          localStorage.removeItem("id");
        }, function (error) {
          alert("There was an error logging out.");
          console.log(error);
        });
      },

      checkLogin: function() {
        if (localStorage.getItem("authToken")) {
          this.isLoggedIn = true;
        }
      },

      editUser: function() {
        let authToken = localStorage.getItem("authToken");
        let id = localStorage.getItem("userId");
        this.$http.patch("http://localhost:4941/api/v1/users/" + id,
          JSON.stringify({
            "givenName": this.firstName,
            "familyName": this.lastName
          }), {
          headers: {
            "X-Authorization": authToken
          }
        }).then(function (response) {
          alert("Changes made successfully");
        }, function (error) {
          alert("There was an error changing your details");
          console.log(error);
        });
        this.username = "";
        this.firstName = "";
        this.email = "";
        this.lastName = "";
        this.password = "";
      },

      toggleEdit: function() {
        this.editBool = !this.editBool;
      }
    }
  }
</script>
