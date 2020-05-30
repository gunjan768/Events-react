import React from 'react'
import { Comment } from 'semantic-ui-react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import EventDetailedChatForm from './EventDetailedChatForm';

const ChildCommentChat = ({ 
    child, selectedCommentId, showReplyForm, addEventComment, eventId, 
    handleCloseReplyForm, handleOpenReplyForm 
}) => 
{
    return (
        <Comment.Group>
            <Comment>

                <Comment.Avatar src = { child.photoURL || '/assets/user.png' } />
                
                <Comment.Content>
                    
                    <Comment.Author as = { Link } to = {`/profile/${child.uid}`}>
                        { child.displayName }
                    </Comment.Author>
                    
                    <Comment.Metadata>
                        <div>{ child.date && formatDistance(child.date, Date.now()) } ago</div>
                    </Comment.Metadata>

                    <Comment.Text>{ child.text }</Comment.Text>

                    <Comment.Actions>
                        <Comment.Action onClick = { () => handleOpenReplyForm(child.id) }>
                            Reply
                        </Comment.Action>
                        {
                            // If someone tries to reply to the replied commented then it will not create a nested structure rather 
                            // this comment will be considered as the child comment of that comment to whom it is the parent comment
                            // we are replying to. Hence parent of the comment to which we are replying to and the current comment 
                            // we are going to write (or reply) is same that's why we passed in parentId, the id of the parent 
                            // comment of the comment we are replying to.
                            showReplyForm && selectedCommentId === child.id &&
                            <EventDetailedChatForm
                                addEventComment = { addEventComment }
                                eventId = { eventId }
                                form = {`reply_${child.id}`}
                                closeForm = { handleCloseReplyForm }
                                parentId = { child.parentId }
                            />
                        }
                    </Comment.Actions>

                </Comment.Content>

            </Comment>
        </Comment.Group>
    );
}

export default ChildCommentChat;