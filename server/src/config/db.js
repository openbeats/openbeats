import mongoose from 'mongoose';

export default async () => {
    await mongoose
        .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Mongo db connected!"))
        .catch(err => console.error("Mongo db connection failed!", err.message))

}