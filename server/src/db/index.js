import mongoose from "mongoose"
import { DB_NAME } from '../constants.js';

export async function connectDB (url) {
    try {
        const connection = await mongoose.connect(`${url}/${DB_NAME}`);
        if(connection) {
            console.log('Mongodb connection established on: ', mongoose.connection.host);
        }
    } catch (error) {
        console.log('Error while connecting to the mongodb: ', error)
    }
}