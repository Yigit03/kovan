import express, {Request, Response} from 'express';
import cors from "cors";
import dotenv from "dotenv";

//load environmental variebles
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json())

//health check endpoint (test için)
app.get("/health", (req: Request, res: Response) =>{
    res.status(200).json({
        status: "succes",
        message: "Kovan API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

//404 handler
app.use((req:Request, res:Response)=>{
    res.status(404).json({
        status: "error",
        message: "Route not found"
    })
});

//start server
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
})