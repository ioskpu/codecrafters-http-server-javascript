const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");


//const checkPath = (path, socket) => {
const loopOnPath = (path, socket) => {
    let temp = "";
    let word = "";
    let flag = 0;
    let counter = 0;

    if (path === "/") {
        socket.write("HTTP/1.1 200 OK\r\n\r\n");
        //console.log("buenisimo...");

    // } else {
    //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    //     console.log("oh no...");
    return word;
    }
    for (let i = 0; index < path.length; index++) {

        if(path[i] === "/"){
            counter++;
        }
        
        if(i === 0 && path[i] != "/"){
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            return null;
        }

        if(i === path.length - 1 && flag === 0){
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            return null;
        }

        if(i! == 0 && path[i] === "/" && counter === 2){
            if(temp.slice(1,) === "echo"){
                flag = 1;
                continue;
            } else {
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                return null;                
            }
            }
            if(flag === 1){
                word += path[i];
            }
            temp += path[i];
        }
        return word;
    }
   
    const parsePath = (path ,socket) => {
        const str = loopOnPath(path,socket);
        
        if (str && str!=="") {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`)
    
        }
    }
// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", data => {
    socket.read();
    //checkPath(data.toString().split("\n")[0].split(" ")[1], socket);
    parsePath(data.toString().split("\r\n")[0].split(" ")[1] , socket);
    socket.end();
  })
});

server.listen(4221, "localhost");
