import Request from '../models/Request.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const createRequest = async (req, res) => {
    const { sendersEmail, sendersId, roomName, username, userId, requestType } = req.body;
  
    if (!sendersEmail || !sendersId || !userId || !requestType || !username) {
        throw new Error("Please provide sendersEmail, sendersId, userId, username, requestType.")
    }
    
    await Request.find({ sendersEmail, sendersId, sendersEmail, username, requestType }).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {

            if (result.length > 0) {
                res.status(StatusCodes.CREATED).json({ message: 'Request was created successfully', data: result });
                return
            }
        
            const request = new Request({ sendersEmail, sendersId, roomName, userId, username, requestType, createdAt: new Date() });

            request.save((error) => {
                if (error) {
                    throw new Error(error)
                } else {
                    res.status(StatusCodes.CREATED).json({ message: 'Request was created successfully' , data: request});
                }
            })
            }
        });
};

const getRequestByUserId = async (req, res) => {
    const { id } = req.params;
  
    
    Request.find({userId: id}).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {
            res.status(StatusCodes.CREATED).json({ message: 'Request was successful' , data: result});
        }
    })

};


const updateRequest = async (req, res) => {
    const  {userId, friendId, requestID } = req.body
  
    try {
        let me = await User.findById(userId);
        let friend = await User.findById(friendId);
        await Request.findByIdAndDelete(requestID)

        friend.friends = friend.friends ? friend.friends.concat(me.id) : [me.id]
        me.friends = me.friends ?  me.friends.concat(friend.id) : [friend.id]

        me.save()
        friend.save()
        
        res.status(StatusCodes.CREATED).json({ message: 'Request was updated successfully'});

    } catch (error) {
        throw new Error(error)
    }

};



const deleteRequest = async (req, res) => {
    const { requestID } = req.body
    
    console.log(req.body)
  
    try {
         await Request.findOneAndDelete(requestID)
    
        res.status(StatusCodes.CREATED).json({ message: 'Request was deleted successfully'});

    } catch (error) {
        throw new Error(error)
    }

};


export { createRequest, getRequestByUserId, updateRequest, deleteRequest };
