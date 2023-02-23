import {
  Container,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  AppBar,
  styled,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import styles from "./Footer.styles";

type Props = {};
const AppHeader = styled(AppBar)(styles);
const Footer = (props: Props) => {
  return (
    <AppHeader className="footer" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: { xs: "flex", md: "flex" },
            }}
          >
            <Button
              className="largeText"
              href="https://twitter.com/CracersNft"
              sx={{
                my: 2,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TwitterIcon />
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppHeader>
  );
};

export default Footer;
