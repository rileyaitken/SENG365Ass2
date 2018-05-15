<template>
	<div class="container">

		<div class="navigation">
			<ul>
				<li><router-link :to="{ name: 'Home'}">Home - View Auctions</router-link></li>
				<li><router-link :to="{ name: 'createauction'}">List Auction</router-link></li>
				<li><router-link :to="{ name: 'register'}">Create Account</router-link></li>
				<li>
					<div class="dropdown">
						<button onclick="showMyETrade()" class="dropbtn">My E-Trade</button>
						<div id="accDetails" class="dropdown-content">
							<router-link :to="{ name: 'mycurrentauctions'}">My Current Auctions</router-link>
							<router-link :to="{ name: 'mysoldauctions'}">My Sold Auctions</router-link>
							<router-link :to="{ name: 'myexpiredauctions'}">My Expired Auctions</router-link>
							<router-link :to="{ name: 'mycurrentbids'}">My Current Bids</router-link>
							<router-link :to="{ name: 'mywonauctions'}">My Won Auctions</router-link>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<div class="searchSection">
			<form id="searchbox" align="left" v-on:submit="getAuctions()">
				<input v-model="q" placeholder="Title" />
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

				<button type="button" v-on:click="getAuctions()" value="Search" />

			</form>
		</div>

		<div v-if="isLoggedIn">
			You are logged in as {{ this.showUser }}
			<button type="button" v-on:click="logout()" value="Logout">Logout</button>
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
              <div v-if="isLoggedIn">
                <form id="loginForm">
                  Username: <input type="text" v-model="username" name="username" value="Enter username"><br>
                  Email:      <input type="text" v-model="email" name="email" value="Enter email"><br>
                  Password: <input type="password" v-model="password" name="password" value="Enter password"><br>
                  <button type="button" v-on:click="validateLogin()" value="Login" data-dismiss="modal">Login</button>
                  <div class="alert alert-success alert-dismissable fade" role="alert">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">Close</button>
                    <strong>Login successful</strong>
                  </div>
                </form>
              </div>

              <div v-else>
                <form id="loginForm">
                  Username: <input type="text" v-model="username" name="username" value="Enter username"><br>
                  Email:      <input type="text" v-model="email" name="email" value="Enter email"><br>
                  Password: <input type="password" v-model="password" name="password" value="Enter password"><br>
                  <button type="button" v-on:click="validateLogin()" value="Login" data-dismiss="modal">Login</button>
                </form>
              </div>

						</div>
						<div class="modal-footer">
							<button class="btn btn-closelogin" data-dismiss="modal">Close login view</button>
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
							<form id="registerForm" v-on:submit="validateRegister()">
								First name: <input type="text" v-model="firstName" name="regFName"><br>
								Last name: <input type="text" v-model="lastName" name="regLName"><br>
								Username: <input type="text" v-model="username" name="username" value="Enter username"><br>
								Email: <input type="text" v-model="email" name="email" value="Enter email"><br>
								Password: <input type="password" v-model="password" name="password" value="Enter password"><br>
								<input type="submit" value="Login" />
							</form>
						</div>
						<div class="modal-footer">
							<button class="btn btn-closeregister" data-dismiss="modal">Close register view</button>
						</div>
					</div>
				</div>
			</div>

		</div>

		<div id="auctions">
			<table>
				<tr v-for="auction in auctions">
					<td>{{ auction[0] }}</td>
				</tr>
			</table>
		</div>

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
				username: "",
				password: "",
				email: "",
				firstName: "",
				lastName: "",
				isLoggedIn: false,
				showUser: "",
			}
		},

		mounted: function() {
			this.getCategories();
			this.getAuctions();
		},

		methods: {

			getAuctions: function() {
				this.auctions = [];
				console.log("Yyeetttt");
				console.log(this.q);

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

				console.log(this.currentCategory);
				console.log(this.status);

				if (this.currentCategory !== 'Any') {
					for (let i = 0; i < this.categories.length; i++) {
						if (this.categories[i].categoryTitle === this.currentCategory) {
							let categoryId = this.categories[i].categoryId;
							queryParams += "&category-id=" + categoryId.toString();
						}
					}
				}

				let query = "http://localhost:4941/api/v1/auctions" + queryParams;
				console.log(query);
				this.$http.get(query)
					.then(function (response) {
						console.log("Got auctions");
						for (var i = 0; i < response.data.length; i++) {
							let auction = [response.data[i].title];
							this.$http.get("http://localhost:4941/api/v1/auctions/" + response.data[i].id + "/photos")
								.then(function (photo_response) {
									auction.push(photo_response);
								}, function (error) {
									console.log(error);
								});
							this.auctions.push(auction);
						}
					}, function (error) {
						console.log("Got error");
						console.log(error);
					});
				console.log(this.auctions);
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
						this.isLoggedIn = true;
						this.showUser = username;
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
					let success = this.register(this.firstName, this.lastName, this.username, this.email, this.password);
					if (success === false) {
						alert("Username/email are already taken");
					}
				}
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
						return true;
				}, function (error) {
						console.log(error);
						return false;
				});
			},

			logout: function() {
				let authToken = localStorage.getItem("authToken");
				this.$http.post("http://localhost:4941/api/v1/users/logout", {
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
			}
		}
	}
</script>

