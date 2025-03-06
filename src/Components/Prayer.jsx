import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function MediaCard({name,time,image}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="صلاه الفجر"
      />
      <CardContent>
        <Typography gutterBottom variant="h3" component="div">
         {name}
        </Typography>
        <Typography variant="h2" sx={{ color: 'text.secondary' }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
