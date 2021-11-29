const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log("listening on 8080");
});

app.get("/pet", (요청, 응답) => {
  응답.send("펫 용품 쇼핑 페이지입니다.");
});

app.get("/beauty", (요청, 응답) => {
  응답.send("뷰티 용품 쇼핑 페이지입니다.");
});

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html");
});

app.get("/write", (요청, 응답) => {
  응답.sendFile(__dirname + "/write.html");
});

app.post("/add", (요청, 응답) => {
  응답.send("전송완료");
  console.log(요청.body);
});
