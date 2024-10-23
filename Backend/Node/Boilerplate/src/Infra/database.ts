import Database from 'better-sqlite3';

export const db = new Database('fleet.db');

export const initDB = async () => {
  await db.exec (`
    CREATE TABLE IF NOT EXISTS fleets (
      id VARCHAR PRIMARY KEY
    );
  `);
  
  await db.exec (`
    CREATE TABLE IF NOT EXISTS fleet_vehicles (
            id UUID PRIMARY KEY,
            fleet_id VARCHAR NOT NULL,
            vehicle_id VARCHAR NOT NULL,
            location VARCHAR,
            FOREIGN KEY (fleet_id) REFERENCES fleets (id)
        );
  `);
}

export const getDB = () => db;
