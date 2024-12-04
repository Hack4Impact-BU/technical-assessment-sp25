const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 4000;
const songRouter = require('./routes/songs');
const commentsRouter = require('./routes/comments');

app.use(bodyParser.json());
app.use(cors());
app.use('/api/songs', songRouter);
app.use('/api/comments', commentsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})