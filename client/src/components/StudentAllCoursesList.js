import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  CardMedia,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@mui/material/styles";

const StudentAllCoursesList = ({ courses }) => {
   const theme = useTheme();
  if (courses.length === 0) {
    return <Typography variant="h6">Курси відсутні.</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {courses.map((course) => (
        <Card key={course._id} sx={{ width: 480, mb: 1, backgroundColor: theme.palette.background.div,
}}>
          <CardMedia
            component="img"
            height="140"
            image={
              course.imageUrl ||
              "https://mui.com/static/images/cards/contemplative-reptile.jpg"
            }
            alt={course.title}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {course.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Тривалість: {course.duration} годин
            </Typography>
            <Typography variant="body2">{course.description}</Typography>
          </CardContent>
          <CardActions>
            <Button startIcon={<FavoriteIcon />} color="secondary">
              В обране
            </Button>
            <Button startIcon={<VisibilityIcon />} color="primary">
              Слідкувати
            </Button>
            <Button startIcon={<ShoppingCartIcon />} color="info">
              Придбати
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default StudentAllCoursesList;
