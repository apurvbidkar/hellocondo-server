"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn("policies", "description", "display_name", { transaction });
      await queryInterface.renameColumn("policies", "icon_name", "icon", { transaction });
      await queryInterface.renameColumn("policies", "sort_order", "sequence_order", { transaction });
      await queryInterface.renameColumn("policies", "accuracy_percentage", "key", { transaction });

      await queryInterface.changeColumn(
        "policies",
        "display_name",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "policies",
        "icon",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "policies",
        "sequence_order",
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "policies",
        "key",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        "policies",
        "updated_at",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.removeColumn("policies", "is_published", { transaction });
      await queryInterface.removeColumn("policies", "color_codes", { transaction });
      await queryInterface.removeColumn("policies", "updated_by", { transaction });
      await queryInterface.addColumn(
        "policies",
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
        "policies",
        "group_id",
        {
          type: Sequelize.UUID,
          allowNull: true,
          default: null,
          references: {
            model: "group_policies",
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
