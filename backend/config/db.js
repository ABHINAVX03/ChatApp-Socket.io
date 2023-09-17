const mongoose=require('mongoose')
const dotenv=require('dotenv');
dotenv.config()
const connectDB = async()=>{
    try {
        const conn=await mongoose.connect(process.env.LINK,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit()
    }
}

module.exports =connectDB;