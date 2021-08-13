const mongoose = require('mongoose')

const url = process.env.MONGODB_URL || 'mongodb+srv://martins:P9v2Mi0TjHtgSGeG@cluster0.busl5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(url ,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
mongoose.set('useFindAndModify', false);