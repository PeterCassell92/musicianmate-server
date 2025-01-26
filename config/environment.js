import dotenv from 'dotenv';
import os from 'os';  // To check the operating system

dotenv.config();

export const env = process.env.NODE_ENV || 'dev';
const isProd = env === 'production';
const isLinux = os.platform() === 'linux';  // Check if the OS is Linux

console.log(`OS is ${isLinux ? 'Linux': 'Windows'}`)

// Get the mongo db atlas password from the environment variable
const mongoAtlasPassword = process.env.musicianmatemongoatlas_db_pw
const mongoAtlastHost = process.env.musicianmatemongoatlas_project_uri
const mongoAtlasUsername = process.env.musicianmatemongoatlas_db_username
const mongoAtlasAppName = process.env.musicianmatemongoatlas_app_name

//If OS is linux and system is not Prod then we want to use the cloud based dev DB on Mongo Atlas.
export const dbURI = isProd 
  ? process.env.DB_URI 
  : isLinux 
    ? `mongodb+srv://${mongoAtlasUsername}:${mongoAtlasPassword}@${mongoAtlastHost}/musicdb?retryWrites=true&w=majority&appName=${mongoAtlasAppName}`
    : 'mongodb://localhost/musicdb'

console.log(dbURI);

// Port configuration
export const port = process.env.PORT || 4000;

// JWT Secret Token
export const secret = process.env.SECRET || 'bowlrainbowsheddrivegear';
