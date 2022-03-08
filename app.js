const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
var mongoose = require('mongoose');
const CM = require('./common-modules/index')

require('dotenv').config({
	path: path.join(__dirname) + '/.env'
});
var connection = mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useCreateIndex: true
}); 


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended : true}))
app.use(helmet());
app.use(cors());

// Routes goes here
app.use('/api/v1/a', require('./Routes/admin'));
app.use('/api/v1/c', require('./Routes/customer'));
// app.use('/api/v1/v', require('./routes/vendor'));

app.get("/health", (req, res) => {
	var git = require('git-rev-sync');
	var pjson = require('./package.json');      
	// console.log(git)
	res.status(200).json({
		project: pjson.name,
		running: true,
		version: pjson.version,
		branch: git.branch(),
		head: git.short(),
		'head-long': git.long(),
		date: git.date(),
		repoName: git.remoteUrl().split("/")[4].split(".")[0],
		mode: process.env.MODE,
	})
});

app.listen(process.env.PORT);
console.log(process.env.PORT + ' is the magic port');