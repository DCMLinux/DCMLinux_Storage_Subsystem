var path = require('path'),
fs = require("fs");
exports.privateKey = fs.readFileSync('/dcmlinux/certs/selfsigned/selfsigned.key').toString();
exports.certificate = fs.readFileSync('/dcmlinux/certs/selfsigned/selfsigned.cert').toString();
