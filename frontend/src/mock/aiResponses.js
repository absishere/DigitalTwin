export const mockAIResponses = {
  'route safe': 'Based on current conditions, your route has moderate risk. Wave heights of 2.4m and winds of 18 knots are within acceptable limits, though I recommend monitoring the weather system developing near coordinates 16.5°N, 68.2°E.',
  'weather': 'Weather in your vicinity is currently clear, but our predictive models show a low-pressure system forming southwest of your position. Expect wind speeds to increase to 25 knots over the next 12 hours.',
  'reroute': 'Given the developing severe wave conditions ahead (5.8m waves at 16.5°N, 68.2°E), I suggest a minor course alteration of +15 degrees to bypass the worst of the system. This will add approximately 4 hours to your ETA.',
  'vessels nearby': 'There are currently 8 vessels within a 5km radius, including MT ARABIAN PEARL (Tanker) to your port side. Traffic density is moderate but manageable. Maintain a standard watch.',
  'default': "I'm analyzing the current conditions for MV OCEAN STAR. Could you be more specific about what you'd like to know?"
};

export const suggestedQuestions = [
  'Is my current route safe?',
  'Any dangerous weather ahead?',
  'What are the wave conditions?',
  'Should I consider rerouting?'
];
