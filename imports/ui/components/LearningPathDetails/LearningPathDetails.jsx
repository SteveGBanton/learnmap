import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { green500, red500 } from 'material-ui/styles/colors';

import { learningPathsUpvote, learningPathsDownvote } from '../../../api/LearningPath/methods';

import './LearningPathDetails.scss';

export default class LearningPathDetails extends React.Component {
  constructor(props) {
    super(props);

    this.upvoteHandler = this.upvoteHandler.bind(this);
    this.downvoteHandler = this.downvoteHandler.bind(this);
  }

  upvoteHandler() {
    try {
      const { _id } = this.props.lp;
      learningPathsUpvote.call({ _id });
    } catch (err) {
      Bert.alert({
        message: err.reason,
        type: 'alert',
        icon: 'fa-ban',
      });
    }
  }

  downvoteHandler() {
    try {
      const { _id } = this.props.lp;
      learningPathsDownvote.call({ _id });
    } catch (err) {
      Bert.alert({
        message: err.reason,
        type: 'alert',
        icon: 'fa-ban',
      });
    }
  }

  renderSkills() {
    const { skills } = this.props.lp;
    return skills.map((skill, i) => (
      <Chip className="lp-skill" key={`skill-${i + 1}`} style={{ margin: '5px 5px 15px 5px' }}>
        {skill}
      </Chip>),
    );
  }

  render() {
    const {
      _id,
      title,
      mentor,
      mentorName,
      thumbnail,
      aggregatedVotes,
      voted,
    } = this.props.lp;

    return (
      <Card className="lp-details-container">
        <Link to={`/learning-path/${_id}`}>
          <CardHeader className="lp-header">
            <CardMedia className="lp-media">
              <img className="lp-thumbnail" src={thumbnail} alt={title} />
            </CardMedia>
          </CardHeader>
          <Divider />
        </Link>
        <div className="lp-content">
          <div className="lp-title">
            <CardTitle
              className="lp-title-text"
              title={title}
              titleStyle={{ fontSize: '18px' }}
            />
            {/*
              TODO Uncomment this out when we have the savedLearningPaths field added to Users

              Meteor.user.savedLearningPaths &&
              Meteor.user.savedLearningPaths.indexOf(_id) !== -1 ?
                <FontIcon
                  className="fa fa-check-circle lp-user-subscribed-icon"
                  color={green500}
                /> :
                null
            */}
          </div>
          <div className="lp-skills">
            {this.renderSkills()}
          </div>
          <Divider />
          <CardActions className="lp-votes">
            <IconButton
              className="lp-vote-btn lp-upvote"
              tooltip="Upvote!"
              iconClassName="fa fa-thumbs-o-up"
              iconStyle={voted[Meteor.userId()] === 1 ?
                { color: green500 } :
                { color: null }
              }
              onClick={this.upvoteHandler}
            />
            <span className="lp-vote-count">{aggregatedVotes}</span>
            <IconButton
              className="lp-vote-btn lp-downvote"
              tooltip="Downvote..."
              iconClassName="fa fa-thumbs-o-down"
              iconStyle={voted[Meteor.userId()] === -1 ?
                { color: red500 } :
                { color: null }
              }
              onClick={this.downvoteHandler}
            />
          </CardActions>
          <div className="lp-mentor">
            <CardText className="lp-mentor-name">
              <Link to={`/user/${mentorName}`}>{mentorName}</Link>
              {
                mentor === Meteor.userId() ?
                  <span> | <Link className="lp-edit-link" to={`/learning-path/${_id}/edit`}>Edit</Link></span> :
                  null
              }
            </CardText>
          </div>
          <div className="clear" />
        </div>
      </Card>
    );
  }
}

LearningPathDetails.propTypes = {
  lp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    mentor: PropTypes.string.isRequired,
    mentorName: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbnail: PropTypes.string,
    aggregatedVotes: PropTypes.number.isRequired,
    voted: PropTypes.shape({}).isRequired,
  }).isRequired,
};
