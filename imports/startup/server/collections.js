// Make collections available on the server
import {
  tasks,
  taskGroups,
  employees
} from '../../api/collections/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
  loadFileIntoEmptyCollection('fixtures/Employees.json', employees, "EmployeeID");
});

function loadFileIntoEmptyCollection(file, collection, idProperty) {
  if (!collection.find().count()) {
    console.log(`loading ${file}...`);
    const jsonFile = JSON.parse(Assets.getText(file));

    // Clean up data
    jsonFile.forEach((doc, index) => {
      // Insert converted document
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        idProperty,
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            collection.insert(cleaned);
          }
        }
      );
    });
  }
}
