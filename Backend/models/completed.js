import mongoose from 'mongoose';

const {Schema} = mongoose;

const completedSchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, required: true, ref: 'Product', unique:true},
    rating: {type: Number, required: true}
});

const Completed = mongoose.model('Completed', completedSchema, 'completed');

export default Completed;