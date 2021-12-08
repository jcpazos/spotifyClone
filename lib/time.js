export function millisToMinuteAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function formatDate(date) {
    let day = new Date(date);
    const options = {
        //to display the full name of the day, you can use short to indicate an abbreviation of the day
         day: "numeric",
         month: "short", //to display the full name of the month
         year: "numeric"
   }

   return day.toLocaleDateString("en-US", options);
}