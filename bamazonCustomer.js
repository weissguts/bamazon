'use strict';
var inquirer = require('inquirer');
var mysql = require("mysql");
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
function searchProduct(j, k) {
    var quantity = k;
    var totalPrice = 0;
    console.log("\nSearching if that product is in stock.\n");

    var query = "SELECT item_id, stock_quantity, product_name, price FROM products";
    connection.query(query, {item_id: j.item_id}, function(err, res) {

        if (err) throw err;

        //Corrects id entered to search mySql id_name column(array) properly.
        j = j-1;
        if (j < 0) {
            console.log("Sorry, we do not have a product match the id you entered. Please try again.");
            productSearch();
        } else {
            totalPrice = res[j].price * k;
            // Search database for ID and Quantity of items that customer has entered.
            console.log("Congrats, we have '" + res[j].product_name + "' in stock!\n"
                + "We currently have '" + res[j].stock_quantity + "' left to purchase. The price is currently" +
                " $" + res[j].price + " per item.\n\n"
                + "Your total price for '" + quantity + "' '" + res[j].product_name + "' is"
                + " $" + totalPrice + ".");
            connection.end();
        }
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


function productSearch() {
    inquirer.prompt(questions).then(answers => {
        var idInput = answers.id;
        var quantityInput = answers.quantity;
        console.log(JSON.stringify(answers, null, '  '));

        searchProduct(idInput, quantityInput);
    });
}


