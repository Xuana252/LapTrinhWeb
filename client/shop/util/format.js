
export const formattedPrice = (price=0) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
}

export const formattedDate = (dateString, daysToAdd = 0) => {
  if (!dateString) return '';
  

  const date = new Date(dateString);
  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  // Return formatted date as "dd-mm-yyyy"
  return `${day}-${month}-${year}`;
};

export const formattedFullDate = (dateString, daysToAdd = 0) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);

  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Get the day of the week
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }); // "Monday"
  
  // Get the day of the month
  const day = date.getDate();
  
  // Add suffix to the day
  const suffix = (day) => {
    if (day >= 11 && day <= 13) return 'th'; // Handle special cases for 11th, 12th, and 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  // Get the month (in abbreviated format)
  const month = date.toLocaleString('en-US', { month: 'short' }); // "Nov"
  
  // Get the year
  const year = date.getFullYear();

  // Return formatted date as "Monday, Nov 9th 2024"
  return `${dayOfWeek}, ${month} ${day}${suffix(day)} ${year}`;
};


