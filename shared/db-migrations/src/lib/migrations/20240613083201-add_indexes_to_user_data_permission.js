'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'identify_unique_rows' index
    await queryInterface.addIndex('user_data_permission', {
      name: 'identify_unique_rows',
      fields: ['user_id', 'object_id', 'object_type']
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'identify_unique_rows' index
    await queryInterface.removeIndex('user_data_permission', 'identify_unique_rows');
  }
};
