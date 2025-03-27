import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Stack,
  Autocomplete,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import BrainIcon from '@mui/icons-material/Psychology'; // or use an appropriate icon

const ALL_SKILLS = {
    'Programming Languages': [
      'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Swift', 'Kotlin', 
      'TypeScript', 'Go', 'Rust', 'PHP', 'C#', 'Scala', 'Dart', 'R',
      'Perl', 'Lua', 'Haskell', 'Assembly', 'Groovy'
    ],
    'Web Development': [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 
      'Django', 'Flask', 'Ruby on Rails', 'Laravel', 'Spring Boot',
      'HTML5', 'CSS3', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Webpack',
      'Next.js', 'Gatsby', 'Svelte', 'GraphQL', 'REST APIs', 'WebSockets',
      'ASP.NET', 'JSP', 'Ember.js'
    ],
    'Mobile Development': [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 
      'iOS', 'Xamarin', 'Apache Cordova', 'Ionic',
      'Objective-C', 'Compose (Android)', 'SwiftUI (iOS)', 'Unity (Mobile)', 'Unreal Engine (Mobile)'
    ],
    'Cloud & DevOps': [
      'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 
      'Jenkins', 'CI/CD', 'Terraform', 'Ansible', 'GitHub Actions',
      'Serverless', 'Lambda', 'ECS', 'EKS', 'GKE', 'Azure Functions',
      'DevSecOps', 'GitLab CI', 'CircleCI', 'ArgoCD', 'Prometheus', 'Grafana'
    ],
    'Databases': [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 
      'Oracle', 'Microsoft SQL Server', 'Cassandra', 'Firebase',
      'DynamoDB', 'Couchbase', 'Elasticsearch', 'MariaDB', 'Neo4j',
      'DocumentDB', 'TimescaleDB'
    ],
    'Data Science & AI': [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 
      'Pandas', 'NumPy', 'Scikit-learn', 'Keras', 'NLP', 
      'Computer Vision', 'Data Visualization',
      'Reinforcement Learning', 'Natural Language Generation', 'Time Series Analysis', 'Statistical Modeling',
      'Spark', 'Hadoop', 'Data Warehousing', 'Data Mining', 'Big Data', 'R Shiny',
      'MLOps', 'ONNX', 'OpenCV'
    ],
    'Testing': [
      'Jest', 'Mocha', 'Chai', 'JUnit', 'Selenium', 'Cypress', 'Playwright', 'Unit Testing', 'Integration Testing', 'End-to-End Testing', 'Load Testing', 'Performance Testing'
    ],
    'Design & UI/UX': [
      'Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Interaction Design'
    ],
    'Game Development': [
      'Unity', 'Unreal Engine', 'C# (Unity)', 'C++ (Unreal)', 'Game Design', '3D Modeling', '2D Game Development', 'Shader Programming', 'Level Design'
    ],
    'Operating Systems': [
      'Linux', 'Windows', 'macOS', 'Unix', 'Android (OS)', 'iOS (OS)', 'Embedded Systems', 'Real-time Operating Systems (RTOS)'
    ],
    'Networking': [
      'TCP/IP', 'DNS', 'HTTP/HTTPS', 'Routing', 'Switching', 'Network Security', 'VPN', 'Firewalls', 'Load Balancing'
    ],
    'Security': [
      'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Cryptography', 'Information Security', 'Vulnerability Assessment', 'Security Auditing', 'OWASP'
    ],
    'Project Management': [
      'Agile', 'Scrum', 'Kanban', 'Waterfall', 'Jira', 'Trello', 'Project Planning', 'Risk Management', 'Stakeholder Management'
    ],
    'Embedded Systems': [
      'C (Embedded)', 'C++ (Embedded)', 'Microcontrollers', 'Embedded Linux', 'RTOS', 'Firmware Development', 'Hardware Interfacing'
    ],
    'Version Control': [
      'Git', 'SVN', 'Mercurial', 'GitHub', 'GitLab', 'Bitbucket'
    ]
  };

