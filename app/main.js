const net = require("net");
const { argv } = require("process");
//const { readFileSync, existsSync } = require("fs");
const { readFileSync, existsSync, writeFileSync } = require("fs");
let dir = "./";
let prev = "";
for (const arg of argv) {
    if (prev == "--directory") dir = arg;
    prev = arg;
}
1
if (!dir.endsWith("/")) dir += "/";
function badRequest(socket) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.end();
}
const handleRequest = (socket) => {
    return (data) => {
        const req = data.toString();
        
        const reqParts = req.split("\r\n");

        const body = req.split("\r\n\r\n").pop();

        const startLine = reqParts[0];

        if (!startLine) badRequest(socket);
        //const [_0, path, _1] = startLine.split(" ");
        const [method, path, _1] = startLine.split(" ");

        if (!path) badRequest(socket);

        if (path === "/") {
            socket.write("HTTP/1.1 200 OK \r\n\r\n");
        } else if (path === "/user-agent") {
            const userAgentHeader = reqParts.find((part) =>
                part.includes("User-Agent"),
            );
            if (!userAgentHeader) {
                return;
            }
            const userAgent = userAgentHeader.split(" ")[1];
            socket.write(
                `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`,

            );
        } else if (path.startsWith("/echo")) {
            const randomString = path.slice(6);
            socket.write(
                `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:${randomString.length}\r\n\r\n${randomString}\r\n`,
            );
        
        } else if (path.startsWith("/files/")) {
            const file = dir + path.replace(/^\/files\//g, "");
            // if (existsSync(file)) {
            //     const content = readFileSync(file);
            if (method == "GET") {
                if (existsSync(file)) {
                    const content = readFileSync(file);
                    socket.write(
                        `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${
                            new Blob([content]).size
                        }\r\n\r\n${content}\r\n`,
                    );
                } else {
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                }
            } else if (method == "POST") {
                writeFileSync(file, body);

            //     socket.write(
            //         `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${
            //             new Blob([content]).size
            //         }\r\n\r\n${content}\r\n`,
            //     );
            // } else {
            //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.write("HTTP/1.1 201 Created\r\n\r\n");
            }
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        socket.end();
    };
};
// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("close", () => {
        socket.end();
        server.close();
    });
    socket.on("data", handleRequest(socket));
});

server.listen(4221, "localhost");