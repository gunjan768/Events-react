import moment from 'moment';

export const objectToArray = object => 
{
    if(!object)
    return {};

    const attendeesArray = Object.entries(object);

    // console.log("attendeesArray : ",attendeesArray);

    return attendeesArray.map(item => 
    {
        // Object.isExtensible(object) will tell us that whether an object is expandable (extensible) or not i.e can we add any extra property 
        // to this object. item[1] is an object which is in-extensible hence we can't add any extra property to this object. Hence we created 
        // an new object using Object.create().
        const obj = Object.create(item[1]);

        // console.log(Object.isExtensible(item[1]));
        
        return Object.assign(obj, { id: item[0] } )
    })
}

export const createNewEvent = (user, photoURL, event) => 
{
    event.date = moment(event.date).toDate();

    return {
        ...event,
        hostUid : user.uid,
        hostedBy : user.displayName,
        hostPhotoURL : photoURL || '/assets/user.png',
        created : Date.now(),
        attendees : 
        {
            [user.uid] : 
            {
                going: true,
                joinDate: Date.now(),
                photoURL: photoURL || '/assets/user.png',
                displayName: user.displayName,
                host: true
            }
        }
    }
}

export const createDataTree = dataset => 
{
    let hashTable = {};

    // Remember that every data is inside the '__proto__' prop. Console for more clearance.
    dataset.forEach(comment => 
    {  
        hashTable[comment.id] = { ...comment.__proto__, id: comment.id, childNodes: [] }
    });

    let dataTree = [];

    // if parentId === 0 then it means that it is the top level comment and not the replied comment of any comments. But if
    // parentId !== 0 then it means that it is the second level comment means it the replied of any of one of the comments and 
    // it's parentId is equal to the id of the main comment whose it is the replied comment. Remember that object and array both
    // are reference type that any changes made will be reflected to the origin object.
    dataset.forEach(comment => 
    {
        if(comment.parentId) 
        hashTable[comment.parentId].childNodes.push(hashTable[comment.id]);
        else 
        dataTree.push(hashTable[comment.id]);
    })

    // console.log("helper.js dataset ",dataset);
    // console.log("helper.js dataTree ",dataTree);
    // console.log("helper.js hashTable ",hashTable);

    return dataTree;
}