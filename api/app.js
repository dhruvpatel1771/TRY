// import express from "express";
// import cors from "cors";
// import postRoute from "./routes/post.route.js"; 
// import authRoute from "./routes/auth.route.js";
// import cookieParser from "cookie-parser";
// import testRoute from "./routes/test.route.js";
// import userRoute from "./routes/user.route.js";
// import chatRoute from "./routes/chat.route.js";
// import messageRoute from "./routes/message.route.js";

// const app = express();

// // Allow requests from http://localhost:5173
// const allowedOrigins = ['http://localhost:5173'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is allowed
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// app.use(cors({origin: process.env.CLIENT_URL,credentials: true}));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth",authRoute); 
// app.use("/api/users",userRoute);
// app.use("/api/posts",postRoute); 
// app.use("/api/test", testRoute);
// app.use("/api/chats", chatRoute);
// app.use("/api/messages", messageRoute);


// app.listen(8800,()=>{
//     console.log("Server is running! Check it out at port http://localhost:8800");
// });

import express from "express";
import cors from "cors";
import postRoute from "./routes/post.route.js"; 
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import { Server } from "socket.io";
import http from "http";

const app = express();

// Allow requests from the specified origin
const allowedOrigins = [process.env.CLIENT_URL || 'https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute); 
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
