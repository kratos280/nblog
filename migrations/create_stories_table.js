'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('stories', {
        sid: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        uid: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {     // Not necessery to define foreign key right here, but NEED to create 'users' table first.
                model: 'users',
                key: 'uid'
            }
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        slug: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        cdate: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },
        {
            engine: 'InnoDB',
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return queryInterface.dropTable('stories');
  }
};
