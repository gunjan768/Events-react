import React, {Component} from 'react';
import {Feed} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import { formatDistance } from 'date-fns';

class EventActivityItem extends Component 
{
    renderSummary = (activity, currentUser ) => 
    {
        switch(activity.type) 
        {
            case 'newEvent':
                return (
                    <div>
                        New Event! {' '}
                        { 
                            currentUser === activity.hostUid ? 
                                <React.Fragment>
                                    <Feed.User as = { Link } to = {{ pathname: '/profile/' + activity.hostUid }}>
                                        {'You'}
                                    </Feed.User> {'are'}
                                </React.Fragment>
                            : 
                                <Feed.User as = { Link } to = {{ pathname: '/profile/' + activity.hostUid }}>
                                    { activity.hostedBy + ' is' }
                                </Feed.User>
                        }
                        {' '} hosting {' '}
                        <Link to = {{ pathname: '/event/' + activity.eventId }}>{ activity.title }</Link>
                    </div>
                );

            case 'cancelledEvent':
                return (
                    <div>
                        
                        {'Event cancelled..!! '}

                        { 
                            currentUser === activity.hostUid ? 
                                <React.Fragment>
                                    <Feed.User as = { Link } to = {{ pathname: '/profile/' + activity.hostUid }}>
                                        {'You'}
                                    </Feed.User> {'have'}
                                </React.Fragment>
                            : 
                                <Feed.User as = { Link } to = {{ pathname: '/profile/' + activity.hostUid }}>
                                    { activity.hostedBy }
                                </Feed.User>
                        }

                        {' '} has cancelled {' '}
                        
                        <Link to = {{ pathname: '/event/' + activity.eventId }}>{ activity.title }</Link>

                    </div>
                );

            default:
                return;
        }
    }

    render() 
    {
        const { activity, currentUser } = this.props;

        return (
            <Feed.Event>
                <Feed.Label><img src = { activity.photoURL || '/assets/user.png' } alt=''/></Feed.Label>
                <Feed.Content>
                    <Feed.Summary>{ this.renderSummary(activity, currentUser) }</Feed.Summary>
                    <Feed.Meta>
                        <Feed.Date>
                            { activity.timestamp && formatDistance(activity.timestamp.toDate(), Date.now()) } ago
                        </Feed.Date>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
        );
    }
}

export default EventActivityItem;