// Map categories to icons
const CATEGORY_ICONS = {
  'Programming Languages': <CodeIcon />,
  'Web Development': <WebIcon />,
  'Mobile Development': <PhoneAndroidIcon />,
  'Cloud & DevOps': <CloudIcon />,
  'Databases': <StorageIcon />,
  'Data Science & AI': <BrainIcon />
};

const SkillsSelector = ({ 
  selectedSkills = [], 
  onChange,
  label = "Select Skills",
  placeholder = "Search or add skills...",
  maxSelections = 15,
  showSelected = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleDelete = (skillToDelete) => {
    onChange(selectedSkills.filter((skill) => skill !== skillToDelete));
  };

  const handleAddSkill = (event, newValue) => {
    if (selectedSkills.length >= maxSelections) {
      return;
    }
    
    // Remove duplicates and empty strings
    const uniqueNewSkills = [...new Set(newValue)]
      .filter(skill => skill.trim() !== '');
      
    onChange(uniqueNewSkills);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() && 
        !FLATTENED_SKILLS.includes(inputValue) && 
        selectedSkills.length < maxSelections) {
      onChange([...selectedSkills, inputValue.trim()]);
      setInputValue('');
    }
  };

  // Flatten skills for searching
  const FLATTENED_SKILLS = Object.values(ALL_SKILLS).flat();

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        freeSolo
        options={FLATTENED_SKILLS}
        value={selectedSkills}
        onChange={handleAddSkill}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        groupBy={(option) => {
          for (const [category, skills] of Object.entries(ALL_SKILLS)) {
            if (skills.includes(option)) return category;
          }
          return 'Other Skills';
        }}
        renderGroup={(params) => (
          <Box key={params.key}>
            <ListItem 
              sx={{ 
                backgroundColor: theme.palette.grey[100],
                py: 1,
                px: 2,
                alignItems: 'center'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {CATEGORY_ICONS[params.group] || <CodeIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.text.secondary
                    }}
                  >
                    {params.group}
                  </Typography>
                } 
              />
            </ListItem>
            <Box sx={{ pl: 2 }}>
              {params.children}
            </Box>
            <Divider sx={{ my: 0.5 }} />
          </Box>
        )}
        renderOption={(props, option, { selected }) => (
          <ListItem 
            {...props}
            sx={{
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: selected 
                ? theme.palette.action.selected 
                : 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              borderRadius: 1,
              transition: 'background-color 0.2s ease'
            }}
          >
            <ListItemText 
              primary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: selected ? 600 : 400,
                    color: selected 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary
                  }}
                >
                  {option}
                </Typography>
              }
            />
            {selected && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <CheckCircleOutlineIcon 
                  color="success" 
                  fontSize="small" 
                />
              </ListItemIcon>
            )}
          </ListItem>
        )}
        renderTags={(value, getTagProps) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                deleteIcon={<CancelIcon fontSize="small" />}
                onDelete={() => handleDelete(option)}
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      color: theme.palette.error.main
                    }
                  }
                }}
                {...getTagProps({ index })}
              />
            ))}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              sx: {
                paddingTop: isMobile ? '8px!important' : '10px!important',
                paddingBottom: isMobile ? '8px!important' : '10px!important',
                minHeight: isMobile ? '56px' : 'auto',
                flexWrap: 'wrap',
                '&.Mui-focused': {
                  borderColor: theme.palette.primary.main
                }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                flexWrap: 'wrap',
                gap: 0.5
              }
            }}
          />
        )}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        sx={{
          '& .MuiAutocomplete-popupIndicator': {
            transform: focused ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
        disabled={selectedSkills.length >= maxSelections}
        noOptionsText={
          inputValue.trim() ? 
            "Press Enter to add custom skill" : 
            "No skills found"
        }
      />
    </Box>
  );
};

export default SkillsSelector;