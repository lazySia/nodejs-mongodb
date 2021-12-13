const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

var db;
MongoClient.connect("mongodb+srv://admin:qwer1234@cluster0.ka8sc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (에러, client) {
  if (에러) {
    return console.log(에러);
  }
  db = client.db("todoapp");

  //   db.collection("post").insertOne({ 이름: "John", _id: 100 }, function (에러, 결과) {
  //     console.log("저장완료");
  //   });

  app.get("/write", function (요청, 응답) {
    응답.render("write.ejs");
  });

  app.post("/add", function (요청, 응답) {
    db.collection("counter").findOne({ name: "게시물갯수" }, function (에러, 결과) {
      var 총게시물갯수 = 결과.totalPost;

      db.collection("post").insertOne({ _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function (에러, 결과) {
        db.collection("counter").updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } }, function (에러, 결과) {
          if (에러) {
            return console.log(에러);
          }
          응답.send("전송완료");
        });
      });
    });
  });

  app.listen(8080, () => {
    console.log("listening on 8080");
  });
});

app.get("/list", function (요청, 응답) {
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);
      응답.render("list.ejs", { posts: 결과 });
    });
});

app.delete("/delete", function (요청, 응답) {
  요청.body._id = parseInt(요청.body._id);
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
    응답.status(200).send({ message: "성공했습니다" }); // 응답코드 200을 보내주세요
    // 이거 적으면 무조건 성공하는 코드가 됨 400 적으면 실패
  });
  응답.send("삭제완료");
});

app.get("/detail/:id", function (요청, 응답) {
  db.collection("post").findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
    응답.render("detail.ejs", { data: 결과 });
  });
});

app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});
