import mongoose from 'mongoose';
import { DB_name } from '../constants.js';

import dotenv from 'dotenv';
dotenv.config('./.env');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_name}`
    );

    console.log(
      `DB connected !!! Database Name: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.log('Error While Connecting to database');
  }
};

export default connectDB;
