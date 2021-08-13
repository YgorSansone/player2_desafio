const jwt = require("jsonwebtoken");
var secret = "Player2=-098712222137 dsajdjhgasgdkdl;ads;jkds ueyyqwPlayer2";
module.exports = async function (req, res, next) {
    const authToken = req.headers['authorization']
    if (authToken != undefined) {
        try {
            const bearer = authToken.split(' ');
            var token = bearer[1];
            var decoded = await jwt.verify(token, secret)
            if (decoded.email != "") {
                console.log(decoded)
                next();
            } else {
                res.status(403)
                res.json({ err: "voce nao tem permissao" })
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(403)
        res.json({ err: "voce nao tem permissao" })
    }
}