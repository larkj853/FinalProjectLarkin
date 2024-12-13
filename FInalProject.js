let starData = []; // Array to hold JSON data
let shapeCounts = {}; // Object to hold shape counts
let countryCounts = {}; // Object to hold country counts
let yearCounts = {}; // Object to hold year counts
let durationCounts = {}; // Object to hold duration ranges
let stars = []; // Array to hold star data
const numStars = 200; // Number of stars
let showGraph = false; // Toggle for displaying the bar graph
let activeFilter = null; // Track the active filter

function preload() {
  // Load JSON data
  fetch('gitHubFinal.json') // Ensure this file is in the correct path
    .then(response => response.json())
    .then(data => {
      starData = data;
      countShapes(); // Count shapes on load
      countCountries(); // Count countries on load
      countYears(); // Count years on load
      countDurations(); // Count durations on load
    });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createStars(); // Generate stars
  noLoop(); // Prevent continuous drawing
}

// Function to count occurrences of each shape
function countShapes() {
  shapeCounts = {};
  starData.forEach(entry => {
    const shape = entry.shape || "unknown"; // Handle empty shape values
    if (!shapeCounts[shape]) {
      shapeCounts[shape] = 0;
    }
    shapeCounts[shape]++;
  });
}

// Function to count occurrences of each country
function countCountries() {
  countryCounts = {};
  starData.forEach(entry => {
    const country = entry.country || "unknown"; // Handle empty country values
    if (!countryCounts[country]) {
      countryCounts[country] = 0;
    }
    countryCounts[country]++;
  });
}

// Function to count occurrences by year
// Function to count occurrences by decade
function countYears() {
  yearCounts = {
    "Unknown": 0, // Handle entries with missing or invalid year
  };

  starData.forEach(entry => {
    const datetime = entry.datetime || "unknown"; // Handle missing datetime
    const year = parseInt(datetime.split("/")[2]?.split(" ")[0]) || null; // Extract year from datetime

    if (year === null) {
      yearCounts["Unknown"]++;
    } else {
      // Calculate decade (e.g., 1985 -> "1980-1989")
      const decade = Math.floor(year / 10) * 10;
      const decadeLabel = `${decade}-${decade + 9}`;
      if (!yearCounts[decadeLabel]) {
        yearCounts[decadeLabel] = 0;
      }
      yearCounts[decadeLabel]++;
    }
  });
}

// Function to count occurrences by duration (seconds) range
function countDurations() {
  durationCounts = {
    "0-10s": 0,
    "10-100s": 0,
    "100-1000s": 0,
    ">1000s": 0,
  };
  starData.forEach(entry => {
    const duration = entry["duration (seconds)"] || 0; // Handle missing duration
    if (duration <= 10) {
      durationCounts["0-10s"]++;
    } else if (duration <= 100) {
      durationCounts["10-100s"]++;
    } else if (duration <= 1000) {
      durationCounts["100-1000s"]++;
    } else {
      durationCounts[">1000s"]++;
    }
  });
}

// Function to create random stars
function createStars() {
  stars = []; // Clear existing stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width), // Random X position
      y: random(height), // Random Y position
      radius: random(1, 3), // Random radius
      twinkle: random(1) > 0.5, // Random twinkle behavior
    });
  }
}

// Function to draw the starry background
function drawBackground() {
  background(0); // Clear the canvas and set a black background
  for (let i = 0; i < height; i++) {
    const alpha = map(i, 0, height, 255, 50); // Gradient effect
    stroke(10, 10, 50, alpha); // Deep space colors
    line(0, i, width, i);
  }
}

// Function to draw stars
function drawStars() {
  noStroke();
  for (let star of stars) {
    fill(255); // Base color for stars
    if (star.twinkle && frameCount % 60 < 30) {
      fill(200, 200, 255); // Twinkle effect with a slight blue tint
    }
    ellipse(star.x, star.y, star.radius, star.radius);
  }
}

// Function to draw a bar graph
function drawBarGraph(dataCounts, xAxisTitle, yAxisTitle, graphTitle) {
  const margin = 50;
  const barWidth = (width - margin * 2) / Object.keys(dataCounts).length;
  let x = margin;

  fill(255); // White text
  textSize(16);
  textAlign(CENTER);
  text(graphTitle, width / 2, 30); // Title

  // Y-axis title
  push();
  textSize(14);
  textAlign(CENTER);
  translate(30, height / 2); // Position and rotate for Y-axis title
  rotate(-PI / 2);
  text(yAxisTitle, 0, 0);
  pop();

  // X-axis title
  textSize(14);
  textAlign(CENTER);
  text(xAxisTitle, width / 2, height - 20);

  for (const [key, count] of Object.entries(dataCounts)) {
    const barHeight = map(count, 0, Math.max(...Object.values(dataCounts)), 0, height - margin * 2);
    fill(100, 200, 255); // Bar color
    rect(x, height - margin - barHeight, barWidth - 10, barHeight); // Draw bar

    // Draw variable name on top of each bar
    fill(255);
    textSize(12);
    textAlign(CENTER);
    text(key, x + barWidth / 2 - 5, height - margin - barHeight - 20); // Variable name above the bar

    // Draw count below the variable name
    text(count, x + barWidth / 2 - 5, height - margin - barHeight - 5); // Count just below the variable name

    x += barWidth; // Move to next bar position
  }
}

function draw() {
  drawBackground(); // Clear the canvas and draw the starry background
  drawStars(); // Draw the stars

  if (showGraph && activeFilter === 0) {
    drawBarGraph(shapeCounts, "Shapes", "Number of Sightings", "UFO Shape Counts");
  } else if (showGraph && activeFilter === 1) {
    drawBarGraph(countryCounts, "Countries", "Number of Sightings", "UFO Country Counts");
  } else if (showGraph && activeFilter === 2) {
    drawBarGraph(yearCounts, "Years", "Number of Sightings", "UFO Sightings by Year");
  } else if (showGraph && activeFilter === 3) {
    drawBarGraph(durationCounts, "Duration (Seconds)", "Number of Sightings", "UFO Sightings by Duration");
  }
}

// Button click handler to display graphs
function setFilter(filterIndex) {
  if (filterIndex === activeFilter) {
    // If the same filter is clicked, toggle visibility
    showGraph = !showGraph;
  } else {
    // If a new filter is clicked, update the filter and show the graph
    activeFilter = filterIndex;
    showGraph = true; // Show the graph for the selected filter
  }
  redraw(); // Trigger a redraw
}
