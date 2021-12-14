const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const { ExplainVerbosity } = require("mongodb");
app.use(methodOverride("_method"));

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
    응답.status(200).json({ message: "성공했습니다" });
    // 응답코드 200을 보내주세요
    // 이거 적으면 무조건 성공하는 코드가 됨 400 적으면 실패
  });
  // 응답.send("삭제완료");
});

app.get("/detail/:id", function (요청, 응답) {
  db.collection("post").findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
    응답.render("detail.ejs", { data: 결과 });
  });
});

app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});

app.get("/edit/:id", function (요청, 응답) {
  db.collection("post").findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
    응답.render("edit.ejs", { post: 결과 });
  });
});

app.put("/edit", function (요청, 응답) {
  db.collection("post").updateOne({ _id: parseInt(요청.body.id) }, { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } }, function (에러, 결과) {
    console.log("수정완료");
    응답.redirect("/list");
  });
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
// app.use : 미들웨어(요청, 응답 사이에 동작하는 코드)
app.use(session({ secret: "비밀코드", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function (요청, 응답) {
  응답.render("login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail", // 실패시 경로
  }),
  function (요청, 응답) {
    응답.redirect("/");
  }
);
app.get("/fail", function (요청, 응답) {
  응답.send("로그인실패");
});

//로그인했니 함수 미들웨어 사용
app.get("/mypage", 로그인했니, function (요청, 응답) {
  // 요청.user;
  응답.render("mypage.ejs", { data: 요청.user });
});

function 로그인했니(요청, 응답, next) {
  if (요청.user) {
    //요청.user 있습니까?
    next();
  } else {
    응답.send("로그인안하셨는데요?");
  }
}

// 아이디 비번 인증하는 세부 코드
passport.use(
  new LocalStrategy(
    {
      usernameField: "id", //폼 name
      passwordField: "pw", // 폼 name
      session: true, // 로그인 후 세션을 저장할 것인지
      passReqToCallback: false,
    },
    // 아이디/비번 맞는지 DB와 비교
    function (입력한아이디, 입력한비번, done) {
      // console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne({ id: 입력한아이디 }, function (에러, 결과) {
        if (에러) return done(에러);
        // DB에 아무것도 없을 때
        if (!결과) return done(null, false, { message: "존재하지않는 아이디요" });
        // DB에 있을 때
        if (입력한비번 == 결과.pw) {
          // 해쉬함수 등으로 암호화 해서 비교해야함
          return done(null, 결과); // 라이브러리 문법:3개의 파라미터(서버에러, 성공시사용자DB데이터, 에러메세지)
        } else {
          return done(null, false, { message: "비번틀렸어요" });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  //id 이용해서 세션을 저장시키는 코드
  done(null, user.id);
});
passport.deserializeUser(function (아이디, done) {
  // 마이페이지 접속시 발동. 나중에 쓸거임. 이 세션 데이터 가진 사람을 DB에서 찾아주세요
  // 로그인한 유저의 개인정보를 DB에서 찾는 역할
  //디비에서 위의 user.id로 유저를 찾은 뒤 유저 정보를 넣을것임
  db.collection("login").findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과); // {id:test, pw:test}
  });
});
