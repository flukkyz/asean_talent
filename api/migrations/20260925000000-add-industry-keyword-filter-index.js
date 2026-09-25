"use strict";

const indexName = "industry_keywords_group_domain_keyword";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      "industry_keywords",
      ["talent_group", "domain_industry_id", "list_keyword_id"],
      {
        name: indexName,
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("industry_keywords", indexName);
  },
};
