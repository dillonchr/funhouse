const { db } = require('../../utils');
const COLLECTION_NAME = 'ca-employees';

module.exports = {
    getEmployees(onResponse) {
        db.getAllDocumentsInCollection(COLLECTION_NAME, onResponse);
    },
    saveEmployees(employees) {
        db.insertMany(COLLECTION_NAME, employees);
    },
    fireEmployees(employeeNames) {
        const update = {$set: {fired: true, fireDate: new Date().getTime()}};
        db.updateMany(COLLECTION_NAME, {name: {$in: employeeNames}}, update);
    },
    getFiredEmployees(onResponse) {
        db.findDocumentsInCollection(COLLECTION_NAME, {fired:true}, {sort:{fireDate: -1}}, onResponse);
    }
};
