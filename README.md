# BAmazon

Amazon-like storefront with the MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

## Getting Started

Video run through - https://www.youtube.com/watch?v=RJiqzGLoEU8&feature=youtu.be

## Running the tests

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.

## Built With

* Node.js, MySQL

## Authors

* **Daniel Hernandez**

