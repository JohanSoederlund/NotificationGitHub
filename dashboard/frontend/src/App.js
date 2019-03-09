import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './App.css';
import Cookies from 'js-cookie';
import socket from './Websocket.js';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  cardUser: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing.unit * 2,
  },
  cardActions: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 2,
    },
  }
});

var tiers = [];
var organizations = [];

class App extends Component {

  constructor(props) {
    super(props);
    socket.emit("getUser", Cookies.get('jwt'));
    this.state = {}
  }

  componentDidMount() {

    socket.on('user', function(data){
      if (data.notifications !== undefined) {
        data.notifications.forEach(notification => {
          tiers.push( notification );
        });
      }
      
      
      this.setState({});
    }.bind(this));

    socket.on('issue', function(data){
      tiers.push( data );
      this.setState({});
    }.bind(this));

    socket.on('commit', function(data){
      tiers.push( data );
      this.setState({});
    }.bind(this));

    socket.on('commit', function(data){
      tiers.push( data );
      this.setState({});
    }.bind(this));
    
    this.setState({});
  }
 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Notification Hub</h1>
        </header>
          
        <div className="sideBar">
          <h2>Organizations</h2>
          <Grid className="sideBarContainer" container spacing={0} alignItems="flex-end">
            {organizations.map(org => (
              <Grid className="sideBarItem" item key={org.name} xs={12} sm={org.name === '' ? 12 : 6} md={12}>
                <a className="organization" href={org.organization_url}>{org.name}</a>
                <p className="description">{org.description}</p>
                {tiers.map(tier => (
                  <Grid item key={tier.title} xs={12} sm={tier.title === '' ? 12 : 6} md={12}>
                    <p className="sideBarIssue">{tier.title}</p>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </div>

        <React.Fragment>
          <CssBaseline />
          <main className={styles.layout}>
          <h2>Notifications</h2>
            <Grid container spacing={40} alignItems="flex-end">
              {tiers.map(tier => (
                <Grid item key={tier.title} xs={12} sm={tier.title === '' ? 12 : 6} md={3}>
                  <Card  >
                    <p className="created_at">{tier.created_at}</p>
                    <h2>{tier.event} {tier.action} </h2>
                    <CardHeader
                      title={tier.title}
                      subheader={tier.subheader}
                      titleTypographyProps={{ align: 'center' }}
                      subheaderTypographyProps={{ align: 'center' }}
                      className={styles.cardHeader}
                    />
                    <CardContent>
                      <div className={styles.cardUser}>
                        <Typography component="h3" variant="h5" color="textPrimary">
                        <p><i><a href={tier.user_html_url}>{tier.user}</a></i></p> 
                        </Typography>
                        <img src={tier.avatar_url} alt={"avatar_url"}></img>
                      </div>
                      {tier.description.map(line => (
                        <Typography variant="subtitle1" align="center" key={line}>
                          {line}
                        </Typography>
                      ))}
                    </CardContent>
                    <CardActions className={styles.cardActions}>
                    <a href={tier.html_url}>
                      <Button fullWidth variant={tier.buttonVariant} color="primary">
                        {tier.buttonText}
                      </Button>
                      </a>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </main>
        </React.Fragment>

      </div>
    );
  }
}

export default App;
