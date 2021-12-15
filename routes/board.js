var router = require("express").Router();

router.get("/sports", function (요청, 응답) {
  응답.send("스포츠게시판");
});

router.get("/game", function (요청, 응답) {
  응답.send("게임게시판");
});

module.exports = router;
