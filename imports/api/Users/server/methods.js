import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

export const createNewUser = new ValidatedMethod({
  name: 'users.createNewUser',
  validate: new SimpleSchema({
    "email": { type: String },
    "password": { type: String },
    "username": { type: String },
    "profile": { type: Object },
    "profile.name": { type: Object },
    "profile.name.first": { type: String },
    "profile.name.last": { type: String },
  }).validator(),
  run(newAdmin) {
    try {
      var id = Accounts.createUser(newAdmin);
      return id
    } catch (exception) {
      Meteor.users.remove(id);
      throw new Meteor.Error('accounts.createuser.error',
        `Error creating new user. ${exception}`);
    }
  }
})

export const usersSendVerificationEmail = new ValidatedMethod({
  name: 'users.sendVerificationEmail',
  validate: null,
  run() {
    return Accounts.sendVerificationEmail(this.userId);
  }
});

export const usersEditProfile = new ValidatedMethod({
  name: 'users.editProfile',
  validate: new SimpleSchema({
    "previousEmailAddress": { type: String },
    "emailAddress": { type: String },
    "profile": { type: Object },
    "profile.name": { type: Object },
    "profile.name.first": { type : String },
    "profile.name.last": { type : String },
  }).validator(),
  run(profile) {
    return editProfile({ userId: this.userId, profile })
    .then(response => response)
    .catch((exception) => {
      throw new Meteor.Error('500', exception);
    });
  }
});

export const usersCheckUsername = new ValidatedMethod({
  name: 'users.checkUsername',
  validate: new SimpleSchema({
    "potentialUserName": { type: String }
  }).validator(),
  run({potentialUserName}) {
    return Meteor.users.find({"username": potentialUserName}).count();
  }
});

rateLimit({
  methods: [
    'users.editProfile',
    'users.createNewAdminUser',
    'users.checkUsername',
  ],
  limit: 5,
  timeRange: 1000,
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
  ],
  limit: 1,
  timeRange: 5000,
});
