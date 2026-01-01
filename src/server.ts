import { prisma } from "../lib/prisma";

async function main(){
    try {
        await prisma.$connect()
        console.log("connected to database sucessfully")
        
    } catch (error) {
        
    }
}