import React, { useState,useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import 'moment/dist/locale/ar-ma';
moment.locale("ar");



export default function MainContent() {
  
  //state
  const [timings, setTimings] = useState({
            "Fajr": "05:20",
            "Dhuhr": "12:02",
            "Asr": "14:52",
            "Maghrib": "17:12",
            "Isha": "18:34",
  });

  const [today, setToday] = useState('');
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [remainingTime, setRemaingTime] = useState("");
  const [selectedCity, setSelectedCity] = useState({
    displayName: "القاهرة",
    apiName:"cairo"
  });

  const availableCity = [
    {
    displayName: "القاهرة",
      apiName: "cairo"
    },
    {
    displayName: "الاسكندريه",
      apiName: "Alexandria"
    },
    {
    displayName: "الزقازيق",
      apiName: "Zagazig"
    },
    {
    displayName: "اسوان",
      apiName: "Aswan"
    },
  ];

  const prayerArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
    
  ];

  const getTimings = async () => {
    const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/%7Bdate%7D?country=EG&city=${selectedCity.apiName}`);
    setTimings(response.data.data.timings);
    
  }

 

  useEffect(() => {

    getTimings();
    
  }, [selectedCity]);
  

  useEffect(() => {

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000)
    
    const t = moment();
    setToday(t.format('MMMM Do YYYY || hh:mm a')); 

    return () => {
      clearInterval(interval);
    }
    
  }, [timings])

//set up count down timer function
  const setupCountdownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 0;

    //we use moment() to convert the string to moment
   

    if(momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
      prayerIndex = 1;
      
    }else if(momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
      prayerIndex = 2;
      
      }else if(momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
      prayerIndex = 3;
      
      }else if(momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
      prayerIndex = 4;
      
    } else {
      prayerIndex = 0;
    }
    
    setNextPrayerIndex(prayerIndex);

    //now after knowing what the next prayer is, we can setup the countdown timer by getting prayer's time
    const nextPrayerObject = prayerArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = nextPrayerTimeMoment.diff(momentNow);

    if (remainingTime < 0) {
      const midNightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajerToMidNightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));

      const totalDifferance = midNightDiff + fajerToMidNightDiff;
      remainingTime = totalDifferance;
      
    }
 
    //we use moment.duration() to convert the time to hours, minutes, seconds . 
    const durationRemaingingTime = moment.duration(remainingTime);
    

    setRemaingTime(`${durationRemaingingTime.hours()}:${durationRemaingingTime.minutes()}:${durationRemaingingTime.seconds()}`);
  }
  
//handle city change
  const handleCityChange = (event) => {
    const cityObject = availableCity.find((city) => {
      return city.apiName == event.target.value;
   })
    setSelectedCity(cityObject);
  };

  return (
    <>
      {/* top row */}
       <Grid container spacing={{xs:2,sm:4,md:12}}>
        <Grid  size={6}>
          <div>
            <h2>  {today} </h2>
            <h1>{selectedCity.displayName}</h1>
          </div>
        </Grid>

        <Grid  size={6}>
          <div>
            <h2>متبقي علي صلاه { prayerArray[nextPrayerIndex].displayName} </h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/*== top row ==*/}

      <Divider />
      
      {/* prayers cards */}
      <Stack direction='row' spacing={{xs:1,sm:2}} justifyContent="space-between"  style={{marginTop:"50px"}}>
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          image="https://export-download.canva.com/hztv8/DAGbx_hztv8/3/0/0001-8963741913518188570.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20250109%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250109T111518Z&X-Amz-Expires=76488&X-Amz-Signature=26aed133c454c1dc35002dbb0b68f8d7a4a28ad8dc00a5366d760e6cb43ba7ca&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Untitled%2520design.png&response-expires=Fri%2C%2010%20Jan%202025%2008%3A30%3A06%20GMT"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          image="https://export-download.canva.com/hztv8/DAGbx_hztv8/5/0/0001-969852574715530846.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20250109%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250109T205818Z&X-Amz-Expires=42467&X-Amz-Signature=aaa6e76a0c6c717d7bc7929cc11496b4b6183caf7e2c7643dd3068bd98ef5e5c&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Untitled%2520design.png&response-expires=Fri%2C%2010%20Jan%202025%2008%3A46%3A05%20GMT"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image="https://export-download.canva.com/hztv8/DAGbx_hztv8/7/0/0001-4515311384451299042.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20250109%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250109T200501Z&X-Amz-Expires=46780&X-Amz-Signature=99d71694e79c18aee4564578ab8123b3dfd8c6acd89d3b13740234da4640df2d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Untitled%2520design.png&response-expires=Fri%2C%2010%20Jan%202025%2009%3A04%3A41%20GMT"
        />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image="https://export-download.canva.com/hztv8/DAGbx_hztv8/10/0/0001-310075230091502177.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20250109%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250109T092945Z&X-Amz-Expires=85343&X-Amz-Signature=076b891a0792501aa88a26f2d7699dca4a1ab73f73b19a904ca7e222a121bb4d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Untitled%2520design.png&response-expires=Fri%2C%2010%20Jan%202025%2009%3A12%3A08%20GMT"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image="https://export-download.canva.com/hztv8/DAGbx_hztv8/12/0/0001-1162381458971422786.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20250110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250110T015058Z&X-Amz-Expires=23795&X-Amz-Signature=ca3f3ced7446645ae6fc3d2d892e59c9917498cb92b0df6a2d28b032df1a96bf&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27Untitled%2520design.png&response-expires=Fri%2C%2010%20Jan%202025%2008%3A27%3A33%20GMT"
        />
       
      </Stack>
      {/*== prayers cards ==*/}

      {/* select city */}
      <Stack justifyContent={"center"} direction={"row"} style={{margin:"40px 0"}}>
        <FormControl style={{width:"30%"}}>
        <InputLabel id="demo-simple-select-label">المدينه</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="city"
          value={selectedCity.apiName}
          onChange={handleCityChange}
          >
            {availableCity.map((city) => {
              return (
                <MenuItem value={city.apiName}  key={city.apiName}>{ city.displayName}</MenuItem>
              )
            })}
          
        </Select>
      </FormControl>
      </Stack>
       {/*== select city ==*/}

    


    
    </>
  )
}
