"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// モックデータ（投稿データ）
let posts = [
    { post_id: 1, user: "user1", content: "こんにちは！", likes: 0, comments: [] },
    { post_id: 2, user: "user2", content: "おはようございます！", likes: 0, comments: [] }
];

// ミドルウェア設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

// ルート: 投稿一覧ページ
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// いいね機能
app.post("/api/like", (req, res) => {
    const postId = parseInt(req.body.post_id, 10);
    const post = posts.find(p => p.post_id === postId);

    if (post) {
        post.likes++;
        res.json({ status: "success", likes: post.likes });
    } else {
        res.status(404).json({ status: "error", message: "投稿が見つかりません。" });
    }
});

// 新しい投稿作成
app.post("/api/post", (req, res) => {
    const { content } = req.body;
    if (!content || content.trim() === "") {
        return res.status(400).json({ status: "error", message: "投稿内容は必須です。" });
    }

    const newPost = {
        post_id: posts.length + 1,
        user: "guest",
        content,
        likes: 0,
        comments: []
    };
    posts.push(newPost);
    res.json({ status: "success", post: newPost });
});

// コメント機能
app.post("/api/comment", (req, res) => {
    const postId = parseInt(req.body.post_id, 10);
    const comment = req.body.comment;
    const post = posts.find(p => p.post_id === postId);

    if (post) {
        post.comments.push({ user: "guest", content: comment });
        res.json({ status: "success", comments: post.comments });
    } else {
        res.status(404).json({ status: "error", message: "投稿が見つかりません。" });
    }
});

// POST: 検索機能
app.post("/api/search", (req, res) => {
    const keyword = req.body.keyword;
    const results = posts.filter(post => post.content.includes(keyword));
    res.json({ status: "success", results }); // 検索結果を返す
});


// サーバー起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
