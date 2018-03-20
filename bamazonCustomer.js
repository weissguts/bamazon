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

// Shows if specified ID entered in CLI is in products database.
function searchProduct(j, k) {
    console.log("Searching if that product is in stock with the selected quantity entered.\n");
    var query = "SELECT item_id, stock_quantity, product_name FROM products";
    connection.query(query, {item_id: j.item_id, stock_quantity: k.stock_quantity}, function(err, res) {
        if (err) throw err;
        // Search database for ID and Quantity of items that customer has entered.

        for (var i = 0; i <res.length; i++) {
            console.log("Congrats, we have that in stock! " + res[j].product_name + " WOWZA " + res[k].stock_quantity);
        }
        connection.end();
});
}


// Questions local Database for inquierer npm package.
var questions = [

    {
        type: 'input',
        name: 'id',
        message: 'What is the id of the name of the product you would like to buy?',
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


inquirer.prompt(questions).then(answers => {
    var idInput = answers.id;
    var quantityInput = answers.quantity;
    console.log(JSON.stringify(answers, null, '  '));
    console.log("Testing " + idInput + "||" + quantityInput);

    searchProduct(idInput, quantityInput);


});