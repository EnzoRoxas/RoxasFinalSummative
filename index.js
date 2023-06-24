const express = require('express');
const app = express();

const port = 4000;
app.use(express.json());


const dateNow = new Date();
const dayNow = dateNow.getDate();
const monthNow = dateNow.getMonth();
const yearNow = dateNow.getFullYear();

const currentDate = monthNow + "/" +dayNow + "/" + yearNow;


let loggedUser;

let users = [{
	email: "ERoxas@email.com",
	password: "zman1234",
	isAdmin: false

},

{
 email:"RMoratalla@gmail.com",
 password: "jotaro1234",
 isAdmin:  false
  }, 

 {
 email: "JPalo@gmail.com",
 password: "chichi1234",
 isAdmin:  false
  }];
var products = [{
  	name: "Hygienix",
  	description: "Body Soap",
  	price: 50,
  	isActive: true,
  	createdOn: currentDate
  },
  {
  	name: "Trials of Apollo Vol. 1-2",
  	description: "Novel",
  	price: 1200,
  	isActive: true,
  	createdOn: currentDate
  }, 
  {
  	name: "Nintendo Switch",
  	description: " Gaming Console",
  	price: 16500,
  	isActive: true,
  	createdOn: currentDate
  }];

  let order = [
  {
  	userId: 333,
  	products: [{name: "Trials of Apollo Vol. 1-2",
  	description: "Novel",
  	price: 1200,
  	isActive: true,
  	createdOn: currentDate}, {name: "Hygienix",
  	description: "Body Soap",
  	price: 50,
  	isActive: true,
  	createdOn: currentDate} ],
  	totalAmount: 1250,
  	purchasedOn: currentDate
  }, 

  {
  	userId: 334,
  	products: [{name: "Nintendo Switch",
  	description: " Gaming Console",
  	price: 16500,
  	isActive: true,
  	createdOn: currentDate},{name: "Trials of Apollo Vol. 1-2",
  	description: "Novel",
  	price: 1200,
  	isActive: true,
  	createdOn: currentDate}],
  	totalAmount: 17700,
  	purchasedOn: currentDate
  }];

  let userOrder =[];


// This GET request retrieves all of the users stored.
app.get('/users', (req, res) =>{
	 res.send(users);
});

// The GET request retrieves all of the orders of the logged in User. The User must first make an order first in order to use this.
app.get('/users/takeOrder', (req, res)=>{
	if (loggedUser.isAdmin === false){
		res.send(userOrder);
	}

	else{
		res.status(401).send("Unauthorized Action.");
	}
})

// This GET request retrieves a specific order of a user. The User must first make an order in order to use this.
app.get('/users/takeOrder/:orderId', (req,res)=>{
     let orderIndex = parseInt(req.params.orderId);
     if (loggedUser.isAdmin === false ){
     	  res.send(userOrder[orderIndex]);
     	
     }

     else{
		res.status(401).send("Unauthorized Action.");
	}
});

// The GET request takes all of the orders, it is only accesible by admins.
app.get('/users/orders', (req, res) =>{
	 if (loggedUser.isAdmin === true){
         let noElement = order.filter((element)=>{
         	return element !== null
         })
         order = noElement
         res.send(order);	
	 }
	 
	 else{
	 	res.status(403).send(false);
	 }
});

// This POST request allows the registration of a new user.
app.post('/users', (req, res) =>{

  	 let newUser = {
  	 	 email: req.body.email,
         password: req.body.password,
         isAdmin:  req.body.isAdmin
  	 };

  	 users.push(newUser);
  	 console.log(users);
  	 res.status(201).send("The Account Has Been Registered!");
  });
 
 // This POST request allows a user to log in 
app.post('/users/login', (req, res) =>{

	let findUser = users.find((user)=> {
		return user.email === req.body.email && user.password === req.body.password;
	});

	if (findUser !== undefined){

		let findUserIndex = users.findIndex((user) =>{
			return user.email === findUser.email;
		});
		findUser.index = findUserIndex;
		loggedUser = findUser;
		console.log(loggedUser);
		res.status(200).send ("You Are Now Logged In.");

	}
	else{
		loggedUser = findUser;
		res.status(400).send("Login Failed, Wrong Credentials!");
	}
});


