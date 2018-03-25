const MongoClient = require("mongodb").MongoClient;
const uuidv1 = require('uuid/v4');
const users = "usersData";
const deeds="deedsData";
const deedRatings="deeds_ratingData";


const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "KarmaHacks"
    }
};
let makeDeed = function (user_id, description, hours, karmaCount, date) {
        return {
            _id:uuidv1(),
            user_id: user_id,
            description: description,
            karmaCount: karmaCount,
            hours: hours,
            dateOfDeed:date
        }
    };
let makeDeedRating = function (user_id, voter_id, deed_id, rating, date) {
            return {
                _id:uuidv1(),
                user_id: user_id,
                voter_id: voter_id,
                deed_id: deed_id,
                rating: rating,
                dateOfRating: date
            }
        };


let makeDoc = function (user_id, name, hashedPassword, dob, gender, location, occupation,
email,points, isOrganisation) {
    return {
        user_id: user_id,
        name: name,
        hashedPassword: hashedPassword,
        dob: dob,
        gender: gender,
        location: location,
        occupation: occupation,
        email: email,
        points: points,
        isOrganisation: isOrganisation
    }
};


let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
let _connection = undefined


async function runSetup() {

    // create db connection
    const db = await MongoClient.connect(fullMongoUrl);

   await db.dropDatabase();

    userCollection = await db.createCollection(users);
    deedCollection= await db.createCollection(deeds);
    deedRatingCollection= await db.createCollection(deedRatings);


    var userJack = makeDoc("jack_d", "Jack Dawson", "", "01/01/1990", "M", "Hoboken", "Teacher","jack_d@gmail.com",
        58, 0);
    userJack.hashedPassword = "$2a$16$mEbkQxGZt3a/qidjcCb6O..ah9yyDlGRj2lWpSK/ebQJJjSp1ISmS";
    userJack._id ="245b3e48-f959-464b-9615-b07d187d78a8";
    
    //password: password

    var userRose = makeDoc("rose_d", "Rose Dewitt", "", "11/03/1995", "F", "Hoboken", "Dancer", "rose_d@gmail.com",
        92, 0);
    userRose.hashedPassword = "$2a$16$biOzgZ.pj1lMO.sRg5MFZuAXLm5FCiWIuDu3hBO6.QXlEwrImJ28W";
    userRose._id="fc650072-441c-43f0-b50d-d681294488c5";    
    //password: password2

    userlily = makeDoc("lilly", "Lilly Evans", "", "11/27/1989", "F", "Jerseycity", "Student",
    "lilly_evans123@gmail.com", 71, 0);
    userlily._id="ea8cbd84-3e7f-48e6-a728-9fa314e943a1";
    
    usermartina = makeDoc("martina", "Martina Navratilova", "", "11/27/1989", "F", "Jersey City", "Sportswoman",
    "martina_nav123@gmail.com", 0.8, 0);
    usermartina.hashedPassword = "$2a$16$KJmxifBk6RayA7SmsXyhcuKqQNv.uaxwy/krRtuUODQ6VhqhV1biC";
    usermartina._id="03aad18c-f71d-4593-945b-56a878264504";
    
    //password: password5

    usermary = makeDoc("mary", "Mary Morgan", "", "11/27/1990", "F", "New York", "Bartender",
        "mary657@gmail.com", 36, 0);
    usermary._id="33aad18c-f41d-4593-945b-56a378264504";
        

    userjamesdean = makeDoc("jamesd", "James Dean", "", "11/27/1989", "M", "Newark", "Pet shop owner", 
    "james_dean@gmail.com", 95, 0);
    userjamesdean.hashedPassword = "$2a$16$QIKZ.4E5fQ/SMViy2R4YpOtdd1OG.oWboEa8eYGwdkS1coFUJ/GRS";
    userjamesdean._id="97bya930-167d-453a-9513-b6da678c2c9b";
    
    //password: password3

    userjessi = makeDoc("jessi", "Jessica Charles", "", "11/27/1989", "F", "Beverly hills", "Chef", 
        "jessica.baker@gmail.com", 87, 0);
    userjessi._id="94f55a9e-5d23-4f92-a54c-d9ce59a47904";
        

    userthomas = makeDoc("thomas", "Tom Marvolo", "", "11/27/1989", "M", "Cliffton", "Software Engineer",
        "tom.riddle@gmail.com", 31, 0);
    userthomas.hashedPassword = "$2a$16$Gyci2gGIPlr3lsAAuel.hOEK97aLjCqFaYE56RDURWdspHRiEUdTO";
    userthomas._id="9de813e6-fc51-422f-98e2-49b4316d2788";
    

    userdane = makeDoc("dani", "Daniel Cliff", "", "11/27/1989", "M", "Chicago", "Dancer",
        "daniel.cliff@gmail.com", 45, 0);
    userdane._id="7812ef31-40a9-4e79-900e-5947521738c6";
        
    
    userkate = makeDoc("kate", "Kate Winslet", "", "11/27/1998", "F", "New York", "Programmer",
        "kate.winslet@gmail.com", 53, 0);
    userkate._id="3817ef31-40a9-4e99-900e-5947981738c6";
        
    userleo = makeDoc("leo", "Leo Nardo Di Caprio", "", "11/27/1981", "M", "Cliffton", "Software Engineer",
    "leo.caprio@gmail.com", 71, 0);
    userleo._id="9997ef31-40a9-4e99-900e-5947981738c9";
    
    usertruementors = makeDoc("true mentors", "True Mentors", "", "01/01/1900", "M", "New York", "NGO",
    "trumentors@gmail.com", 64, 1);
    userleo._id="9997ef31-40a9-4e99-900e-5947981738c9";
    
    //await connectionsColl.insert(connection3
    

    usersList = [];
    usersList.push(userJack);
    usersList.push(userRose);
    usersList.push(userlily);
    usersList.push(usermary);
    usersList.push(usermartina);
    usersList.push(userjamesdean);
    usersList.push(userjessi);
    usersList.push(userthomas);
    usersList.push(userdane);
    usersList.push(userkate);
    usersList.push(userleo);

    res = await userCollection.insertMany(usersList);
    usersins = await userCollection.find().toArray();
    // console.log(usersins);

    var deedJackD_1 = makeDeed(userJack._id, "Spent time at the orphanage", 2, 4, "11/27/2017");
    var deedJackD_2 = makeDeed(userJack._id, "Spent time at the orphanage", 2, 4, "12/27/2017");
    var deedRose_1 = makeDeed(userRose._id, "Built website for local soup kitchen", 20, 10, "02/02/2018");
    var deedRose_2 = makeDeed(userRose._id, "Ran marathon for cancer research", 5, 10, "02/02/2018");

    deedsList=[];
    deedsList.push(deedJackD_1);
    deedsList.push(deedJackD_2);
    deedsList.push(deedRose_1);
    deedsList.push(deedRose_2);

    deedsColl = await deedCollection.insertMany(deedsList);
    deedsins = await deedCollection.find().toArray();
    console.log("*********   DEEDS INSERTED *************")
    console.log(deedsins);
    console.log("***********************************\n\n")


    var deed1Rating1= makeDeedRating(deedJackD_1.user_id,userRose._id,deedJackD_1._id,2,"11/27/2017");
    var deed1Rating2= makeDeedRating(deedJackD_1.user_id,userdane._id,deedJackD_1._id,2,"11/27/2017");

    var deed2Rating1= makeDeedRating(deedJackD_1.user_id,userRose._id,deedRose_1._id,2,"12/27/2017");
    var deed2Rating2= makeDeedRating(deedJackD_1.user_id,userdane._id,deedRose_1._id,2,"11/28/2017");

    deedRatingsLst=[];
    deedRatingsLst.push(deed1Rating1);
    deedRatingsLst.push(deed1Rating2);
    deedRatingsLst.push(deed2Rating1);
    deedRatingsLst.push(deed2Rating2);

    ratingsColl= await deedRatingCollection.insertMany(deedRatingsLst);
    ratingsIns=await deedRatingCollection.find().toArray();
    console.log("*********   DEEDS RATING INSERTED *************")
    console.log(ratingsIns);
    console.log("***********************************\n\n")

    return usersins;

}


var exports = module.exports = runSetup;