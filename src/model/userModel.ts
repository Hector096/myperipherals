import mongoose, { Schema, Document } from 'mongoose';



export type  IUser =  Document & {
  email: string;
  name: string;
  password: string;
  date : Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  tokens: AuthToken[];
}
export interface AuthToken {
  accessToken: string;
  kind: string;
}
const UserSchema = new Schema<IUser>({
email: { type: String, unique: true },
name:String,
password:String,
passwordResetToken: String,
passwordResetExpires: Date,
tokens: Array,
},{timestamps: true}
);

// Export the model and return your IUser interface
export const User = mongoose.model<IUser>('User', UserSchema);