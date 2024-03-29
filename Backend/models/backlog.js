import mongoose from "mongoose";

const {Schema} = mongoose;

const backlogSchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, required: true, ref: 'Product', unique:true},
});

const Backlog = mongoose.model('Backlog', backlogSchema, 'backlog');

export default Backlog;