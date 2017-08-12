import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store our tasks
export const tasks = new Mongo.Collection('Tasks');

// Sample Northwind data from oData service.  May not need all of these but
// leaving in at present.
export const employees = new Mongo.Collection('Employees');

// Publish
if (Meteor.isServer) {
    // Publish employees
    Meteor.publish('employees', () => {
        return employees.find();
    });
    
}