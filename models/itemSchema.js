const mongoose=require('mongoose');
const itemSchema=mongoose.Schema;

const itemsSchema = new itemSchema({
    pname:String,
    source:String,
    destination:String,
    remark:String
});

module.exports=mongoose.model('items',itemsSchema);