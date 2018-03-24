const MongoClient = require("mongodb").MongoClient;
const uuidv1 = require('uuid/v4');
const users = "usersData";

const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "effugio"
    }
};

var makeDoc = function (user_id, name, hashedPassword, dob, gender, location, occupation,
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

    // adding travel data seed
    //NM - Commenting the below collection drop line as starting the application gives 'MongoError: ns not found' error
    //NM - According to lecturer's code dropping the database rather than a specific collection.
    //await db.collection(travel).drop();
    await db.dropDatabase();

    //adding users data seed
    //NM - Commenting the below collection drop line as starting the application gives 'MongoError: ns not found' error
   //await db.collection(users).drop();
    userCollection = await db.createCollection(users);


    var userJack = makeDoc("jack_d", "Jack Dawson", "", "01/01/1990", "M", "Hoboken", "Teacher","jack_d@gmail.com",
        0.5, 0);
    userJack.hashedPassword = "$2a$16$mEbkQxGZt3a/qidjcCb6O..ah9yyDlGRj2lWpSK/ebQJJjSp1ISmS";
    userJack._id ="245b3e48-f959-464b-9615-b07d187d78a8";
    
    //password: password

    var userRose = makeDoc("rose_d", "Rose Dewitt", "", "11/03/1995", "F", "Hoboken", "Dancer", "rose_d@gmail.com",
        0.9, 0);
    userRose.hashedPassword = "$2a$16$biOzgZ.pj1lMO.sRg5MFZuAXLm5FCiWIuDu3hBO6.QXlEwrImJ28W";
    userRose._id="fc650072-441c-43f0-b50d-d681294488c5";    
    //password: password2

    userlily = makeDoc("lilly", "Lilly Evans", "", "11/27/1989", "F", "Jerseycity", "Student",
    "lilly_evans123@gmail.com", 0.7, 0);
    userlily._id="ea8cbd84-3e7f-48e6-a728-9fa314e943a1";
    
    usermartina = makeDoc("martina", "Martina Navratilova", "", "11/27/1989", "F", "Jersey City", "Sportswoman",
    "martina_nav123@gmail.com", 0.8, 0);
    usermartina.hashedPassword = "$2a$16$KJmxifBk6RayA7SmsXyhcuKqQNv.uaxwy/krRtuUODQ6VhqhV1biC";
    usermartina._id="03aad18c-f71d-4593-945b-56a878264504";
    
    //password: password5

    usermary = makeDoc("mary", "Mary Morgan", "", "11/27/1990", "F", "New York", "Bartender",
        "mary657@gmail.com", 0.6, 0);
    usermary._id="33aad18c-f41d-4593-945b-56a378264504";
        

    userjamesdean = makeDoc("jamesd", "James Dean", "", "11/27/1989", "M", "Newark", "Pet shop owner", 
    "james_dean@gmail.com", 0.8, 0);
    userjamesdean.hashedPassword = "$2a$16$QIKZ.4E5fQ/SMViy2R4YpOtdd1OG.oWboEa8eYGwdkS1coFUJ/GRS";
    userjamesdean._id="97bya930-167d-453a-9513-b6da678c2c9b";
    
    //password: password3

    userjessi = makeDoc("jessi", "Jessica Charles", "", "11/27/1989", "F", "Beverly hills", "Chef", 
        "jessica.baker@gmail.com", 0.8, 0);
    userjessi._id="94f55a9e-5d23-4f92-a54c-d9ce59a47904";
        

    userthomas = makeDoc("thomas", "Tom Marvolo", "", "11/27/1989", "M", "Cliffton", "Software Engineer",
        "tom.riddle@gmail.com", 0.7, 0);
    userthomas.hashedPassword = "$2a$16$Gyci2gGIPlr3lsAAuel.hOEK97aLjCqFaYE56RDURWdspHRiEUdTO";
    userthomas._id="9de813e6-fc51-422f-98e2-49b4316d2788";
    

    userdane = makeDoc("dani", "Daniel Cliff", "", "11/27/1989", "M", "Chicago", "Dancer",
        "daniel.cliff@gmail.com", 0.5, 0);
    userdane._id="7812ef31-40a9-4e79-900e-5947521738c6";
        
    
    userkate = makeDoc("kate", "Kate Winslet", "", "11/27/1998", "F", "New York", "Programmer",
        "kate.winslet@gmail.com", 0.5, 0);
    userkate._id="3817ef31-40a9-4e99-900e-5947981738c6";
        
    userleo = makeDoc("leo", "Leo Nardo Di Caprio", "", "11/27/1981", "M", "Cliffton", "Software Engineer",
    "leo.caprio@gmail.com", 0.7, 0);
    userleo._id="9997ef31-40a9-4e99-900e-5947981738c9";
    
    usertruementors = makeDoc("true mentors", "True Mentors", "", "01/01/1900", "M", "New York", "NGO",
    "trumentors@gmail.com", 0.0, 1);
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

    return usersins;

}


var exports = module.exports = runSetup;