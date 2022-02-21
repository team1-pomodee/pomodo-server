import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const searchUsers = async (req, res) => {
    const { user } = req.query;

    const regex = new RegExp(`^${user}.*$`, 'g');

    User.find({username:  { $regex:  regex}}).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {
            res.status(StatusCodes.CREATED).json({ message: 'Request was successful' , data: result, count: result.length});
        }
    })

};


const unFriendUsers = async (req, res) => {
    const  {userId, friendId } = req.body
  
    try {
        let me = await User.findById(userId);
        let friend = await User.findById(friendId);

        friend.friends = friend.friends ? friend.friends.filter(user => user !== userId) : []
        me.friends = me.friends ? me.friends.filter(user => user !== friendId) : []
    
        
        console.log(friend, me);

        me.save()
        friend.save()
        
        res.status(StatusCodes.CREATED).json({ message: 'Request was updated successfully'});

    } catch (error) {
        throw new Error(error)
    }

};




export { searchUsers, unFriendUsers };
