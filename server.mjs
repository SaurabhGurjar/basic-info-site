import http from "node:http";
import fs from "node:fs/promises";
import url from "node:url";

const server = http.createServer();

server
  .on("request", async (req, res) => {
    try {
      const request = url.parse(req.url, true);
      const filename =
        request.pathname === "/" ? "./index" : `.${request.pathname}`;
      let page;
      try {
        if(filename === './favicon.ico') return;
        page = await fs.readFile(`${filename}.html`);
      } catch (err) {
        console.error(err);
        const errorPage = await fs.readFile("./404.html");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(errorPage);
        res.end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(page);
      res.end();
      return;
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("500 Internal server error!");
    }
  })
  .listen(8080, () => {
    console.log("Server is listening at 8080");
  });
