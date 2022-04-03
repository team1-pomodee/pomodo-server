import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { ObjectId } from 'mongodb';

const searchUsers = async (req, res) => {
    const { user } = req.query;

    const regex = new RegExp(`^${user}.*$`, 'i');

    User.find({username:  { $regex:  regex}}).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {
            res.status(StatusCodes.CREATED).json({ message: 'Request was successful' , data: result, count: result.length});
        }
    })

};

const getFriendsByUserId = async (req, res) => {
    const { userId } = req.params;

    User.find({_id: userId}).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {
            User.find({
                _id: {
                $in: result[0].friends
            }}).exec((error, data) => {
                if (error) {
                    throw new Error(error)
                } else {
                    
                    res.status(StatusCodes.CREATED).json({ message: 'Request was successful' , data: data, count: data.length});
                }
            })
        }
    })

};


const getSingleUser = async (req, res) => {
    const { userId } = req.params;

    User.findOne({_id: ObjectId(userId)}).exec((error, result) => {
        if (error) {
            console.log(error)
            throw new Error(error)
        } else {
            res.status(StatusCodes.CREATED).json({ message: 'Request was successful' , data: result});
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




export { searchUsers,getFriendsByUserId, unFriendUsers, getSingleUser };
