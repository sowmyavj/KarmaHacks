const uuidv1 = require('uuid/v4');
const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const mongoCollections = require("../config/mongoCollections");
const deedsRatingList = mongoCollections.deeds_rating;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = Promise.promisifyAll(require("bcrypt"));



let exportedMethods = {

    async  getDeedRating(_id) {
        if (!_id) throw "You must provide an id to search for a deed rating";
        const deedsRatingCollection = await deedsRatingList();
        const listOfDeedRatings = await deedsRatingCollection.find({ _id: _id }).limit(1).toArray();
        if (listOfDeedRatings.length === 0) throw "Could not find deed rating with id " + _id;
        return listOfDeedRatings[0];
    },

    

    async addDeedRating(deedRating) {

        const deedsRatingCollection = await deedsRatingList();

        const newDeedRating = {
            _id: uuidv1(),
            voter_id: deedRating.voter_id,
            user_id:deedRating.user_id,
            deed_id: deedRating.deed_id,
            rating: deedRating.rating,
            dateOfRating: deedRating.dateOfRating
        };

        const newInsertInformation = await deedsRatingCollection.insertOne(newDeedRating);
        const newId = newInsertInformation.insertedId;
        return await this.getDeedRating(newId);
    },


    async getAllDeedRatingsForDeedId(deedId) {
        const deedsRatingCollection = await deedsRatingList();
        const deedRatingsForDeed = await deedsRatingCollection.find({ deed_id: deedId }).toArray();
        if (deedRatingsForDeed.length === 0) {
            return null;
        }
        return deedRatingsForDeed;
    }

}

module.exports = exportedMethods;