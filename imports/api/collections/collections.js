import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store our tasks
export const tasks = new Mongo.Collection('Tasks');
export const taskGroups = new Mongo.Collection('TaskGroups');

// Sample Northwind data from oData service.  May not need all of these but
// leaving in at present.
export const employees = new Mongo.Collection('Employees');

// Publish
if (Meteor.isServer) {

    // Publish task Groups
    Meteor.publish('taskGroups', () => {
        return taskGroups.find();
    });
    
    // Publish tasks and associated taskLists
    Meteor.publishComposite('tasks', {
      find: function() {
        return tasks.find();
      },
      children: [{
        find: function(task) {
          return taskGroups.find({
            _id: task.groupId
          });
        }
      }]
    });
    
    // Publish employees
    Meteor.publish('employees', () => {
        return employees.find();
    });
    
}