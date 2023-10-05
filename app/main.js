// const net = require("net");

// // You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");


// //const checkPath = (path, socket) => {
// const loopOnPath = (path, socket) => {
//     let temp = "";
//     let word = "";
//     let flag = 0;
//     let counter = 0;

//     if (path === "/") {
//         socket.write("HTTP/1.1 200 OK\r\n\r\n");
//         //console.log("buenisimo...");

//     // } else {
//     //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//     //     console.log("oh no...");
//     return word;
//     }
//     for (let i = 0; i < path.length; i++) {

//         if(path[i] === "/"){
//             counter++;
//         }
        
//         if(i === 0 && path[i] != "/"){
//             socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//             return null;
//         }

//         if(i === path.length - 1 && flag === 0){
//             socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//             return null;
//         }

//         if(i !== 0 && path[i] === "/" && counter === 2){
//             if(temp.slice(1,) === "echo"){
//                 flag = 1;
//                 continue;
//             } else {
//                 socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//                 return null;                
//             }
//             }
//             if(flag === 1){
//                 word += path[i];
//             }
//             temp += path[i];
//         }
//         return word;
//     }
   
//     const parsePath = (path ,socket) => {
//         const str = loopOnPath(path,socket);
        
//         if (str && str!=="") {
//             socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`)
    
//         }
//     }
// // Uncomment this to pass the first stage
// const server = net.createServer((socket) => {
//   socket.on("close", () => {
//     socket.end();
//     server.close();
//   });

//   socket.on("data", data => {
//     socket.read();
//     //checkPath(data.toString().split("\n")[0].split(" ")[1], socket);
//     parsePath(data.toString().split("\r\n")[0].split(" ")[1] , socket);
//     socket.end();
//   })
// });

// server.listen(4221, "localhost");

const net = require("net");

console.log("Logs from your program will appear here!");

const parseRequest = (request) => {
  const lines = request.split("\r\n");
  const [method, path] = lines[0].split(" ");
  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    const [key, value] = lines[i].split(": ");
    headers[key] = value;
  }
  return { method, path, headers };
};

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", (data) => {
    const request = data.toString();
    const parsedRequest = parseRequest(request);

    if (
      parsedRequest.method === "GET" &&
      parsedRequest.path === "/user-agent"
    ) {
      const userAgent = parsedRequest.headers["User-Agent"];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      socket.write(response);
    } else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }

    socket.end();
  });
});

server.listen(4221, "localhost");
