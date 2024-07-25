const mongoose = require("mongoose");
const uri = "mongodb+srv://zwang570:sKC3XMs60g5qjNyJ@cluster0.2a4o8y9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", res => {
  console.log("connected");
});
mongoose.connection.on("error", err => {
  console.log("Mongoose connection error: " + err);
});
