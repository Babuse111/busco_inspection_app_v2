import * as SQLite from 'expo-sqlite';

// Database configuration
const DATABASE_NAME = 'busco_inspection.db';

// Initialize database
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Create tables
    await createTables(db);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Create all required tables
const createTables = async (db) => {
  try {
    // Users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'driver',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Depots table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS depots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Buses table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS buses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_number TEXT UNIQUE NOT NULL,
        depot_id INTEGER,
        model TEXT,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (depot_id) REFERENCES depots (id)
      );
    `);

    // Inspections table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        depot_id INTEGER,
        bus_number TEXT,
        inspection_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'in_progress',
        submitted_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (depot_id) REFERENCES depots (id)
      );
    `);

    // Inspection items table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS inspection_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inspection_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_description TEXT,
        is_checked BOOLEAN DEFAULT 0,
        has_issue BOOLEAN DEFAULT 0,
        notes TEXT,
        photo_path TEXT,
        sequence_number INTEGER,
        FOREIGN KEY (inspection_id) REFERENCES inspections (id)
      );
    `);

    // Incidents table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bus_number TEXT,
        description TEXT NOT NULL,
        photo_path TEXT,
        incident_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'reported',
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Clock entries table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS clock_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        clock_in_time DATETIME,
        clock_out_time DATETIME,
        entry_date DATE DEFAULT (date('now')),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Insert default depots
export const insertDefaultDepots = async (db) => {
  try {
    const depots = ['Mbombela', 'Malelane', 'Bhoga'];
    
    for (const depot of depots) {
      await db.runAsync(`
        INSERT OR IGNORE INTO depots (name) VALUES (?);
      `, [depot]);
    }
    
    console.log('Default depots inserted');
  } catch (error) {
    console.error('Error inserting default depots:', error);
  }
};

// User management functions
export const createUser = async (db, userData) => {
  try {
    const result = await db.runAsync(`
      INSERT INTO users (employee_id, full_name, password, role)
      VALUES (?, ?, ?, ?);
    `, [userData.employeeId, userData.fullName, userData.password, userData.role || 'driver']);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const authenticateUser = async (db, employeeId, password) => {
  try {
    const result = await db.getFirstAsync(`
      SELECT * FROM users WHERE employee_id = ? AND password = ?;
    `, [employeeId, password]);
    
    return result;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

// Depot functions
export const getAllDepots = async (db) => {
  try {
    const depots = await db.getAllAsync(`
      SELECT * FROM depots ORDER BY name;
    `);
    
    return depots;
  } catch (error) {
    console.error('Error getting depots:', error);
    throw error;
  }
};

// Inspection functions
export const createInspection = async (db, inspectionData) => {
  try {
    const result = await db.runAsync(`
      INSERT INTO inspections (user_id, depot_id, bus_number)
      VALUES (?, ?, ?);
    `, [inspectionData.userId, inspectionData.depotId, inspectionData.busNumber]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating inspection:', error);
    throw error;
  }
};

export const saveInspectionItem = async (db, itemData) => {
  try {
    const result = await db.runAsync(`
      INSERT OR REPLACE INTO inspection_items 
      (inspection_id, item_name, item_description, is_checked, has_issue, notes, photo_path, sequence_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      itemData.inspectionId,
      itemData.itemName,
      itemData.itemDescription,
      itemData.isChecked ? 1 : 0,
      itemData.hasIssue ? 1 : 0,
      itemData.notes,
      itemData.photoPath,
      itemData.sequenceNumber
    ]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving inspection item:', error);
    throw error;
  }
};

export const submitInspection = async (db, inspectionId) => {
  try {
    await db.runAsync(`
      UPDATE inspections 
      SET status = 'completed', submitted_at = CURRENT_TIMESTAMP 
      WHERE id = ?;
    `, [inspectionId]);
    
    console.log('Inspection submitted successfully');
  } catch (error) {
    console.error('Error submitting inspection:', error);
    throw error;
  }
};

// Incident functions
export const createIncident = async (db, incidentData) => {
  try {
    const result = await db.runAsync(`
      INSERT INTO incidents (user_id, bus_number, description, photo_path)
      VALUES (?, ?, ?, ?);
    `, [incidentData.userId, incidentData.busNumber, incidentData.description, incidentData.photoPath]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

// Clock in/out functions
export const clockIn = async (db, userId) => {
  try {
    // Check if already clocked in today
    const today = new Date().toISOString().split('T')[0];
    const existing = await db.getFirstAsync(`
      SELECT * FROM clock_entries 
      WHERE user_id = ? AND entry_date = ? AND clock_out_time IS NULL;
    `, [userId, today]);
    
    if (existing) {
      throw new Error('Already clocked in today');
    }
    
    const result = await db.runAsync(`
      INSERT INTO clock_entries (user_id, clock_in_time, entry_date)
      VALUES (?, CURRENT_TIMESTAMP, ?);
    `, [userId, today]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error clocking in:', error);
    throw error;
  }
};

export const clockOut = async (db, userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.runAsync(`
      UPDATE clock_entries 
      SET clock_out_time = CURRENT_TIMESTAMP 
      WHERE user_id = ? AND entry_date = ? AND clock_out_time IS NULL;
    `, [userId, today]);
    
    if (result.changes === 0) {
      throw new Error('No active clock-in found for today');
    }
    
    return true;
  } catch (error) {
    console.error('Error clocking out:', error);
    throw error;
  }
};

export const getClockStatus = async (db, userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const status = await db.getFirstAsync(`
      SELECT * FROM clock_entries 
      WHERE user_id = ? AND entry_date = ?
      ORDER BY clock_in_time DESC LIMIT 1;
    `, [userId, today]);
    
    return status;
  } catch (error) {
    console.error('Error getting clock status:', error);
    throw error;
  }
};