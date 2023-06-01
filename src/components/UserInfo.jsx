import React, { useState } from 'react';
import { TextField, Button, Typography, Avatar, Grid, FormControlLabel, Switch, CssBaseline, Pagination, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const lightTheme = createTheme({
  typography: {
    fontFamily: "Montserrat"
  }
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "Montserrat"
  }
});

function UserInfo() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUser(response.data);
      fetchUserRepos(1);
    } catch (error) {
      console.error(error);
      toast.error('User not found or network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRepos = async (page) => {
    try {
      setIsLoading(true);
      const perPage = 3;
      const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`);
      setRepos(response.data);
      const linkHeader = response.headers.link;
      const totalCount = linkHeader ? parseInt(linkHeader.split(',')[1].match(/page=(\d+)>; rel="last"/)[1]) * perPage : 0;
      const totalPages = Math.ceil(totalCount / perPage);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchUserRepos(page);
  };

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: "5em" }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={handleThemeChange} />}
            label="Dark Mode"
          />
        </Box>
        <Typography variant="h4" component="h1" fontWeight={"700"} marginBottom={5} >
          Github User Information
        </Typography>
        <TextField
          label="Enter a username"
          variant="outlined"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <Button variant="contained" onClick={fetchUserData} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Fetch'}
        </Button>

        {user && (
          <div style={{ marginTop: '2rem' }}>
            <Avatar alt="Profile" src={user.avatar_url} sx={{ width: 200, height: 200, marginTop: '1rem' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              {user.login}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Bio:</strong> {user.bio}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Followers:</strong> {user.followers}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Following:</strong> {user.following}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Public Repositories:</strong> {user.public_repos}
            </Typography>
          </div>
        )}

        {username && (
          <React.Fragment>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={"700"} style={{ marginTop: '2rem' }}>
              Repositories
            </Typography>
            <Grid container spacing={2}>
              {repos.map((repo) => (
                <Grid item key={repo.id} xs={12} sm={6} md={4}>
                  <Typography variant="h6">{repo.full_name}</Typography>
                  <Typography variant="body1">{repo.description}</Typography>
                  <Typography variant="body2">Language: {repo.language}</Typography>
                  <Typography variant="body2">Forks: {repo.forks}</Typography>
                  <Typography variant="body2">Watchers: {repo.watchers}</Typography>
                </Grid>
              ))}
            </Grid>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2" style={{ marginRight: '1rem' }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </React.Fragment>
        )}
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default UserInfo;
