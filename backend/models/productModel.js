import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    color: { type: String },
    sizeAsString: { type: String },
    sizeInNumbers: { type: Number },
    likes: { type: Number },
    price: { type: Number },
    views: { type: Number },
    active: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],

    active: { type: Boolean, required: true },
    views: { type: Number },
    gender: { type: String },
    color: { type: String },
    size: { type: String },
    sizeInNumbers: { type: Number },
    yearMade: { type: Number },
    likes: { type: Number },
    condition: { type: String },
    weightInKilograms: { type: Number },
    variantType: { type: Boolean, required: true },
    // variants: [variantSchema],
    onSale: { type: Boolean, required: true },
    salePrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
