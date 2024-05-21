// import {server} from "socket.io"

// const io = new Server({
//     cors:{
//         origin: "http://localhost:5173",
//     },
// });

// io.on("connection", (socket) => {
//     console.log(socket);
// });


import { Server } from "socket.io";

// Use environment variables for the client URL and port
const io = new Server({
    cors: {
        // origin: process.env.CLIENT_URL || "http://localhost:5173",
        origin: process.env.CLIENT_URL || "https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Use a dynamic port to work correctly with Render
const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
