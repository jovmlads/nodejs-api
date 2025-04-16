import mongoose from "mongoose";

// SCHEMA

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
})

// MODEL

export const UserModel = mongoose.model('User', UserSchema)

// ACTIONS

// get all users
export const getUsers = () => UserModel.find()
// does user exist
export const getUsersByEmail = (email: string) => UserModel.findOne({ email })
// determine whether user is logged in 
export const getUsersBySessionToken = (sessionToken: string) => UserModel.findOne({ 
    'authentication.sessionToken': sessionToken 
})
// find user by ID
export const getUserById = (id: string) => UserModel.findById(id)
// create user
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then(user => user.toObject())
// delete user by ID
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })
// update user by ID
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findOneAndUpdate({ id, values })