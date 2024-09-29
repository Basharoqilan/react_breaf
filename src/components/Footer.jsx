import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Link,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import logo2footer from "./logo2_footer.png";
const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#3b4ca5", // Blue background similar to the footer
        padding: "40px 0",
        color: "#fff",
      }}
    >
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Logo Section */}
          <Grid item xs={12} sm={3} md={3}>
            <Box mb={3} sx={{ display: "flex", alignItems: "center" }}>
              {/* Logo */}
              <img
                src={logo2footer}
                alt="Courses Logo"
                style={{ height: 40, marginRight: "20px" }}
              />
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={6} sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Contact Us
            </Typography>
          </Grid>

          {/* Social Icons to the right */}
          <Grid item xs={12} sm={3} md={3} sx={{ textAlign: "right" }}>
            <Box>
              <IconButton
                component="a"
                href="#"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  m: 1,
                  fontSize: "32px", // Make icons larger
                }}
              >
                <TwitterIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                component="a"
                href="https://bit.ly/sai4ull"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  m: 1,
                  fontSize: "32px", // Make icons larger
                }}
              >
                <FacebookIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  m: 1,
                  fontSize: "32px", // Make icons larger
                }}
              >
                <PinterestIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Contact Info Below */}
        <Grid container justifyContent="center" mt={2}>
          {" "}
          {/* Reduced space above the contact info */}
          <Grid item xs={12} sm={6} md={4}>
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                textAlign: "center",
                lineHeight: 1.8, // Reduced line height for tighter space
              }}
            >
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "20px", lineHeight: 1.8 }}
                >
                  Mobile: +123 456 7890
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "20px", lineHeight: 1.8 }}
                >
                  Email: info@example.com
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "20px", lineHeight: 1.8 }}
                >
                  Location: 123 Main St, City, Country
                </Typography>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;