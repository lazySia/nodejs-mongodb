var router = require("express").Router();

// 로그인한 사람만 방문가능하게 특정 라우터파일에 미들웨어 적용하고 싶으면
// function 로그인했니(요청, 응답, next) {
//   if (요청.user) {
//     //요청.user 있습니까?
//     next();
//   } else {
//     응답.send("로그인안하셨는데요?");
//   }
// }

// router.use(로그인했니); -> 여기있는 모든 URL에 적용할 미들웨어
// router.use('/shirts', 로그인했니); -> 특정 URL에만 적용하는 미들웨어
// router.get("/shirts", 로그인했니, function (요청, 응답) {
//   응답.send("셔츠 파는 페이지입니다.");
// });

router.get("/shirts", function (요청, 응답) {
  응답.send("셔츠 파는 페이지입니다.");
});

router.get("/pants", function (요청, 응답) {
  응답.send("바지 파는 페이지입니다.");
});

module.exports = router;
