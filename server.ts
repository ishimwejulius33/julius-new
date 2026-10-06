import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/productroute";
import authRouter from "./routes/autholizroutes";
import { connectDB } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use("/api", productRouter);
app.use("/api/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({ message: "server is running" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Request failed:", error);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in the environment");
  }

  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});