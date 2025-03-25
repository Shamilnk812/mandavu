import {format, isToday, isYesterday} from 'date-fns'


const FormatLastSeen = (timestamp)=> {
    if (!timestamp) return "Unknown"; // Handle undefined/null timestamps
    const lastSeenTime = new Date(timestamp)
    if (isNaN(lastSeenTime)) return "Invalid Date"; // Handle invalid dates

    if(isToday(lastSeenTime)){
        return format(lastSeenTime, "hh:mm a");
    }else if(isYesterday(lastSeenTime)){
        return "Yesterday"
    }else{
        return format(lastSeenTime, "dd/MM/yy");
    }
};


export default FormatLastSeen;