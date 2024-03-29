import mongoose from 'mongoose';

const {Schema} = mongoose;

const droppedSchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, required: true, ref: 'Product', unique: true},
    reason: {type: String, required: true}
});

const Dropped = mongoose.model('Dropped', droppedSchema, 'dropped');

export default Dropped;