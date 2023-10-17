const mongoose = require("mongoose");
const {Schema} = mongoose;

const NotesSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logUser'
  },
  title:{
    type:String,
    required:true,
  },
  note:{
    type:String,
    required:true,
  },
  lastEdited:{
    type:Date,
    default: Date.now
  }
});

module.exports = mongoose.model("markdown", NotesSchema);