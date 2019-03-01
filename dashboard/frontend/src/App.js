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
    //socket.emit("issues", "JohanSoederlund");
  }

  componentDidMount() {
    /*
    socket.on('notification', function(data){
      console.log("notification");
      console.log(data);
    });

    socket.on('issues', function(data){
      console.log("issues");
      console.log(data);
    });
    */

    var style = {backgroundColor: "white"};
    if (data.action === "opened") {
      style = {backgroundColor: "lightgreen"}
      this.delayBackground(this);
    } //closed
    else if (data.action === "opened") {
      style = {backgroundColor: "OrangeRed "}
      this.removeCard(this);
    } 
    var johan = {
      title: data.issue.title,
      subheader: data.issue.body,
      user: data.sender.login,
      user_html_url: data.sender.html_url,
      description: [
        
      ],
      buttonText: 'Github link',
      buttonVariant: 'contained',
      html_url: data.issue.html_url,
      avatar_url: data.issue.user.avatar_url+".jpg",
      style: style,
      created_at: new Date(data.issue.created_at).toUTCString()
    }
    tiers.push(johan, johan, johan, johan);
    
    var dv023 = {
      name: data.organization.login,
      organization_url: data.repository.owner.html_url,
      description: data.organization.description
    }
    console.log(JSON.stringify(dv023));
    organizations.push(dv023, dv023, dv023, dv023);
    this.setState({});
  }

  async removeCard(_this) {
    await this.sleep(10000);
    tiers.pop();
    _this.setState({});
  }

  async delayBackground(_this) {
    await this.sleep(2000);
    tiers[tiers.length -1].style = {backgroundColor: "white"};
    _this.setState({});
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
          <h2>Issues</h2>
            <Grid container spacing={40} alignItems="flex-end">
              {tiers.map(tier => (
                <Grid item key={tier.title} xs={12} sm={tier.title === '' ? 12 : 6} md={3}>
                  <Card style={tier.style} >
                    <p className="created_at">{tier.created_at}</p>
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

/*
<div className="sideBar">
            {organizations.map(org => (
              <div>
                <a href={org.organization_url}>{org.name}</a>
                <p>{org.description}</p>
              </div>
            ))}
        </div>
        */

/*
<div className="sideBar">
          <Grid container spacing={40} alignItems="flex-end">
            {organizations.map(org => (
              <Grid item key={org.name} xs={12} sm={org.name === 'Enterprise' ? 12 : 6} md={4}>
                  <a href={org.organization_url}>{org.name}</a>
                  <p>{org.description}</p>
              </Grid>
            ))}
          </Grid>
        </div>
*/



const data = 
  { action: 'opened',
  issue:
   { url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/20',
     repository_url: 'https://api.github.com/repos/1dv023/js223zs-examination-3',
     labels_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/20/labels{/name}',
     comments_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/20/comments',
     events_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/20/events',
     html_url: 'https://github.com/1dv023/js223zs-examination-3/issues/20',
     id: 414025348,
     node_id: 'MDU6SXNzdWU0MTQwMjUzNDg=',
     number: 20,
     title: 'Exempel issue',
     user:
      { login: 'JohanSoederlund',
        id: 21335107,
        node_id: 'MDQ6VXNlcjIxMzM1MTA3',
        avatar_url: 'https://avatars1.githubusercontent.com/u/21335107?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/JohanSoederlund',
        html_url: 'https://github.com/JohanSoederlund',
        followers_url: 'https://api.github.com/users/JohanSoederlund/followers',
        following_url:
         'https://api.github.com/users/JohanSoederlund/following{/other_user}',
        gists_url:
         'https://api.github.com/users/JohanSoederlund/gists{/gist_id}',
        starred_url:
         'https://api.github.com/users/JohanSoederlund/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/JohanSoederlund/subscriptions',
        organizations_url: 'https://api.github.com/users/JohanSoederlund/orgs',
        repos_url: 'https://api.github.com/users/JohanSoederlund/repos',
        events_url:
         'https://api.github.com/users/JohanSoederlund/events{/privacy}',
        received_events_url:
         'https://api.github.com/users/JohanSoederlund/received_events',
        type: 'User',
        site_admin: false },
     labels: [],
     state: 'open',
     locked: false,
     assignee: null,
     assignees: [],
     milestone: null,
     comments: 0,
     created_at: '2019-02-25T10:06:44Z',
     updated_at: '2019-02-25T10:06:44Z',
     closed_at: null,
     author_association: 'CONTRIBUTOR',
     body: 'tester vi ett exempel' },
  repository:
   { id: 79242552,
     node_id: 'MDEwOlJlcG9zaXRvcnk3OTI0MjU1Mg==',
     name: 'js223zs-examination-3',
     full_name: '1dv023/js223zs-examination-3',
     private: true,
     owner:
      { login: '1dv023',
        id: 12395417,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjEyMzk1NDE3',
        avatar_url: 'https://avatars0.githubusercontent.com/u/12395417?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/1dv023',
        html_url: 'https://github.com/1dv023',
        followers_url: 'https://api.github.com/users/1dv023/followers',
        following_url: 'https://api.github.com/users/1dv023/following{/other_user}',
        gists_url: 'https://api.github.com/users/1dv023/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/1dv023/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/1dv023/subscriptions',
        organizations_url: 'https://api.github.com/users/1dv023/orgs',
        repos_url: 'https://api.github.com/users/1dv023/repos',
        events_url: 'https://api.github.com/users/1dv023/events{/privacy}',
        received_events_url: 'https://api.github.com/users/1dv023/received_events',
        type: 'Organization',
        site_admin: false },
     html_url: 'https://github.com/1dv023/js223zs-examination-3',
     description: 'Examination assignment 3 for Johan Söderlund, WP2016',
     fork: false,
     url: 'https://api.github.com/repos/1dv023/js223zs-examination-3',
     forks_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/forks',
     keys_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/keys{/key_id}',
     collaborators_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/collaborators{/collaborator}',
     teams_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/teams',
     hooks_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/hooks',
     issue_events_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/events{/number}',
     events_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/events',
     assignees_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/assignees{/user}',
     branches_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/branches{/branch}',
     tags_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/tags',
     blobs_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/git/blobs{/sha}',
     git_tags_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/git/tags{/sha}',
     git_refs_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/git/refs{/sha}',
     trees_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/git/trees{/sha}',
     statuses_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/statuses/{sha}',
     languages_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/languages',
     stargazers_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/stargazers',
     contributors_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/contributors',
     subscribers_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/subscribers',
     subscription_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/subscription',
     commits_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/commits{/sha}',
     git_commits_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/git/commits{/sha}',
     comments_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/comments{/number}',
     issue_comment_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues/comments{/number}',
     contents_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/contents/{+path}',
     compare_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/compare/{base}...{head}',
     merges_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/merges',
     archive_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/{archive_format}{/ref}',
     downloads_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/downloads',
     issues_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/issues{/number}',
     pulls_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/pulls{/number}',
     milestones_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/milestones{/number}',
     notifications_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/notifications{?since,all,participating}',
     labels_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/labels{/name}',
     releases_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/releases{/id}',
     deployments_url:
      'https://api.github.com/repos/1dv023/js223zs-examination-3/deployments',
     created_at: '2017-01-17T15:39:13Z',
     updated_at: '2019-02-23T11:12:08Z',
     pushed_at: '2019-02-23T11:12:07Z',
     git_url: 'git://github.com/1dv023/js223zs-examination-3.git',
     ssh_url: 'git@github.com:1dv023/js223zs-examination-3.git',
     clone_url: 'https://github.com/1dv023/js223zs-examination-3.git',
     svn_url: 'https://github.com/1dv023/js223zs-examination-3',
     homepage: null,
     size: 406,
     stargazers_count: 0,
     watchers_count: 0,
     language: 'JavaScript',
     has_issues: true,
     has_projects: true,
     has_downloads: true,
     has_wiki: true,
     has_pages: false,
     forks_count: 0,
     mirror_url: null,
     archived: false,
     open_issues_count: 1,
     license: null,
     forks: 0,
     open_issues: 1,
     watchers: 0,
     default_branch: 'master' },
  organization:
   { login: '1dv023',
     id: 12395417,
     node_id: 'MDEyOk9yZ2FuaXphdGlvbjEyMzk1NDE3',
     url: 'https://api.github.com/orgs/1dv023',
     repos_url: 'https://api.github.com/orgs/1dv023/repos',
     events_url: 'https://api.github.com/orgs/1dv023/events',
     hooks_url: 'https://api.github.com/orgs/1dv023/hooks',
     issues_url: 'https://api.github.com/orgs/1dv023/issues',
     members_url: 'https://api.github.com/orgs/1dv023/members{/member}',
     public_members_url: 'https://api.github.com/orgs/1dv023/public_members{/member}',
     avatar_url: 'https://avatars0.githubusercontent.com/u/12395417?v=4',
     description: 'Linnaeus university course "Server-based Web programming"' },
  sender:
   { login: 'JohanSoederlund',
     id: 21335107,
     node_id: 'MDQ6VXNlcjIxMzM1MTA3',
     avatar_url: 'https://avatars1.githubusercontent.com/u/21335107?v=4',
     gravatar_id: '',
     url: 'https://api.github.com/users/JohanSoederlund',
     html_url: 'https://github.com/JohanSoederlund',
     followers_url: 'https://api.github.com/users/JohanSoederlund/followers',
     following_url:
      'https://api.github.com/users/JohanSoederlund/following{/other_user}',
     gists_url:
      'https://api.github.com/users/JohanSoederlund/gists{/gist_id}',
     starred_url:
      'https://api.github.com/users/JohanSoederlund/starred{/owner}{/repo}',
     subscriptions_url: 'https://api.github.com/users/JohanSoederlund/subscriptions',
     organizations_url: 'https://api.github.com/users/JohanSoederlund/orgs',
     repos_url: 'https://api.github.com/users/JohanSoederlund/repos',
     events_url:
      'https://api.github.com/users/JohanSoederlund/events{/privacy}',
     received_events_url:
      'https://api.github.com/users/JohanSoederlund/received_events',
     type: 'User',
     site_admin: false } }

