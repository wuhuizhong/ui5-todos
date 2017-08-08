import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store our tasks
export const tasks = new Mongo.Collection('Tasks');