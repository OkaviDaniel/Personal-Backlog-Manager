import mongoose from "mongoose";

const {Schema} = mongoose;

const currentSchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, required: true, ref: 'Product', unique: true},
});

const Current = mongoose.model('Current', currentSchema, 'current');

export default Current;