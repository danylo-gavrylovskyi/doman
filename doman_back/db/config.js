const path = require("path");

try {
	require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
} catch (error) {
	// dotenv is optional — in Docker the env vars are injected directly.
}

const config = {
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT) || 5432,
	dialect: "postgres",
};

module.exports = {
	development: config,
	test: config,
	production: config,
};
