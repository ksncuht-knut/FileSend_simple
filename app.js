var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

var errorHandler = require('errorhandler');
var expressErrorhandler = require('express-error-handler');
var expressSession = require('express-session');

var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession(
    {
        secret : 'this is secret',
        resave : true,
        saveUninitialized : true
    }
));

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/arrive', static(path.join(__dirname, 'arrive')));
app.use(cors());

var protocol = multer.diskStorage(
    {
        destination : function (req, file, callback)
        {
            callback(null, 'arrive')
        },
        filename : function (req, file, callback)
        {
            callback(null, file.originalname)
        }
    }
);

var arrive = multer(
    {
        storage : protocol,
        limits :
        {
            files : 100
        }
    }
);

var router = express.Router();

router.route('/process/sending').post(arrive.array('sendingFile', 1), function(req, res)
{
    try
    {
        var files = req.files;
        
        var filename = ''
        var mimetype = ''
        var size = 0;

        if (Array.isArray(files))
        {
            for (var index = 0; index < files.length; index++)
            {
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        }
        else
        {
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }

        console.log(filename + " ?????? ?????? ??????.");

        res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
        res.write('<h1>????????? ?????????????????????.</h1>');
        res.write('<hr><br>');
        res.write('<p>?????? ?????? : ' + filename + '</p>');
        res.write('<p>?????? ?????? : ' + mimetype + '</p>');
        res.write('<p>?????? ?????? : ' + size + ' byte </p>');
        res.write(" <br><br><a href='../public/select.html'>?????? ???????????? ??????</a>");
        res.end();
    }
    catch(err)
    {
        console.dir(err.stack)
    }
});

app.use('/', router);

app.use('/', function(req, res)
{
    res.redirect("./public/select.html");
});

http.createServer(app).listen(3000, function()
{
    console.log("?????? ???????????? ??????.");
});