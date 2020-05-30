import React, { Component } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import ChildCommentChat from './ChildCommentChat';

class EventDetailedChat extends Component 
{
	state = 
	{
		showReplyForm: false,
		selectedCommentId: null
	};

	handleCloseReplyForm = () => 
	{
		this.setState(
		{
			selectedCommentId: null,
			showReplyForm: false
		});
	}

	handleOpenReplyForm = id  => 
	{
		this.setState(
		{
			showReplyForm: true,
			selectedCommentId: id
		});
	}

	render() 
	{
		const { addEventComment, eventId, eventChat } = this.props;
		const { showReplyForm, selectedCommentId } = this.state;

		return (
			<React.Fragment>

				<Segment textAlign="center" attached="top" inverted color="teal" style = {{ border: 'none' }}>
					<Header>Chat about this event</Header>
				</Segment>

				<Segment attached>
					<Comment.Group>
					{
						eventChat && eventChat.map(comment => (
							<Comment key = { comment.id } >
								
								<Comment.Avatar src = {comment.photoURL || '/assets/user.png'} />

								<Comment.Content>

									<Comment.Author as = { Link } to = {`/profile/${comment.uid}`}>
										{ comment.displayName }
									</Comment.Author>

									<Comment.Metadata>
										<div> { comment.date && formatDistance(comment.date, Date.now()) } ago </div>
									</Comment.Metadata>
									
									<Comment.Text>{comment.text}</Comment.Text>
									
									<Comment.Actions>
										<Comment.Action onClick = { () => this.handleOpenReplyForm(comment.id) }>
											Reply
										</Comment.Action>
										{
											showReplyForm && selectedCommentId === comment.id &&
											<EventDetailedChatForm
												addEventComment = { addEventComment }
												eventId = { eventId }
												form = {`reply_${comment.id}`}
												closeForm = { this.handleCloseReplyForm }
												parentId = { comment.id }
											/>
										}
									</Comment.Actions>

								</Comment.Content>

								{
									comment.childNodes && comment.childNodes.map(child => (
										<ChildCommentChat
											key = { child.id } 
											child = { child }
											showReplyForm = { showReplyForm }
											selectedCommentId = { selectedCommentId }
											addEventComment = { addEventComment }
											eventId = { eventId }
											handleOpenReplyForm = { this.handleOpenReplyForm }
											handleCloseReplyForm = { this.handleCloseReplyForm }
										/>
									))
								}
							</Comment>
						))
					}
					</Comment.Group>

					<EventDetailedChatForm
						parentId = { 0 }
						addEventComment = { addEventComment }
						eventId = { eventId }
						form = { 'newComment' }
					/>

				</Segment>

			</React.Fragment>
		);
  	}
}

export default EventDetailedChat;