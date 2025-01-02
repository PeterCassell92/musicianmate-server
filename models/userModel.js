import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongooseHidden from 'mongoose-hidden'
import bcrypt from 'bcrypt'
import userSchema from './userSchema.js'

//* Hashing the password
userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

//* Comparing hashed password given with that stored in the DB
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

//* Virtual password
userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })
userSchema.pre('validate', function checkPassword(next) {
  if (
    this.isModified('password') &&
    this.password !== this._passwordConfirmation
  ) {
    this.invalidate('passwordConfirmation', 'should match password')
  }
  next()
})
userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, email: true } }))

export default mongoose.model('User', userSchema)