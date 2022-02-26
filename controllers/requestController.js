import Request from '../models/Request.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const createRequest = async (req, res) => {
  const { sendersEmail, sendersId, roomName, userId, requestType } = req.body;
  

  if (!sendersEmail || !sendersId || !userId || !requestType) {
    throw new Error("Please provide sendersEmail, sendersId, userId, requestType.")
  }
    
       Request.find({sendersEmail, sendersId, sendersEmail, requestType }).exec((error, result) => {
        if (error) {
            throw new Error(error)
        } else {
                const request = new Request({ sendersEmail, sendersId, roomName, userId, requestType });
    
                request.save((error) => {
                    if (error) {
                        throw new Error(error)
                    } else {
                        res.status(StatusCodes.CREATED).json({ message: 'Request was created successfully' , data: request});
                    }
                })
        }
       })
    
    
  

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
        let report = await Request.findById(requestID)

        friend.friends = friend.friends ? friend.friends.concat(me.id) : [me.id]
        me.friends = me.friends ?  me.friends.concat(friend.id) : [friend.id]
        
        await report.remove()
        me.save()
        friend.save()
        
        res.status(StatusCodes.CREATED).json({ message: 'Request was updated successfully'});

    } catch (error) {
        throw new Error(error)
    }

};



const deleteRequest = async (req, res) => {
    const  { requestID } = req.params
  
    try {
        let report = await Request.findById(requestID)
        await report.remove()
     
        res.status(StatusCodes.CREATED).json({ message: 'Request was deleted successfully'});

    } catch (error) {
        throw new Error(error)
    }

};


export { createRequest, getRequestByUserId, updateRequest, deleteRequest };
