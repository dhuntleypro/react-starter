import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const empoyeesSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    isAdmin: { type: Boolean },
    profileImageURL: { type: String },
    subscribed: { type: Boolean },
    subscribedToNewsletter: { type: Boolean },
    phoneNumber: { type: String },
    active: { type: Boolean },
  },

  {
    timestamps: true,
  }
);

const customersSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    profileImageURL: { type: String },
    subscribed: { type: Boolean },
    subscribedToNewsletter: { type: Boolean },
    phoneNumber: { type: String },
    billingActive: { type: Boolean },
    active: { type: Boolean },
  },

  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },

    homeAddress: { type: String, unique: true },
    homeCity: { type: String, unique: true },
    homeState: { type: String, unique: true },
    homeZipCode: { type: Number, unique: true },

    profileImageURL: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    loggedIn: { type: Boolean, default: false, unique: true },
    cartHasItems: { type: Boolean, unique: true },
    cartTotal: { type: Number, unique: true },
    agreedToTerms: { type: Boolean, unique: true },
    agreedtoTermsDate: { type: String, unique: true },
    agreedToContract: { type: Boolean, unique: true },

    birthday: { type: Number, unique: true },
    birthMonth: { type: Number, unique: true },
    birthYear: { type: Number, unique: true },
    gender: { type: String, unique: true },
    shirtSize: { type: String, unique: true },
    waistSizeInNumbers: { type: Number, unique: true },
    pantsLength: { type: String, unique: true },
    waistSize: { type: String, unique: true },
    subscribed: { type: Boolean, unique: true },
    subscribedToNewsletter: { type: Boolean, unique: true },
    userIsActive: { type: Boolean, unique: true },

    // favorites: [favoriteSchema],
    // employees: [empoyeesSchema],
    // customers: [customersSchema],
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
