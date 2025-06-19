import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, Contest, ProblemStats } from '../types';
import { studentApi } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [contestDays, setContestDays] = useState(30);
  const [problemDays, setProblemDays] = useState(30);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, contestsRes, statsRes] = await Promise.all([
        studentApi.getById(id!),
        studentApi.getContestHistory(id!, contestDays),
        studentApi.getProblemStats(id!, problemDays),
      ]);
      setStudent(studentRes.data);
      setContests(contestsRes.data);
      setProblemStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContestDaysChange = (days: number) => {
    setContestDays(days);
    studentApi.getContestHistory(id!, days).then(res => setContests(res.data));
  };

  const handleProblemDaysChange = (days: number) => {
    setProblemDays(days);
    studentApi.getProblemStats(id!, days).then(res => setProblemStats(res.data));
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      const response = await studentApi.toggleNotifications(id!, enabled);
      setStudent(response.data);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  const ratingData = contests.map(contest => ({
    date: format(new Date(contest.contestDate), 'MMM dd'),
    rating: contest.newRating,
  }));

  const ratingDistribution = problemStats
    ? Object.entries(problemStats.ratingDistribution).map(([rating, count]) => ({
        rating: `${rating}-${Number(rating) + 99}`,
        count,
      }))
    : [];

  const buttonStyle = {
    borderRadius: '25px',
    backgroundColor: '#FF9800',
    boxShadow: '0 0 15px rgba(255, 152, 0, 0.3)',
    '&:hover': {
      backgroundColor: '#F57C00',
      boxShadow: '0 0 20px rgba(255, 152, 0, 0.5)',
    },
  };

  const outlinedButtonStyle = {
    borderRadius: '25px',
    borderColor: '#FF9800',
    color: '#FF9800',
    boxShadow: '0 0 10px rgba(255, 152, 0, 0.2)',
    '&:hover': {
      borderColor: '#F57C00',
      color: '#F57C00',
      boxShadow: '0 0 15px rgba(255, 152, 0, 0.4)',
    },
  };

  const paperStyle = {
    boxShadow: '0 0 20px rgba(255, 152, 0, 0.15)',
    border: '1px solid rgba(255, 152, 0, 0.2)',
    borderRadius: '12px',
  };

  const cardStyle = {
    ...paperStyle,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 0 25px rgba(255, 152, 0, 0.25)',
    },
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ ...outlinedButtonStyle, mb: 2 }}
      >
        Back to Students
      </Button>

      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2, ...paperStyle }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF9800' }}>{student.name}</Typography>
            <Stack spacing={1}>
              <Typography color="textSecondary">{student.email}</Typography>
              <Typography>Phone: {student.phoneNumber}</Typography>
              <Typography>
                Codeforces Handle: {student.codeforcesHandle}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF9800' }}>Ratings</Typography>
            <Stack spacing={1}>
              <Typography>Current Rating: {student.currentRating}</Typography>
              <Typography>Max Rating: {student.maxRating}</Typography>
              <Typography>
                Last Updated: {format(new Date(student.lastUpdated), 'PPpp')}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={student.emailNotificationsEnabled}
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF9800',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#FF9800',
                        },
                      },
                    }}
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="caption" display="block">
                Reminder emails sent: {student.reminderEmailCount}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ width: '100%', ...paperStyle }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTab-root': {
              color: '#FF9800',
            },
            '& .Mui-selected': {
              color: '#F57C00 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF9800',
            },
          }}
        >
          <Tab label="Contest History" />
          <Tab label="Problem Solving" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Button
              variant={contestDays === 30 ? 'contained' : 'outlined'}
              onClick={() => handleContestDaysChange(30)}
              fullWidth={isMobile}
              sx={contestDays === 30 ? buttonStyle : outlinedButtonStyle}
            >
              30 Days
            </Button>
            <Button
              variant={contestDays === 90 ? 'contained' : 'outlined'}
              onClick={() => handleContestDaysChange(90)}
              fullWidth={isMobile}
              sx={contestDays === 90 ? buttonStyle : outlinedButtonStyle}
            >
              90 Days
            </Button>
            <Button
              variant={contestDays === 365 ? 'contained' : 'outlined'}
              onClick={() => handleContestDaysChange(365)}
              fullWidth={isMobile}
              sx={contestDays === 365 ? buttonStyle : outlinedButtonStyle}
            >
              365 Days
            </Button>
          </Stack>

          <Box sx={{ 
            height: { xs: 300, sm: 400 },
            width: '100%',
            overflowX: 'auto',
            mb: 4,
            ...paperStyle,
            p: 2,
          }}>
            <LineChart
              width={isMobile ? 600 : 800}
              height={isMobile ? 300 : 400}
              data={ratingData}
              margin={{ 
                top: 5, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 0 : 20, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 152, 0, 0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#FF9800' }}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#FF9800' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#FF9800"
                name="Rating"
                strokeWidth={2}
                dot={{ fill: '#FF9800', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#F57C00' }}
              />
            </LineChart>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, color: '#FF9800' }}>
            Recent Contests
          </Typography>
          <Grid container spacing={2}>
            {contests.map((contest) => (
              <Grid item xs={12} sm={6} md={4} key={contest._id}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#FF9800' }}>{contest.contestName}</Typography>
                    <Stack spacing={1}>
                      <Typography>
                        Date: {format(new Date(contest.contestDate), 'PP')}
                      </Typography>
                      <Typography>Rank: {contest.rank}</Typography>
                      <Typography>
                        Rating Change: {contest.newRating - contest.oldRating}
                      </Typography>
                      <Typography>
                        Problems Solved: {contest.solvedProblems}/{contest.totalProblems}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Button
              variant={problemDays === 7 ? 'contained' : 'outlined'}
              onClick={() => handleProblemDaysChange(7)}
              fullWidth={isMobile}
              sx={problemDays === 7 ? buttonStyle : outlinedButtonStyle}
            >
              7 Days
            </Button>
            <Button
              variant={problemDays === 30 ? 'contained' : 'outlined'}
              onClick={() => handleProblemDaysChange(30)}
              fullWidth={isMobile}
              sx={problemDays === 30 ? buttonStyle : outlinedButtonStyle}
            >
              30 Days
            </Button>
            <Button
              variant={problemDays === 90 ? 'contained' : 'outlined'}
              onClick={() => handleProblemDaysChange(90)}
              fullWidth={isMobile}
              sx={problemDays === 90 ? buttonStyle : outlinedButtonStyle}
            >
              90 Days
            </Button>
          </Stack>

          {problemStats && (
            <Box sx={{ 
              height: { xs: 300, sm: 400 },
              width: '100%',
              overflowX: 'auto',
              mb: 4,
              ...paperStyle,
              p: 2,
            }}>
              <BarChart
                width={isMobile ? 600 : 800}
                height={isMobile ? 300 : 400}
                data={ratingDistribution}
                margin={{ 
                  top: 5, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 0 : 20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 152, 0, 0.1)" />
                <XAxis 
                  dataKey="rating" 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#FF9800' }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#FF9800' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#FF9800" 
                  name="Problems Solved"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}; 