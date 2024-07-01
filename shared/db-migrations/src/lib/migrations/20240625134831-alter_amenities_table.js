"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn("amenities", "description", "display_name", { transaction });
      await queryInterface.renameColumn("amenities", "icon_name", "icon", { transaction });
      await queryInterface.renameColumn("amenities", "sort_order", "sequence_order", { transaction });
      await queryInterface.renameColumn("amenities", "accuracy_percentage", "key", { transaction });

      await queryInterface.changeColumn(
        "amenities",
        "display_name",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "amenities",
        "icon",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "amenities",
        "sequence_order",
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "amenities",
        "key",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "amenities",
        "updated_at",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      );
      

      await queryInterface.removeColumn("amenities", "is_published", { transaction });
      await queryInterface.removeColumn("amenities", "color_codes", { transaction });
      await queryInterface.removeColumn("amenities", "updated_by", { transaction });
      await queryInterface.addColumn(
        "amenities",
        "updated_by",
        {
          type: Sequelize.UUID,
          allowNull: true,
          default: null,
          references: {
            model: "users",
            key: "id",
          },
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "amenities",
        "group_id",
        {
          type: Sequelize.UUID,
          allowNull: true,
          default: null,
          references: {
            model: "group_amenities",
            key: "id",
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
