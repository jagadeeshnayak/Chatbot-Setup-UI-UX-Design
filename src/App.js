import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Modal, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Google, 
  ContentCopy, 
  Email, 
  CheckCircle, 
  Link as LinkIcon,
  Share,
  Facebook,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

// Dummy data for scraping status
const scrapingData = [
  { url: 'https://example.com/home', status: 'scraped', chunks: ['Welcome section...', 'Services overview...'] },
  { url: 'https://example.com/about', status: 'pending', chunks: [] },
  { url: 'https://example.com/contact', status: 'scraped', chunks: ['Contact form...', 'Address...'] },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserRegistration />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/setup" element={<OrganizationSetup />} />
        <Route path="/integration" element={<IntegrationTest />} />
        <Route path="/success" element={<SuccessScreen />} />
      </Routes>
    </Router>
  );
}

function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/verify');
  };

  return (
    <div className="container">
      <Typography variant="h3" gutterBottom>Create Account</Typography>
      <form onSubmit={handleSubmit} className="auth-form">
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth
          sx={{ mt: 3 }}
        >
          Create Account
        </Button>
      </form>
      <Button 
        variant="outlined" 
        startIcon={<Google />} 
        fullWidth
        sx={{ mt: 2 }}
      >
        Continue with Google
      </Button>
    </div>
  );
}

function EmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/setup');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container">
      <Typography variant="h3" gutterBottom>Verify Email</Typography>
      <TextField
        label="Verification Code"
        variant="outlined"
        fullWidth
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Verify Email'}
      </Button>
    </div>
  );
}

function OrganizationSetup() {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: '',
    website: '',
    description: ''
  });
  const [selectedPage, setSelectedPage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFetchDescription = async () => {
    try {
      // Simulated API call
      setTimeout(() => {
        setCompany(prev => ({
          ...prev,
          description: 'Sample meta description fetched from website. This is a default description that can be edited.'
        }));
        setSnackbarOpen(true);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Typography variant="h3" gutterBottom>Organization Setup</Typography>
      
      <TextField
        label="Company Name"
        fullWidth
        required
        value={company.name}
        onChange={(e) => setCompany({...company, name: e.target.value})}
        sx={{ mb: 3 }}
      />
      
      <div className="website-input">
        <TextField
          label="Website URL"
          fullWidth
          required
          value={company.website}
          onChange={(e) => setCompany({...company, website: e.target.value})}
          onBlur={handleFetchDescription}
          sx={{ mb: 3 }}
        />
        <Button 
          variant="outlined" 
          onClick={handleFetchDescription}
          sx={{ ml: 2 }}
        >
          Fetch Info
        </Button>
      </div>

      <TextField
        label="Company Description"
        multiline
        rows={4}
        fullWidth
        value={company.description}
        onChange={(e) => setCompany({...company, description: e.target.value})}
        sx={{ mb: 3 }}
      />

      <Typography variant="h5" gutterBottom>Scraping Progress</Typography>
      <div className="scraping-list">
        {scrapingData.map((page, index) => (
          <Paper 
            key={index} 
            className="scraping-item"
            onClick={() => setSelectedPage(page)}
          >
            <div className="scraping-status">
              {page.status === 'scraped' ? (
                <CheckCircle color="success" />
              ) : (
                <CircularProgress size={24} />
              )}
            </div>
            <Typography variant="body1">{page.url}</Typography>
          </Paper>
        ))}
      </div>

      <Modal open={!!selectedPage} onClose={() => setSelectedPage(null)}>
        <div className="scraped-content-modal">
          <Typography variant="h5" gutterBottom>
            Scraped Content from {selectedPage?.url}
          </Typography>
          {selectedPage?.chunks.map((chunk, index) => (
            <Paper key={index} className="content-chunk">
              <Typography variant="body2">{chunk}</Typography>
            </Paper>
          ))}
          {!selectedPage?.chunks.length && (
            <Typography variant="body2">No content scraped yet</Typography>
          )}
        </div>
      </Modal>

      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => navigate('/integration')}
      >
        Continue to Integration
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success">
          Description fetched successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

function IntegrationTest() {
  const navigate = useNavigate();
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [code] = useState(`<script src="https://cdn.beyondchats.com/widget.js" data-api-key="YOUR_UNIQUE_KEY"></script>`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="container">
      <Typography variant="h3" gutterBottom>Chatbot Integration</Typography>
      
      <div className="integration-options">
        <Button 
          variant="contained" 
          size="large"
          sx={{ mb: 2 }}
          onClick={() => window.open('https://example.com/test-chatbot', '_blank')}
        >
          Test Chatbot
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          sx={{ mb: 2 }}
          onClick={() => setIntegrationOpen(true)}
        >
          Integration Options
        </Button>
        
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/success')}
        >
          Verify Integration
        </Button>
      </div>

      <Modal open={integrationOpen} onClose={() => setIntegrationOpen(false)}>
        <div className="integration-modal">
          <Typography variant="h5" gutterBottom>Integration Methods</Typography>
          
          <Typography variant="body1" gutterBottom>
            Add this code to your website's &lt;head&gt; section:
          </Typography>
          
          <Paper className="code-snippet">
            <pre>{code}</pre>
            <IconButton onClick={copyToClipboard}>
              <ContentCopy />
            </IconButton>
          </Paper>
          
          <Button 
            variant="contained" 
            startIcon={<Email />}
            sx={{ mt: 2 }}
          >
            Email Instructions to Developer
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function SuccessScreen() {
  const [width, height] = useWindowSize();
  const [confettiRunning, setConfettiRunning] = useState(true);

  return (
    <div className="container success-screen">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={confettiRunning ? 500 : 0}
        recycle={false}
        onConfettiComplete={() => setConfettiRunning(false)}
      />
      
      <CheckCircle sx={{ fontSize: 100, color: 'green', mb: 3 }} />
      <Typography variant="h2" gutterBottom>Setup Complete! 🎉</Typography>
      
      <div className="success-actions">
        <Button variant="contained" size="large" sx={{ m: 1 }}>
          Explore Admin Panel
        </Button>
        <Button variant="outlined" size="large" sx={{ m: 1 }}>
          Start Chatting
        </Button>
      </div>

      <Typography variant="h6" sx={{ mt: 4 }}>Share Your Success</Typography>
      <div className="social-sharing">
        <IconButton><Twitter fontSize="large" /></IconButton>
        <IconButton><Facebook fontSize="large" /></IconButton>
        <IconButton><LinkedIn fontSize="large" /></IconButton>
        <IconButton><Share fontSize="large" /></IconButton>
      </div>
    </div>
  );
}

export default App;