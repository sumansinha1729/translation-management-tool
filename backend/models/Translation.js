const mongoose=require('mongoose');

const TranslationSchema=new mongoose.Schema({
  key:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },

  values:{
    type:Map,
    of:String,
    default:{}
  }
},{timestamps:true});

module.exports=mongoose.model("Translation",TranslationSchema);

