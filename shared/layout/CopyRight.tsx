import { Typography, Link } from "@mui/material";

const CopyRight: React.FC = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Admin Panel
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
};

export default CopyRight;
