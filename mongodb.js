const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const ObjectId = mongodb.ObjectID
//const id = new ObjectId() 
// console.log(id.getTimestamp())


const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
MongoClient.connect(connectionUrl, { useUnifiedTopology:true}, (error, client)=>{
    if(error){
        return console.log("unable to connect to the database!!")
    }
    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     _id: id,
    //     name:'dad',
    //     age:72

    // }, (error, result)=>{
    //     if(error){
    //         return console.log("unable to insert user")
    //     }console.log(result.ops)
    // })



    // db.collection('users').insertMany([
    //     {
    //         name:'raymond',
    //         age:'26'
    //     },{
    //         name:'valeria',
    //         age:24
    //     }
    // ], (error, result)=>{
    //     if(error){
    //         return console.log('this was unsuccessful')
    //     }
    //     console.log(result.ops)
    // })



    // db.collection('tasks').insertMany([
    //     {
    //         description: 'clean the house',
    //         completed:true
    //     },
    //     {
    //         description: 'renew licence',
    //         completed:false
    //     },
    //     {
    //         description: 'have i finished this crud operation',
    //         completed:false
    //     }
    // ], (error, result)=>{
    //     if (error){
    //         return console.log('unable to insert task')
    //     }
    //     console.log(result.ops)
    // })


                        //find


    // db.collection('users').findOne({name:'tess',},(error, user)=>{
    //     if(error){
    //         return console.log('no user by that name was found')
    //     }
    //     console.log(user)
    // })




    // db.collection('users').find({ name:'sharon'}).toArray( (error, users)=>{
    //     console.log(users)
    // })


    // db.collection('users').find({ name:'sharon'}).count( (error, users)=>{
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectId("5eb391afd2a47ceb7e742eb9")}, (error, task)=>{
    //     console.log(task)
    // })

    // db.collection('tasks').find({ completed: false}).toArray( (error, tasks)=>{
    //     console.log(tasks)
    // })




    // using promises update

    // const updateName = db.collection('users').updateOne({
    //     _id: new ObjectId('5eb39514b5e38aeb8ff2e502')
    // }, {
    //     $set:{
    //         name: 'Mr yogo'
    //     },
    //     $inc:{
    //         age: 5
    //     }
    // })

    // updateName.then( (result)=>{
    //     console.log(result)
    // }).catch( (error)=>{
    //     console.log('error', error)
    // })



    // db.collection('tasks').updateMany({
    //     completed:false

    // }, {
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })



            //delete operation

    // db.collection('users').deleteMany({
    //     age:27
    // }).then( (result)=>{
    //     console.log(result)
    // }).catch( (error)=>{
    //     console.log('error', error)
    // })


    db.collection('users').deleteOne({ 
        _id: new ObjectId('5eb38eb34cf1d4eb623ee962')
    }).then( (result)=>{
        console.log(result)
    }).catch( (error)=>{
        console.log(error)
    })
})