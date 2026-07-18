"use strict";

/**
 * Initial schema — mirrors the sequelize-typescript models as of the first
 * migration. For an EXISTING database that was previously created via
 * `sequelize.sync`, do NOT run this migration; instead mark it as already
 * applied so migration state is tracked going forward:
 *
 *   INSERT INTO "SequelizeMeta" (name) VALUES ('20260718000000-init-schema.js');
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { INTEGER, STRING, TEXT, DECIMAL, BOOLEAN, DATE } = Sequelize;

		const timestamps = {
			createdAt: { type: DATE, allowNull: false },
			updatedAt: { type: DATE, allowNull: false },
		};

		const idColumn = {
			type: INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			unique: true,
		};

		await queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.createTable(
				"categories",
				{
					id: idColumn,
					title: { type: STRING, allowNull: false, unique: true },
					slug: { type: STRING, allowNull: false, unique: true },
					image: { type: STRING, allowNull: false, unique: true },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"subcategories",
				{
					id: idColumn,
					title: { type: STRING, allowNull: false, unique: true },
					slug: { type: STRING, allowNull: false, unique: true },
					image: { type: STRING, allowNull: true, unique: true },
					categoryId: {
						type: INTEGER,
						allowNull: false,
						references: { model: "categories", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"products",
				{
					id: idColumn,
					article: { type: STRING, allowNull: true, unique: true },
					title: { type: STRING, allowNull: true, unique: true },
					slug: { type: STRING, allowNull: true, unique: true },
					description: { type: TEXT, allowNull: true },
					quantity: { type: INTEGER, allowNull: true },
					image: { type: STRING, allowNull: true, unique: true },
					price: { type: DECIMAL, allowNull: true },
					isPopular: { type: BOOLEAN, allowNull: true, defaultValue: false },
					subcategoryId: {
						type: INTEGER,
						allowNull: true,
						references: { model: "subcategories", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "SET NULL",
					},
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"attributes",
				{
					id: idColumn,
					title: { type: STRING, allowNull: false, unique: true },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"product-attributes",
				{
					id: idColumn,
					productId: {
						type: INTEGER,
						allowNull: false,
						references: { model: "products", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
					attributeId: {
						type: INTEGER,
						allowNull: false,
						references: { model: "attributes", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
					attributeValue: { type: STRING, allowNull: false },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"orders",
				{
					id: idColumn,
					firstName: { type: STRING, allowNull: false },
					lastName: { type: STRING, allowNull: false },
					email: { type: STRING, allowNull: false },
					phoneNumber: { type: STRING, allowNull: false },
					totalPrice: { type: INTEGER, allowNull: false },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"order-product",
				{
					id: idColumn,
					orderId: {
						type: INTEGER,
						allowNull: false,
						references: { model: "orders", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
					productId: {
						type: INTEGER,
						allowNull: false,
						references: { model: "products", key: "id" },
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
					quantity: { type: INTEGER, allowNull: false },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"company_details",
				{
					id: idColumn,
					payment_and_delivery_content: { type: TEXT, allowNull: true },
					returns_and_exchanges_content: { type: TEXT, allowNull: true },
					about_company_content: { type: TEXT, allowNull: true },
					phone_number1: { type: STRING, allowNull: false, unique: true },
					phone_number2: { type: STRING, allowNull: true, unique: true },
					email: { type: STRING, allowNull: false, unique: true },
					address: { type: STRING, allowNull: false, unique: true },
					facebook_link: { type: STRING, allowNull: true, unique: true },
					instagram_link: { type: STRING, allowNull: true, unique: true },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.createTable(
				"users",
				{
					id: idColumn,
					firstName: { type: STRING, allowNull: false },
					lastName: { type: STRING, allowNull: false },
					phoneNumber: { type: STRING, allowNull: false, unique: true },
					email: { type: STRING, allowNull: true, unique: true },
					password: { type: STRING, allowNull: true },
					isAdmin: { type: BOOLEAN, allowNull: false, defaultValue: false },
					...timestamps,
				},
				{ transaction }
			);

			await queryInterface.addIndex("subcategories", ["categoryId"], { transaction });
			await queryInterface.addIndex("products", ["subcategoryId"], { transaction });
			await queryInterface.addIndex("product-attributes", ["productId"], { transaction });
			await queryInterface.addIndex("product-attributes", ["attributeId", "attributeValue"], { transaction });
			await queryInterface.addIndex("orders", ["email"], { transaction });
			await queryInterface.addIndex("order-product", ["orderId"], { transaction });
			await queryInterface.addIndex("order-product", ["productId"], { transaction });
		});
	},

	async down(queryInterface) {
		await queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.dropTable("order-product", { transaction });
			await queryInterface.dropTable("product-attributes", { transaction });
			await queryInterface.dropTable("users", { transaction });
			await queryInterface.dropTable("company_details", { transaction });
			await queryInterface.dropTable("orders", { transaction });
			await queryInterface.dropTable("products", { transaction });
			await queryInterface.dropTable("subcategories", { transaction });
			await queryInterface.dropTable("attributes", { transaction });
			await queryInterface.dropTable("categories", { transaction });
		});
	},
};
