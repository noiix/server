// const User = require('../../models/userModel')

// const UpdateLastLocation = async (ipInfo, userId) => {
//     let lastLocation = {
//         type: "Point",
//         coordinates: ipInfo.ll
//     };
//     let savedUser = await User.findByIdAndUpdate(
//         userId, 
//         {
//             ipInfo,
//             lastLocation
//         },
//         {new: true}
//     );
//     return savedUser;
// };

// module.exports = {UpdateLastLocation};