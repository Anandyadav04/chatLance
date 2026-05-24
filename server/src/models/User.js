import mongoose from "mongoose";
import bcrypts from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        },

        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        },

        password: {
        type: String,
        required: true,
        minlength: 6,
        },

        avatar: {
        type: String,
        default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;