import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store our tasks
export const tasks = new Mongo.Collection('Tasks');
export const taskLists = new Mongo.Collection('TaskLists');

// Sample Northwind data from oData service.  May not need all of these but
// leaving in at present.
export const employees = new Mongo.Collection('Employees');

// Publish
if (Meteor.isServer) {

    // Publish task lists
    Meteor.publish('taskLists', () => {
        return taskLists.find();
    });
    
    // Publish tasks and associated taskLists
    Meteor.publishComposite('tasks', {
      find: function() {
        return tasks.find();
      },
      children: [{
        find: function(task) {
          return taskLists.find({
            _id: task.listId
          });
        }
      }]
    });
    
    // Publish employees
    Meteor.publish('employees', () => {
        return employees.find();
    });
    
}