// This POST request allows the user to create an order.
app.post('/users/createOrder/:index', (req, res) =>{
	let productOrder = parseInt(req.params.index);

	if(loggedUser.isAdmin === false){
	
	let newOrder = {
    userId: req.body.userId,
  	products: [products[productOrder]],	
  	totalAmount: req.body.totalAmount,
  	purchasedOn: req.body.purchasedOn
		}

		userOrder.push(newOrder);
		order.push(newOrder);
		res.status(201).send("You Have Added A New Order.");
	}

	else{
		res.status(401).send("ERROR. Unauthorized Action.");
	}
});



// This PUT request turns the user into an admin.
app.put('/users/admin/', (req, res) =>{
       console.log(req.params);
	   console.log(req.params.index);

	   let userIndex = parseInt(req.params.index);

	   if (loggedUser.isAdmin === false){
              loggedUser.isAdmin = true;
              // console.log(users[userIndex]);
              res.status(200).send('You Are Now An Admin.');
	   }
	    else{
          res.status(208).send("This User is Already An Admin.")
	   }

});


//This GET request retrieves a specific product. 
app.get('/products/:productId', (req, res) =>{

	 let productId = parseInt(req.params.productId);

     let produce = products[productId];
     res.status(200).send(produce);
});

//This GET request retrieves all of the products.
app.get('/products', (req,res)=>{
   
   let activeProduct = products.filter((products)=> products.isActive === true);
   if (loggedUser.isAdmin === true){
        res.status(200).send(activeProduct);
   }
   else{
   	res.status(401).send("Unauthorized Action!");
   }

 });


// This POST request allows to add one or more products. It is only accesible by an admin.
app.post('/products', (req, res)=>{
      if(loggedUser.isAdmin === true){
      	if(!Array.isArray(req.body)){
      		let newProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            isActive: req.body.isActive,
            createdOn: req.body.createdOn
      	}
      	products.push(newProduct);
      	res.status(200).send("The Product Has Been Added.");
      }
       else if(Array.isArray(req.body)){
       	let newProducts =req.body.map((products)=>{
       		return{
       			name: products.name,
       			description: products.description,
       			price: products.price,
       			isActive: products.isActive,
       			createdOn: products.createdOn
       		}
       
       	}) 
       	products.push(...newProducts);
       	res.status(200).send("The Products Have Been Added.");
       }

    }
    else{
    	res.status(403).send("Unauthorized Action.");
    }
})

// This PUT request allows an admin to archive an existing product.
app.put('/products/archive/:index', (req, res) =>{
	let productIndex = parseInt(req.params.index);

	if(loggedUser.isAdmin === true){
		products[productIndex].isActive = false;
		console.log(products[productIndex]);
		res.status(200).send("Product Archived.");
	}

	else{
		res.status(401).send("ERROR. Unauthorized Action.");
	}
})
 


// This PUT request allows an admin to update an existing product.
app.put('/products/update/:index', (req, res) =>{
	let updateIndex = parseInt(req.params.index);
      
     	
	if( loggedUser.isAdmin === true){
		let updateProduct = {
			name: req.body.name,
  	description: req.body.description,
  	price: req.body.price,
  	isActive: req.body.isActive,
  	createdOn: req.body.createdOn
		};
		products[updateIndex] = updateProduct;
		res.status(201).send("The Product Has Been Updated.");
	}

	else{
		res.status(401).send("Unauthorized Action!");
	}
});


// This DELETE request allows users to delete an order.
app.delete('/order/:index', (req, res) =>{
	let deleteOrder = req.params.index;

	if (loggedUser.isAdmin === false){
		// const orderDlte = order.pop();
		delete order[deleteOrder];
		res.status(200).send("The Order Has Been Deleted.")
	}
	
	else{
		res.status(401).send("ERROR. Unauthorized Action.");
	}


});


  app.listen(port, () => console.log(`Server is Running at port ${port}!`));

