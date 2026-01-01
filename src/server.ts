import { prisma } from "../lib/prisma";
import app from "./app";
const PORT = process.env.PORT || 3000

async function main(){
    try {
        await prisma.$connect()
        console.log("connected to database sucessfully")

        app.listen(PORT,()=>{
            console.log(`server is running on port http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1)

    }
}
main()