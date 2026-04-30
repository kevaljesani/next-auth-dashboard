import mongoose from "mongoose";

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
            socketTimeoutMS: 45000,
        });
        console.log('mongodb connected');
    } catch (error) {
        console.log('mongodb error', error);
    }
}

export default DBConnection