import React, { useState, useEffect } from 'react';
import fajer from '../assets/images/fajer.png'
import dohur from '../assets/images/dohur.png'
import aser from '../assets/images/aser.png'
import magherb from '../assets/images/magherb.png'
import isha from '../assets/images/isha.png'
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
      <div className=''>

         {/* top row */}
       <Grid  container spacing={{xs:2,sm:4,md:12}}>
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
          image={fajer}
          
        />

        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          image={dohur}
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image={aser}
          />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image={magherb}
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image={isha}
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

      </div>
     

    


    
    </>
  )
}
