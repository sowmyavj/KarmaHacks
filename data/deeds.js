const uuidv1 = require('uuid/v4');
const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const mongoCollections = require("../config/mongoCollections");
const deedsList = mongoCollections.deeds;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = Promise.promisifyAll(require("bcrypt"));
const deedRating = require("./deeds_rating");
const users = require("./users");



let exportedMethods = {

    async  getDeed(_id) {
        if (!_id) throw "You must provide an id to search for a deed";
        const deedCollection = await deedsList();
        const listOfDeeds = await deedCollection.find({ _id: _id }).limit(1).toArray();
        if (listOfDeeds.length === 0) throw "Could not find deed with id " + _id;
        return listOfDeeds[0];
    },



    async addDeed(deed) {

        const deedsCollection = await deedsList();

        const newDeed = {
            _id: uuidv1(),
            user_id: deed.user_id,
            description: deed.description,
            hours: deed.hours,
            karmaCount: deed.karmaCount,
            dateOfDeed: deed.dateOfDeed
        };

        const newInsertInformation = await deedsCollection.insertOne(newDeed);
        const newId = newInsertInformation.insertedId;
        //console.log("inserted: "+newId);
        return await this.getDeed(newId);
    },

    async incrementKarmaCount(deed, inc) {

        oldDeed = await this.getDeed(deed._id);
        const updatedDeed = {
            _id: oldDeed._id,
            user_id: oldDeed.user_id,
            description: oldDeed.description,
            hours: oldDeed.hours,
            karmaCount: oldDeed.karmaCount,
            dateOfDeed: oldDeed.dateOfDeed
        };

        if (inc != null) {
            updatedDeed.karmaCount = updatedDeed.karmaCount + inc;
        }

        const deedCollection = await deedsList();
        output = await deedCollection.updateOne({ _id: updatedDeed._id }, updatedDeed);
        return await this.getDeed(updatedDeed._id);
    },


    async removeDeed(id) {
        const deedCollection = await deedsList();
        const deletionInfo = await deedCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            return null;
        }
        return deletionInfo.deletedCount;
    },

    async getAllDeedsForUserId(userId) {
        const deedCollection = await deedsList();
        const allDeeds = await deedCollection.find({ user_id: userId }).toArray();
        if (allDeeds.length === 0) {
            return null;
        }
        return allDeeds;
    },

    async getAllDeedRatings(id) {
        allDeedRatings = await deedRating.getAllDeedRatingsForDeedId(id);
        return allDeedRatings;
    },

    async calculateKarmaCount(id) {
        allDeedRatings = await deedRating.getAllDeedRatingsForDeedId(id);
        let count = 0;
        if(allDeedRatings == null){
            return 0;
        }
        for (var singleRating of allDeedRatings) {
            count += singleRating.rating;
        }
        return count;
    },
    async getDeedsForAllUsers(userId) {
        const deedCollection = await deedsList();
        const allDeeds = await deedCollection.find().toArray();
        if (allDeeds.length === 0) {
            return null;
        }
        //console.log(allDeeds);
        //let user, karmacount, karmaRating;
        let deedlist = [];
       
        for (var d of allDeeds) {
  //          console.log("One deed")
   //         console.log(d);
            if (userId != d.user_id) {
                let deedObject = {};
                let user = await users.getUser(d.user_id);
                let c1 = await this.calculateKarmaCount(d._id);
                let c2 = await users.calculatePoints(d.user_id);
                //deedObject.user = user;
                deedObject.karmaCount = c1;
                deedObject.karmaPoints = c2;
                deedlist.push(deedObject);
            }

        }

        return deedlist;
    }

}

module.exports = exportedMethods;