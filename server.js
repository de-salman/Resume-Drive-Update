var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
const path = require('path');
const cors = require('cors');

const {google} = require('googleapis');

const KEYFILEPATH = './SACred.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth( opts= {
  keyFile: KEYFILEPATH,
  scopes: SCOPES
})

  
  const drive = google.drive({
    version: 'v3',
    auth: auth,
  });



async function uploadFile(email,filename) {
  const filePath = path.join(__dirname, `/uploads/${filename}`);
  try {
    const response = await drive.files.create({
        
      requestBody: {
        name: email+'.pdf', //This can be name of your choice
        mimeType: 'application/pdf',
        parents: ['1XFYDcCAszHs_bAYEjhxIzcidMkpZefnc']
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}



var app = express();
// var corsOptions = {
//   origin: 'http://www.mccollinsmedia.com',
//   optionsSuccessStatus: 200 // For legacy browser support
// }

// app.use(cors(corsOptions));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage});
// app.post('/upload', function (req, res, next) {
//     upload(req, res, function (err) {
//         if (err) {
//             return res.end("Something went wrong:(");
//         }
//         console.log("worked");
//         console.log(req);
//         uploadFile("blah")
//     });
// })

app.post('/upload',upload.single('files'),(req,res,next) => {
  const file = req.file;
  console.log(req.body.Email);
  if(file){
    uploadFile(req.body.Email,req.file.originalname)
  }
})



app.listen(proccess.env.PORT || 5353);
