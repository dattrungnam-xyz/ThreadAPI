import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Please provide your username!"],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: "Media",
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  private: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  instagram: {
    type: String,
    validate: {
      validator: function (value) {
        return (
          value.startsWith("instagram.com") ||
          value.startsWith("https://www.instagram.com")
        );
      },
      message: "Instagram url invalid!",
    },
  },
  bio: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  followersCount: {
    type: Number,
  },

  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  followingCount: {
    type: Number,
  },
  //dang yeu cau theo doi ai
  followingRequest: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  // nguoi khac yeu cau theo doi
  followerRequest: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.passwordChangedAfter = async function (iat) {
  if (this.passwordChangedAt) {
    const iatDate = new Date(iat * 1000);
    return this.passwordChangedAt > iatDate;
  }
  return false;
};
userSchema.post(/^find/, function (doc) {
  doc.followingCount = doc.following?.length || 0;
  doc.followersCount = doc.followers?.length || 0;
});

userSchema.pre(/^find/, function (next) {
  this.populate("avatar");
  next();
});

const User = mongoose.model("User", userSchema);

export { User };
