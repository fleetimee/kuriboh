var express = require("express");
var router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("beranda", { title: "Beranda" });
});

router.get("/pengguna", function (req, res, next) {
  pool.query("SELECT * FROM pengguna", (err, hasil) => {
    console.log("hasil", hasil);
    res.render("pengguna", { daftar: hasil.rows });
  });
});

router.get("/penggunaform/:id?", function (req, res, next) {
  // Data Kota
  pool.query("SELECT * FROM kota", (err, hasilkota) => {
    var data = { kota: hasilkota.rows };

    // Mode edit
    if (req.params.hasOwnProperty("id") && req.params.id != "0") {
      pool.query(
        `SELECT * FROM pengguna WHERE pengguna_id=$1`,
        [req.params.id],
        (err, hasil) => {
          data.pengguna = hasil.rows[0];
          res.render("penggunaform", data);
        }
      );
    } else {
      let obj = {
        pengguna_id: 0,
        pengguna_email: "",
        pengguna_sandi: "",
        kota_id: 0,
      };
      data.pengguna = obj;
      res.render("penggunaform", data);
    }
  });
});

router.get("/penggunasimpan", function (req, res, next) {
  res.render("beranda", { title: "Pengguna" });
});

router.get("/penggunahapus", function (req, res, next) {
  pool.query(
    `DELETE FROM pengguna WHERE pengguna_id=$1`,
    [req.params.id],
    (err, hasil) => {
      console.log("hasil", hasil);
      res.redirect("/admin/pengguna");
    }
  );
});

module.exports = router;
