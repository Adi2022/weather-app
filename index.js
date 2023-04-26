const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "UTF-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp - 273.15).toFixed(2));
  temperature = temperature.replace("{%tempMin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
  temperature = temperature.replace("{%tempMax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};


const server = http
  .createServer((req, res) => {
    if (req.url === "/") {
      requests(
        "https://api.openweathermap.org/data/2.5/weather?q=KANPUR&appid=740c3ad970d416c0212dce53411ed42b"
      )
        .on("data", (chunk) => {
          const objData = JSON.parse(chunk);
          const newArray = [objData];

          const realData=newArray.map((val)=>replaceVal(homeFile,val)).join("") 
          res.write(realData);
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);

          res.end();
        });
    }
  })
  server.listen(8000);
    
  
