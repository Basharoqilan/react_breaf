import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Container, Button } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import righticon from "./right-icon.svg";
import about2 from "./about2.png";


const AboutSection = () => {
  const [videoUrl, setVideoUrl] = useState(""); // State to store the video URL
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch video details from the Mocky API
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Fetching data from the Mocky API for course video
        const response = await axios.get(
          `https://run.mocky.io/v3/e630a05b-4ed7-4b24-b723-314936a65baa`
        );

        // Extract the YouTube video URL from the response (Assuming the first course has the video URL)
        const courseData = response.data[0]; // Assuming the first course in the list
        const videoLink = courseData.strYouTubeURL; // This field contains the YouTube video URL

        setVideoUrl(videoLink); // Update the state with the YouTube link
        setLoading(false); // Turn off loading after data is fetched
      } catch (error) {
        console.error("Error fetching video details from Mocky API:", error);
        setLoading(false);
      }
    };

    fetchVideo(); // Fetch video when the component mounts
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f7f7f7", // Light background
        width: "100vw", // Full viewport width
        minHeight: "100vh", // Full viewport height
        display: "flex", // Flexbox for alignment
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box mb={4}>
                {/* Icon with gradient background and shadow */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #a64af9, #f75bd6)",
                    borderRadius: "50%",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <TrendingUpIcon sx={{ color: "white",  }} />
                </Box>
              </Box>

              <Box mb={4}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#475fa9"  , }} // Title in #475fa9
                >
                  Learn new skills online with expert instructors
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: "black" ,  }}>
                  Gain access to top-notch courses and discover tools and
                  techniques to help you engage more effectively in your web
                  development journey.
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <img
                     src={righticon}
                     alt="Right Icon"
                  style={{ width: 30, height: 30, marginRight: 16 }}
                />
                <Typography variant="body1" sx={{ color: "black" , }}>
                  Learn industry-standard practices from leading professionals.
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <img
                    src={righticon}
                  alt="Right Icon"
                  style={{ width: 30, height: 30, marginRight: 16 }}
                />
                <Typography variant="body1" sx={{ color: "black"  , }}>
                  Join a global community of learners building new skills.
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <img
                    src={righticon}
                  alt="Right Icon"
                  style={{ width: 30, height: 30, marginRight: 16 }}
                />
                <Typography variant="body1" sx={{ color: "black"  ,}}>
                  Web development made simple and accessible for all levels.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Content - Image and Play Button */}
          <Grid item xs={12} md={6}>
            <Box position="relative">
              <img
                src={about2}
                alt="About Section Image"
                style={{ width: "100%", borderRadius: 8 }}
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -50%)" }}
              >
                {loading ? (
                  <Typography variant="body1" sx={{ color: "black" }}>
                    Loading video...
                  </Typography>
                ) : (
                  <Button
                    href={videoUrl} // Use the video URL fetched from the Mocky API
                    target="_blank"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: 1,
                    }}
                  >
                    <PlayCircleFilledWhiteIcon
                      sx={{ fontSize: 50, color: "#FF5733" }}
                    />
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;