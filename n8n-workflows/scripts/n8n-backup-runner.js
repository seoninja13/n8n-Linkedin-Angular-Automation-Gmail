#!/usr/bin/env node

/**
 * N8N Workflow Backup Runner
 * This script demonstrates how to use the backup system.
 * The actual backup logic will be implemented using MCP tools in the main application.
 * 
 * Usage: node n8n-backup-runner.js
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  baseDir: path.join(__dirname, '..'),
  backupDir: path.join(__dirname, '..', 'backups'),
  exportDir: path.join(__dirname, '..', 'exports'),
  logsDir: path.join(__dirname, '..', 'logs'),
  timestamp: new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5),
  dateOnly: new Date().toISOString().slice(0, 10),
};

async function createDirectories() {
  const dirs = [
    CONFIG.backupDir,
    CONFIG.exportDir,
    CONFIG.logsDir,
    path.join(CONFIG.exportDir, 'active'),
    path.join(CONFIG.exportDir, 'inactive'),
    path.join(CONFIG.exportDir, 'archived'),
    path.join(CONFIG.backupDir, CONFIG.timestamp)
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

async function main() {
  console.log('🚀 N8N Workflow Backup System');
  console.log('📁 Creating directory structure...');
  
  await createDirectories();
  
  console.log('✅ Directory structure created successfully!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. The actual backup will be performed using MCP tools');
  console.log('2. Run the backup process from the main application');
  console.log('3. Check the backup directories for exported workflows');
  console.log('');
  console.log('📂 Backup Structure:');
  console.log(`   Timestamped backups: ${CONFIG.backupDir}`);
  console.log(`   Latest exports: ${CONFIG.exportDir}`);
  console.log(`   Backup logs: ${CONFIG.logsDir}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CONFIG, createDirectories };
