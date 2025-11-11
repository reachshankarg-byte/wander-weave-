import React, { useState } from 'react';
import { TextField, MenuItem, Button, Card, CardContent, Typography, Collapse, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const ItineraryPlanner = () => {
  // Form state
  const [formData, setFormData] = useState({
    budget: '',
    startDate: null,
    endDate: null,
    theme: ''
  });

  // Itinerary state
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});

  // Theme options
  const themeOptions = [
    { value: 'cultural', label: 'Cultural' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'relaxation', label: 'Relaxation' }
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle day expansion
  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  // Mock MCP integration function
  const fetchItineraryViaMCP = async (preferences) => {
    // MCP INTEGRATION POINT: This stub will be replaced with actual MCP client calls
    // Following MCP Context7 documentation for plan-execute-synthesize pattern
    
    // PLAN phase: Break down user input into actionable steps
    console.log('MCP Plan Phase: Analyzing travel preferences...');
    
    // EXECUTE phase: Query external tools (Amadeus, Google Places, etc.)
    console.log('MCP Execute Phase: Fetching data from travel APIs...');
    
    // SYNTHESIZE phase: Format and return structured itinerary
    console.log('MCP Synthesize Phase: Generating optimized itinerary...');
    
    // Mock response - replace with actual MCP API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          days: [
            {
              day: 1,
              date: preferences.startDate,
              activities: [
                { time: '09:00', name: 'Museum Visit', description: 'Explore local art and history', cost: 50 },
                { time: '13:00', name: 'Local Lunch', description: 'Authentic cuisine experience', cost: 30 },
                { time: '16:00', name: 'City Walking Tour', description: 'Guided tour of historic district', cost: 25 }
              ],
              dailyBudget: 105
            },
            {
              day: 2,
              date: preferences.startDate ? new Date(preferences.startDate.getTime() + 86400000) : new Date(),
              activities: [
                { time: '10:00', name: 'Adventure Park', description: 'Outdoor activities and zip-lining', cost: 75 },
                { time: '14:00', name: 'Scenic Hike', description: 'Mountain trail with panoramic views', cost: 0 },
                { time: '19:00', name: 'Fine Dining', description: 'Upscale restaurant experience', cost: 80 }
              ],
              dailyBudget: 155
            }
          ],
          totalCost: 260,
          budgetRemaining: preferences.budget - 260
        });
      }, 1500);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.budget || !formData.startDate || !formData.endDate || !formData.theme) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.budget <= 0) {
      alert('Budget must be greater than 0');
      return;
    }

    setLoading(true);
    
    try {
      // MCP INTEGRATION POINT: Call MCP service with user preferences
      const itineraryData = await fetchItineraryViaMCP(formData);
      setItinerary(itineraryData);
      
      // Initialize all days as expanded
      const initialExpanded = {};
      itineraryData.days.forEach((_, index) => {
        initialExpanded[index] = true;
      });
      setExpandedDays(initialExpanded);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <Typography variant="h4" component="h1" className="text-center mb-6 text-blue-600 font-bold">
        Wander Weave
      </Typography>

      {/* Preferences Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextField
          fullWidth
          label="Budget (USD)"
          type="number"
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', e.target.value)}
          required
          inputProps={{ min: 1 }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => handleInputChange('startDate', date)}
              renderInput={(params) => <TextField {...params} required />}
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(date) => handleInputChange('endDate', date)}
              minDate={formData.startDate}
              renderInput={(params) => <TextField {...params} required />}
            />
          </div>
        </LocalizationProvider>

        <TextField
          fullWidth
          select
          label="Travel Theme"
          value={formData.theme}
          onChange={(e) => handleInputChange('theme', e.target.value)}
          required
        >
          {themeOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 py-3"
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </Button>
      </form>

      {/* Itinerary Display */}
      {itinerary && (
        <div className="space-y-4">
          <Typography variant="h5" component="h2" className="text-gray-800 font-semibold">
            Your AI-Generated Itinerary
          </Typography>

          {/* Days */}
          {itinerary.days.map((day, index) => (
            <Card key={day.day} className="border border-gray-200">
              <CardContent className="p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDayExpansion(index)}
                >
                  <Typography variant="h6" className="font-medium">
                    Day {day.day} - ${day.dailyBudget}
                  </Typography>
                  <IconButton size="small">
                    {expandedDays[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </div>

                <Collapse in={expandedDays[index]}>
                  <div className="mt-3 space-y-3">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex justify-between items-start border-b pb-2">
                        <div className="flex-1">
                          <Typography variant="body2" className="font-medium text-gray-900">
                            {activity.time} - {activity.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            {activity.description}
                          </Typography>
                        </div>
                        <Typography variant="body2" className="font-medium text-green-600 ml-2">
                          ${activity.cost}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </CardContent>
            </Card>
          ))}

          {/* Budget Summary */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardContent className="p-4">
              <Typography variant="h6" className="font-semibold text-blue-800 mb-2">
                Budget Summary
              </Typography>
              <div className="flex justify-between">
                <Typography>Total Cost:</Typography>
                <Typography className="font-medium">${itinerary.totalCost}</Typography>
              </div>
              <div className="flex justify-between">
                <Typography>Remaining Budget:</Typography>
                <Typography className={`font-medium ${itinerary.budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${itinerary.budgetRemaining}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MCP Integration Note */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-600">
        <Typography variant="body2">
          <strong>MCP Integration:</strong> This component uses mock data. Replace 
          <code>fetchItineraryViaMCP</code> with actual MCP Context7 API calls following 
          the plan-execute-synthesize pattern for AI agent workflow.
        </Typography>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
