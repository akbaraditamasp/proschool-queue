const fs = require("fs");
const succ = "./succeed_jobs";
const fail = "./failed_jobs";

fs.readdir(succ, (err, files) => {
  console.log("Jumlah tugas berhasil " + files.length);
});
fs.readdir(fail, (err, files) => {
  console.log("Jumlah tugas gagal " + files.length);
});
