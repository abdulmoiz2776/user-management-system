const pool = require("./db");
const { faker } = require("@faker-js/faker");

async function seed() {
  try {
    console.log("🚀 Seed script started...");

    const batchSize = 1000;
    const total = 50000;

    for (let i = 0; i < total; i += batchSize) {
      console.log(`⚙️ Generating batch ${i} - ${i + batchSize}`);

      let values = [];

      for (let j = 0; j < batchSize; j++) {
        const name = faker.person.fullName().replace(/'/g, ""); // prevent SQL error
        const email = faker.internet.email();

        values.push(`('${name}', '${email}', true)`);
      }

      const query = `
        INSERT INTO users (name, email, status)
        VALUES ${values.join(",")}
      `;

      await pool.query(query);

      console.log(`✅ Inserted: ${i + batchSize}`);
    }

    console.log("🎉 DONE: 50,000 users inserted");
    process.exit();

  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
}

seed();