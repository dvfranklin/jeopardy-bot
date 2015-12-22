// TODO: Post to the server, clear the form, and show a little message.
import React, { PropTypes } from 'react';
import { Button, Card, CardText, CardTitle, CardMenu, CardActions, Icon, Textfield } from 'react-mdl';

class Broadcast extends React.Component {
  constructor(props) {
    super(props);

    this.onClickSendMessage = this.onClickSendMessage.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);

    this.state = {
      message: '',
      sent: false,
    };
  }

  onClickSendMessage() {
    // Empty messages are useless:
    if (this.state.message.trim()) {
      this.setState({
        message: '',
      });
      fetch(`/api/v1/broadcasts/`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: this.state.message,
          studio: this.props.studio === 'all' ? false : this.props.studio,
        }),
      }).then(res => {
        if (res.ok) {
          this.setState({
            sent: true,
          });
        }
      });
    }
  }

  onChangeMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    const allBroadcast = this.props.studio === 'all';
    return (
      <Card shadow={0} style={{
        width: '100%',
      }}>
        <CardTitle>Send Broadcast</CardTitle>
        <CardText>
          {allBroadcast ?
            `Send a message to all public and private slack channels the bot is currently in.
            This will not send any private messages.` :
            'Send a message to this studio as the bot.'
          }
          <Textfield
            onChange={this.onChangeMessage}
            value={this.state.message}
            label="Message..."
            rows={3}
          />

          {this.state.sent && (
            <div className="mdl-color--green-100 jbot-broadcast-sent">
              Your broadcast has been sent!
            </div>
          )}
        </CardText>
        <CardActions border>
          <Button colored ripple onClick={this.onClickSendMessage}>Send Message</Button>
        </CardActions>
        <CardMenu>
          <Icon name="announcement" />
        </CardMenu>
      </Card>
    );
  }
}

Broadcast.propTypes = {
  studio: PropTypes.string.isRequired,
};

export default Broadcast;
