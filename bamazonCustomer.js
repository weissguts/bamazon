'use strict';
var inquirer = require('inquirer');
var mysql = require("mysql");
var maxIdNum = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProducts();
    productSearch();

});

// Shows all products in database.
function showProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);

    });
}

// Shows if specified ID entered in CLI is in products database. Returns to user if we have product and current quantity.
function searchProduct(idInput, quantityInput) {
    var idInput = idInput;
    var quantityInput = quantityInput;
    var totalPrice = 0;
    var currentStock = 0;

    //Check to see if id is a negative number. If negative will return user to beginning.
    if (idInput <0) {
        console.log("Finally working bug free.");
        productSearch();
        return;
    }

    console.log("\nSearching if that product is in stock and how many are available to purchase.\n");

    var query = "SELECT item_id, stock_quantity, product_name, price FROM products";
    connection.query(query, {item_id: idInput.item_id}, function(err, res) {
        //checks for errors
        if (err) throw err;

        //Sets current stock to equal stock_quantity of the row of id_input (item_id).
        currentStock = res[idInput].stock_quantity;

        //Corrects id entered to search mySql id_name column(array) properly. "id_input"
        idInput = idInput-1;

        //If statements to check that ID and Quantity entered are valid and if we have enough available.
        if (idInput < 0) {
            console.log("Sorry, we do not have a product matching the id you entered. Please try again.");
            productSearch();
        }

        else if (quantityInput > currentStock) {
            console.log("Sorry we do not currently have that many in stock. Please try again.");
            productSearch();
        }
        else if (quantityInput <= 0) {
            console.log("Sorry you must enter a quantity greater than 0. Please try again.");
            productSearch();
        }

        //If item_id and there is enough stock_quantity available, calculate total cost.
        else {
            totalPrice = res[idInput].price * quantityInput;
            // Search database for ID and Quantity of items that customer has entered.
            console.log("Congrats, we have '" + res[idInput].product_name + "' in stock!\n"
                + "We currently have '" + res[idInput].stock_quantity + "' left to purchase. The price is currently" +
                " $" + res[idInput].price + " per item.\n\n"
                + "Your total price for '" + quantityInput + "' '" + res[idInput].product_name + "' is"
                + " $" + totalPrice + ".");
            connection.end();
        }
    });
}

//Grabs the MAX item_id from products table. This will be used to ensure that if user enters last item MySql DB...
//... that it will properly retrieve the data and not give an error.
function maxId(input) {
    var query = "SELECT * FROM products where item_id = (SELECT MAX(item_id) FROM products)";
    connection.query(query, {item_id: input.item_id}, function (err, res) {
        //checks for errors
        if (err) throw err;
            maxIdNum = res[0].item_id;
            console.log(maxIdNum);
    });
}



// Questions local Database for inquirer npm package.
var questions = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the id of the product you would like to buy?',
        validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },

        filter: Number
    },

    {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
        validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },

        filter: Number
    },

];

//Starts inquirer prompt and searches database based on questions from questions array.
function productSearch() {
    inquirer.prompt(questions).then(answers => {
        var idInput = answers.id;
        var quantityInput = answers.quantity;

        console.log(JSON.stringify(answers, null, '  '));

        maxId(idInput);
        // if (idInput == maxId().value) {
        //     idInput--;
        // }
        searchProduct(idInput, quantityInput);
    });
}


