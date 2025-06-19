import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Student } from '../types';
import { studentApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface StudentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
}

const initialFormData: StudentFormData = {
  name: '',
  email: '',
  phoneNumber: '',
  codeforcesHandle: '',
};

export const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpen = (student?: Student) => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        codeforcesHandle: student.codeforcesHandle,
      });
      setEditingId(student._id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await studentApi.update(editingId, formData);
      } else {
        await studentApi.create({
          ...formData,
          currentRating: 0,
          maxRating: 0,
          lastUpdated: new Date().toISOString(),
          emailNotificationsEnabled: true,
          reminderEmailCount: 0,
        });
      }
      handleClose();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.delete(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone Number', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Updated'];
    const csvData = students.map(student => [
      student.name,
      student.email,
      student.phoneNumber,
      student.codeforcesHandle,
      student.currentRating,
      student.maxRating,
      format(new Date(student.lastUpdated), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.csv';
    link.click();
  };

  const handleRowClick = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

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

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Typography variant="h5" component="h2" sx={{ color: '#FF9800' }}>
          Student Progress Management
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            fullWidth={isMobile}
            sx={buttonStyle}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            fullWidth={isMobile}
            sx={outlinedButtonStyle}
          >
            Download CSV
          </Button>
        </Stack>
      </Stack>

      <TableContainer 
        component={Paper}
        sx={{
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            px: { xs: 1, sm: 2 },
          },
          ...paperStyle,
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Name</TableCell>
              {!isMobile && <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Email</TableCell>}
              {!isMobile && <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Phone</TableCell>}
              <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Handle</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Rating</TableCell>
              {!isMobile && <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Max Rating</TableCell>}
              {!isTablet && <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Last Updated</TableCell>}
              <TableCell sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow 
                key={student._id}
                onClick={() => handleRowClick(student._id)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.05)',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell>{student.name}</TableCell>
                {!isMobile && <TableCell>{student.email}</TableCell>}
                {!isMobile && <TableCell>{student.phoneNumber}</TableCell>}
                <TableCell>{student.codeforcesHandle}</TableCell>
                <TableCell>{student.currentRating}</TableCell>
                {!isMobile && <TableCell>{student.maxRating}</TableCell>}
                {!isTablet && (
                  <TableCell>
                    {format(new Date(student.lastUpdated), 'yyyy-MM-dd HH:mm')}
                  </TableCell>
                )}
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(student._id);
                    }}
                    color="error"
                    size={isMobile ? "small" : "medium"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            ...paperStyle,
            '& .MuiDialogTitle-root': {
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              color: '#FF9800',
            },
          },
        }}
      >
        <DialogTitle>
          {editingId ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800',
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800',
                },
              }}
            />
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800',
                },
              }}
            />
            <TextField
              label="Codeforces Handle"
              value={formData.codeforcesHandle}
              onChange={(e) => setFormData({ ...formData, codeforcesHandle: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={outlinedButtonStyle}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={buttonStyle}
          >
            {editingId ? 'Save Changes' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 